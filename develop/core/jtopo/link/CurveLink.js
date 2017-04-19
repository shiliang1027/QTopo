var util = require('./util.js');
module.exports = function (jtopo) {
    jtopo.CurveLink = CurveLink;
    function CurveLink(start, end, text) {
        jtopo.Link.apply(this, arguments);
    }
    jtopo.util.inherits(CurveLink,jtopo.Link);
    CurveLink.prototype.paintPath = function (context, path) {
        if (this.nodeA === this.nodeZ)return void this.paintLoop(context);
        var start = path[0];
        var end = path[path.length - 1];
        var middle = path.middle;
        if (start && end && middle) {
            context.beginPath();
            if (this.dashedPattern instanceof Array && this.dashedPattern.length == 2) {
                if (this.dashedPattern[0] > 0 && this.dashedPattern[1] > 0) {
                    context.setLineDash(this.dashedPattern);
                }
            }
            context.moveTo(start.x, start.y);
            context.strokeStyle = "rgba(" + this.strokeColor + "," + this.alpha + ")";
            context.lineWidth = this.lineWidth;
            context.moveTo(start.x, start.y);
            context.quadraticCurveTo(middle.x, middle.y, end.x, end.y);
            context.stroke();
            context.closePath();
            if (null != this.arrowsRadius) {
                if (this.qtopo.attr.arrow.end) {
                    this.paintArrow(context, start, end);
                }
                if (this.qtopo.attr.arrow.start) {
                    this.paintArrow(context, end, start);
                }
            }
        }
    };
    CurveLink.prototype.getPath = function () {
        var path = [];
        var start = this.getStartPosition();
        var end = this.getEndPosition();
        if (start && end) {
            if (this.nodeA === this.nodeZ) {
                path.push(start);
                path.push(end);
            } else {
                var angle = Math.atan(Math.abs(end.y - start.y) / Math.abs(end.x - start.x));
                path.middle = {
                    x: (start.x + end.x) / 2 + this.offset * Math.cos(angle - Math.PI / 2),
                    y: (start.y + end.y) / 2 + this.offset * Math.sin(angle - Math.PI / 2)
                };
                path.text = util.makeQuadraticPoint(start, path.middle, end, 1 / 2);
                path.angle = angle;
                path.push(start);
                for (var i = 1; i <= 5; i++) {
                    path.push(util.makeQuadraticPoint(start, path.middle, end, i / 5));//取样份与选取难度相关
                }
                path.push(end);
            }
        }
        return path
    };
    CurveLink.prototype.paintText = function (cx, path) {
        if (this.text && this.text.length > 0) {
            var textX = path.text.x + this.textOffsetX;
            var textY = path.text.y + this.textOffsetY;
            cx.save();
            cx.beginPath();
            cx.font = this.font;
            var totalWidth = cx.measureText(this.text).width;
            var fontWidth = cx.measureText("田").width;
            cx.fillStyle = "rgba(" + this.fontColor + ", " + this.alpha + ")";
            cx.fillText(this.text, textX - totalWidth / 2, textY - fontWidth / 2);
            cx.stroke();
            cx.closePath();
            cx.restore();
        }
    };

};