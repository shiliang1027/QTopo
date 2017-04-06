//-
var Node = {
    Image: require("./element/node/Image.js"),
    Text: require("./element/node/Text.js")
};
var Link = {
    Curve: require("./element/link/Curve.js"),
    Direct: require("./element/link/Direct.js"),
    Flexional: require("./element/link/Flexional.js"),
    Fold: require("./element/link/Fold.js")
};

var Line = {
    Direct: require("./element/line/Direct.js")
};
var Container = {
    Group: require("./element/container/Group.js")
};
var events = require("./events.js");
module.exports = Scene;
//-
//画布对象
var defaults = function () {
    return {
        mode: QTopo.constant.mode.NORMAL,
        backgroundImage: ""
    };
};
function Scene(stage, config) {
    var self = this;
    self.jtopo = new JTopo.Scene();
    self.jtopo.qtopo = self;
    self.children = {
        node: [],
        link: [],
        container: [],
        line: []
    };
    self.attr = defaults();
    self.extra=config.extra||{};
    stage.add(self.jtopo);
    events.init(self);
    //延时执行
    setTimeout(function () {
        if (config) {
            if (config.backgroundImage) {
                self.setBackgroundImage(config.backgroundImage);
            }
            if (config.backgroundColor) {
                self.setBackgroundColor(config.backgroundColor);
            }
            if (config.mode) {
                self.setMode(config.mode);
            }
        }
    });
}
//-
Scene.prototype.get=function(key){
    return this.attr[key];
};
Scene.prototype.val=function(key,value){
    if(QTopo.util.getClass(key)=='Object') {
        var self=this;
        $.each(key, function (name, value) {
            self.extra[name] = value;
        })
    }else{
        if(!value){
            var result;
            if(this.extra[key]){
                result=this.extra[key];
            }else if(this.attr[key]){
                result=this.attr[key];
            }else{
                result=this[key];
            }
            return result;
        }else{
            this.extra[key]=value;
        }
    }
};
Scene.prototype.setDefault = function (type, config) {
    if (config) {
        var constant = QTopo.constant;
        switch (type) {
            case constant.node.IMAGE:
                Node.Image.setDefault(config);
                break;
            case constant.node.TEXT:
                Node.Text.setDefault(config);
                break;
            case constant.link.DIRECT:
                Link.Direct.setDefault(config);
                break;
            case constant.link.CURVE:
                Link.Curve.setDefault(config);
                break;
            case constant.link.FLEXIONAL:
                Link.Flexional.setDefault(config);
                break;
            case constant.link.FOLD:
                Link.Fold.setDefault(config);
                break;
            case constant.line.DIRECT:
                Line.Direct.setDefault(config);
                break;
            case constant.container.GROUP:
                Container.Group.setDefault(config);
                break;
        }
    }
};
Scene.prototype.getDefault = function (type) {
    if (type) {
        var result;
        var constant = QTopo.constant;
        switch (type) {
            case constant.node.IMAGE:
                result = Node.Image.getDefault();
                break;
            case constant.node.TEXT:
                result = Node.Text.getDefault();
                break;
            case constant.link.DIRECT:
                result = Link.Direct.getDefault();
                break;
            case constant.link.CURVE:
                result = Link.Curve.getDefault();
                break;
            case constant.link.FLEXIONAL:
                result = Link.Flexional.getDefault();
                break;
            case constant.link.FOLD:
                result = Link.Fold.getDefault();
                break;
            case constant.line.DIRECT:
                result = Line.Direct.getDefault();
                break;
            case constant.container.GROUP:
                result = Container.Group.getDefault();
                break;
        }
        return result;
    }
};
Scene.prototype.setBackgroundImage = function (image) {
    this.jtopo.background = image;
    this.attr.background = image;
};
Scene.prototype.setBackgroundColor = function (color) {
    this.jtopo.backgroundColor = QTopo.util.transHex(color);
    this.jtopo.alpha = 1;
    this.attr.background = QTopo.util.transHex(color);
};
Scene.prototype.setMode = function (mode) {
    if (["normal", "edit", "drag", "select"].indexOf(mode) > -1) {
        this.attr.mode = mode;
        this.jtopo.mode = mode;
    } else {
        QTopo.util.error("set wrong mode :", mode);
    }
};
Scene.prototype.clear = function () {
    QTopo.util.info("scene clear");
    this.children = {
        node: [],
        link: [],
        container: [],
        line: []
    };
    this.jtopo.clear();
};
Scene.prototype.getType = function () {
    return QTopo.constant.SCENE;
};
Scene.prototype.getUseType = function () {
    return QTopo.constant.SCENE;
};
Scene.prototype.on = function (name, fn) {
    this.jtopo.addEventListener(name,fn);
};
Scene.prototype.off = function (name, fn) {
    this.jtopo.removeEventListener(name,fn);
};
Scene.prototype.find = function (scan, type) {
    var children = this.children;
    var result = [];
    var condition = typeof scan == "string" ? scan.split(",") : [];
    if (condition.length > 0) {
        $.each(condition, function (i, term) {
            term = term.split("=");
            //制定了类型，缩小查找范围，未指定则全部遍历
            if (type) {
                switch (type) {
                    case "node":
                        scanArr(children.node, term[0], term[1]);
                        break;
                    case "link":
                        scanArr(children.link, term[0], term[1]);
                        break;
                    case "container":
                        scanArr(children.container, term[0], term[1]);
                        break;
                    case "line":
                        scanArr(children.line, term[0], term[1]);
                        break;
                }
            } else {
                $.each(children, function (j, arr) {
                    scanArr(arr, term[0], term[1]);
                });
            }
        });
    }
    return result;
    //扫描数组中对象对应的属性是否相等
    function scanArr(arr, key, value) {
        $.each(arr, function (i, item) {
            //只扫描对象的attr和extra中的属性
            if (equal(item.extra, key, value) || equal(item.attr, key, value)) {
                //排除重复的
                if (result.indexOf(item) < 0) {
                    result.push(item);
                }
            }
        });
        return result;
    }

    function equal(object, key, value) {
        return object && object[key] && object[key] == value;
    }
};
Scene.prototype.getOrigin = function () {
    return {
        x: 0 - this.jtopo.translateX,
        y: 0 - this.jtopo.translateY
    }
};
//-
function addJTopo(element) {
    try {
        this.jtopo.add(element.jtopo);
    } catch (e) {
        QTopo.util.error("In Scene, jtopo add error : ", e);
    }
}
function removeJTopo(element) {
    try {
        this.jtopo.remove(element.jtopo);
    } catch (e) {
        QTopo.util.error("In Scene, jtopo remove error : ", e);
    }
}
Scene.prototype.createNode = function (config) {
    var newNode;
    var constant = QTopo.constant.node;
    config = config || {};
    switch (config.type) {
        case constant.TEXT:
            newNode = new Node.Text.constructor(config);
            break;
        default:
            newNode = new Node.Image.constructor(config);
    }
    if (newNode && newNode.jtopo) {
        addJTopo.call(this, newNode);
        this.children.node.push(newNode);
        return newNode;
    } else {
        QTopo.util.error("create Node error", config);
        return false;
    }
};
/**
 * 根据配置在两个元素之间创建新的链接
 * @param config
 * @returns {*}
 */
Scene.prototype.createLink = function (config) {
    var newLink;
    var constant = QTopo.constant.link;
    config = config || {};
    switch (config.type) {
        case constant.CURVE:
            newLink = new Link.Curve.constructor(config);
            break;
        case constant.FLEXIONAL:
            newLink = new Link.Flexional.constructor(config);
            break;
        case constant.FOLD:
            newLink = new Link.Fold.constructor(config);
            break;
        default:
            newLink = new Link.Direct.constructor(config);
    }
    if (newLink && newLink.jtopo) {
        addJTopo.call(this, newLink);
        this.children.link.push(newLink);
        return newLink;
    } else {
        QTopo.util.error("create Link error", config);
        return false;
    }
};
//--
/**
 * 根据配置在两个元素之间创建链接,若两元素已有链接则原链接计数上加1,提供线路展开
 * @param config
 * @param fn 可选参数，若无则自动创建链接,若有则执行fn的动作
 */
Scene.prototype.addLink = function (config,fn) {
    if (config && config.start && config.end) {
        var links = this.linksBetween(config.start, config.end);//按number属性从大到小排列
        if (links.length == 0) {
            if($.isFunction(fn)){
                fn();
            }else{
                return this.createLink(config);
            }
        } else {
            //两点之间连线为1则认为是已有链接，超过1则认为是可以展开且已经展开的直线
            var number = 1;
            if ($.isNumeric(config.number)) {
                number = parseInt(config.number);
                if(number<1){
                    number=1;
                }
            }
            if(links.length==1){
                links[0].set({
                    number: links[0].attr.number + number
                });
                return links[0];
            }else if(links.length>1){
                var parent=links[0].parent;
                if(parent){
                    parent.attr.number+=number;
                    parent.addChild(number);
                }
                return parent;
            }
        }
    }
};
Scene.prototype.linksBetween = function (start, end) {
    var result = [];
    var links = start.links;
    //检测两元素间的连线是否已有
    if ($.isArray(links.out)) {
        $.each(links.out, function (i, linkOut) {
            if (linkOut.path.end == end) {
                result.push(linkOut);
            }
        });
    }
    if ($.isArray(links.in)) {
        $.each(links.in, function (j, linkIn) {
            if (linkIn.path.start == end) {
                result.push(linkIn);
            }
        });
    }
    return result.sort(function (a, b) {
        return b.attr.number - a.attr.number;
    });
};
//--
Scene.prototype.createLine = function (config) {
    var newLine;
    var constant = QTopo.constant.line;
    config = config || {};
    switch (config.type) {
        default:
            newLine = new Line.Direct.constructor(config);
    }
    if (newLine && newLine.jtopo) {
        addJTopo.call(this, newLine);
        this.children.line.push(newLine);
        return newLine;
    } else {
        QTopo.util.error("create Link error", config);
        return false;
    }
};
//--
Scene.prototype.createContainer = function (config) {
    var newContainer;
    var constant = QTopo.constant.container;
    config = config || {};
    switch (config.type) {
        default:
            newContainer = new Container.Group.constructor(config);
    }
    if (newContainer && newContainer.jtopo) {
        //分组只加入其本身，切换节点不作数
        var nodeConfig = {};
        if (config.toggle) {
            nodeConfig = config.toggle
        }
        //可选禁用分组切换
        if (!(config.toggle&&typeof config.toggle.close == "boolean" && config.toggle.close)) {
            addToggle(this, newContainer, nodeConfig);
        }
        this.children.container.push(newContainer);
        addJTopo.call(this, newContainer);
        return newContainer;
    } else {
        QTopo.util.error("create Container error", config);
        return false;
    }
};
function addToggle(scene, container, configToggle) {
    configToggle.useType = QTopo.constant.CASUAL;//标记用途
    container.toggleTo = new Node.Image.constructor(configToggle);
    container.toggleTo.toggleTo = container;//互相索引
    container.toggleTo.hide();//初始隐藏
    addJTopo.call(scene, container.toggleTo);//加入画布
}
//--
//-
Scene.prototype.remove = function (element) {
    var self=this;
    if (element) {
        if ($.isArray(element)) {
            $.each(element, function (i, item) {
                removeOnce(item);
            });
        } else {
            removeOnce(element);
        }
        function removeOnce(oneElement) {
            if (oneElement.jtopo) {
                switch (oneElement.getType()) {
                    case QTopo.constant.NODE:
                        if (QTopo.util.arrayDelete(self.children.node, oneElement) || oneElement.getUseType() == QTopo.constant.CASUAL) {
                            removeNode.call(self, oneElement);
                        }
                        break;
                    case QTopo.constant.LINK:
                        if (QTopo.util.arrayDelete(self.children.link, oneElement) || oneElement.getUseType() == QTopo.constant.CASUAL) {
                            removeLink.call(self, oneElement);
                        }
                        break;
                    case QTopo.constant.LINE:
                        if (QTopo.util.arrayDelete(self.children.line, oneElement) || oneElement.getUseType() == QTopo.constant.CASUAL) {
                            removeLine.call(self, oneElement);
                        }
                        break;
                    case QTopo.constant.CONTAINER:
                        if (QTopo.util.arrayDelete(self.children.container, oneElement) || oneElement.getUseType() == QTopo.constant.CASUAL) {
                            removeContainer.call(self, oneElement);
                        }
                        break;
                }
            }
        }
    }
};
function upDataLinks(element) {
    var links = element.links;
    if (links) {
        //更新其上连线的另一方的links属性
        while (links.in.length > 0) {
            this.remove(links.in.pop());
        }
        while (links.out.length > 0) {
            this.remove(links.out.pop());
        }
    }
}
//线上删除时候,要更新node和container中的links属性
function removeLink(link) {
    try {
        QTopo.util.arrayDelete(link.path.start.links.out, link);
        QTopo.util.arrayDelete(link.path.end.links.in, link);
        removeJTopo.call(this, link);
    } catch (e) {
        QTopo.util.error("Scene removeLink error", e);
    }
}
function removeLine(line) {
    try {
        removeJTopo.call(this, line);
    } catch (e) {
        QTopo.util.error("Scene removeLine error", e);
    }
}
function removeNode(node) {
    //刷新一下现有的线
    try {
        //更新其上线另一头的links属性
        upDataLinks.call(this, node);
        //要更新其父的children属性,父删除子
        if (node.parent && $.isArray(node.parent.children)) {
            node.parent.remove(node);
        }
        //删除分组切换的节点时同时删除其切换的分组
        if (node.toggleTo) {
            //分组若隐藏了,应该展示
            node.toggleTo.toggle();
            this.remove(node.toggleTo);
        }
        removeJTopo.call(this, node);
    } catch (e) {
        QTopo.util.error("Scene removeNode error", e);
    }
}
//容器删除时,要更与其相连的线的另一端的links属性,要更新其子类的parent属性
function removeContainer(container) {
    try {
        //分组若隐藏了,应该展示
        container.toggle(true);
        //更新其上线另一头的links属性
        upDataLinks.call(this, container);
        //更新子元素的Parent属性
        if ($.isArray(container.children) && container.children.length > 0) {
            for (var i = 0; i < container.children.length; i++) {
                container.children[i].parent = null;
            }
        }
        //删除分组同时删除其切换节点
        if (container.toggleTo) {
            this.remove(container.toggleTo);
        }
        removeJTopo.call(this, container);
    } catch (e) {
        QTopo.util.error("Scene removeContainer error", e);
    }
}
//-
Scene.prototype.toJson=function(){
    var json=$.extend({},this.attr);
    json.extra=$.extend({},this.extra);
    return json;
};

Scene.prototype.isChildren=function(element){
    var result=false;
    if(element.jtopo){
        $.each(this.children,function(name,arr){
            if(arr.indexOf(element)>-1){
                result=true;
                return false;
            }
        });
    }
    return result;
};
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
var selectedCatch = {
    jtopo: [],
    qtopo: []
};
/**
 *获取被选中的元素
 * @returns {Array|*}
 */
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
