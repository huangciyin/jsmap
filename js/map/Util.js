function include(src) {
    HTMLCode = '<script language="javascript" src="' + src + '"></script>';
    document.write(HTMLCode);
}


Util = new Object();

Util.createUniqueID = function (prefix) {
    if (prefix == null) {
        prefix = "id_";
    }
    return prefix + Math.round(Math.random() * 100000000);
};

Util.getValueOfNoPX = function (valueString) {
    if (!valueString)
        return;
    if (valueString.indexOf("px")) {
        var i = valueString.indexOf("px");
        return Number(valueString.substring(0, i));
    }
    return Number(valueString);
}

Util.getRealMapWidth = function (fullExtent) {
    return Util.distanceByLnglat(fullExtent.getMinX() / 1e16, fullExtent.getMaxY() / 1e16, fullExtent.getMaxX() / 1e16, fullExtent.getMaxY() / 1e16);
}

Util.getRealMapHeight = function (fullExtent) {
    return Util.distanceByLnglat(fullExtent.getMinX() / 1e16, fullExtent.getMinY() / 1e16, fullExtent.getMinX() / 1e16, fullExtent.getMaxY() / 1e16);
}

Util.getRealMapBound = function (fullExtent, level) {
    //获取当前级别地图的比例尺
    var scale = Util.zoomScale(level);

    var xmin = fullExtent.getMinX() / 1e16;
    var xmax = fullExtent.getMaxX() / 1e16;
    var ymin = fullExtent.getMinY() / 1e16;
    var ymax = fullExtent.getMaxY() / 1e16;

    //瓦片的长度;
    var tileWidth = TileSize / 96 * 2.54 * scale / 100;
    var cols = Util.getRealMapWidth(fullExtent) / tileWidth; // double
    var rows = (ymax - ymin) / ((xmax - xmin) / cols);
    xmax = (xmax - xmin) / cols * Math.ceil(cols) + xmin;
    ymin = ymax - (ymax - ymin) / rows * Math.ceil(rows);
    return new Bound(xmin * 1e16, xmax * 1e16, ymin * 1e16, ymax * 1e16);
}

Util.distanceByLnglat = function (lng1, lat1, lng2, lat2) {
    var radLat1 = Util.Rad(lat1);
    var radLat2 = Util.Rad(lat2);
    var a = radLat1 - radLat2;
    var b = Util.Rad(lng1) - Util.Rad(lng2);
    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
    s = s * 6378137.0; // 取WGS84标准参考椭球中的地球长半径(单位:m)
    s = Math.round(s * 10000) / 10000;
    return s;
}

Util.Rad = function (d) {//角度转换为弧度;
    return d * Math.PI / 180.0;
}

Util.zoomScale = function (level) {
    var scale;
    switch (level) {
        case 1:
            scale = '5000000';
            break;
        case 2:
            scale = '3400000';
            break;
        case 3:
            scale = '2000000';
            break;
        case 4:
            scale = '1000000';
            break;
        case 5:
            scale = '800000';
            break;
        case 6:
            scale = '500000';
            break;
        case 7:
            scale = '250000';
            break;
        case 8:
            scale = '100000';
            break;
        case 9:
            scale = '50000';
            break;
        case 10:
            scale = '25000';
            break;
        default:
            scale = -1;
            break;
    }
    return scale;
}


Util.createDiv = function (id, left, top, width, height, img, position, border, opacity) {
    if (document.getElementById(id)) {
        return document.getElementById(id);
    }
    var e = document.createElement('div');
    if (id)
        e.id = id;

    if (left)
        e.style.left = parseInt(left) + "px";
    if (top)
        e.style.top = parseInt(top) + "px";

    if (width && height) {
        e.style.width = parseInt(width) + "px";
        e.style.height = parseInt(height) + "px";
    }
    if (img)
        e.appendChild(Util.createImg(id + '_Img', 5, 5, null, null, img, 'relative'));

    if (position)
        e.style.position = position;
    if (border)
        e.style.border = border;

    if (opacity) {
        e.style.opacity = opacity;
        e.style.filter = 'alpha(opacity=' + (opacity * 100) + ')';
    }

    return e;
};


Util.createImg = function (id, left, top, width, height, imgurl, position, border, opacity, delayDisplay) {

    image = document.createElement("img");

    if (delayDisplay) {
        image.style.display = "none";
        Event.observe(image, "load", Util.onImageLoad.bindAsEventListener(image));
        Event.observe(image, "error", Util.onImageLoadError.bindAsEventListener(image));
    }

    image.style.alt = id;
    image.galleryImg = "no";
    if (imgurl)
        image.src = imgurl;

    if (!position)
        position = "relative";

    if (id)
        image.id = id;

    if (left)
        image.style.left = parseInt(left) + "px";
    if (top)
        image.style.top = parseInt(top) + "px";

    if (width && height) {
        image.style.width = parseInt(width) + "px";
        image.style.height = parseInt(height) + "px";
    }

    if (position)
        image.style.position = position;

    if (border)
        image.style.border = border;

    if (opacity) {
        image.style.opacity = opacity;
        image.style.filter = 'alpha(opacity=' + (opacity * 100) + ')';
    }

    return image;
}


Util.setElementStyle = function (element, id, left, top, width, height, position, border, overflow, opacity) {

    if (id) {
        element.id = id;
    }

    if (left)
        element.style.left = parseInt(left) + "px";
    if (top)
        element.style.top = parseInt(top) + "px";

    if (width && height) {
        element.style.width = parseInt(width) + "px";
        element.style.height = parseInt(height) + "px";
    }
    if (position) {
        element.style.position = position;
    }
    if (border) {
        element.style.border = border;
    }
    if (overflow) {
        element.style.overflow = overflow;
    }
    if (opacity) {
        element.style.opacity = opacity;
        element.style.filter = 'alpha(opacity=' + (opacity * 100) + ')';
    }
};



Util.onImageLoad = function () {
    this.style.backgroundColor = null;
    this.style.display = "";
};

Util.onImageLoadError = function () {
    this.style.backgroundColor = "pink";
    this.style.display = "";
};


Util.getMousePixel = function (e) {
    if (!e)
        e = window.event;
    if (!e.pageX)
        e.pageX = e.clientX;
    if (!e.pageY)
        e.pageY = e.clientY;
    return { x: e.pageX, y: e.pageY };
};


Util.getMouseRelativePixel = function (e, mapDiv) {
    var pixel = Util.getMousePixel(e);
    var relDeltaX = pixel.x - Util.getLeft(mapDiv.parentNode) - Util.getValueOfNoPX(mapDiv.style.left);
    var relDeltaY = pixel.y - Util.getTop(mapDiv.parentNode) - Util.getValueOfNoPX(mapDiv.style.top);
    return { x: relDeltaX, y: relDeltaY }
};

Util.getTop = function (obj) {
    var t = obj.offsetTop;
    while (obj = obj.offsetParent) {
        t += obj.offsetTop;
    }
    return t;
};

Util.getLeft = function (obj) {
    var t = obj.offsetLeft;
    while (obj = obj.offsetParent) {
        t += obj.offsetLeft;
    }
    return t;
};

Util.getScreenPixel = function (coord, zoom) {
    var sx = (coord.x - zoom.realMapBound.getMinX()) * ((zoom.getTileCols() * TileSize) / zoom.realMapBound.getWidth());
    var sy = (zoom.realMapBound.getMaxY() - coord.y) * ((zoom.getTileRows() * TileSize) / zoom.realMapBound.getHeight());
    return { x: sx, y: sy }
}

Util.getCoordinateByPixel = function (pixel, zoom) {
    var x = zoom.realMapBound.getMinX() + pixel.x * (zoom.realMapBound.getWidth() / (zoom.getTileCols() * TileSize));
    var y = zoom.realMapBound.getMaxY() - pixel.y * (zoom.realMapBound.getHeight() / (zoom.getTileRows() * TileSize));
    return new Coordinate(x, y);
};
Util.getCoordinateByPixel = function (pixel, zoom) {
    var x = zoom.realMapBound.getMinX() + pixel.x * (zoom.realMapBound.getWidth() / (zoom.getTileCols() * TileSize));
    var y = zoom.realMapBound.getMaxY() - pixel.y * (zoom.realMapBound.getHeight() / (zoom.getTileRows() * TileSize));
    return new Coordinate(x, y);
};
Util.addMarker = function (e) {
    var point = Util.getCoordinateByPixel(Util.getMouseRelativePixel(e, $('map_' + map.mapId)), toolbar.model.zoom).getPoint();
    //var point = Util.getCoordinateByPixel(Util.getMouseRelativePixel(e, $('map')), toolbar.model.zoom).getPoint();
    var address = new Address(point);
    var marker = new Marker(point, Marker.LARGE, address.getAddress());
    marker.setToMap($('map_' + map.mapId), map.model, null, marker);
    //marker.setToMap($('map'), map.model, marker);
};
var state = 1;
var orgLeft = 0;
var orgTop = 0;
var deltaX = 0;
var deltaY = 0;
var timer = null;

function setCurPos(left, top) {
    orgLeft = left;
    orgTop = top;
}

function slide(layerId, w, h, img) {
    var containerW = Util.getValueOfNoPX($(layerId).parentNode.style.width);
    var containerH = Util.getValueOfNoPX($(layerId).parentNode.style.height);

    if (state == 1) {
        state = 0;
        var rate = 200 / 190;
        fly(layerId, containerW, containerH, 20, rate);
        img.src = ImageBaseDir + 'ov_pan_up.gif'
    }
    else {
        state = 1;
        var rate = 190 / 200;
        fly(layerId, containerW - w, containerH - h, 20, rate);
        img.src = ImageBaseDir + 'ov_pan_down.gif';
    }
}
function fly(layerId, left, top, speed, speedRate) {
    wSpeed = (Math.max(orgLeft, left) - Math.min(orgLeft, left)) / (speed);
    hSpeed = (Math.max(orgTop, top) - Math.min(orgTop, top)) / (speed * speedRate);
    move(layerId, wSpeed, hSpeed, left, top);
}
function move(layerId, wSpeed, hSpeed, left, top) {
    clearTimeout(timer);
    if (orgLeft != left) {
        if ((Math.max(orgLeft, left) - Math.min(orgLeft, left)) < wSpeed)
            orgLeft = left;
        else if (orgLeft < left)
            orgLeft = orgLeft + wSpeed;
        else if (orgLeft > left)
            orgLeft = orgLeft - wSpeed;
        $(layerId).style.left = orgLeft+"px";
    }
    if (orgTop != top) {
        if ((Math.max(orgTop, top) - Math.min(orgTop, top)) < hSpeed)
            orgTop = top
        else if (orgTop < top)
            orgTop = orgTop + hSpeed
        else if (orgTop > top)
            orgTop = orgTop - hSpeed
        $(layerId).style.top = orgTop + "px";
    }

    timer = setTimeout('move("' + layerId + '",' + wSpeed + ',' + hSpeed + ',' + left + ',' + top + ')', 30);
};

function MM_swapImgRestore() {
    var i, x, a = document.MM_sr;
    for (i = 0; a && i < a.length && (x = a[i]) && x.oSrc; i++) x.src = x.oSrc;
}

function MM_swapImage() {
    var i, j = 0, x, a = MM_swapImage.arguments;
    document.MM_sr = new Array;
    for (i = 0; i < (a.length - 2); i += 3)
        if ((x = $(a[i])) != null) {
            document.MM_sr[j++] = x;
            if (!x.oSrc)
                x.oSrc = x.src;
            x.src = a[i + 2];
        }
}
//判断浏览器类型; 
function isIE() {
    if (navigator.appName != "Microsoft Internet Explorer") {
        return false;
    }
    return true;
}
