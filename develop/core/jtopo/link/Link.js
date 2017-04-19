var util = require('./util.js');
module.exports = function (jtopo) {
    jtopo.Link = Link;
    function Link(start, end, text) {
        jtopo.InteractiveElement.call(this);
        this.elementType = "link";
        this.zIndex = jtopo.zIndex_Link;
        this.text = text;
        this.nodeA = start;
        this.nodeZ = end;
        this.nodeA && null == this.nodeA.outLinks && (this.nodeA.outLinks = []);
        this.nodeA && null == this.nodeA.inLinks && (this.nodeA.inLinks = []);
        this.nodeZ && null == this.nodeZ.inLinks && (this.nodeZ.inLinks = []);
        this.nodeZ && null == this.nodeZ.outLinks && (this.nodeZ.outLinks = []);
        null != this.nodeA && this.nodeA.outLinks.push(this);
        null != this.nodeZ && this.nodeZ.inLinks.push(this);
        this.caculateIndex();
        this.font = "12px Consolas";
        this.fontColor = "255,255,255";
        this.lineWidth = 2;
        this.lineJoin = "miter";
        this.transformAble = !1;
        this.offset = 20;
        this.gap = 12;
        this.textOffsetX = 0;
        this.textOffsetY = 0;
        this.arrowsRadius = null;
        this.arrowsOffset = 0;
        this.arrowsType = "close";
        this.dashedPattern = [];
        this.path = [];
        var e = "text,font,fontColor,lineWidth,lineJoin".split(",");
        this.serializedProperties = this.serializedProperties.concat(e);
    }

    jtopo.util.inherits(Link, jtopo.InteractiveElement);

    Link.prototype.caculateIndex = function () {
        var a = util.getNums(this.nodeA, this.nodeZ);
        if (a > 0) {
            this.nodeIndex = a - 1;
        }
    };
    Link.prototype.removeHandler = function () {
        var a = this;
        this.nodeA && this.nodeA.outLinks && (this.nodeA.outLinks = this.nodeA.outLinks.filter(function (b) {
            return b !== a
        }));
        this.nodeZ && this.nodeZ.inLinks && (this.nodeZ.inLinks = this.nodeZ.inLinks.filter(function (b) {
            return b !== a
        }));
        var b = util.getLinkNotThis(this);
        b.forEach(function (a, b) {
            a.nodeIndex = b
        })
    };
    Link.prototype.getStartPosition = function () {
        return util.getBorderPoint(this.nodeA, this.nodeZ);
    };
    Link.prototype.getEndPosition = function () {
        return util.getBorderPoint(this.nodeZ, this.nodeA);
    };
    Link.prototype.getPath = function () {
        var path = [];
        var self = this;
        var start = this.getStartPosition();
        var end = this.getEndPosition();
        if (start && end) {
            var NUMS = util.getNums(this.nodeA, this.nodeZ);
            if ((this.nodeA === this.nodeZ) || 1 == NUMS) {
                path.push(start);
                path.push(end);
            } else {
                getPathWidthGap(path);
            }
        }
        return path;

        function getPathWidthGap(path) {
            var tanAngle = Math.atan2(end.y - start.y, end.x - start.x);
            var offsetStart = {
                x: start.x + self.offset * Math.cos(tanAngle),
                y: start.y + self.offset * Math.sin(tanAngle)
            };
            var offsetEnd = {
                x: end.x + self.offset * Math.cos(tanAngle - Math.PI),
                y: end.y + self.offset * Math.sin(tanAngle - Math.PI)
            };
            var i = tanAngle - Math.PI / 2;
            var j = tanAngle - Math.PI / 2;
            var gap = NUMS * self.gap / 2 - self.gap / 2;
            var beginGap = self.gap * self.nodeIndex;
            var firstMiddle = {
                x: offsetStart.x + beginGap * Math.cos(i),
                y: offsetStart.y + beginGap * Math.sin(i)
            };
            var secondMiddle = {
                x: offsetEnd.x + beginGap * Math.cos(j),
                y: offsetEnd.y + beginGap * Math.sin(j)
            };
            firstMiddle = {
                x: firstMiddle.x + gap * Math.cos(i - Math.PI),
                y: firstMiddle.y + gap * Math.sin(i - Math.PI)
            };
            secondMiddle = {
                x: secondMiddle.x + gap * Math.cos(j - Math.PI),
                y: secondMiddle.y + gap * Math.sin(j - Math.PI)
            };
            path.push({
                x: start.x,
                y: start.y
            });
            path.push({
                x: firstMiddle.x,
                y: firstMiddle.y
            });
            path.push({
                x: secondMiddle.x,
                y: secondMiddle.y
            });
            path.push({
                x: end.x,
                y: end.y
            });
        }
    };
    Link.prototype.paintPath = function (context, path) {
        var attr = this.qtopo.attr;
        if (this.nodeA === this.nodeZ) {
            return void this.paintLoop(context);
        }
        context.beginPath();
        context.moveTo(path[0].x, path[0].y);
        if (this.dashedPattern instanceof Array && this.dashedPattern.length == 2) {
            if (this.dashedPattern[0] > 0 && this.dashedPattern[1] > 0) {
                context.setLineDash(this.dashedPattern);
            }
        }
        for (var i = 1; i < path.length; i++) {
            if (attr.radius > 0) {
                if (i < path.length - 1) {
                    context.arcTo(path[i].x, path[i].y, path[i + 1].x, path[i + 1].y, attr.radius);//增加折线弧度
                } else {
                    context.lineTo(path[i].x, path[i].y);
                }
            } else {
                context.lineTo(path[i].x, path[i].y);
            }
        }
        context.stroke();
        context.closePath();
        if (null != this.arrowsRadius) {
            if (attr.arrow.end) {//终点箭头
                this.paintArrow(context, path[path.length - 2], path[path.length - 1]);
            }
            if (attr.arrow.start) {//起点箭头
                this.paintArrow(context, path[1], path[0]);
            }
        }
    };
    Link.prototype.paintLoop = function (a) {
        a.beginPath();
        var radius = this.gap * (this.nodeIndex + 1) / 2;
        a.arc(this.nodeA.x, this.nodeA.y, radius, Math.PI / 2, 2 * Math.PI);
        a.stroke();
        a.closePath();
    };
    Link.prototype.paintArrow = function (context, startPoint, endPoint) {
        context.save();
        context.beginPath();
        context.fillStyle = "rgba(" + this.strokeColor + "," + this.alpha + ")";
        switch (this.arrowsType) {
            case'close':
                util.linkArrow(context, startPoint, endPoint, this.arrowsRadius, this.arrowsOffset, true);
                break;
            default:
                util.linkArrow(context, startPoint, endPoint, this.arrowsRadius, this.arrowsOffset, false);
                this.arrowsType = 'open';
        }
        context.closePath();
        context.restore();
    };
    Link.prototype.paint = function (context) {
        if (null != this.nodeA && null != !this.nodeZ) {
            var path = this.getPath(this.nodeIndex);
            this.path = path;
            context.strokeStyle = "rgba(" + this.strokeColor + "," + this.alpha + ")";
            context.lineWidth = this.lineWidth;
            if (path && path.length > 0) {
                this.paintPath(context, path);
                this.paintText(context, path);
            }
        }
    };
    var i = -(Math.PI / 2 + Math.PI / 4);
    Link.prototype.paintText = function (context, path) {
        var textStart = path[0];
        var textEnd = path[path.length - 1];
        if (4 == path.length) {
            textStart = path[1];
            textEnd = path[2];
        }
        if (this.text && this.text.length > 0) {
            var textX = (textEnd.x + textStart.x) / 2 + this.textOffsetX;
            var textY = (textEnd.y + textStart.y) / 2 + this.textOffsetY;
            context.save();
            context.beginPath();
            context.font = this.font;
            var totalWidth = context.measureText(this.text).width;
            var fontWidth = context.measureText("田").width;
            context.fillStyle = "rgba(" + this.fontColor + ", " + this.alpha + ")";
            if (this.nodeA === this.nodeZ) {
                var GAP = this.gap * (this.nodeIndex + 1) / 2;
                textX = this.nodeA.x + GAP * Math.cos(i);
                textY = this.nodeA.y + GAP * Math.sin(i);
                context.fillText(this.text, textX, textY);
            } else {
                context.fillText(this.text, textX - totalWidth / 2, textY - fontWidth / 2);
            }
            context.stroke();
            context.closePath();
            context.restore();
        }
    };
    Link.prototype.paintSelected = function (context) {
        context.shadowBlur = 10;
        context.shadowColor = "rgba(255,255,255,1)";
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 0;
    };
    Link.prototype.isInBound = function (mouseX, mouseY) {
        if (this.nodeA === this.nodeZ) {
            var d = this.gap * (this.nodeIndex + 1) / 2;
            var e = jtopo.util.getDistance(this.nodeA, {
                    x: mouseX,
                    y: mouseY
                }) - d;
            return Math.abs(e) <= 3;
        }
        var inBound = !1;
        for (var i = 1; i < this.path.length; i++) {
            var start = this.path[i - 1];
            var end = this.path[i];
            if (1 == jtopo.util.isPointInLine({x: mouseX, y: mouseY}, start, end)) {
                inBound = !0;
                break;
            }
        }
        return inBound;
    }
};