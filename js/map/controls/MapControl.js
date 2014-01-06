﻿//控制地图的显示,继承自Control

MapControl = Class.create();
MapControl.prototype = Object.extend(new Abstract.Control(), {
    initialize: function (id, container) {
        this.id = id;
        this.mapDiv = Util.createDiv(id);
        this.mapDiv.style.position = "absolute";
        this.mapDiv.style.zIndex = 0;
        this.mapDiv.style.cursor = "hand"; //鼠标状态 hand | move;
        this.container = container;
        this.container.style.border = "1px solid #666666"; //border;
        this.container.style.overflow = "hidden";
        this.container.style.position = "relative";
        this.container.appendChild(this.mapDiv);
    },

    paint: function (model, isTracing) {
        var curZoom = model.getZoom();
        var viewBound = curZoom.getViewBound(this.container).clone(model.getViewCenterCoord());
        var mapBound = curZoom.realMapBound;
        var deltaX = (mapBound.getMinX() - viewBound.getMinX()) * (curZoom.getTileCols() * TileSize / mapBound.getWidth());
        var deltaY = (viewBound.getMaxY() - mapBound.getMaxY()) * (curZoom.getTileRows() * TileSize / mapBound.getHeight());
        this.mapDiv.style.left = deltaX + "px";
        this.mapDiv.style.top = deltaY + "px";
        this.mapDiv.style.width = (curZoom.getTileCols() * TileSize) + "px"
        this.mapDiv.style.height = (curZoom.getTileRows() * TileSize) + "px"

        this.loadTiles(model, this.container, this.mapDiv, isTracing);

    }
});