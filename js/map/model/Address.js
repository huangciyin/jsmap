Address = Class.create();
Address.prototype = {
    initialize: function (point) {
                this._x = point.x;
                this._y = point.y;
                this._addr = "我在哪儿呢?~";
    },

    getAddress: function () {
            if (this._x<= 0 || this._y <= 0) return;
                 if (this._x<=113.80253906249999) {
                 this._addr = "紫松公寓";
                 }
                
                 else if (this._x<=  113.87679443359377) {
                    this._addr = "西边操场";
                }
               else if (this._x<= 113.988916015625) {
                    this._addr = "主校区图书馆附近";
                }
                
                 else if(this._x<= 114.08492431640626)
                {
                    this._addr = "南一楼";
                }
                else if(this._x<= 114.389599609375)
                {
                    this._addr = "东九";
                }
                else if(this._x<=114.561474609375)
                {
                    this._addr = "韵院公寓";
                }
                else{
                return "抱歉，暂时未获取到您的地址，请再试一次."
                }
                //return "我在"+this._addr+"哦~&nbsp;&nbsp;&nbsp;&nbsp;<a class=\"rLink\" href=\"#\">分享</a>"+"<br/>X:<b>"+this._x+"</b>Y:<b>"+this._y+"</b>";
                return "我在"+this._addr+"哦~&nbsp;&nbsp;&nbsp;&nbsp;<a class=\"rLink\" href=\"#\">分享</a>"+"<br/>经:<b>"+this._x+"</b>纬:<b>"+this._y+"</b>";
    },

    setAddress: function (x, y, addr) {
//            this._x=x;
//            this._y=y;
//            this._addr = addr;
            
    },
}