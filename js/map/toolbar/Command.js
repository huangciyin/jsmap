Abstract.Command = function(){}
Abstract.Command.prototype = {
    initialize: function(id,img1,img2,img3,pos,left,top,width,height){
        this.toolType = "Command";        
        this.id = id;
        this.img_normal = ImageBaseDir + 'mapTools/' + img1;
        this.img_over = ImageBaseDir + 'mapTools/' + img2;
        this.img_down = ImageBaseDir + 'mapTools/' + img3;
        this.position = pos;
        this.left = parseInt(left);
        this.top = parseInt(top);
        this.width = parseInt(width);
        this.height = parseInt(height);        
        this.div = Util.createDiv(this.id, this.left, this.top, this.width, this.height, this.img_normal, this.position, '0px solid #ccc');
        this.div.style.cursor = "pointer";
    },
    
    cmdClickHandler: function(e){       
        if(Event.element(e).childNodes.length>0) return;
        this.clearCurrentToolStatus();
        var cmd = this.tools[Event.element(e).parentNode.id];        
        cmd.div.childNodes[0].src = cmd.img_down;
        if(!cmd.selected)
            cmd.selected = true;
        
        this.currentTool = this.defaultTool;
        this.currentTool.div.childNodes[0].src = this.currentTool.img_normal;
        this.mapDiv.style.cursor = this.currentTool.cursorStyle;        
        
        cmd.cmd_clickHandler(cmd, this.model, this.mapDiv);
        Event.stop(e);
    },
    
    cmdMouseOverHandler: function(e){
        var elm = Event.element(e)
        if(elm.childNodes.length>0)  return;
        var cmd = this.tools[elm.parentNode.id];
        if(cmd.selected == true)
            return;        
        elm.alt = cmd.alt;
        elm.src = cmd.img_over;
        Event.stop(e);        
    },
    
    cmdMouseOutHandler: function(e){
        var elm = Event.element(e)
        if(elm.childNodes.length>0)  return; 
        var cmd = this.tools[elm.parentNode.id];
        if(cmd.selected == true)
            return;
        elm.src = cmd.img_normal;
        Event.stop(e);
    } ,
    
    clearOrgDiv: function(container, index){
        var nodes = container.childNodes;
        for(var i=0; i<nodes.length; i++){
            if(nodes[i].id.indexOf('search'+index+'_')>-1){
                container.removeChild(nodes[i]);
            }
        }
    },
    
    registerEvent: function(source, param){
        Event.observe(source, param.split(',')[0], eval('this.'+param.split(',')[0]).bindAsEventListener(this));
        Event.observe(source, param.split(',')[1], eval('this.'+param.split(',')[1]).bindAsEventListener(this));
        Event.observe(source, param.split(',')[2], eval('this.'+param.split(',')[2]).bindAsEventListener(this));
    },
    
    mousedown: function(e){
        if(Event.element(e).childNodes.length==0)
            return;
        if(!this.dragged)
            this.dragged = true;
            
        this.elm = Event.element(e);
        this.orgPixelX = Util.getValueOfNoPX(this.elm.parentNode.style.left);
	    this.orgPixelY = Util.getValueOfNoPX(this.elm.parentNode.style.top);
	    this.elm.style.cursor = "hand";
        this.orgMousePixel = Util.getMousePixel(e);
        
	    if(this.elm.setCapture){
		    this.elm.setCapture();
	    }
	    else if (window.captureEvents){
		    window.captureEvents(Event.MOUSEMOVE|Event.MOUSEUP);
		}
    },
    
    mousemove: function(e){
        if(!this.dragged) return;
        if(!Event.element(e))
            return;
        this.newMousePixel = Util.getMousePixel(e);	
            
	    var deltaX = this.newMousePixel.x - this.orgMousePixel.x;
	    var deltaY = this.newMousePixel.y - this.orgMousePixel.y;
		this.elm.parentNode.style.left = (this.orgPixelX + deltaX) + "px";
		this.elm.parentNode.style.top = (this.orgPixelY + deltaY) + "px";
    },
    
    mouseup: function(e){
        if(!this.elm)
            return;
        if(this.elm.releaseCapture) 
			this.elm.releaseCapture();
		else if(window.captureEvents) 
			window.captureEvents(Event.MOUSEMOVE|Event.MOUSEUP);
		document.onmousemove = null;
		document.onmouseup = null;
        this.dragged = false;
        this.elm.style.cursor = '';
    }     
 }

//分类查询;
SearchCmd = Class.create(); 
SearchCmd.prototype = Object.extend(new Abstract.Command(), {
    alt: '分类查询',
    selected: false,
    cmd_clickHandler: function(cmd, model, mapDiv){
        this.clearOrgDiv(mapDiv.parentNode,1);
        this.searcher(mapDiv, model);
    } ,
    
    searcher: function(mapDiv, model){
        this.mapDiv = mapDiv;
        this.model = model;
        
        var left = Util.getValueOfNoPX(this.mapDiv.parentNode.style.width)-500
        this.selDiv1 = Util.createDiv('search1_poi1',left,80,220,300,null,"absolute","0px solid blue");
        this.selDiv1.style.backgroundColor = "white";
        this.selDiv1.style.filter = "alpha(opacity=80)"; 
        this.selDiv1.style.opacity = "0.80";
        this.selDiv1.style.fontSize = "1px"
        this.selDiv1.style.zIndex = 10000; 
        this.selDiv1.innerHTML = '<div align="right" style="background:blue;padding:1px;cursor:default"><img onclick="hideInfoWindown(event, \'' + this.selDiv1.id + '\')" src="' + ImageBaseDir + 'infowindow_close.gif"></div>'      
        this.mapDiv.parentNode.appendChild(this.selDiv1);
        this.selDiv1.style.display="none";
        
        var left = Util.getValueOfNoPX(this.mapDiv.parentNode.style.width)-700
        this.selDiv2 = Util.createDiv('search1_point1',left,80,220,300,null,"absolute","1px solid blue");
        this.selDiv2.style.backgroundColor = "white";
        this.selDiv2.style.filter = "alpha(opacity=80)"; 
        this.selDiv2.style.opacity = "0.80";
        this.selDiv2.style.fontSize = "1px"
        this.selDiv2.style.zIndex = 10000;  
        this.selDiv2.innerHTML = '<div align="right" style="background:blue;padding:1px;cursor:default"><img onclick="hideInfoWindown(event, \'' + this.selDiv2.id + '\')" src="' + ImageBaseDir + 'infowindow_close.gif"></div>'              
        this.selDiv1.innerHTML += '<iframe id="poi2" name="poi2" src="../poi2.jsf" style="width:220px;height:300;scrolling="no" frameborder="0"></iframe>';
        this.selDiv2.innerHTML += '<iframe id="point2" name="point2"  src="../point2.jsf" style="width:220px;height:300;scrolling="no" frameborder="0"></iframe>';
        this.mapDiv.parentNode.appendChild(this.selDiv2);
        this.selDiv2.style.display="none";
        
        var left = Util.getValueOfNoPX(mapDiv.parentNode.style.width) - 220;        
        this.model.typeSearchId = Util.createUniqueID('search1_');
        this.searchDiv = Util.createDiv(this.model.typeSearchId,left,10,220,350,null,"absolute","1px solid blue");
        this.searchDiv.style.backgroundColor = "white";
        this.searchDiv.style.filter = "alpha(opacity=80)"; 
        this.searchDiv.style.opacity = "0.80";
        this.searchDiv.style.fontSize = "1px"
        this.searchDiv.style.zIndex = 10000;  
        this.searchDiv.innerHTML = '<div align="right" style="background:blue;padding:1px;cursor:default"><img onclick="hideInfoWindown(event, \'' + this.searchDiv.id + '\')" src="' + ImageBaseDir + 'infowindow_close.gif"></div>'
        this.searchDiv.innerHTML += '<iframe id="poisearch2" name="searchFrame" style="width:100%;height:35%" src="../poisearch2.jsf" scrolling="no" frameborder="0"></iframe>';              
        //this.searchDiv.innerHTML += '<div id="typpSearchResult" style="padding:1px;width:100%;z-index:10;background:blue"></div>';
        //this.searchDiv.innerHTML += '<div id="search_content" style="padding:1px;width:100%;z-index:10;height:200px;overflow:auto"></div>';
        this.searchDiv.innerHTML += '<iframe id="search2" name="search2" style="display:none;height:65%;width:100%" src="../staticresult.jsp" scrolling="auto" frameborder="0"></iframe>';              
        this.registerEvent(this.searchDiv.childNodes[0], "mousedown,mousemove,mouseup");
        this.mapDiv.parentNode.appendChild(this.searchDiv);
    }
});
//全图;
FullCmd = Class.create(); 
FullCmd.prototype = Object.extend(new Abstract.Command(), {
    alt: '全图显示',
    selected: false,  
    cmd_clickHandler: function(cmd, model, mapDiv){
        model.reset(mapDiv, $('sliderbar_'+model.getId()).parentNode);
    }
});
//清除;
ClearCmd = Class.create(); 
ClearCmd.prototype = Object.extend(new Abstract.Command(), {
    alt: '清除操作痕迹',
    selected: false,  
    cmd_clickHandler: function(cmd, model, mapDiv){
        model.clearOverLayers(mapDiv);
    }
});

//前一屏;
PrevCmd = Class.create(); 
PrevCmd.prototype = Object.extend(new Abstract.Command(), {      
    alt: '移到上一屏',
    selected: false,  
    cmd_clickHandler: function(cmd, model, mapDiv){
        if(model.curIndex == -1)
            model.curIndex = model.traceIndex - 1;
        if(model.curIndex >0 && model.curIndex <= model.traceIndex - 1){
            var obj = model.traces[--model.curIndex];
            model.setViewCenterCoord(obj.coord);
            model.setZoom(new Zoom(obj.level));
            model.controls[mapDiv.id].paint(model, false);
            model.controls[model.ovId].paint(model);
            $('sliderbar_'+model.getId()).parentNode.style.top = ((MaxZoomLevel - obj.level) * 12 + 6) + "px"
        }
    }
});

//后一屏;   
NextCmd = Class.create(); 
NextCmd.prototype = Object.extend(new Abstract.Command(), {
    alt: '移到下一屏',
    selected: false,  
    cmd_clickHandler: function(cmd, model, mapDiv){    
        
        if(model.curIndex == -1)
            model.curIndex = model.traceIndex - 1;
        if(model.curIndex >=0 && model.curIndex < model.traceIndex - 1){
            var obj = model.traces[++model.curIndex];
            model.setViewCenterCoord(obj.coord);
            model.setZoom(new Zoom(obj.level));
            model.controls[mapDiv.id].paint(model, false);
            model.controls[model.ovId].paint(model);
            $('sliderbar_'+model.getId()).parentNode.style.top = ((MaxZoomLevel - obj.level) * 12 + 6) + "px"
        }
    }
});      



//辖区定位;
LocateCmd = Class.create(); 
LocateCmd.prototype = Object.extend(new Abstract.Command(), {
    alt: '辖区定位',
    selected: false, 
    cmd_clickHandler: function(cmd, model, mapDiv){
        this.clearOrgDiv(mapDiv.parentNode,2);
        this.areaLocate(mapDiv, model);
    },
  
    areaLocate: function(mapDiv, model){   
        var left = Util.getValueOfNoPX(mapDiv.parentNode.style.width)-220
        this.areaDiv = Util.createDiv(Util.createUniqueID('search2_'),left,10,220,300,null,"absolute","1px solid blue");
        this.areaDiv.style.backgroundColor = "white";
        this.areaDiv.style.filter = "alpha(opacity=80)"; 
        this.areaDiv.style.opacity = "0.80";
        this.areaDiv.style.fontSize = "1px"
        this.areaDiv.style.zIndex = 10000;        
        this.areaDiv.innerHTML = '<div align="right" style="background:blue;padding:1px;cursor:default"><img onclick="hideInfoWindown(event, \'' + this.areaDiv.id + '\')" src="' + ImageBaseDir + 'infowindow_close.gif"></div>'
        this.areaDiv.innerHTML += '<iframe id="searchFrame" name="searchFrame" style="width:100%; height:400px;" src="../point.jsf?flag=1" scrolling="no" frameborder="0"></iframe>';
        this.registerEvent(this.areaDiv.childNodes[0], "mousedown,mousemove,mouseup");
        mapDiv.parentNode.appendChild(this.areaDiv);        
    }    
    
});