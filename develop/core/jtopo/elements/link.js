module.exports = function (jtopo) {
    Link.prototype = new jtopo.InteractiveElement;
    FoldLink.prototype = new Link;
    FlexionalLink.prototype = new Link;
    CurveLink.prototype = new Link;
    jtopo.Link = Link;
    jtopo.FoldLink = FoldLink;
    jtopo.FlexionalLink = FlexionalLink;
    jtopo.CurveLink = CurveLink;

    function getPublicLink(elementA, elementB) {
        var result = [];
        if (null == elementA || null == elementB)return result;
        if (elementA && elementB && elementA.outLinks && elementB.inLinks)
            for (var i = 0; i < elementA.outLinks.length; i++) {
                var outLink = elementA.outLinks[i];
                for (var f = 0; f < elementB.inLinks.length; f++) {
                    var inlink = elementB.inLinks[f];
                    if (outLink === inlink) {
                        result.push(inlink);
                    }
                }
            }
        return result
    }

    function getLinksBetween(start, end) {
        var d = getPublicLink(start, end);
        var e = getPublicLink(end, start);
        return d.concat(e);
    }

    function getLinkNotThis(link) {
        var b = getLinksBetween(link.nodeA, link.nodeZ);
        return b = b.filter(function (b) {
            return link !== b
        })
    }

    function getNums(a, b) {
        return getLinksBetween(a, b).length
    }

    /*计算二次线的右侧固定坐标,待定*/
    function getfixedRight(start, end) {
        //重写线的绘制路径
        var littleSize = 50;
        var startRight = {
            x: start.x + start.width,
            y: start.y + start.height / 2
        };
        var endRight = {
            x: end.x + end.width,
            y: end.y + end.height / 2
        };
        var middleA = {};
        var middleB = {};
        if (startRight.x > endRight.x) {
            middleA.x = startRight.x + littleSize;
            middleA.y = startRight.y;
            middleB.x = startRight.x + littleSize;
            middleB.y = endRight.y;
        } else {
            middleA.x = endRight.x + littleSize;
            middleA.y = startRight.y;
            middleB.x = endRight.x + littleSize;
            middleB.y = endRight.y;
        }
        return [startRight, middleA, middleB, endRight];
    }

    function getBorderPoint(start, end) {
        var lineFn = jtopo.util.lineF(start.cx, start.cy, end.cx, end.cy);
        var bound = start.getBound();
        return jtopo.util.intersectionLineBound(lineFn, bound);
    }

    function linkArrow(context, startPoint, endPoint, radius, offset, type) {
        var atanAngle = Math.atan2(endPoint.y - startPoint.y, endPoint.x - startPoint.x);
        var length = jtopo.util.getDistance(startPoint, endPoint) - radius;
        var COS = startPoint.x + (length + offset) * Math.cos(atanAngle);
        var SIN = startPoint.y + (length + offset) * Math.sin(atanAngle);
        var m = endPoint.x + offset * Math.cos(atanAngle);
        var n = endPoint.y + offset * Math.sin(atanAngle);
        atanAngle -= Math.PI / 2;
        var o = {
            x: COS + (radius / 2) * Math.cos(atanAngle),
            y: SIN + (radius / 2) * Math.sin(atanAngle)
        };
        var p = {
            x: COS + (radius / 2) * Math.cos(atanAngle - Math.PI),
            y: SIN + (radius / 2) * Math.sin(atanAngle - Math.PI)
        };
        context.moveTo(o.x, o.y);
        context.lineTo(m, n);
        context.lineTo(p.x, p.y);
        if (type) {
            context.fill();
        } else {
            context.stroke();
        }
    }

    function Link(start, end, text) {
        this.initialize = function (start, end, text) {
            Link.prototype.initialize.apply(this, arguments);
            this.elementType = "link";
            this.zIndex = jtopo.zIndex_Link;
            if (0 != arguments.length) {
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
                this.dashedPattern = null;
                this.path = [];
                var e = "text,font,fontColor,lineWidth,lineJoin".split(",");
                this.serializedProperties = this.serializedProperties.concat(e)
            }
        };
        this.caculateIndex = function () {
            var a = getNums(this.nodeA, this.nodeZ);
            if (a > 0) {
                this.nodeIndex = a - 1;
            }
        };
        this.initialize(start, end, text);
        this.removeHandler = function () {
            var a = this;
            this.nodeA && this.nodeA.outLinks && (this.nodeA.outLinks = this.nodeA.outLinks.filter(function (b) {
                return b !== a
            }));
            this.nodeZ && this.nodeZ.inLinks && (this.nodeZ.inLinks = this.nodeZ.inLinks.filter(function (b) {
                return b !== a
            }));
            var b = getLinkNotThis(this);
            b.forEach(function (a, b) {
                a.nodeIndex = b
            })
        };
        this.getStartPosition = function () {
            return getBorderPoint(this.nodeA, this.nodeZ);
        };
        this.getEndPosition = function () {
            return getBorderPoint(this.nodeZ, this.nodeA);
        };
        this.getPath = function () {
            var path=[];
            var self = this;
            var start = this.getStartPosition();
            var end = this.getEndPosition();
            if(start&&end){
                var NUMS = getNums(this.nodeA, this.nodeZ);
                if ((this.nodeA === this.nodeZ)||1 == NUMS){
                    path.push(start);
                    path.push(end);
                }else{
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
        this.paintPath = function (context, path) {
            var attr = this.qtopo.attr;
            if (this.nodeA === this.nodeZ) {
                return void this.paintLoop(context);
            }
            context.beginPath();
            context.moveTo(path[0].x, path[0].y);
            for (var i = 1; i < path.length; i++) {
                if (null == this.dashedPattern) {
                    if (attr.radius > 0) {
                        if (i < path.length - 1) {
                            context.arcTo(path[i].x, path[i].y, path[i + 1].x, path[i + 1].y, attr.radius);//增加折线弧度
                        } else {
                            context.lineTo(path[i].x, path[i].y);
                        }
                    } else {
                        context.lineTo(path[i].x, path[i].y);
                    }
                } else {
                    context.JTopoDashedLineTo(path[i - 1].x, path[i - 1].y, path[i].x, path[i].y, this.dashedPattern);
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
        this.paintLoop = function (a) {
            a.beginPath();
            var radius = this.gap * (this.nodeIndex + 1) / 2;
            a.arc(this.nodeA.x, this.nodeA.y, radius, Math.PI / 2, 2 * Math.PI);
            a.stroke();
            a.closePath();
        };
        this.paintArrow = function (context, startPoint, endPoint) {
            context.save();
            context.beginPath();
            context.fillStyle = "rgba(" + this.strokeColor + "," + this.alpha + ")";
            switch (this.arrowsType) {
                case'close':
                    linkArrow(context, startPoint, endPoint, this.arrowsRadius, this.arrowsOffset, true);
                    break;
                default:
                    linkArrow(context, startPoint, endPoint, this.arrowsRadius, this.arrowsOffset, false);
                    this.arrowsType = 'open';
            }
            context.closePath();
            context.restore();
        };
        this.paint = function (context) {
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
        this.paintText = function (context, path) {
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
        this.paintSelected = function (context) {
            context.shadowBlur = 10;
            context.shadowColor = "rgba(255,255,255,1)";
            context.shadowOffsetX = 0;
            context.shadowOffsetY = 0;
        };
        this.isInBound = function (mouseX, mouseY) {
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
    }

    function FoldLink(a, b, c) {
        this.initialize = function () {
            FoldLink.prototype.initialize.apply(this, arguments);
            this.direction = "horizontal";
        };
        this.initialize(a, b, c);
        this.getStartPosition = function () {
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
        this.getEndPosition = function () {
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
        this.getPath = function (Index) {
            var start = this.getStartPosition();
            var end = this.getEndPosition();
            if (this.nodeA === this.nodeZ) {
                return [start, end];
            }
            var path = [];
            var middleX;
            var middleY;
            var NUMS = getNums(this.nodeA, this.nodeZ);
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
        this.paintText = function (context, path) {
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
    }

    function FlexionalLink(a, b, c) {
        this.initialize = function () {
            FlexionalLink.prototype.initialize.apply(this, arguments);
            this.direction = "vertical";
            this.offset = 44;
        };
        this.initialize(a, b, c);
        this.getStartPosition = function () {
            var position = {
                x: this.nodeA.cx,
                y: this.nodeA.cy
            };
            if ("horizontal" == this.direction) {
                if (this.nodeZ.cx < position.x) {
                    position.x = this.nodeA.x;
                } else {
                    position.x = this.nodeA.x + this.nodeA.width
                }
            } else {
                if (this.nodeZ.cy < position.y) {
                    position.y = this.nodeA.y;
                } else {
                    position.y = this.nodeA.y + this.nodeA.height;
                }
            }
            return position;
        };
        this.getEndPosition = function () {
            var position = {
                x: this.nodeZ.cx,
                y: this.nodeZ.cy
            };
            if ("horizontal" == this.direction) {
                if (this.nodeA.cx < position.x) {
                    position.x = this.nodeZ.x;
                } else {
                    position.x = this.nodeZ.x + this.nodeZ.width;
                }
            } else {
                if (this.nodeA.cy < position.y) {
                    position.y = this.nodeZ.y;
                } else {
                    position.y = this.nodeZ.y + this.nodeZ.height;
                }
            }
            return position;
        };
        this.getPath = function (index) {
            var start = this.getStartPosition();
            var end = this.getEndPosition();
            if (this.nodeA === this.nodeZ) {
                return [start, end];
            }
            var path = [];
            var totalLinks = getNums(this.nodeA, this.nodeZ);
            var totalGap = (totalLinks - 1) * this.gap;
            var gap = this.gap * index - totalGap / 2;
            var linkOffset = this.offset;
            if ("horizontal" == this.direction) {
                if (this.nodeA.cx > this.nodeZ.cx) {
                    linkOffset = -linkOffset
                }
                path.push({x: start.x, y: start.y + gap});
                path.push({x: start.x + linkOffset, y: start.y + gap});
                path.push({x: end.x - linkOffset, y: end.y + gap});
                path.push({x: end.x, y: end.y + gap})
            } else {
                if (this.nodeA.cy > this.nodeZ.cy) {
                    linkOffset = -linkOffset
                }
                path.push({x: start.x + gap, y: start.y});
                path.push({x: start.x + gap, y: start.y + linkOffset});
                path.push({x: end.x + gap,y: end.y - linkOffset});
                path.push({x: end.x + gap, y: end.y});
            }
            return path;
        }
    }


    //制造一个二次贝塞尔曲线的阶段点
    function makeQuadraticPoint(start, middle, end, time) {
        return {
            x: (1 - time) * (1 - time) * start.x + 2 * time * (1 - time) * middle.x + time * time * end.x,
            y: (1 - time) * (1 - time) * start.y + 2 * time * (1 - time) * middle.y + time * time * end.y
        }
    }

    function CurveLink(a, b, c) {
        this.initialize = function () {
            CurveLink.prototype.initialize.apply(this, arguments)
        };
        this.initialize(a, b, c);
        this.paintPath = function (context, path) {
            if (this.nodeA === this.nodeZ)return void this.paintLoop(context);
            var start = path[0];
            var end = path[path.length - 1];
            var middle = path.middle;
            if (start && end && middle) {
                context.beginPath();
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
        this.getPath = function () {
            var path = [];
            var start = this.getStartPosition();
            var end = this.getEndPosition();
            if (start && end) {
                if (this.nodeA === this.nodeZ) {
                    path.push(start);
                    path.push(end);
                }else{
                    var angle = Math.atan(Math.abs(end.y - start.y) / Math.abs(end.x - start.x));
                    path.middle = {
                        x: (start.x + end.x) / 2 + this.offset * Math.cos(angle - Math.PI / 2),
                        y: (start.y + end.y) / 2 + this.offset * Math.sin(angle - Math.PI / 2)
                    };
                    path.text = makeQuadraticPoint(start, path.middle, end, 1 / 2);
                    path.angle = angle;
                    path.push(start);
                    for (var i = 1; i <= 5; i++) {
                        path.push(makeQuadraticPoint(start, path.middle, end, i / 5));//取样份与选取难度相关
                    }
                    path.push(end);
                }
            }
            return path
        };
        this.paintText = function (cx, path) {
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
    }
};