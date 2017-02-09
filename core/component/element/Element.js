/**
 * Created by qiyc on 2017/2/7.
 */
module.exports = new Element();
function Element(){
    this.show=function() {
        this.jtopo.visible=true;
    };
    this.hide=function() {
        this.jtopo.visible=false;
    };
    this.setText=function (text) {
        this.jtopo.text = text;
    };
    this.on=function (name, fn) {
        this.jtopo.addEventListener(name, fn);
    };
    this.setZIndex=function (zIndex) {
        this.jtopo.zIndex = parseInt(zIndex);
    };
    this.setFontColor=function (color) {
        this.jtopo.fontColor = QTopo.util.transHex(color.toLowerCase());
    };
    this.setAlpha=function (alpha) {
        if (alpha > 1 || alpha < 0) {
            this.jtopo.alpha = 1;
        } else {
            this.jtopo.alpha = alpha;
        }
    };
    this.setFont=function (font) {
        this.jtopo.font = font.size + "px " + font.type;
    };
    this.setTextOffset=function(arr){
        if($.isArray(arr)&&arr.length>=2) {
            this.jtopo.textOffsetX = arr[0];
            this.jtopo.textOffsetY = arr[1];
        }else{
            console.error("textOffset need be array and 2 length");
        }
    };
    this.setPosition = function (position, fix) {
        if($.isArray(position)&&position.length>=2) {
            this.jtopo.setLocation(position[0], position[1]);
        }else{
            console.error("position need be array and 2 length");
        }
    };
    this.setSize = function (size) {
        if($.isArray(size)&&size.length>=2){
            this.jtopo.setSize(size[0], size[1]);
        }else{
            console.error("size need be array and 2 length");
        }
    };
    this.setTextPosition = function (textPosition) {
        var jtopo = this.jtopo;
        jtopo.textPosition = textPosition;
        jtopo.text = this.attr.name;
        switch (textPosition) {
            case 'Hidden':
                jtopo.text = '';
                break;
            case 'Bottom_Center':
                jtopo.textOffsetX = 0;
                jtopo.textOffsetY = 0;
                break;
            case 'Top_Center':
                jtopo.textOffsetX = 0;
                jtopo.textOffsetY = 0;
                break;
            case 'Middle_Left':
                jtopo.textOffsetX = -5;
                jtopo.textOffsetY = 0;
                break;
            case 'Middle_Right':
                jtopo.textOffsetX = 5;
                jtopo.textOffsetY = 0;
                break;
            default:
                jtopo.textOffsetX = 0;
                jtopo.textOffsetY = 0;
                jtopo.text = this.attr.name;
                jtopo.textPosition='Bottom_Center';
                break;
        }
    };
    //限制所能修改的属性,arr为所能修改的属性列表
    this._setAttr=function(arr,config){
        var self=this;
        try{
            $.each(arr,function(k,v){
                var fn=self['set'+QTopo.util.upFirst(v)];
                var attr=config[v];
                if(attr&&fn){
                    fn.call(self,attr);
                }
            });
        }catch (e){
            console.info("Element _setAttr error :"+e);
        }
    }
}

