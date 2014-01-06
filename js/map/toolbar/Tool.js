Abstract.Tool = function(){}
Abstract.Tool.prototype = {
    initialize: function (id, img1, img2, img3, pos, left, top, width, height) {
        this.toolType = "Tool";
        this.id = id;
        this.img_normal = ImageBaseDir + 'mapTools/' + img1;
        this.img_over = ImageBaseDir + 'mapTools/' + img2;
        this.img_down = ImageBaseDir + 'mapTools/' + img3;
        this.position = pos;
        this.left = parseInt(left);
        this.top = parseInt(top);
        this.width = parseInt(width);
        this.height = parseInt(height);
        this.div = Util.createDiv(this.id, this.left, this.top, this.width, this.height, this.img_normal, this.position, '0px');
        this.div.style.cursor = "pointer";
    },


    barClickHandler: function (e) {
        var elm = Event.element(e)
        if (elm.childNodes.length > 0) return;
        this.clearCurrentToolStatus();
        var tool = this.tools[Event.element(e).parentNode.id];
        tool.div.childNodes[0].src = tool.img_down;
        if (!tool.selected) {
            tool.selected = true;
            this.currentTool = tool;
            this.mapDiv.style.cursor = tool.cursorStyle;
        }

        Event.stop(e);
    },

    barMouseOverHandler: function (e) {
        var elm = Event.element(e)
        if (elm.childNodes.length > 0)
            return;
        if (this.tools[elm.parentNode.id].selected == true)
            return;
        elm.src = this.tools[elm.parentNode.id].img_over;
        elm.alt = this.tools[elm.parentNode.id].alt;

        Event.stop(e);
    },

    barMouseOutHandler: function (e) {
        var elm = Event.element(e)
        if (elm.childNodes.length > 0)
            return;
        if (this.tools[elm.parentNode.id].selected == true)
            return;
        elm.src = this.tools[elm.parentNode.id].img_normal;
        Event.stop(e);
    },

    zoomToExtent: function (model, extent, container, direction) {
        if (extent) {
            var zoom = model.getZoom();

            var w1 = zoom.getViewBound(container).getPixelWidth(zoom);
            var h1 = zoom.getViewBound(container).getPixelHeight(zoom);
            var w2 = extent.getPixelWidth(zoom);
            var h2 = extent.getPixelHeight(zoom);
            var r1 = Math.sqrt(w1 * w1 + h1 * h1);
            var r2 = Math.sqrt(w2 * w2 + h2 * h2);
            var deltalLevel = Math.floor(r1 / r2);
            if (w2 < 1 || h2 < 1)
                return;
            var orgLevel = zoom.getLevel();
            if (deltalLevel > 3) deltalLevel = 3;
            switch (direction) {
                case 'zoomin':
                    orgLevel += deltalLevel;
                    if (orgLevel > MaxZoomLevel) orgLevel = MaxZoomLevel;
                    break;
                case 'zoomout':
                    orgLevel -= deltalLevel;
                    if (orgLevel < 1) orgLevel = 1;
                    break;
            }
            model.setZoom(new Zoom(orgLevel));
            model.setViewCenterCoord(extent.getCenter());
            model.controls[container.childNodes[0].id].paint(model, true);
            model.controls[model.ovId].paint(model);
            $('sliderbar_' + model.getId()).parentNode.style.top = ((MaxZoomLevel - orgLevel) * 12 + 6) + "px"
        }
    }
};

//移动;
PanTool = Class.create();
PanTool.prototype = Object.extend(new Abstract.Tool(), {
    cursorStyle: 'hand',
    selected: false,
    alt: '移动',
    mouseDownHandler: function (e, toolbar) {
        this.mapDiv = toolbar.mapDiv;
        if (!this.mapDiv)
            return;
        if (!this.isDrag)
            this.isDrag = true;
        this.orgPixelX = Util.getValueOfNoPX(this.mapDiv.style.left);
        this.orgPixelY = Util.getValueOfNoPX(this.mapDiv.style.top);
        this.orgMousePixel = Util.getMousePixel(e);
        if (this.mapDiv.setCapture)
            this.mapDiv.setCapture();
        else if (window.captureEvents)
            window.captureEvents(Event.MOUSEMOVE | Event.MOUSEUP);
        document.onselectstart = function () { return false };
        Event.stop(e);
    },

    mouseMoveHandler: function (e, toolbar) {
        if (this.orgMousePixel == null || this.isDrag == false || !this.mapDiv)
            return;
        this.newMousePixel = Util.getMousePixel(e);
        var deltaX = this.newMousePixel.x - this.orgMousePixel.x;
        var deltaY = this.newMousePixel.y - this.orgMousePixel.y;
        this.mapDiv.style.left = (this.orgPixelX + deltaX) + "px";
        this.mapDiv.style.top = (this.orgPixelY + deltaY) + "px";
        Event.stop(e);
    },

    mouseUpHandler: function (e, toolbar) {
        if (!this.isDrag) return;
        if (!this.mapDiv)
            return;
        if (this.mapDiv.releaseCapture)
            this.mapDiv.releaseCapture();
        else if (window.captureEvents)
            window.captureEvents(Event.MOUSEMOVE | Event.MOUSEUP);
        var lastMousePixel = Util.getMousePixel(e);
        var deltaX = lastMousePixel.x - this.orgMousePixel.x;
        var deltaY = lastMousePixel.y - this.orgMousePixel.y;
        this.reLoadTiles(toolbar.model, deltaX, deltaY, this.mapDiv);
        document.onmousemove = null;
        document.onmouseup = null;
        this.isDrag = false;
        Event.stop(e);
    },

    reLoadTiles: function (model, deltaX, deltaY, mapDiv) {
        var orgCenterCoord = model.getViewCenterCoord();
        var curZoom = model.getZoom();
        var x = orgCenterCoord.x - deltaX * curZoom.realMapBound.getWidth() / (curZoom.getTileCols() * TileSize);
        var y = orgCenterCoord.y + deltaY * curZoom.realMapBound.getHeight() / (curZoom.getTileRows() * TileSize);
        var newCenterCoord = new Coordinate(x, y)
        if (!newCenterCoord.isSame(orgCenterCoord))
            model.setViewCenterCoord(newCenterCoord);
        var control = new Abstract.Control()
        control.loadTiles(model, mapDiv.parentNode, mapDiv, true);
        model.controls[model.ovId].paint(model);
    },

    clickHandler: function (e, toolbar) {
        Event.stop(e);
    },

    dblClickHandler: function (e, toolbar) {
        Util.addMarker(e);
        Event.stop(e);
    }
});

//拉框放大;
ZoominTool = Class.create();
ZoominTool.prototype = Object.extend(new Abstract.Tool(), {
    cursorStyle:'url("images/zoomin.cur")',
    selected: false,
    alt: '拉框放大',
    mouseDownHandler: function(e, toolbar) {        
        this.mapDiv = toolbar.mapDiv;
        this.mouseDownPixel = Util.getMouseRelativePixel(e, this.mapDiv);
        
        this.zoomBox = Util.createDiv('zoomBox',this.mouseDownPixel.x,this.mouseDownPixel.y, null,null,null,"absolute","1px solid red");
        this.zoomBox.style.backgroundColor = "white";
        this.zoomBox.style.filter = "alpha(opacity=50)"; 
        this.zoomBox.style.opacity = "0.50";
        this.zoomBox.style.fontSize = "1px";
        this.mapDiv.appendChild(this.zoomBox);        
        Event.stop(e);
    },
    
    mouseMoveHandler: function(e, toolbar){
        this.mapDiv = toolbar.mapDiv;
        this.mouseMovePixel = Util.getMouseRelativePixel(e, this.mapDiv);
        
        if (this.mouseDownPixel) {
            var deltaX = Math.abs(this.mouseDownPixel.x - this.mouseMovePixel.x);
            var deltaY = Math.abs(this.mouseDownPixel.y - this.mouseMovePixel.y);
            this.zoomBox.style.width = Math.max(1, deltaX) + "px";
            this.zoomBox.style.height = Math.max(1, deltaY) + "px";
            if (this.mouseMovePixel.x < this.mouseDownPixel.x)
                this.zoomBox.style.left = this.mouseMovePixel.x+"px";
            if (this.mouseMovePixel.y < this.mouseDownPixel.y)
                this.zoomBox.style.top = this.mouseMovePixel.y+"px";
        }        
        Event.stop(e);   
    },
    
    mouseUpHandler: function(e, toolbar){
        if (this.mouseDownPixel && this.mouseMovePixel) {              
            var top = Math.min(this.mouseDownPixel.y, this.mouseMovePixel.y);
            var bottom = Math.max(this.mouseDownPixel.y, this.mouseMovePixel.y);
            var left = Math.min(this.mouseDownPixel.x, this.mouseMovePixel.x);
            var right = Math.max(this.mouseDownPixel.x, this.mouseMovePixel.x);
            
            var leftTop = Util.getCoordinateByPixel({x:left,y:top}, toolbar.model.getZoom())
            var rightbottom = Util.getCoordinateByPixel({x:right,y:bottom}, toolbar.model.getZoom())
            var rect = new Rectangle(leftTop.x/1e16, rightbottom.x/1e16, leftTop.y/1e16, rightbottom.y/1e16);  
            this.removeZoomBox(this.zoomBox);
            this.zoomToExtent(toolbar.model, rect, this.mapDiv.parentNode, "zoomin");
        }
        document.onselectstart = function(){return false};
        this.coord = null;
        this.newCoord = null;
        Event.stop(e);
      },
      
      removeZoomBox: function(zoom){
        if(!zoom) return;
        this.mapDiv.removeChild(zoom);
        zoom = null;
      },
      
      clickHandler: function(e, movel){
        Event.stop(e);
      },
      
      dblClickHandler: function(e, movel){
        Event.stop(e);
    }
    
});

//拉框缩小;
ZoomoutTool = Class.create();
ZoomoutTool.prototype = Object.extend(new Abstract.Tool(), {
    cursorStyle:'url("images/zoomout.cur")',
    selected: false,
    alt: '拉框缩小',
    mouseDownHandler: function(e, toolbar) {        
        this.mapDiv = toolbar.mapDiv;
        this.mouseDownPixel = Util.getMouseRelativePixel(e, this.mapDiv);
        
        this.zoomBox = Util.createDiv('zoomBox',this.mouseDownPixel.x,this.mouseDownPixel.y, null,null,null,"absolute","1px solid red");
        this.zoomBox.style.backgroundColor = "white";
        this.zoomBox.style.filter = "alpha(opacity=50)"; 
        this.zoomBox.style.opacity = "0.50";
        this.zoomBox.style.fontSize = "1px";
        this.mapDiv.appendChild(this.zoomBox);        
        Event.stop(e);
    },
    
    mouseMoveHandler: function(e, toolbar){
        this.mapDiv = toolbar.mapDiv;
        this.mouseMovePixel = Util.getMouseRelativePixel(e, this.mapDiv);
        
        if (this.mouseDownPixel) {
            var deltaX = Math.abs(this.mouseDownPixel.x - this.mouseMovePixel.x);
            var deltaY = Math.abs(this.mouseDownPixel.y - this.mouseMovePixel.y);
            this.zoomBox.style.width = Math.max(1, deltaX) + "px";
            this.zoomBox.style.height = Math.max(1, deltaY) + "px";
            if (this.mouseMovePixel.x < this.mouseDownPixel.x)
                this.zoomBox.style.left = this.mouseMovePixel.x+"px";
            if (this.mouseMovePixel.y < this.mouseDownPixel.y)
                this.zoomBox.style.top = this.mouseMovePixel.y+"px";
        }        
        Event.stop(e);
    },
    
    mouseUpHandler: function(e, toolbar){
        if (this.mouseDownPixel && this.mouseMovePixel) {              
            var top = Math.min(this.mouseDownPixel.y, this.mouseMovePixel.y);
            var bottom = Math.max(this.mouseDownPixel.y, this.mouseMovePixel.y);
            var left = Math.min(this.mouseDownPixel.x, this.mouseMovePixel.x);
            var right = Math.max(this.mouseDownPixel.x, this.mouseMovePixel.x);
            
            var leftTop = Util.getCoordinateByPixel({x:left,y:top}, toolbar.model.getZoom())
            var rightbottom = Util.getCoordinateByPixel({x:right,y:bottom}, toolbar.model.getZoom())
            var rect = new Rectangle(leftTop.x/1e16, rightbottom.x/1e16, leftTop.y/1e16, rightbottom.y/1e16);  
            this.removeZoomBox(this.zoomBox);
            this.zoomToExtent(toolbar.model, rect, this.mapDiv.parentNode, "zoomout");
            
        }
        document.onselectstart = function(){return false};
        this.coord = null;
        this.newCoord = null;
        Event.stop(e);
      },
      
      removeZoomBox: function(zoom){
        if(!zoom) return;
        this.mapDiv.removeChild(zoom);
        zoom = null;
      },
      
      clickHandler: function(e, movel){
        Event.stop(e);
      },
      
      dblClickHandler: function(e, movel){
        Event.stop(e);
    }
});

//测量距离;
MeasureTool = Class.create();
MeasureTool.prototype = Object.extend(new Abstract.Tool(), {
    isDrag: false,
    selected: false,        
    cursorStyle:'url("images/mea.cur")',
    alt: '测量距离',
    measure: new Array(),
    
    mouseDownHandler: function(e, toolbar){
        if(!this.lineDiv)
            this.lineDiv = Util.createDiv('lineDiv');
        this.mapDiv = toolbar.mapDiv;
        this.mapDiv.appendChild(this.lineDiv);                
        
        this.mouseDownPixel = Util.getMouseRelativePixel(e, this.mapDiv);
        
        if(!this.isDrag)
            this.isDrag = true;
        this.lastX=this.mouseDownPixel.x;   
        this.lastY=this.mouseDownPixel.y;        
        this.line='<v:line from="'+this.lastX+','+this.lastY+'" to="'+this.mouseDownPixel.x+','+this.mouseDownPixel.y+'" strokecolor="red" strokeweight="2pt" style="position:absolute;left:-3px;top:-3px;"></v:line>'
        this.vLine = document.createElement(this.line);
        this.lineDiv.appendChild(this.vLine);           
        
        var coord = Util.getCoordinateByPixel(this.mouseDownPixel, toolbar.model.getZoom());
        this.measure.push(new Point(coord.x/1e16, coord.y/1e16));
        Event.stop(e);
    }, 
    
    mouseMoveHandler: function(e, toolbar){
        if(!this.isDrag)
            return;         
        this.mouseMovePixel = Util.getMouseRelativePixel(e, this.mapDiv);
        this.vLine.to = this.mouseMovePixel.x + "," + this.mouseMovePixel.y;                 
        Event.stop(e);
    },
    
    dblClickHandler: function(e, toolbar){
        if(!this.isDrag || !this.lineDiv)
           return;  
        this.lineDiv.innerHTML = "";
        this.mapDiv.removeChild(this.lineDiv);
        var pline = new Polyline(this.measure, "blue", 2);
        pline.setToMap(toolbar.mapDiv, toolbar.model);
        this.measure = new Array();
        
        this.isDrag=false;        
        
        var len = pline.getLength();
        var unit = '';        
        if(len != null && len.toString().indexOf(".")){
            var i = len.toString().indexOf(".");
            if(i<4){
                unit = "米"
                len = Number(len.toString().substring(0, i+3));
            }                
            else{
                len = len/1000;
                i = len.toString().indexOf(".");
                len = Number(len.toString().substring(0, i+4));
                unit = "千米";
            }
        }
        
        var infoCoord = Util.getMouseRelativePixel(e, this.mapDiv);
        this.CreateMeasureInfo(toolbar.model.getId(), infoCoord, "<br>本次总测量距离：<br>"+len+unit);
        Event.stop(e);
    },
    
    CreateMeasureInfo: function(modelId, infoCoord, result){
        var div = $("measureResultDiv")
        if(!div){
            var mapDiv = $("map_"+modelId)
		    this.measureResult = document.createElement("div");
		    this.measureResult.id = "measureResultDiv";
		    this.measureResult.onselect = null;
		    this.measureResult.style.position = "absolute";
		    this.measureResult.style.background = "#FFFFFF";
		    this.measureResult.style.border = "1px solid #999999";
		    this.measureResult.style.fontSize = "12px";
		    this.measureResult.style.padding = "1px";
		    this.measureResult.innerHTML = '<div style="background:#EEEEEE;"><table style="width:150px;"><tr><td align=left>测量结果</td><td align=right><img onmousedown="hideWindown(event, \'' + this.measureResult.id + '\')" src="' + ImageBaseDir + 'infowindow_close.gif"></td></tr></table></div>';
		    this.measureResult.innerHTML += '<div id="measureResult" align="center" style="padding:2px;height:50px;width:150px;z-index:10"></div>';
	        mapDiv.appendChild(this.measureResult);
	    }	    
	    this.measureResult.style.zIndex = 11;
	    this.measureResult.style.left = infoCoord.x + "px";
	    this.measureResult.style.top = infoCoord.y + "px";	    
	    $("measureResult").innerHTML = result;
	    this.measureResult.style.display = "";
    },
      
    clickHandler: function(e, model) {
        Event.stop(e);
    },
  
    mouseUpHandler: function(e, model){
        Event.stop(e);
    }
});


function hideWindow(e, id) {
    var obj = $(id);
    obj.style.display = "none";
    Event.stop(e);
}



    