module.exports = function (jtopo) {
    function getNodesCenter(a) {
        var b = 0, c = 0;
        a.forEach(function (a) {
            b += a.cx, c += a.cy
        });
        var d = {x: b / a.length, y: c / a.length};
        return d
    }

    function circleLayoutNodes(nodeArray, animateConfig) {
        null == animateConfig && (animateConfig = {});
        var e = animateConfig.cx,
            f = animateConfig.cy,
            g = animateConfig.minRadius,
            h = animateConfig.nodeDiameter,
            i = animateConfig.hScale || 1,
            j = animateConfig.vScale || 1;
        if (null == e || null == f) {
            var k = getNodesCenter(nodeArray);
            e = k.x, f = k.y
        }
        var l = 0, m = [], n = [];
        nodeArray.forEach(function (node) {
            null == animateConfig.nodeDiameter ? (node.diameter && (h = node.diameter),
                h = node.radius ? 2 * node.radius : Math.sqrt(2 * node.width * node.height),
                n.push(h)) : n.push(h), l += h
        }), nodeArray.forEach(function (a, b) {
            var c = n[b] / l;
            m.push(Math.PI * c)
        });
        var o = (nodeArray.length, m[0] + m[1]), p = n[0] / 2 + n[1] / 2, q = p / 2 / Math.sin(o / 2);
        null != g && g > q && (q = g);
        var r = q * i, s = q * j, t = animateConfig.animate;
        if (t) {
            var time = t.time || 1e3, v = 0;
            nodeArray.forEach(function (node, c) {
                v += 0 == c ? m[c] : m[c - 1] + m[c];
                var d = e + Math.cos(v) * r, g = f + Math.sin(v) * s;
                jtopo.Animate.stepByStep(node,
                    {
                        x: d - node.width / 2,
                        y: g - node.height / 2
                    }, time
                ).start();
            })
        } else {
            var v = 0;
            nodeArray.forEach(function (a, b) {
                v += 0 == b ? m[b] : m[b - 1] + m[b];
                var c = e + Math.cos(v) * r, d = f + Math.sin(v) * s;
                a.cx = c, a.cy = d
            })
        }
        return {cx: e, cy: f, radius: r, radiusA: r, radiusB: s}
    }

    function GridLayout(row, column) {
        return function (container) {
            var childs = container.childs;
            if (!(childs.length <= 0)) {
                var cBound = container.getBound();
                var childNode = childs[0];
                var columSpace = (cBound.width - childNode.width) / column;
                var rowSpace = (cBound.height - childNode.height) / row;
                for (var childIndex = 0, rowsIndex = 0; row > rowsIndex; rowsIndex++) {
                    for (var columnIndex = 0; column > columnIndex; columnIndex++) {
                        var node = childs[childIndex++];
                        var x = cBound.left + columSpace / 2 + columnIndex * columSpace;
                        var y = cBound.top + rowSpace / 2 + rowsIndex * rowSpace;
                        node.setLocation(x, y);
                        if (childIndex >= childs.length) {
                            return
                        }
                    }
                }

            }
        }
    }

    function FlowLayout(row, column) {
        if (null == column) {
            column = 0;
        }
        if (null == row) {
            row = 0;
        }
        return function (container) {
            var childs = container.childs;
            if (!(childs.length <= 0)) {
                var bound = container.getBound();
                var left = bound.left;
                var top = bound.top;
                for (var i = 0; i < childs.length; i++) {
                    var child = childs[i];
                    if (left + child.width >= bound.right) {
                        left = bound.left;
                        top += row + child.height;
                    }
                    child.setLocation(left, top);
                    left += column + child.width;
                }
            }
        }
    }

    function AutoBoundLayout() {
        return function (container, children) {
            if (children.length > 0) {
                var left = 1e7,
                    right = -1e7,
                    top = 1e7,
                    bottom = -1e7,
                    width = right - left,
                    height = bottom - top;
                for (var i = 0; i < children.length; i++) {
                    var child = children[i];
                    child.x <= left && (left = child.x);
                    (child.x + child.width) >= right && (right = child.x + child.width);
                    child.y <= top && (top = child.y);
                    (child.y + child.height) >= bottom && (bottom = child.y + child.height);
                    width = right - left;
                    height = bottom - top;
                }
                container.x = left;
                container.y = top;
                container.width = width;
                container.height = height;
            } else {
                container.width = 100;
                container.height = 100;
            }
            if (container.qtopo) {
                container.qtopo.attr.size[0] = container.width;
                container.qtopo.attr.size[1] = container.height;
            }
        }
    }

    /**
     * 找到可以作为根的节点
     * */
    function getRootNodes(elements) {
        return elements.filter(function (element) {
            return (element instanceof jtopo.Node) &&
                (!element.inLinks || element.inLinks.length == 0) &&
                (element.outLinks && element.outLinks.length > 0);
        });
    }

    function getGap(arr) {
        var totalWidth = 0, totalHeight = 0;
        arr.forEach(function (a) {
            totalWidth += a.width;
            totalHeight += a.height;
        });
        return {
            width: totalWidth / arr.length,
            height: totalHeight / arr.length
        }
    }

    function i(a, b, c, d) {
        b.x += c, b.y += d;
        for (var e = getRootChilds(a, b), f = 0; f < e.length; f++)i(a, e[f], c, d)
    }

    function j(a, b) {
        function c(b, e) {
            var f = getRootChilds(a, b);
            null == d[e] && (d[e] = {}, d[e].nodes = [], d[e].childs = []), d[e].nodes.push(b), d[e].childs.push(f);
            for (var g = 0; g < f.length; g++)c(f[g], e + 1), f[g].parent = b
        }

        var d = [];
        return c(b, 0), d
    }

    function TreeLayout(direction, gap, top) {
        return function (scene) {
            function f(childs, root) {
                var h = jtopo.layout.getTreeDeep(childs, root);
                var k = j(childs, root);
                var l = k["" + h].nodes;
                for (var m = 0; m < l.length; m++) {
                    var n = l[m], o = (m + 1) * (gap + 10), p = h * top;
                    "down" == direction || ("up" == direction ? p = -p : "left" == direction ? (o = -h * top, p = (m + 1) * (gap + 10)) : "right" == direction && (o = h * top, p = (m + 1) * (gap + 10))), n.setLocation(o, p)
                }
                for (var q = h - 1; q >= 0; q--)for (var r = k["" + q].nodes, s = k["" + q].childs, m = 0; m < r.length; m++) {
                    var t = r[m], u = s[m];
                    if ("down" == direction ? t.y = q * top : "up" == direction ? t.y = -q * top : "left" == direction ? t.x = -q * top : "right" == direction && (t.x = q * top), u.length > 0 ? "down" == direction || "up" == direction ? t.x = (u[0].x + u[u.length - 1].x) / 2 : ("left" == direction || "right" == direction) && (t.y = (u[0].y + u[u.length - 1].y) / 2) : m > 0 && ("down" == direction || "up" == direction ? t.x = r[m - 1].x + r[m - 1].width + gap : ("left" == direction || "right" == direction) && (t.y = r[m - 1].y + r[m - 1].height + gap)), m > 0)if ("down" == direction || "up" == direction) {
                        if (t.x < r[m - 1].x + r[m - 1].width)for (var v = r[m - 1].x + r[m - 1].width + gap, w = Math.abs(v - t.x), x = m; x < r.length; x++)i(scene.childs, r[x], w, 0)
                    } else if (("left" == direction || "right" == direction) && t.y < r[m - 1].y + r[m - 1].height)for (var y = r[m - 1].y + r[m - 1].height + gap, z = Math.abs(y - t.y), x = m; x < r.length; x++)i(scene.childs, r[x], 0, z)
                }
            }

            var realGap = null;
            if (null == gap) {
                realGap = getGap(scene.childs);
                gap = realGap.width;
                if ("left" == direction || "right" == direction) {
                    gap = realGap.width + 10;
                }
            }
            if (null == top) {
                if (null == realGap) {
                    realGap = getGap(scene.childs)
                }
                top = 2 * realGap.height;
            }
            direction = direction || "down";
            var roots = jtopo.layout.getRootNodes(scene.childs);
            if (roots.length > 0) {
                f(scene.childs, roots[0]);
                var bound = jtopo.util.getElementsBound(scene.childs);
                var center = scene.getCenterLocation();
                var startX = center.x - (bound.left + bound.right) / 2,
                    startY = center.y - (bound.top + bound.bottom) / 2;
                scene.childs.forEach(function (element) {
                    if (element instanceof jtopo.Node) {
                        element.x += startX;
                        element.y += startY;
                    }
                })
            }
        }
    }

    //必须得是有向无环图才可以布局
    function CircleLayout(radius) {
        return function (scene) {
            function locationSet(allChilds, root, ra) {
                var rootsArr = getRootChilds(allChilds, root);
                if (0 != rootsArr.length) {
                    if (null == ra) {
                        ra = radius;
                    }
                    var step = 2 * Math.PI / rootsArr.length;
                    rootsArr.forEach(function (child, i) {
                        child.setLocation(
                            root.x + ra * Math.cos(step * i),
                            root.y + ra * Math.sin(step * i)
                        );
                        locationSet(allChilds, child, ra / 2);
                    })
                }
            }

            var roots = jtopo.layout.getRootNodes(scene.childs);
            if (roots.length > 0) {
                locationSet(scene.childs, roots[0]);
                var bound = jtopo.util.getElementsBound(scene.childs);
                var center = scene.getCenterLocation();
                var left = center.x - (bound.left + bound.right) / 2;
                var top = center.y - (bound.top + bound.bottom) / 2;
                scene.childs.forEach(function (b) {
                    if (b instanceof jtopo.Node) {
                        b.x += left;
                        b.y += top;
                    }
                })
            }
        }
    }

    function m(a, b, c, d, e, f) {
        for (var g = [], h = 0; c > h; h++)for (var i = 0; d > i; i++)g.push({x: a + i * e, y: b + h * f});
        return g
    }

    function circlePosition(centerX, centerY, total, raidus, beginAngle, endAngle) {
        var begin = beginAngle ? beginAngle : 0;
        var end = endAngle ? endAngle : 2 * Math.PI;
        var totalAngle = end - begin;
        var step = totalAngle / total;
        var position = [];
        begin += step / 2;
        for (var i = begin; end >= i; i += step) {
            position.push({
                x: centerX + Math.cos(i) * raidus,
                y: centerY + Math.sin(i) * raidus
            });
        }
        return position
    }

    function treePostion(a, b, c, d, e, f) {
        var g = f || "bottom", h = [];
        if ("bottom" == g)for (var i = a - c / 2 * d + d / 2, j = 0; c >= j; j++)h.push({
            x: i + j * d,
            y: b + e
        }); else if ("top" == g)for (var i = a - c / 2 * d + d / 2, j = 0; c >= j; j++)h.push({
            x: i + j * d,
            y: b - e
        }); else if ("right" == g)for (var i = b - c / 2 * d + d / 2, j = 0; c >= j; j++)h.push({
            x: a + e,
            y: i + j * d
        }); else if ("left" == g)for (var i = b - c / 2 * d + d / 2, j = 0; c >= j; j++)h.push({x: a - e, y: i + j * d});
        return h
    }

    function gridPosition(a, b, c, d, e, f) {
        for (var g = [], h = 0; c > h; h++)for (var i = 0; d > i; i++)g.push({x: a + i * e, y: b + h * f});
        return g
    }

    function adjustPosition(root, rootChilds) {
        if (root.layout) {
            var layout = root.layout;
            var locationArr = null;
            switch (layout.type) {
                case 'circle':
                    var radius = layout.radius || Math.max(root.width, root.height);
                    locationArr = circlePosition(
                        root.cx,
                        root.cy,
                        rootChilds.length,
                        radius,
                        root.layout.beginAngle,
                        root.layout.endAngle
                    );
                    break;
                case 'tree':
                    locationArr = treePostion(
                        root.cx,
                        root.cy,
                        rootChilds.length,
                        layout.width || 50,
                        layout.height || 50,
                        layout.direction
                    );
                    break;
                case 'grid':
                    locationArr = gridPosition(
                        root.x,
                        root.y,
                        layout.rows,
                        layout.cols,
                        layout.horizontal || 0,
                        layout.vertical || 0
                    );
                    break;
            }
            for (var i = 0; i < rootChilds.length; i++) {
                rootChilds[i].setCenterLocation(locationArr[i].x, locationArr[i].y);
            }
        }
    }

    function getRootChilds(allChilds, rootNode) {
        var rootChilds;
        if (rootNode.outLinks instanceof Array && rootNode.outLinks.length > 0) {
            rootChilds = rootNode.outLinks.map(function (link) {
                return link.nodeZ;
            });
        }
        return rootChilds || [];
    }

    function layoutNode(scene, root, recursion) {
        var rootChilds = getRootChilds(scene.childs, root);
        if (0 != rootChilds.length) {
            adjustPosition(root, rootChilds);
            if (1 == recursion) {
                for (var e = 0; e < rootChilds.length; e++) {
                    layoutNode(scene, rootChilds[e], recursion);
                }
            }
        }
        return null
    }

    function springLayout(root, scene) {
        var keyA = 0.01;//移动幅度
        var keyB = 0.95;
        var temp = -5;
        var stepX = 0;
        var stepY = 0;
        var times = 0;
        var nodes = scene.getElementsByClass(jtopo.Node);
        annimate();

        function change(root, node) {
            var disX = root.x - node.x;
            var disY = root.y - node.y;
            stepX += disX * keyA;
            stepY += disY * keyA;
            stepX *= keyB;
            stepY *= keyB;
            stepY += temp;
            node.x += stepX;
            node.y += stepY;
        }

        function annimate() {
            ++times;
            if (times < 150) {
                for (var i = 0; i < nodes.length; i++) {
                    if (nodes[i] != root) {
                        change(root, nodes[i]);
                    }
                }
                setTimeout(annimate, 1e3 / 24)
            }
        }
    }

    function getTreeDeep(childs, root) {
        function reDeep(childs, root, deep) {
            var rootChilds = getRootChilds(childs, root);
            if (deep > d) {
                d = deep;
            }
            for (var g = 0; g < rootChilds.length; g++) {
                reDeep(childs, rootChilds[g], deep + 1);
            }
        }

        var d = 0;
        reDeep(childs, root, 0);
        return d;
    }

    jtopo.layout = jtopo.Layout = {
        layoutNode: layoutNode,
        getNodeChilds: getRootChilds,
        adjustPosition: adjustPosition,
        springLayout: springLayout,
        getTreeDeep: getTreeDeep,
        getRootNodes: getRootNodes,
        GridLayout: GridLayout,
        FlowLayout: FlowLayout,
        AutoBoundLayout: AutoBoundLayout,
        CircleLayout: CircleLayout,
        TreeLayout: TreeLayout,
        getNodesCenter: getNodesCenter,
        circleLayoutNodes: circleLayoutNodes
    }
}