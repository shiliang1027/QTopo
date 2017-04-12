module.exports=function (jtopo) {
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

    function Link(b, c, g) {
        function h(start, end) {
            var link = jtopo.util.lineF(start.cx, start.cy, end.cx, end.cy);
            var bound = start.getBound();
            return jtopo.util.intersectionLineBound(link, bound);
        }

        this.initialize = function (b, c, d) {
            if (Link.prototype.initialize.apply(this, arguments), this.elementType = "link", this.zIndex = jtopo.zIndex_Link, 0 != arguments.length) {
                this.text = d;
                this.nodeA = b;
                this.nodeZ = c;
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
        }, this.caculateIndex = function () {
            var a = getNums(this.nodeA, this.nodeZ);
            a > 0 && (this.nodeIndex = a - 1)
        }, this.initialize(b, c, g), this.removeHandler = function () {
            var a = this;
            this.nodeA && this.nodeA.outLinks && (this.nodeA.outLinks = this.nodeA.outLinks.filter(function (b) {
                return b !== a
            })), this.nodeZ && this.nodeZ.inLinks && (this.nodeZ.inLinks = this.nodeZ.inLinks.filter(function (b) {
                return b !== a
            }));
            var b = getLinkNotThis(this);
            b.forEach(function (a, b) {
                a.nodeIndex = b
            })
        }, this.getStartPosition = function () {
            var a = {x: this.nodeA.cx, y: this.nodeA.cy};
            return a
        }, this.getEndPosition = function () {
            var a;
            return null != this.arrowsRadius && (a = h(this.nodeZ, this.nodeA)), null == a && (a = {x: this.nodeZ.cx, y: this.nodeZ.cy}), a
        }, this.getPath = function () {
            var a = [], b = this.getStartPosition(), c = this.getEndPosition();
            if (this.nodeA === this.nodeZ)return [b, c];
            var d = getNums(this.nodeA, this.nodeZ);
            if (1 == d)return [b, c];
            var f = Math.atan2(c.y - b.y, c.x - b.x), g = {x: b.x + this.bundleOffset * Math.cos(f), y: b.y + this.bundleOffset * Math.sin(f)}, h = {
                x: c.x + this.bundleOffset * Math.cos(f - Math.PI),
                y: c.y + this.bundleOffset * Math.sin(f - Math.PI)
            }, i = f - Math.PI / 2, j = f - Math.PI / 2, k = d * this.bundleGap / 2 - this.bundleGap / 2, l = this.bundleGap * this.nodeIndex, m = {
                x: g.x + l * Math.cos(i),
                y: g.y + l * Math.sin(i)
            }, n = {x: h.x + l * Math.cos(j), y: h.y + l * Math.sin(j)};
            return m = {x: m.x + k * Math.cos(i - Math.PI), y: m.y + k * Math.sin(i - Math.PI)}, n = {x: n.x + k * Math.cos(j - Math.PI), y: n.y + k * Math.sin(j - Math.PI)}, a.push({
                x: b.x,
                y: b.y
            }), a.push({x: m.x, y: m.y}), a.push({x: n.x, y: n.y}), a.push({x: c.x, y: c.y}), a
        }, this.paintPath = function (a, b) {
            if (this.nodeA === this.nodeZ)return void this.paintLoop(a);
            a.beginPath(), a.moveTo(b[0].x, b[0].y);
            for (var c = 1; c < b.length; c++)null == this.dashedPattern ? a.lineTo(b[c].x, b[c].y) : a.JTopoDashedLineTo(b[c - 1].x, b[c - 1].y, b[c].x, b[c].y, this.dashedPattern);
            if (a.stroke(), a.closePath(), null != this.arrowsRadius) {
                var d = b[b.length - 2], e = b[b.length - 1];
                this.paintArrow(a, d, e)
            }
        }, this.paintLoop = function (a) {
            a.beginPath();
            {
                var b = this.bundleGap * (this.nodeIndex + 1) / 2;
                Math.PI + Math.PI / 2
            }
            a.arc(this.nodeA.x, this.nodeA.y, b, Math.PI / 2, 2 * Math.PI), a.stroke(), a.closePath()
        }, this.paintArrow = function (b, c, d) {
            var e = this.arrowsOffset, f = this.arrowsRadius / 2, g = c, h = d, i = Math.atan2(h.y - g.y, h.x - g.x), j = jtopo.util.getDistance(g, h) - this.arrowsRadius, k = g.x + (j + e) * Math.cos(i), l = g.y + (j + e) * Math.sin(i), m = h.x + e * Math.cos(i), n = h.y + e * Math.sin(i);
            i -= Math.PI / 2;
            var o = {x: k + f * Math.cos(i), y: l + f * Math.sin(i)}, p = {x: k + f * Math.cos(i - Math.PI), y: l + f * Math.sin(i - Math.PI)};
            b.beginPath(), b.fillStyle = "rgba(" + this.strokeColor + "," + this.alpha + ")", b.moveTo(o.x, o.y), b.lineTo(m, n), b.lineTo(p.x, p.y), b.stroke(), b.closePath()
        }, this.paint = function (a) {
            if (null != this.nodeA && null != !this.nodeZ) {
                var b = this.getPath(this.nodeIndex);
                this.path = b, a.strokeStyle = "rgba(" + this.strokeColor + "," + this.alpha + ")", a.lineWidth = this.lineWidth, this.paintPath(a, b), b && b.length > 0 && this.paintText(a, b)
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
        }, this.paintSelected = function (a) {
            a.shadowBlur = 10, a.shadowColor = "rgba(0,0,0,1)", a.shadowOffsetX = 0, a.shadowOffsetY = 0
        }, this.isInBound = function (b, c) {
            if (this.nodeA === this.nodeZ) {
                var d = this.bundleGap * (this.nodeIndex + 1) / 2, e = jtopo.util.getDistance(this.nodeA, {x: b, y: c}) - d;
                return Math.abs(e) <= 3
            }
            for (var f = !1, g = 1; g < this.path.length; g++) {
                var h = this.path[g - 1], i = this.path[g];
                if (1 == jtopo.util.isPointInLine({x: b, y: c}, h, i)) {
                    f = !0;
                    break
                }
            }
            return f
        }
    }

    function FoldLink(a, b, c) {
        this.initialize = function () {
            FoldLink.prototype.initialize.apply(this, arguments), this.direction = "horizontal"
        }, this.initialize(a, b, c), this.getStartPosition = function () {
            var a = {x: this.nodeA.cx, y: this.nodeA.cy};
            return "horizontal" == this.direction ? this.nodeZ.cx > a.x ? a.x += this.nodeA.width / 2 : a.x -= this.nodeA.width / 2 : this.nodeZ.cy > a.y ? a.y += this.nodeA.height / 2 : a.y -= this.nodeA.height / 2, a
        }, this.getEndPosition = function () {
            var a = {x: this.nodeZ.cx, y: this.nodeZ.cy};
            return "horizontal" == this.direction ? this.nodeA.cy < a.y ? a.y -= this.nodeZ.height / 2 : a.y += this.nodeZ.height / 2 : a.x = this.nodeA.cx < a.x ? this.nodeZ.x : this.nodeZ.x + this.nodeZ.width, a
        }, this.getPath = function (a) {
            var b = [], c = this.getStartPosition(), d = this.getEndPosition();
            if (this.nodeA === this.nodeZ)return [c, d];
            var f, g, h = getNums(this.nodeA, this.nodeZ), i = (h - 1) * this.bundleGap, j = this.bundleGap * a - i / 2;
            return "horizontal" == this.direction ? (f = d.x + j, g = c.y - j, b.push({x: c.x, y: g}), b.push({x: f, y: g}), b.push({x: f, y: d.y})) : (f = c.x + j, g = d.y - j, b.push({
                x: f,
                y: c.y
            }), b.push({x: f, y: g}), b.push({x: d.x, y: g})), b
        }, this.paintText = function (a, b) {
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

    function CurveLink(a, b, c) {
        this.initialize = function () {
            CurveLink.prototype.initialize.apply(this, arguments)
        }, this.initialize(a, b, c), this.paintPath = function (a, b) {
            if (this.nodeA === this.nodeZ)return void this.paintLoop(a);
            a.beginPath(), a.moveTo(b[0].x, b[0].y);
            for (var c = 1; c < b.length; c++) {
                var d = b[c - 1], e = b[c], f = (d.x + e.x) / 2, g = (d.y + e.y) / 2;
                g += (e.y - d.y) / 2, a.strokeStyle = "rgba(" + this.strokeColor + "," + this.alpha + ")", a.lineWidth = this.lineWidth, a.moveTo(d.x, d.cy), a.quadraticCurveTo(f, g, e.x, e.y), a.stroke()
            }
            if (a.stroke(), a.closePath(), null != this.arrowsRadius) {
                var h = b[b.length - 2], i = b[b.length - 1];
                this.paintArrow(a, h, i)
            }
        }
    }

    Link.prototype = new jtopo.InteractiveElement;
    FoldLink.prototype = new Link;
    FlexionalLink.prototype = new Link;
    CurveLink.prototype = new Link;
    jtopo.Link = Link;
    jtopo.FoldLink = FoldLink;
    jtopo.FlexionalLink = FlexionalLink;
    jtopo.CurveLink = CurveLink;
}