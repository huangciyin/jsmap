Marker = Class.create();
Marker.prototype = Object.extend(new Abstract.OverLayer(), {
    initialize: function (point, iconSet, info) {
        this.id = Util.createUniqueID("Over_Marker_");
        if (iconSet) {
            if (iconSet == Marker.SMALL) {//指定小图标;
                this.icon = new Icon(12, 20, Marker.SMALL_ICON);
                this.shadowIcon = new Icon(22, 20, Marker.SMALL_SHADOW_ICON);
            }
            else {//默认大图标;
                this.icon = new Icon(20, 34, ImageBaseDir+"marker_large.png");
                this.shadowIcon = new Icon(37, 34, ImageBaseDir+"marker_large_shadow.png");
            }
        }
        if (point) {
            this.coord = point.getCoord();
        }
        if (info) {
            this.info = info;
        }
    },
    getId: function () {
        return this.id;
    },
    setId: function (id) {
        this.id = id;
    },
    getCoord: function () {
        return this.coord;
    },
    setCoord: function (point) {
        this.coord = point.getCoord();
    },

    getIcon: function () {
        return this.icon;
    },
    setIcon: function (icon) {
        this.icon = icon;
    },
    getShadowIcon: function () {
        return this.shadowIcon;
    },
    setShadowIcon: function (sIcon) {
        this.shadowIcon = sIcon;
    },
    getInfo: function () {
        return this.info;
    },
    setInfo: function (info) {
        this.info = info;
    },



    setToMap: function (mapDiv, model, overLayDiv, marker) {
        this.mapDiv = mapDiv;
        this.model = model;
        this.sPoint = Util.getScreenPixel(this.coord, model.getZoom());
        var deltaX = this.sPoint.x - this.icon.width / 2;
        var deltaY = this.sPoint.y - this.icon.height;
        var markerDiv = $(this.id);
        var markerDiv = Util.createDiv(this.id, deltaX, deltaY, Math.max(this.icon.width, this.shadowIcon.width), Math.max(this.icon.height, this.shadowIcon.height), null, 'absolute');
        markerDiv.style.zIndex = 10; //保证markerDiv在最前面;
        //图标;
        //        if (isIE() && this.getIcon().src.toLowerCase().indexOf("png") != -1) {
        //            markerDiv.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src=" + this.icon.src + ", sizingmethod=scale);";
        //        }
        //        else 
        {
            var _icon = Util.createImg("_icon_" + this.id, 0, 0, this.icon.width, this.icon.height, this.icon.src, 'relative');
            _icon.onclick = function () {
                return false;
            };
            if (!$("_icon_" + this.id)) {
                markerDiv.appendChild(_icon);
            }
        }
        //阴影;
        //        if (isIE() && this.getShadowIcon().src.toLowerCase().indexOf("png") != -1) {
        //            markerDiv.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src=" + this.getShadowIcon.src + ", sizingmethod=scale);";
        //        }
        //        else 
        {
            var _s_icon = Util.createImg("_s_icon_" + this.id, 0, -this.icon.height, this.shadowIcon.width, this.shadowIcon.height, this.shadowIcon.src, 'relative');
            _s_icon.onclick = function () {
                return false;
            };
            if (!$("_s_icon_" + this.id)) {
                markerDiv.appendChild(_s_icon);
            }
        }
        //click事件;
        markerDiv.onclick = function () {
            if (marker.info) {
                var markerdiv = $("marker_" + marker.id + "_infowindow");
                if (markerdiv && markerdiv.style.display != "none") {//已存在,再次点击则隐藏;
                    markerdiv.style.display = 'none';
                }
                else if (markerdiv && markerdiv.style.display == "none") {//已隐藏,再次点击则显示;
                    markerdiv.style.display = 'block';
                }
                else {//不存在时显示;
                    marker.showInfoWindow(marker);
                }
            }
        };
        //overLayDiv;
        if (overLayDiv) {
            this.div = overLayDiv;
            overLayDiv.style.left = deltaX + 'px';
            overLayDiv.style.top = deltaY + 'px';
        }
        else {
            //this.model.clearOverLayers();
            this.div = markerDiv;
            this.insert();
            this.div.style.cursor = "pointer";
        };
        // Event.observe(markerDiv, "click", this.reLoadInfo.bindAsEventListener(this));
    },

    reLoadInfo: function (e) {
        if (this.info && this.infoDiv) {
            this.infoDiv.style.display = "";
        }
    },

    showInfoWindow: function (marker) {
        var infoWindowID = "marker_" + marker.getId() + "_infowindow";
        var infoWindow = $(infoWindowID); //Info窗口;
        var newDeltaX = this.icon.width;
        var newDeltaY = -50;
        if (infoWindow == null) {
            //创建Info窗口;
            //var mapDiv = $("map_" + map.mapId);
            infoWindow = Util.createDiv(infoWindowID, newDeltaX, newDeltaY, null, null, null, 'absolute', '1px solid #999999', 0.85);
            infoWindow.onselect = function () {
                return false;
            };
            infoWindow.style.background = "#F5F5F5";
            infoWindow.style.fontSize = "12px";
            infoWindow.style.padding = "2px";
            infoWindow.innerHTML = '<div align="right" style="background:rgba(150,150,150,0.5); padding:2px;"><img onclick="hideInfoWindown(event,\'' + infoWindowID
            + '\');" src="' + ImageBaseDir + 'infowindow_close.gif"></div><div id="marker_' + marker.id + '_infowindow_content" style="padding:2px;"></div>';
            //infoWindow.style.background = "url('" + ImageBaseDir + "infowindow.gif')";//比较好看的形状;

            //mapDiv.appendChild(infoWindow);
            $(marker.id).appendChild(infoWindow);
        }
        //this.infoWindow.style.cursor = "default";
        //this.infoWindow.style.display = "";
        infoWindow.style.zIndex = $(marker.id).zIndex++;
        $("marker_" + marker.id + "_infowindow_content").innerHTML = marker.getInfo(); //添加Info;
    }
});

Icon = Class.create();
Icon.prototype = {
    initialize: function (w, h, src) {
        this.width = w;
        this.height = h;
        this.src = src;
    }
};

// 常量

//图标;
Marker.LARGE = "LARGE";
Marker.SMALL = "SMALL";
Marker.LARGE_ICON = ImageBaseDir + "marker_large.png";
Marker.SMALL_ICON = ImageBaseDir + "marker_small.png";
Marker.LARGE_SHADOW_ICON = ImageBaseDir + "marker_large_shadow.png";
Marker.SMALL_SHADOW_ICON = ImageBaseDir + "marker_small_shadow.png";