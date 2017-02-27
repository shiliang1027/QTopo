/**
 * Created by qiyc on 2017/2/27.
 */
var Scene = require('./Scene.js');
Scene.prototype.goCenter = function () {
    this.jtopo.stage.centerAndZoom();
};
Scene.prototype.resize=function(size){
    if($.isNumeric(size)){
        this.jtopo.scaleX = size;
        this.jtopo.scaleY = size;
    }
};
Scene.prototype.toggleZoom=function(){
    if (!this.jtopo.stage.wheelZoom) {
        this.jtopo.stage.wheelZoom = 0.85; // 设置鼠标缩放比例
    }else{
        this.jtopo.stage.wheelZoom=null;
    }
};
Scene.prototype.toggleEagleEye=function(){
    this.jtopo.stage.eagleEye.visible=!this.jtopo.stage.eagleEye.visible;
};
Scene.prototype.getPicture=function(){
    //stage.saveImageInfo();
    //在新页面打开图片
    var image = this.jtopo.stage.canvas.toDataURL("image/png");
    var w = window.open('about:blank', 'image from canvas');
    w.document.write("<img src='" + image + "' alt='from canvas'/>");
    //下载图片
    // here is the most important part because if you dont replace you will get a DOM 18 exception.
    // var image =  stage.canvas.toDataURL("image/png").replace("image/png", "image/octet-stream;Content-Disposition: attachment;filename=foobar.png");
    //var image = stage.canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    //window.location.href=image; // it will save locally
};
Scene.prototype.toggleZIndex = function (element, flag) {
    if (element) {
        var jtopo = element.jtopo;
        var scene = this.jtopo;
        if (jtopo && scene) {
            var map = scene.zIndexMap[jtopo.zIndex];
            var index = map.indexOf(jtopo);
            if (!flag) {
                //提升层次
                map.push(map[index]);
                map.splice(index, 1);

            } else {
                //降低层次
                map.splice(0, 0, map[index]);
                map.splice(index + 1, 1);
            }
        }
    }
};
Scene.prototype.getSelected = function () {
    return this.jtopo.selectedElements;
};
module.exports = Scene;