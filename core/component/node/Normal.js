/**
 * Created by qiyc on 2017/2/7.
 */
var defaults={
    name: "node",
    image: "img/mo/wlan_4.png",
    size:[64,64],
    alpha: 1,
    position:[0,0],
    font: '16px 微软雅黑',
    weight:10,
    zIndex: 200,//层级(10-999)
    id: "",
    pid: '',
    color: JTopo.util.randomColor(),
    textPosition: 'Bottom_Center',//Bottom_Center Top_Center Middle_Left Middle_Right Hidden
    type: 'normal',
    text: ''
};
//一般节点
function Normal(config) {
    var self=this;
    config=$.extend(defaults, config||{});
    self.attr=config;
    self.jtopo = new JTopo.Node();
    //函数
    self.set=setJTopo;
    self.set(config);//初始化
}
module.exports = Normal;

function setJTopo(attr){
    if(attr){
        var jtopo=this.jtopo;
        $.extend(true, this.attr, attr||{});
        if(attr.image){
            setImage(attr.image,this);
        }
        if(attr.textPosition||attr.namePosition){
            setTextPosition(attr.textPosition||attr.namePosition,this);
        }else if(attr.name){
            setTextPosition('Bottom_Center',this);
        }
        if(attr.size){
            jtopo.setSize(attr.size[0], attr.size[1]);
        }
        if(attr.position){
            jtopo.setLocation(attr.position[0], attr.position[1]);
        }
        if(attr.alpha){
            jtopo.alpha=attr.alpha;
        }
    }
}
function setImage(image,node) {
    node.jtopo.setImage(image);
}
function setTextPosition(textPosition,node) {
    var jtopo=node.jtopo;
    jtopo.textPosition = textPosition;
    jtopo.text = node.attr.name;
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
    }
}
function drawAlarm(set) {
    if(this.attr.scene){
        var config =QTopo.config;
        var color = set.color ? set.color.toLowerCase(): (this.attr.alarmLevel?config.alarm.color[this.attr.alarmLevel-1]:'0,0,255');
        this.alarm = set.text ||(this.alarm||'No Alarm Text!');
        this.alarmColor = QTopo.util.transHex(color);
        this.alarmAlpha = 1;
        this.alarmFont = (set.size || 20) + 'px ' + (set.font || '微软雅黑');
        this.attr.alarmLevel = set.level||(this.attr.alarmLevel||config.alarm.color.length);
        this.attr.alarmColor = color;
        shadowFlash(this, this.alarmColor);
    }
}
function shadowFlash(node, color) {
    node.shadow = true;
    node.shadowOffsetX = 0;
    node.shadowOffsetY = 0;
    node.shadowColor = "rgba(" + color + ",1)";
    node.shadowBlur = 10;
    flash(node, true);
}
function flash(node, flag) {
    if (node.attr.flash) {
        clearInterval(node.attr.flash);
    }
    node.attr.flash = setInterval(function () {
        if (flag) {
            node.shadowBlur += 10;
            if (node.shadowBlur >= 100) {
                flag = false;
            }
        }
        else {
            node.shadowBlur -= 10;
            if (node.shadowBlur <= 10) {
                flag = true;
            }
        }
    }, 100);
}