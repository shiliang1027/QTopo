var util=require('./util.js');
module.exports=function(jtopo){
    jtopo.FoldLink = FoldLink;
    function FoldLink(start, end, text) {
        jtopo.Link.apply(this, arguments);
        this.direction = "horizontal";
    }
    jtopo.util.inherits(FoldLink,jtopo.Link);
    FoldLink.prototype.getStartPosition = function () {
        var position = {
            x: this.nodeA.cx,
            y: this.nodeA.cy
        };
        if ("horizontal" == this.direction) {
            if (this.nodeZ.cx > position.x) {
                position.x += this.nodeA.width / 2;
            } else {
                position.x -= this.nodeA.width / 2;
            }
        } else {
            if (this.nodeZ.cy > position.y) {
                position.y += this.nodeA.height / 2;
            } else {
                position.y -= this.nodeA.height / 2;
            }
        }
        return position;
    };
    FoldLink.prototype.getEndPosition = function () {
        var position = {
            x: this.nodeZ.cx,
            y: this.nodeZ.cy
        };
        if ("horizontal" == this.direction) {
            if (this.nodeA.cy < position.y) {
                position.y -= this.nodeZ.height / 2
            } else {
                position.y += this.nodeZ.height / 2;
            }
        } else {
            if (this.nodeA.cx < position.x) {
                position.x = this.nodeZ.x;
            } else {
                position.x = this.nodeZ.x + this.nodeZ.width;
            }
        }
        return position;
    };
    FoldLink.prototype.getPath = function (Index) {
        var start = this.getStartPosition();
        var end = this.getEndPosition();
        if (this.nodeA === this.nodeZ) {
            return [start, end];
        }
        var path = [];
        var middleX;
        var middleY;
        var NUMS = util.getNums(this.nodeA, this.nodeZ);
        var benginGap = (NUMS - 1) * this.gap;
        var totalGap = this.gap * Index - benginGap / 2;
        if ("horizontal" == this.direction) {
            middleX = end.x + totalGap;
            middleY = start.y - totalGap;
            path.push({x: start.x, y: middleY});
            path.push({x: middleX, y: middleY});
            path.push({x: middleX, y: end.y});
        } else {
            middleX = start.x + totalGap;
            middleY = end.y - totalGap;
            path.push({x: middleX, y: start.y});
            path.push({x: middleX, y: middleY});
            path.push({x: end.x, y: middleY});
        }
        return path
    };
    FoldLink.prototype.paintText = function (context, path) {
        if (this.text && this.text.length > 0) {
            var textStart = path[1];
            var textX = textStart.x + this.textOffsetX;
            var textY = textStart.y + this.textOffsetY;
            context.save();
            context.beginPath();
            context.font = this.font;
            var totalWidth = context.measureText(this.text).width;
            var fontWidth = context.measureText("田").width;
            context.fillStyle = "rgba(" + this.fontColor + ", " + this.alpha + ")";
            context.fillText(this.text, textX - totalWidth / 2, textY - fontWidth / 2);
            context.stroke();
            context.closePath();
            context.restore();
        }
    }
};