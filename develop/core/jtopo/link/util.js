var util={
    getLinkNotThis:getLinkNotThis,
    getNums:getNums,
    linkArrow:linkArrow,
    getBorderPoint:getBorderPoint,
    makeQuadraticPoint:makeQuadraticPoint,
    isOverlay:isOverlay
};
module.exports=util;
function getLinksBetween(start, end) {
    var d = getPublicLink(start, end);
    var e = getPublicLink(end, start);
    return d.concat(e);
}
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

function lineF(x1, y1, x2, y2) {
    var tan = (y2 - y1) / (x2 - x1);
    var g = y1 - x1 * tan;
    e.k = tan;
    e.b = g;
    e.x1 = x1;
    e.x2 = x2;
    e.y1 = y1;
    e.y2 = y2;
    return e;
    function e(a) {
        return a * tan + g
    }
}
function inRange(a, b, c) {
    var d = Math.abs(b - c), e = Math.abs(b - a), f = Math.abs(c - a), g = Math.abs(d - (e + f));
    return 1e-6 > g ? !0 : !1
}
function isPointInLineSeg(a, b, c) {
    return inRange(a, c.x1, c.x2) && inRange(b, c.y1, c.y2)
}
function intersection(lineFn, lineFnB) {
    var c, d;
    if (lineFn.k != lineFnB.k) {
        if(1 / 0 == lineFn.k || lineFn.k == -1 / 0){
            c = lineFn.x1;
            d = lineFnB(lineFn.x1);
        }else if(1 / 0 == lineFnB.k || lineFnB.k == -1 / 0){
            c = lineFnB.x1;
            d = lineFn(lineFnB.x1);
        }else{
            c = (lineFnB.b - lineFn.b) / (lineFn.k - lineFnB.k);
            d = lineFn(c)
        }
        if(0!= isPointInLineSeg(c, d, lineFn)&&0!= isPointInLineSeg(c, d, lineFnB)){
            return {
                x: c,
                y: d
            }
        }
    }
    return null;
}
function intersectionLineBound(lineFn, bound) {
    var newLineFn = lineF(bound.left, bound.top, bound.left, bound.bottom);
    var d = intersection(lineFn, newLineFn);
    if (null == d) {
        newLineFn = lineF(bound.left, bound.top, bound.right, bound.top);
        d = intersection(lineFn, newLineFn);
        if (null == d) {
            newLineFn = lineF(bound.right, bound.top, bound.right, bound.bottom);
            d = intersection(lineFn, newLineFn);
            if (null == d) {
                newLineFn = lineF(bound.left, bound.bottom, bound.right, bound.bottom);
                d = intersection(lineFn, newLineFn);
            }
        }
    }

    return d;
}







//--------------
function getLinkNotThis(link) {
    var b = getLinksBetween(link.nodeA, link.nodeZ);
    return b = b.filter(function (b) {
        return link !== b
    })
}
//--------------
function getNums(a, b) {
    return getLinksBetween(a, b).length
}
//--------------
function getBorderPoint(start, end) {
    var lineFn = lineF(start.cx, start.cy, end.cx, end.cy);
    var bound = start.getBound();
    return intersectionLineBound(lineFn, bound);
}
//---------------
function linkArrow(context, startPoint, endPoint, radius, offset, type) {
    var atanAngle = Math.atan2(endPoint.y - startPoint.y, endPoint.x - startPoint.x);
    var length = JTopo.util.getDistance(startPoint, endPoint) - radius;
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
//---------------
//制造一个二次贝塞尔曲线的阶段点
function makeQuadraticPoint(start, middle, end, time) {
    return {
        x: (1 - time) * (1 - time) * start.x + 2 * time * (1 - time) * middle.x + time * time * end.x,
        y: (1 - time) * (1 - time) * start.y + 2 * time * (1 - time) * middle.y + time * time * end.y
    }
}
//---------------
function isOverlay(nodeA,nodeZ){
    return ((nodeA.cx<nodeZ.x+nodeZ.width)&&(nodeA.cx>nodeZ.x))&&((nodeA.cy>nodeZ.y)&&(nodeA.cy)<nodeZ.y+nodeZ.height);
}
//---------------
