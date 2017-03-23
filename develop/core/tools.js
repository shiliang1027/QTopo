/**
 * Created by qiyc on 2017/2/27.
 */
var Scene = require('./Scene.js');
Scene.prototype.goCenter = function () {
    if (this.jtopo.childs && this.jtopo.childs.length > 0) {
        this.jtopo.stage.centerAndZoom();
    }
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
 * @param flag 可选。true为降低false为提升，未有值则默认提升，若以提升到最高则降至最低
 */
Scene.prototype.toggleZIndex = function (element, flag) {
    if (element) {
        var jtopo = element.jtopo;
        var scene = this.jtopo;
        if (jtopo && scene) {
            var map = scene.zIndexMap[jtopo.zIndex];
            var index = map.indexOf(jtopo);
            var todo=true;
            if(typeof flag=='boolean'){
                todo=flag;
            }else{
                if(index==map.length-1){
                    todo=false;
                }
            }
            if (todo) {
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
var selectedCatch = {
    jtopo: [],
    qtopo: []
};
Scene.prototype.getSelected = function () {
    var jtopo = this.jtopo.selectedElements;
    if ($.isArray(jtopo)) {
        if (selectedCatch.jtopo != jtopo) {
            selectedCatch.jtopo = jtopo;
            selectedCatch.qtopo = [];
            jtopo.forEach(function (el) {
                if (el.qtopo && el.qtopo.getUseType() != QTopo.constant.CASUAL) {
                    selectedCatch.qtopo.push(el.qtopo);
                }
            });
        }
        return selectedCatch.qtopo;
    } else {
        return [];
    }
};
/**
 * 高亮目标隐藏其他
 * @param target 可选参数,数组或对象,高亮其相关对象,无参则全部高亮
 * @param flag 可选参数，若为true则只高亮传入的对象,不选则只对传入对象相关的对象高亮
 */
Scene.prototype.toggleLight = function (target, flag) {
    try {
        var alpha = 1;
        var lighting;
        if (target) {
            alpha = 0.1;
            if (flag) {
                if ($.isArray(target)) {
                    lighting = target;
                } else {
                    lighting = [target];
                }
            } else {
                if ($.isArray(target)) {
                    lighting = getConnectionLightings(target);
                } else {
                    lighting = getConnectionLightings([target]);
                }
            }
        }
        totalSetAlpha(this.children.node.concat(this.children.link), alpha);
        totalSetAlpha(lighting, 1);
    } catch (e) {
        QTopo.util.error("scene toggleLight error", e);
    }
    function getConnectionLightings(arr) {
        var lighting = [];
        $.each(arr, function (i, target) {
            if (target.getType() == QTopo.constant.NODE && target.getUseType() != QTopo.constant.CASUAL) {
                var links = target.links;
                QTopo.util.arrayPush(lighting, target);
                if (links) {
                    if ($.isArray(links.out)) {
                        $.each(links.out, function (l, outlink) {
                            QTopo.util.arrayPush(lighting, outlink);
                            QTopo.util.arrayPush(lighting, outlink.path.end);
                        });
                    }
                    if ($.isArray(links.in)) {
                        $.each(links.in, function (n, inlink) {
                            QTopo.util.arrayPush(lighting, inlink);
                            QTopo.util.arrayPush(lighting, inlink.path.start);
                        });
                    }
                }
            }
        });
        return lighting;
    }

    function totalSetAlpha(total, alpha) {
        //全部隐藏
        if ($.isArray(total)) {
            $.each(total, function (i, element) {
                element.set({
                    alpha: alpha
                });
            });
        }
    }
};
Scene.prototype.moveToNode = function (node) {
    // 查询到的节点居中显示
    if (this.children.node.indexOf(node) > -1) {
        var location = node.jtopo.getCenterLocation();
        this.resize(1);
        this.jtopo.setCenter(location.x, location.y);
        // 闪烁几下
        nodeFlash(node.jtopo, 5);
    }
    function nodeFlash(node, num) {
        if ($.isNumeric(num)) {
            if (num == 0) {
                node.selected = false;
            } else {
                node.selected = !node.selected;
                setTimeout(function () {
                    nodeFlash(node, num - 1);
                }, 300);
            }
        }
    }
};
//---------自动布局
/**
 * 自动布局
 * @param config 参数
 */
Scene.prototype.autoLayout = function (config) {
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
    if ($.isNumeric(rows)) {
        rows = parseInt(rows);
        if (rows < 1) {
            rows = 1;
        }
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
}
//-------工具函数
//获取节点的度
function getDegree(node) {
    var inLinks = node.links.in;
    var outLinks = node.links.out;
    var degree = 0;
    if (inLinks.length == 1) {
        degree += inLinks[0].attr.number;
    } else {
        degree += inLinks.length;
    }
    if (outLinks.length == 1) {
        degree += outLinks[0].attr.number;
    } else {
        degree += outLinks.length;
    }
    return degree;
}
//移动动画
function move(node, targetX, targetY) {
    targetX = parseInt(targetX);
    targetY = parseInt(targetY);
    var x = node.attr.position[0];
    var y = node.attr.position[1];
    var partX = parseInt((targetX - x)) / 10;
    var partY = parseInt((targetY - y)) / 10;
    var part = 0;
    var temp = setInterval(function () {
        if (Math.abs(targetX - x) > 1) {
            x += partX;
        }
        if (Math.abs(targetY - y) > 1) {
            y += partY;
        }
        node.setPosition([parseInt(x), parseInt(y)]);
        part++;
        if (Math.abs(targetX - x) <= 1 && Math.abs(targetY - y) <= 1) {
            clearInterval(temp);
        } else if (part >= 10) {
            clearInterval(temp);
        }
    }, 100);
}
//---------自动布局
module.exports = Scene;