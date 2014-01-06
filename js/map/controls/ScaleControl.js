//Scale Control
ScaleControl = Class.create();
ScaleControl.prototype = {
    initialize: function (container) {
        this.id = Util.createUniqueID('Scale_');
        this.scaleDiv = this.create(container)
        container.appendChild(this.scaleDiv);
    },

    create: function (container) {debugger
        //var left = Util.getValueOfNoPX(container.style.left) + 10;
        var left = Util.getValueOfNoPX($('mapholder').style.left)+ 10;
        var top = Util.getValueOfNoPX($('map_wrap').style.top) + Util.getValueOfNoPX($('mapholder').style.height)-30;
        var div = Util.createDiv(this.id, left, top, null, null, null, 'absolute')
        var scaleInfo = Util.createDiv(null, left - 5, top, 150, null, ImageBaseDir + 'scale.gif', 'absolute')
        container.appendChild(scaleInfo);
        div.style.fontSize = "12px";
        div.innerHTML = '<div id="scaleInfo" style="padding:3px;z-index:10;vertical-align:bottom;">&nbsp;</div>';
        return div;
    }
};