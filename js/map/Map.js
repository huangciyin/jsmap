Map = Class.create();
Map.prototype = {

    mapTypes: new Object(),
    currentMapType: null,

    initialize: function (container) {
        this.container = container;
        this.container.style.backgroundImage = 'url(' + ImageBaseDir + 'iaspec_bottom.png)';
        this.container.style.color = "#006c54";
        this.mapId = Util.createUniqueID();
        this.containerWidth = Util.getValueOfNoPX(this.container.style.width);
        this.containerHeight = Util.getValueOfNoPX(this.container.style.height);
        this.model = new MapModel(this.mapId);
        this.mapControl = new MapControl("map_" + this.mapId, this.container);
        this.model.controls[this.mapControl.id] = this.mapControl;
        var scale = new ScaleControl(container);
        this.model.controls[scale.id] = scale;

    },

    getContainer: function () {
        return this.container;
    },

    setCenter: function (centerPoint, level) {
        this.model.defaultCenterPoint = centerPoint;
        this.model.defaultLevel = level;
        this.model.setViewCenterCoord(centerPoint.getCoord());
        this.model.setZoom(new Zoom(level));
        this.mapControl.paint(this.model, true);
        this.level = level;

        Event.observe(this.mapControl.mapDiv, "mousewheel", this.map_mousewheel.bindAsEventListener(this));
    },

    map_mousewheel: function (e) {

        var level = this.model.getZoom().getLevel();
        if (window.event.wheelDelta == 120 && level < MaxZoomLevel) {
            level += 1
            this.model.setZoom(new Zoom(level));
            this.mapControl.paint(this.model, true);
        }
        else if (window.event.wheelDelta == -120 && level > 1) {
            level -= 1
            this.model.setZoom(new Zoom(level));
            this.mapControl.paint(this.model, true);
        }
        $('sliderbar_' + this.model.getId()).parentNode.style.top = ((MaxZoomLevel - level) * 12 + 6) + "px";
    },

    addMapType: function (type, isCurrent) {
        if (isCurrent) {
            this.model.setCurrentMapType(type);
        }

        this.model.mapTypeIds.push(type.typeId)
        this.model.mapTypes[type.typeId] = type;
        type.paint(this.model, $('map'));
    },

    addOverLayer: function (overlay) {
        if (this.overlays == null) {
            this.overlays = new Array();
        }
        if (overlay == null) {
            return;
        }
        this.overlays.push(overlay);
        return overlay;
    },

    addControl: function (control) {
        control.paint(this.model)
        this.model.controls[control.id] = control;
    },

    addToolBar: function (toolbar) {
        toolbar.setMapModel(this.model);
        toolbar.registerEventToMap(this.mapControl.mapDiv);
    }
};

