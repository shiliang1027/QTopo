module.exports=function(jtopo){
    jtopo.TextNode = TextNode;
    function TextNode(text) {
        jtopo.Node.apply(this,arguments);
        this.text = text;
        this.elementType = "TextNode";
    }
    jtopo.util.inherits(TextNode,jtopo.Node);
    TextNode.prototype.paint = function (context) {
        //自动换行
        var self=this;
        var texts = this.text.split("\n");
        context.beginPath();
        context.font = this.font;
        var fontWidth = context.measureText("田").width;
        this.width = 0;
        texts.forEach(function(text){
            var width = context.measureText(text).width;
            if (width > self.width) {
                self.width = width;
            }
        });
        this.height = texts.length * fontWidth;
        context.fillStyle = "rgba(" + this.fontColor + ", " + this.alpha + ")";
        if (texts.length > 1) {
            texts.forEach(function(text,i){
                context.fillText(text, -self.width / 2 + 0.15 * fontWidth, self.height / 2 + (i - texts.length + 0.85) * fontWidth);
            });
        } else {
            context.fillText(texts, -this.width / 2 + 0.03 * fontWidth, this.height / 2 - 0.15 * fontWidth);
        }
        context.closePath();
        this.paintBorder(context);
        this.paintCtrl(context);
        this.paintAlarmText(context);
    };
};
