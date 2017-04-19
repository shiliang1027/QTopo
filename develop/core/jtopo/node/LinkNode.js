module.exports=function(jtopo){
    jtopo.LinkNode = LinkNode;
    function LinkNode(text, href, target) {
        jtopo.TextNode.apply(this,arguments);
        this.text = text;
        this.href = href;
        this.target = target;
        this.elementType = "LinkNode";
        this.isVisited = !1;
        this.visitedColor = null;
        this.click(function () {
            "_blank" == this.target ? window.open(this.href) : location = this.href;
            this.isVisited = !0;
        });
    }
    jtopo.util.inherits(LinkNode,jtopo.TextNode);
    LinkNode.prototype.paint = function (context) {
        context.beginPath();
        context.font = this.font;
        this.width = context.measureText(this.text).width;
        this.height = context.measureText("田").width;
        if (this.isVisited && null != this.visitedColor) {
            context.strokeStyle = "rgba(" + this.visitedColor + ", " + this.alpha + ")";
            context.fillStyle = "rgba(" + this.visitedColor + ", " + this.alpha + ")";
        } else {
            context.strokeStyle = "rgba(" + this.fontColor + ", " + this.alpha + ")";
            context.fillStyle = "rgba(" + this.fontColor + ", " + this.alpha + ")";
        }
        context.fillText(this.text, -this.width / 2, this.height / 2);
        if (this.isMouseOver) {
            context.moveTo(-this.width / 2, this.height);
            context.lineTo(this.width / 2, this.height);
            context.stroke();
        }
        context.closePath();
        this.paintBorder(context);
        this.paintCtrl(context);
        this.paintAlarmText(context);
    };
};