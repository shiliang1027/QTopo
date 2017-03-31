var Element=require("../Element.js");
module.exports =Line;
function Line(jtopo) {
    if(jtopo){
        Element.call(this,jtopo);
    }else{
        QTopo.util.error("create Line without jtopo",this);
    }
    this.attr.path={
        start:this.jtopo.nodeA,
        end:this.jtopo.nodeZ
    };
}
QTopo.util.inherits(Line,Element);
Line.prototype.setPosition=function(position){
    var start=this.attr.path.start;
    var end=this.attr.path.end;
    if($.isArray(position.start)&&$.isNumeric(position.start[0])&&$.isNumeric(position.start[1])){
        start.setLocation(parseInt(position.start[0]), parseInt(position.start[1]));
    }
    if($.isArray(position.end)&&$.isNumeric(position.end[0])&&$.isNumeric(position.end[1])){
        end.setLocation(parseInt(position.end[0]), parseInt(position.end[1]));
    }
    this.attr.position={
        start:[start.x,start.y],
        end:[end.x,end.y]
    };
};
Line.prototype.getType=function(){
    return QTopo.constant.Line;
};
Line.prototype.setColor = function (color) {
    if (color) {
        this.jtopo.strokeColor = QTopo.util.transHex(color.toLowerCase());
    }
    this.attr.color=this.jtopo.strokeColor;
};
Line.prototype.setNum = function (num) {
    if ($.isNumeric(num)) {
        if(num > 1){
            this.jtopo.text = '(+' + num + ')';
        }else {
            this.jtopo.text = '';
        }
        this.attr.num=num;
    }
};
Line.prototype.setWidth=function(width){
    if($.isNumeric(width)){
        this.jtopo.lineWidth = width; // 线宽
    }
    this.attr.width=this.jtopo.lineWidth;
};
Line.prototype.setArrow = function(arrow){
    if(arrow){
        this.jtopo.arrowsRadius = $.isNumeric(arrow.size)?arrow.size:0;
        this.jtopo.arrowsOffset = $.isNumeric(arrow.offset)?arrow.offset:0;
    }
    if(!this.attr.arrow){
        this.attr.arrow={};
    }
    this.attr.arrow.size=this.jtopo.arrowsRadius;
    this.attr.arrow.offset=this.jtopo.arrowsOffset;
};
Line.prototype.setGap=function(gap){
    if(gap){
        this.jtopo.bundleGap = $.isNumeric(gap)?gap:0; // 线条之间的间隔
    }
    this.attr.gap=this.jtopo.bundleGap;
};
Line.prototype.setDashed=function(dashedPattern){
    if($.isNumeric(dashedPattern)&&dashedPattern>0){
        this.jtopo.dashedPattern=parseInt(dashedPattern);
    }else{
        this.jtopo.dashedPattern=null;
    }
    this.attr.dashed=this.jtopo.dashedPattern;
};
