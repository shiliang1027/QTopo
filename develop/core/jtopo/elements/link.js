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
    function getfixedRight(start,end) {
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

    function Link(start, end, text) {
        function getBorderPoint(start, end) {
            var lineFn = jtopo.util.lineF(start.cx, start.cy, end.cx, end.cy);
            var bound = start.getBound();
            return jtopo.util.intersectionLineBound(lineFn, bound);
        }

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
                this.bundleOffset = 20;
                this.bundleGap = 12;
                this.textOffsetX = 0;
                this.textOffsetY = 0;
                this.arrowsRadius = null;
                this.arrowsOffset = 0;
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
            return getBorderPoint(this.nodeA,this.nodeZ);
        };
        this.getEndPosition = function () {
            return getBorderPoint(this.nodeZ, this.nodeA);
        };
        this.getPath = function () {
            var self = this;
            var start = this.getStartPosition();
            var end = this.getEndPosition();
            if (this.nodeA === this.nodeZ)return [start, end];
            var NUMS = getNums(this.nodeA, this.nodeZ);
            if (1 == NUMS) {
                return [start, end];
            }
            return getPathWidthGap();

            function getPathWidthGap() {
                var path = [];
                var tanAngle = Math.atan2(end.y - start.y, end.x - start.x);
                var offsetStart = {
                    x: start.x + self.bundleOffset * Math.cos(tanAngle),
                    y: start.y + self.bundleOffset * Math.sin(tanAngle)
                };
                var offsetEnd = {
                    x: end.x + self.bundleOffset * Math.cos(tanAngle - Math.PI),
                    y: end.y + self.bundleOffset * Math.sin(tanAngle - Math.PI)
                };
                var i = tanAngle - Math.PI / 2;
                var j = tanAngle - Math.PI / 2;
                var gap = NUMS * self.bundleGap / 2 - self.bundleGap / 2;
                var beginGap = self.bundleGap * self.nodeIndex;
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
                return path;
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
            var radius = this.bundleGap * (this.nodeIndex + 1) / 2;
            a.arc(this.nodeA.x, this.nodeA.y, radius, Math.PI / 2, 2 * Math.PI);
            a.stroke();
            a.closePath();
        };
        this.paintArrow = function (context, startPoint, endPoint) {
            var offset = this.arrowsOffset;
            var raidus = this.arrowsRadius / 2;
            var atanAngle = Math.atan2(endPoint.y - startPoint.y, endPoint.x - startPoint.x);
            var length = jtopo.util.getDistance(startPoint, endPoint) - this.arrowsRadius;
            var k = startPoint.x + (length + offset) * Math.cos(atanAngle);
            var l = startPoint.y + (length + offset) * Math.sin(atanAngle);
            var m = endPoint.x + offset * Math.cos(atanAngle);
            var n = endPoint.y + offset * Math.sin(atanAngle);
            atanAngle -= Math.PI / 2;
            var o = {
                x: k + raidus * Math.cos(atanAngle),
                y: l + raidus * Math.sin(atanAngle)
            };
            var p = {
                x: k + raidus * Math.cos(atanAngle - Math.PI),
                y: l + raidus * Math.sin(atanAngle - Math.PI)
            };
            context.beginPath();
            context.fillStyle = "rgba(" + this.strokeColor + "," + this.alpha + ")";
            context.moveTo(o.x, o.y);
            context.lineTo(m, n);
            context.lineTo(p.x, p.y);
            context.stroke();
            context.closePath();
        };
        this.paint = function (context) {
            if (null != this.nodeA && null != !this.nodeZ) {
                var path = this.getPath(this.nodeIndex);
                this.path = path;
                context.strokeStyle = "rgba(" + this.strokeColor + "," + this.alpha + ")";
                context.lineWidth = this.lineWidth;
                this.paintPath(context, path);
                if (path && path.length > 0) {
                    this.paintText(context, path);
                }
            }
        };
        var i = -(Math.PI / 2 + Math.PI / 4);
        this.paintText = function (a, b) {
            var c = b[0], d = b[b.length - 1];
            if (4 == b.length && (c = b[1], d = b[2]), this.text && this.text.length > 0) {
                var e = (d.x + c.x) / 2 + this.textOffsetX, f = (d.y + c.y) / 2 + this.textOffsetY;
                a.save(), a.beginPath(), a.font = this.font;
                var g = a.measureText(this.text).width, h = a.measureText("田").width;
                if (a.fillStyle = "rgba(" + this.fontColor + ", " + this.alpha + ")", this.nodeA === this.nodeZ) {
                    var j = this.bundleGap * (this.nodeIndex + 1) / 2, e = this.nodeA.x + j * Math.cos(i), f = this.nodeA.y + j * Math.sin(i);
                    a.fillText(this.text, e, f)
                } else a.fillText(this.text, e - g / 2, f - h / 2);
                a.stroke(), a.closePath(), a.restore()
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
                var d = this.bundleGap * (this.nodeIndex + 1) / 2;
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
            if("horizontal" == this.direction){
                if(this.nodeZ.cx > position.x ){
                    position.x += this.nodeA.width / 2;
                }else{
                    position.x -= this.nodeA.width / 2;
                }
            }else{
                if(this.nodeZ.cy > position.y){
                    position.y += this.nodeA.height / 2;
                }else{
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
            var benginGap = (NUMS - 1) * this.bundleGap;
            var totalGap = this.bundleGap * Index - benginGap / 2;
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
        this.paintText = function (a, b) {
            if (this.text && this.text.length > 0) {
                var c = b[1], d = c.x + this.textOffsetX, e = c.y + this.textOffsetY;
                a.save(), a.beginPath(), a.font = this.font;
                var f = a.measureText(this.text).width, g = a.measureText("田").width;
                a.fillStyle = "rgba(" + this.fontColor + ", " + this.alpha + ")", a.fillText(this.text, d - f / 2, e - g / 2), a.stroke(), a.closePath(), a.restore()
            }
        }
    }

    function FlexionalLink(a, b, c) {
        this.initialize = function () {
            FlexionalLink.prototype.initialize.apply(this, arguments), this.direction = "vertical", this.offsetGap = 44
        }, this.initialize(a, b, c), this.getStartPosition = function () {
            var a = {x: this.nodeA.cx, y: this.nodeA.cy};
            return "horizontal" == this.direction ? a.x = this.nodeZ.cx < a.x ? this.nodeA.x : this.nodeA.x + this.nodeA.width : a.y = this.nodeZ.cy < a.y ? this.nodeA.y : this.nodeA.y + this.nodeA.height, a
        }, this.getEndPosition = function () {
            var a = {x: this.nodeZ.cx, y: this.nodeZ.cy};
            return "horizontal" == this.direction ? a.x = this.nodeA.cx < a.x ? this.nodeZ.x : this.nodeZ.x + this.nodeZ.width : a.y = this.nodeA.cy < a.y ? this.nodeZ.y : this.nodeZ.y + this.nodeZ.height, a
        }, this.getPath = function (a) {
            var b = this.getStartPosition(), c = this.getEndPosition();
            if (this.nodeA === this.nodeZ)return [b, c];
            var d = [], f = getNums(this.nodeA, this.nodeZ), g = (f - 1) * this.bundleGap, h = this.bundleGap * a - g / 2, i = this.offsetGap;
            return "horizontal" == this.direction ? (this.nodeA.cx > this.nodeZ.cx && (i = -i), d.push({x: b.x, y: b.y + h}), d.push({x: b.x + i, y: b.y + h}), d.push({
                x: c.x - i,
                y: c.y + h
            }), d.push({x: c.x, y: c.y + h})) : (this.nodeA.cy > this.nodeZ.cy && (i = -i), d.push({x: b.x + h, y: b.y}), d.push({x: b.x + h, y: b.y + i}), d.push({
                x: c.x + h,
                y: c.y - i
            }), d.push({x: c.x + h, y: c.y})), d
        }
    }




    //制造一个二次贝塞尔曲线的阶段点
    function curve_makePoint(s, m, e, t) {
        return {
            x: (1 - t) * (1 - t) * s.x + 2 * t * (1 - t) * m.x + t * t * e.x,
            y: (1 - t) * (1 - t) * s.y + 2 * t * (1 - t) * m.y + t * t * e.y
        }
    }
    //改写源码绘制曲线,可由curveOffset指定弧度
    function CurveLink(a, b, c) {
        this.initialize = function () {
            CurveLink.prototype.initialize.apply(this, arguments)
        };
        this.initialize(a, b, c);
        this.paintPath = function (cx, path) {
            if (this.nodeA === this.nodeZ)return void this.paintLoop(cx);
            var start = path[0];
            var end = path[path.length-1];
            var middle = path.middle;
            if (start && end && middle) {
                cx.beginPath();
                cx.moveTo(start.x, start.y);
                cx.strokeStyle = "rgba(" + this.strokeColor + "," + this.alpha + ")";
                cx.lineWidth = this.lineWidth;
                cx.moveTo(start.x, start.y);
                cx.quadraticCurveTo(middle.x, middle.y, end.x, end.y);
                cx.stroke();
                cx.closePath();
                if ( null != this.arrowsRadius) {
                    if (this.qtopo.attr.arrow.end) {
                        this.paintArrow(cx, start, end);
                    }
                    if (this.qtopo.attr.arrow.start) {
                        this.paintArrow(cx, end, start);
                    }
                }
            }
        };
        this.getPath=function () {
            var path = [];
            var start = this.getStartPosition();
            var end = this.getEndPosition();
            if (this.nodeA === this.nodeZ){
                return [start, end];
            }
            if (start && end) {
                var angle = Math.atan(Math.abs(end.y - start.y) / Math.abs(end.x - start.x));
                path.middle = {
                    x: (start.x + end.x) / 2 + this.qtopo.attr.curveOffset * Math.cos(angle - Math.PI / 2),
                    y: (start.y + end.y) / 2 + this.qtopo.attr.curveOffset * Math.sin(angle - Math.PI / 2)
                };
                path.text =  curve_makePoint(start,path.middle, end, 1/2);
                path.angle = angle;
                path.push(start);
                for (var i = 1; i <= 5; i++) {
                    path.push(curve_makePoint(start, path.middle, end, i / 5));//取样份与选取难度相关
                }
                path.push(end);
            }
            return path
        };
        this.paintText=function (cx, path) {
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