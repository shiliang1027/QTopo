var Link = require("./Link.js");
module.exports = {
    constructor: DirectLink,
    setDefault: setDefault,
    getDefault: getDefault
};
//-
var DEFAULT = {
    number: 1,
    alpha: 1,
    color: '22,124,255',
    arrow: {
        size: 10,
        offset: 0,
        start: false,
        end: false
    },
    serializeId:"",
    gap: 20,
    width: 3,
    dashed: null,
    zIndex: 100,
    font: {
        size: 16,
        type: "微软雅黑",
        color: '255,255,255'
    },
    expendAble: true,
    useType: QTopo.constant.link.DIRECT,
    bundleOffset: 60// 多条直线时，线条折线拐角处的长度
};
function setDefault(config) {
    QTopo.util.extend(DEFAULT, config || {});
}
function getDefault() {
    return QTopo.util.deepClone(DEFAULT);
}
//------
var jtopoReset={
    //双向箭头
    getStartPosition:function () {
        var a;
        return null != this.arrowsRadius && (a = (function (self) {
            var b = self.nodeA, c = self.nodeZ;
            var d = JTopo.util.lineF(b.cx, b.cy, c.cx, c.cy);
            var e = b.getBound();
            return f = JTopo.util.intersectionLineBound(d, e);
        })(this)), null == a && (a = {
            x: this.nodeA.cx,
            y: this.nodeA.cy
        }), a;
    },
    paintPath:function (a, b) {
        if (this.nodeA === this.nodeZ) return void this.paintLoop(a);
        a.beginPath(),
            a.moveTo(b[0].x, b[0].y);
        for (var c = 1; c < b.length; c++) {
            null == this.dashedPattern ? (
                (null == this.PointPathColor ? a.lineTo(b[c].x, b[c].y) : a.JtopoDrawPointPath(b[c - 1].x, b[c - 1].y, b[c].x, b[c].y, a.strokeStyle, this.PointPathColor))
            ) : a.JTopoDashedLineTo(b[c - 1].x, b[c - 1].y, b[c].x, b[c].y, this.dashedPattern)
        }
        if (a.stroke(), a.closePath(), null != this.arrowsRadius) {
            if (this.qtopo.attr.arrow.end) {
                this.paintArrow(a, b[0], b[b.length - 1]);
            }//终点箭头
            if (this.qtopo.attr.arrow.start) {
                this.paintArrow(a, b[b.length - 1], b[0]);
            }//起点箭头
        }
    }
};
//------
//-
function DirectLink(config) {
    if (!config.start || !config.end || !config.start.jtopo || !config.end.jtopo) {
        QTopo.util.error("Create Link need start and end");
        return;
    }
    this.attr = QTopo.util.extend(getDefault(), config || {});
    Link.call(this, new JTopo.Link(config.start.jtopo, config.end.jtopo));
    //函数
    this.set = setJTopo;
    //初始化
    this.set(this.attr);
    //源码修改
    reset(this);
}
QTopo.util.inherits(DirectLink, Link);
function setJTopo(config) {
    if (config) {
        var self = this;
        self._setAttr(config);
    }
}
function reset(link) {
    link.jtopo.getStartPosition = jtopoReset.getStartPosition;
    link.jtopo.paintPath = jtopoReset.paintPath;
}
DirectLink.prototype.setBundleOffset = function (bundleOffset) {
    if ($.isNumeric(bundleOffset)) {
        this.jtopo.bundleOffset = parseInt(bundleOffset);
    }
    this.attr.bundleOffset = this.jtopo.bundleOffset;
};
DirectLink.prototype.getDefault = getDefault;
DirectLink.prototype.openToggle = function (scene) {
    this.attr.expendAble = true;
    var jtopo = scene.jtopo;
    /**
     * 直线切换
     * @param flag 为true则展开为false则缩放，无值则根据现状切换,
     */
    this.toggle = function (flag) {
        var todo = !(this.getUseType() == QTopo.constant.CASUAL && this.parent);
        if (typeof flag == "boolean" && (flag ^ todo)) {
            return;
        }
        if (todo) {
            //展开
            //复制属性
            if (this.attr.number > 1 && this.attr.expendAble) {
                var childSet = QTopo.util.deepClone(this.attr);
                childSet.start = this.path.start;
                childSet.end = this.path.end;
                childSet.useType = QTopo.constant.CASUAL;
                childSet.number = 1;
                var parent = {
                    attr: this.attr,
                    extra: this.extra,
                    path: this.path,
                    addChild: function (num) {
                        if ($.isNumeric(num)) {
                            num = parseInt(num);
                            for (var i = 0; i < num; i++) {
                                var link = scene.createLink(childSet);
                                parent.children.push(link);
                                link.parent = parent;
                                link.extra = parent.extra;
                            }
                        }
                    },
                    children: []
                };
                scene.remove(this);
                parent.addChild(parent.attr.number);
            }
        } else {
            //聚合
            var father = this.parent;
            scene.remove(father.children);
            var config = father.attr;
            config.start = father.path.start;
            config.end = father.path.end;
            scene.createLink(config).extra = father.extra;
        }
    };
};