Zoom = Class.create();
Zoom.prototype = {
    initialize: function(level){
        this.level = level;        
        this.tileCols = FirstZoomTileCols*Math.pow(2,(this.level - 1));
		this.tileRows = FirstZoomTileRows*Math.pow(2,(this.level - 1));
        this.tileNum = this.tileCols * this.tileRows ;        
        this.scale = Width/(this.tileCols * TileSize * 2.54 /100 / 96);
        this.realMapBound = FullExtent;
    },
    
    getViewBound: function(container){
        var width = Util.getValueOfNoPX(container.style.width);
        var height = Util.getValueOfNoPX(container.style.height);
        this.viewBound = this.realMapBound.getCenterCoord().getBound(width*this.realMapBound.getWidth()/(this.tileCols*TileSize), height*this.realMapBound.getHeight()/(this.tileRows*TileSize));
        return this.viewBound;
    },
    
    getLevel: function(){
        return this.level;
    },
    
    getTileCols: function(){
        return this.tileCols;
    },
    
    getTileRows: function(){
        return this.tileRows;
    },
    
    getScale: function(){
        return this.scale;
    },
    
    getTiles: function(model, container){
        var coord = model.getViewCenterCoord();
        var viewBound = this.getViewBound(container)
        if (viewBound.getCenterCoord() != coord) {
			viewBound = viewBound.clone(coord);
		}
		if (!this.realMapBound.isCover(viewBound)) {
			return null;
		}
		else{
		    var tiles = new Array();
		    var rowFrom = Math.floor((this.realMapBound.getMaxY() - viewBound.getMaxY()) / (this.realMapBound.getHeight() / this.tileRows));
			rowFrom = rowFrom<0 ? 0 : rowFrom;
			
			var rowTo = Math.floor((viewBound.getMinY() - this.realMapBound.getMinY()) / (this.realMapBound.getHeight() / this.tileRows));
			rowTo = rowTo<0 ? this.tileRows:(this.tileRows - rowTo);
			
			var colFrom = Math.floor((viewBound.getMinX() - this.realMapBound.getMinX()) / (this.realMapBound.getWidth() / this.tileCols));
			colFrom = colFrom<0 ? 0 : colFrom;
			
			var colTo = Math.floor((this.realMapBound.getMaxX() - viewBound.getMaxX()) / (this.realMapBound.getWidth() / this.tileCols));
			colTo = colTo<0 ? this.tileCols : (this.tileCols - colTo);
			
			
			var delta = 1;
			rowFrom = rowFrom-delta<0?0:rowFrom-delta;
			rowTo = rowTo+delta>this.tileRows?this.tileRows:rowTo+delta;
			colFrom = colFrom-delta<0?0:colFrom-delta;
			colTo = colTo+delta>this.tileCols?this.tileCols:colTo+delta;
			
			for (var i=rowFrom; i<rowTo; i++) {
				for (var j=colFrom; j<colTo; j++) {
					var tile = new Tile(i, j, this.level, model);
					tiles.push(tile);
				}
			}
			return tiles;
		} 
    }
}