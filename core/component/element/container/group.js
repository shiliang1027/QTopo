/**
 * Created by qiyc on 2017/2/8.
 */
Group.prototype = require("./Container.js");
module.exports = Group;
//曲线
var defaults = function () {
    return {
        name: '',
        id: '',
        pid: '',
        font: '30px' + '微软雅黑',
        fontColor: '255,255,255',
        fillColor: '10,10,100',
        alpha: 0.5,
        childDragble: true,
        dragable: true,
        zIndex: 10,
        borderWidth: 0,
        borderRadius: 30,//最大160 最小0
        borderColor: '255,0,0',
        image: "img/mo/wlan_4.png",
        textPosition: 'Bottom_Center',//Bottom_Center Top_Center Middle_Left Middle_Right Hidden,
        eweight: 10000,
        layout: "",
        showLink: false,
        showName: true
    };
};
function Group(config) {
    var self = this;
    self.jtopo = new JTopo.FoldLink(config.start.jtopo, config.end.jtopo);
    self.attr = $.extend(true, defaults(), config || {});
    //函数
    self.set = setJTopo;
    //初始化
    self.set(self.attr);
    //改写源码绘制曲线,可由curveOffset指定弧度
    reset(self);
}
function setJTopo() {
    if (config) {
        var self=this;
        self._setLink(config);
        if(config.direction){
            setDirection.call(self,config.direction);
        }
    }
}
function reset() {

}