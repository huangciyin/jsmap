var baseDir = "";	

var head = document.getElementsByTagName("head")[0];
var nodes = head.childNodes;
for (var i = 0; i < nodes.length;++i) {
	var src = nodes.item(i).src;
	if(src) {
		var index = src.indexOf("/Util.js");
		if (index >= 0) {
			baseDir = src.substring(0, index);
		}
	}
}


include(baseDir + "/Prototype.js");
include(baseDir + "/Map.js");
// include(baseDir + "/MapEvent.js");

include(baseDir + "/model/MapModel.js");
include(baseDir + "/model/MapType.js");
include(baseDir + "/model/Tile.js");
include(baseDir + "/model/Zoom.js");
include(baseDir + "/model/OverLayer.js");
include(baseDir + "/model/Address.js");

include(baseDir + "/geoObject/Bound.js");
include(baseDir + "/geoObject/Coordinate.js");
include(baseDir + "/geoObject/Point.js");
include(baseDir + "/geoObject/Polyline.js");
include(baseDir + "/geoObject/Rectangle.js");
include(baseDir + "/geoObject/Marker.js");

include(baseDir + "/controls/Control.js");
include(baseDir + "/controls/OvMap.js");
include(baseDir + "/controls/NavControl.js");
include(baseDir + "/controls/ScaleControl.js");
include(baseDir + "/controls/MapControl.js");

include(baseDir + "/toolbar/ToolBar.js");
include(baseDir + "/toolbar/Tool.js");
include(baseDir + "/toolbar/Command.js");


function handleLocation(points, pointCoords){
    
    if(pointCoords){
        var coords = pointCoords.split(';');
        var minX = Number(coords[0].split(',')[0]);
        var minY = Number(coords[0].split(',')[1]);
        var maxX = Number(coords[1].split(',')[0]);
        var maxY = Number(coords[1].split(',')[1]);
        var bound = new Bound(minX*1e16,maxX*1e16,minY*1e16,maxY*1e16) ;
        var curZoom = map.model.getZoom();
        var viewBound = curZoom.getViewBound($('map'));         
        var w = bound.getWidth()/viewBound.getWidth();
        var h = bound.getHeight()/viewBound.getHeight();
        var rate = Math.max(w, h);        
        newScale = Util.zoomScale(curZoom.getLevel()) * rate
        for(var i=1; i<=MaxZoomLevel; i++){
            if(Util.zoomScale(i) < newScale){
                break;
            }
        }
        level = i-1 
        map.model.setViewCenterCoord(bound.getCenterCoord());
        map.model.setZoom(new Zoom(level));
        map.model.controls[map.mapWidget.mapDiv.id].paint(map.model, true);
        map.model.controls[map.model.ovId].paint(map.model);  
        $('sliderbar_'+map.model.getId()).parentNode.style.top=((MaxZoomLevel-level)*12+6)+"px";
        
    }
    
    map.model.clearOverLayers(); 
    var zoomPoints = points.split('||');
    for(var i=0; i<zoomPoints.length; i++){
        var linePts = new Array();
        if(zoomPoints[i].indexOf(';')>-1){
            var singlePt = zoomPoints[i].split(';');
            for(var j=0; j<singlePt.length; j++){
                var x = Number(singlePt[j].split(',')[0]);
                var y = Number(singlePt[j].split(',')[1]);
                linePts.push(new Point(x, y));
            }
        }
        var polyline = new Polyline(linePts, 'blue', 2);
        polyline.setToMap($('map_' + map.model.getId()), map.model);    
    }
};

//潮州市富丽学校,110.89850203,21.67807503;

function handlerTypeSearch(searchResult){
    var tHead = '<table style=" width:90%;">'
    var tFoot = "</table>"
    $("search_content").innerHTML = "";
    if(searchResult==null || searchResult.indexOf(',')==-1 )
        return;
    else{
        var resultSplits = searchResult.split(';');
        var content
        for(var i=0; i<resultSplits.length; i++){
            var pointInfo = resultSplits[i].split(',');
            content += '<tr style="cursor:hand"><td onclick=locate("event",'+pointInfo[1]+','+pointInfo[2]+',"'+pointInfo[0]+'")><font size="2">'+pointInfo[0]+'</font></td></tr>'
            //Locate(x, y, info)
        }
        var tb = tHead + content + tFoot;
    }
    $("search_content").innerHTML = tb;
};

function locate(e, x, y, info){
    var mapDiv = $("map").childNodes[0]
    var x = Number(x);
    var y = Number(y);
    
    var marker = new Marker();
    marker.setCoord(new Point(x,y));
    marker.setIcon(new Icon(13, 24, ImageBaseDir + "marker_small.png"));
    marker.setInfo(info);
    marker.setToMap(mapDiv, map.model);
    
    map.model.setViewCenterCoord(marker.getCoord());
    map.model.setZoom(new Zoom(MaxZoomLevel));
    map.model.controls[mapDiv.id].paint(map.model, true);
    map.model.controls[map.model.ovId].paint(map.model);
    $('sliderbar_'+map.model.getId()).parentNode.style.top=6+"px"
    if(e)
        Event.stop(e)
}