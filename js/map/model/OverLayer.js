Abstract.OverLayer = function(){};
Abstract.OverLayer.prototype = {

    initialize: function(mapDiv){
    },
    
    insert: function(){
        if(this.model == null)
            return ;
        if (this.model.overlays == null)
			this.model.overlays = new Array();
		this.model.overlays.push(this);
		this.mapDiv.appendChild(this.div)
    },
    
    remove: function(){
        if(this.model == null)
            return ;
        if (this.model.overlays) {
			this.model.overlays.without(this)
			this.mapDiv.removeChild(this.div);
		}
    }   
    
};