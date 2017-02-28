/**
 * Created by qiyc on 2017/2/27.
 */
var Scene = require('./Scene.js');
Scene.prototype.goCenter = function () {
    this.jtopo.stage.centerAndZoom();
};
Scene.prototype.resize = function (size) {
    if ($.isNumeric(size)) {
        this.jtopo.scaleX = size;
        this.jtopo.scaleY = size;
    }
};
Scene.prototype.toggleZoom = function () {
    if (!this.jtopo.stage.wheelZoom) {
        this.jtopo.stage.wheelZoom = 0.85; // 设置鼠标缩放比例
    } else {
        this.jtopo.stage.wheelZoom = null;
    }
};
/**
 * 切换鹰眼显示
 */
Scene.prototype.toggleEagleEye = function () {
    this.jtopo.stage.eagleEye.visible = !this.jtopo.stage.eagleEye.visible;
};
/**
 * 获取当前画布的png格式图片在新的窗口打开
 */
Scene.prototype.getPicture = function () {
    //stage.saveImageInfo();
    //在新页面打开图片
    var image = this.jtopo.stage.canvas.toDataURL("image/png");
    var w = window.open('about:blank', 'image from canvas');
    w.document.write("<img src='" + image + "' alt='from canvas'/>");
    //下载图片
    // here is the most important part because if you dont replace you will get a DOM 18 exception.
    // var image =  stage.canvas.toDataURL("image/png").replace("image/png", "image/octet-stream;Content-Disposition: attachment;filename=foobar.png");
    //var image = stage.canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    //window.location.href=image; // it will save locally
};
/**
 * 切换元素的层次
 * @param element 待控制元素
 * @param flag 可选。true为降低，不填或flase为提升
 */
Scene.prototype.toggleZIndex = function (element, flag) {
    if (element) {
        var jtopo = element.jtopo;
        var scene = this.jtopo;
        if (jtopo && scene) {
            var map = scene.zIndexMap[jtopo.zIndex];
            var index = map.indexOf(jtopo);
            if (!flag) {
                //提升层次
                map.push(map[index]);
                map.splice(index, 1);

            } else {
                //降低层次
                map.splice(0, 0, map[index]);
                map.splice(index + 1, 1);
            }
        }
    }
};
/**
 *获取被选中的元素
 * @returns {Array|*}
 */
Scene.prototype.getSelected = function () {
    return this.jtopo.selectedElements;
};
/**
 * 高亮目标隐藏其他,若传入数组，则只将数组内容全部高亮，若是节点则隐藏其相关对象
 * @param target 数组或type=QTopo.constant.NODE对象
 */
Scene.prototype.toggleLight = function (target) {
    try {
        var alpha = 1;
        var lighting = [];
        if (target) {
            alpha = 0.3;
            if ($.isArray(target)) {
                lighting = target;
            } else if (target.getType() == QTopo.constant.NODE && target.getUseType() != QTopo.constant.CASUAL) {
                var links = target.links;
                lighting.push(target);
                if (links) {
                    $.each(links.out, function (l, outlink) {
                        lighting.push(outlink);
                        lighting.push(outlink.path.end);
                    });
                    $.each(links.in, function (n, inlink) {
                        lighting.push(inlink);
                        lighting.push(inlink.path.start);
                    });
                }
            }
        }
        totalSetAlpha([this.children.node, this.children.link], alpha);
        totalSetAlpha([lighting], 1);
    } catch (e) {
        console.error("scene toggleLight error", e);
    }
    function totalSetAlpha(total, alpha) {
        //全部隐藏
        if (total.length > 0) {
            $.each(total, function (i, arr) {
                $.each(arr, function (j, element) {
                    element.set({
                        alpha: alpha
                    });
                });
            });
        }
    }
};
Scene.prototype.moveToNode = function (node) {
    var location = node.jtopo.getCenterLocation();
    // 查询到的节点居中显示
    if (this.children.node.indexOf(node) > -1) {
        this.resize(1);
        this.jtopo.setCenter(location.x, location.y);
        // 闪烁几下
        nodeFlash(node.jtopo, 5);
    }
    function nodeFlash(node,num){
        if($.isNumeric(num)){
            if (num == 0) {
                node.selected = false;
            }else{
                node.selected = !node.selected;
                setTimeout(function () {
                    nodeFlash(node, num - 1);
                }, 300);
            }
        }
    }
};
/**
 * 自动布局
 * @param config 参数
 */
Scene.prototype.autoLayout = function (config) {
    debugger;
    if (config && config.type) {
        var needSort = [];
        var jtopos = [];
        this.children.node.forEach(function (v) {
            if (!v.parent) {
                needSort.push(v);
                jtopos.push(v.jtopo);
            }
        });
        switch (config.type) {
            case "round":
                layout_round(this.jtopo, jtopos);
                break;
            case "default":
                layout_default(needSort, parseInt(config.rows), parseInt(config.rowSpace), parseInt(config.columnSpace), this.getOrigin());
                break;
        }
    }
};
function layout_round(scene, jtopos) {
    JTopo.layout.circleLayoutNodes(jtopos, {animate: {time: 1000}});
}
function layout_default(elements, rows, rowSpace, columnSpace, begin) {
    $.each(elements.sort(function (a, b) {
        return getDegree(b) - getDegree(a);
    }), function (i, v) {
        //v.setLocation(begin.x + (i % rows) * columnSpace, begin.y);
        move(v, begin.x + (i % rows) * columnSpace, begin.y);
        if ((i + 1) % rows == 0) {
            begin.y += rowSpace;
        }
    });
}
//-------工具函数
//获取节点的度
function getDegree(node) {
    return node.links.in.length + node.links.out.length;
}
//移动动画
function move(node, targetX, targetY) {
    targetX = parseInt(targetX);
    targetY = parseInt(targetY);
    var x = node.attr.position[0];
    var y = node.attr.position[1];
    var partX = parseInt((targetX - x)) / 10;
    var partY = parseInt((targetY - y)) / 10;
    var temp = setInterval(function () {
        if (Math.abs(targetX - x) > 1) {
            x += partX;
        }
        if (Math.abs(targetY - y) > 1) {
            y += partY;
        }
        node.setPosition([parseInt(x), parseInt(y)]);
        if (Math.abs(targetX - x) <= 1 && Math.abs(targetY - y) <= 1) {
            clearInterval(temp);
        }
    }, 100);
}
//--------
module.exports = Scene;