/**
 * Created by qiyc on 2017/2/6.
 */
var ruler;
var util = {
    toJson:function(json){
        if (typeof json == 'string') {
            json = $.parseJSON(json.replace(/'/g, '"'));
        }
        return json;
    },
    upFirst: function (string) {
        return string.replace(/(^|\s+)\w/g, function (s) {
            return s.toUpperCase();//首字母大寫
        })
    },
    extend: function (base, config) {
        try {
            if (typeof base == "object" && typeof config == "object") {
                deep(base, config);
            } else {
                console.error("some extend error:", base, config);
            }
        } catch (e) {
            console.error("extend error", e, base, config);
        }
        function deep(base, config) {
            $.each(base, function (key, value) {
                if (typeof base[key] == "object" && typeof config[key] == "object") {
                    if ($.isArray(base[key]) && $.isArray(config[key])) {
                        base[key] = config[key];
                    } else if ($.isFunction(base[key]) && $.isFunction(config[key])) {
                        base[key] = config[key];
                    } else {
                        deep(base[key], config[key]);
                    }
                } else if (typeof base[key] != "undefined" && typeof config[key] != "undefined") {
                    base[key] = config[key];
                }
            });
        }

        return base;
    },
    getParameter: function (param) {
        var query = window.location.search;//获取URL地址中？后的所有字符
        var iLen = param.length;//获取你的参数名称长度
        var iStart = query.indexOf(param);//获取你该参数名称的其实索引
        if (iStart == -1)//-1为没有该参数
            return "";
        iStart += iLen + 1;
        var iEnd = query.indexOf("&", iStart);//获取第二个参数的其实索引
        if (iEnd == -1)//只有一个参数
            return query.substring(iStart);//获取单个参数的参数值
        return query.substring(iStart, iEnd);//获取第二个参数的值
    },
    //仅画布全屏展示
    runPrefixMethod: function (element, method) {
        var usablePrefixMethod;
        ["webkit", "moz", "ms", "o", ""].forEach(function (prefix) {
                if (usablePrefixMethod) return;
                if (prefix === "") {
                    // 无前缀，方法首字母小写
                    method = method.slice(0, 1).toLowerCase() + method.slice(1);
                }
                var typePrefixMethod = typeof element[prefix + method];
                if (typePrefixMethod + "" !== "undefined") {
                    if (typePrefixMethod === "function") {
                        usablePrefixMethod = element[prefix + method]();
                    } else {
                        usablePrefixMethod = element[prefix + method];
                    }
                }
            }
        );
    },
    //浏览器全屏展示
    launchFullScreen: function (element) {
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        }
    },
    //关闭浏览器全屏
    exitFullScreen: function (doc) {
        if (doc.exitFullscreen) {
            doc.exitFullscreen();
        } else if (doc.mozCancelFullScreen) {
            doc.mozCancelFullScreen();
        } else if (doc.webkitExitFullscreen) {
            doc.webkitExitFullscreen();
        }
    },
    //16进制转换
    transHex: function (color) {
        if (color && color.length == 7 && color.charAt(0) == '#') {
            var a = parseInt(color.substr(1, 2), 16);
            var b = parseInt(color.substr(3, 2), 16);
            var c = parseInt(color.substr(5, 2), 16);
            return a + ',' + b + ',' + c;
        } else {
            return color;
        }
    },
    //切换隐藏
    toggleElemnts: function (arr, visiable) {
        if (arr && arr instanceof Array) {
            $.each(arr, function (i, v) {
                if (typeof(visiable) == 'boolean') {
                    visiable ? v.show() : v.hide();
                } else {
                    v.visible ? v.hide() : v.show();
                }
            });
        }
    },
    //如果数组中不存在则存入，否则不做操作
    arrayPush: function (arr, value) {
        if (arr.indexOf(value) < 0) {
            arr.push(value);
            return true;
        }
        return false;
    },
    //如果数组中不存在则删除，否则不做操作
    arrayDelete: function (arr, value) {
        var i = arr.indexOf(value);
        if (i >= 0) {
            arr.splice(i, 1);
            return true;
        }
        return false;
    },
    //批量设值
    setAttr: function (element, object) {
        $.each(object, function (key, value) {
            element.prop[key] = value;
        });
    }, /**
     * 构造类继承关系
     * @memberOf module:zrender/tool/util
     * @param {Function} clazz 源类
     * @param {Function} baseClazz 基类
     */
    inherits: function (clazz, baseClazz) {
        var clazzPrototype = clazz.prototype;

        function F() {
        }

        F.prototype = baseClazz.prototype;
        clazz.prototype = new F();

        for (var prop in clazzPrototype) {
            clazz.prototype[prop] = clazzPrototype[prop];
        }
        clazz.constructor = clazz;
    },
    //显示名字
    showName: function (element) {
        element.text = element.prop.name;
    },
    hideName: function (element) {
        element.text = '';
    },
    //深度克隆对象
    deepClone: function (obj) {
        var result, oClass = isClass(obj);
        //确定result的类型
        if (oClass === "Object") {
            result = {};
        } else if (oClass === "Array") {
            result = [];
        } else {
            return obj;
        }
        for (key in obj) {
            var copy = obj[key];
            if (isClass(copy) == "Object") {
                result[key] = arguments.callee(copy);//递归调用
            } else if (isClass(copy) == "Array") {
                result[key] = arguments.callee(copy);
            } else {
                result[key] = obj[key];
            }
        }
        return result;
        function isClass(o) {
            if (o === null) return "Null";
            if (o === undefined) return "Undefined";
            return Object.prototype.toString.call(o).slice(8, -1);
        }
    },
    //获取当前屏幕正中心
    getCenterPosition: function (scene) {
        return {
            x: -scene.translateX + $(window).width() / 2,
            y: -scene.translateY + $(window).height() / 2
        }
    },
    //闪烁
    nodeFlash: function (node, n) {
        if (n == 0) {
            node.selected = false;
            return;
        }
        node.selected = !node.selected;
        setTimeout(function () {
            util.nodeFlash(node, n - 1);
        }, 300);
    },
    //图层平移到节点上
    nodeAsCenter: function (scene, node) {
        if (node) {
            var location = node.getCenterLocation();
            // 查询到的节点居中显示
            if (scene.childs.indexOf(node) > -1) {
                scene.scaleX = 1;
                scene.scaleY = 1;
                scene.setCenter(location.x, location.y);
                // 闪烁几下
                util.nodeFlash(node, 6);
            }
        }
    },//获取字符串长度
    getStringWidth: function (text, size) {
        if (!ruler) {
            ruler = $("span[name=topo_get_string_Width]");
        }
        ruler.text(text);
        if (size) {
            ruler.css("fontSize", size);
        } else {
            ruler.css("fontSize", "14px");
        }
        return ruler[0].offsetWidth;
    }
};
module.exports = util;