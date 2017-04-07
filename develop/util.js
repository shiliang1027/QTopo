/**
 * @module QTopo
 */
/**
 * @class QTopo.util
 * @static
 */
function cached(fn) {
    var cache = Object.create(null);
    return (function cachedFn(str) {
        var hit = cache[str];
        return hit || (cache[str] = fn(str))
    })
}

var util = {
        /**
         *  给函数添加缓存机制
         *  @method cached
         *  @param fn {function} 需处理的函数
         *  @returns {function} 处理过的函数
         */
        cached:cached,
        /**
         * 字符串转化json
         * @method toJson
         * @param json {string|object}
         * @returns json对象 {json}
         */
        toJson: function (json) {
            if (typeof json == 'string') {
                json = $.parseJSON(json.replace(/'/g, '"'));
            }
            return json;
        },
        /**
         * 首字母大写
         * @method upFirst
         * @param string 字符串
         * @returns {string} 首字母大写的字符串
         */
        upFirst: cached(function (str) {
            return str.charAt(0).toUpperCase() + str.slice(1);
        }),
        /**
         * 对象深度合并，只继承原对象有的属性
         * @method extend
         * @param base 原对象
         * @param config 合并对象
         * @returns {object} 处理完的原对象
         */
        extend: function (base, config) {
            try {
                if (typeof base == "object" && typeof config == "object") {
                    deep(base, config);
                }
                else {
                    QTopo.util.error("some extend error:", base, config);
                }
            } catch (e) {
                QTopo.util.error("extend error", e, base, config);
            }
            function deep(attr, config) {
                $.each(attr, function (key, value) {
                    if (attr[key] && typeof attr[key] == "object" && typeof config[key] == "object") {
                        if ($.isArray(attr[key]) && $.isArray(config[key])) {
                            attr[key] = config[key];
                        } else if ($.isFunction(attr[key]) && $.isFunction(config[key])) {
                            attr[key] = config[key];
                        } else {
                            deep(attr[key], config[key]);
                        }
                    } else if (typeof attr[key] != "undefined" && typeof config[key] != "undefined") {
                        attr[key] = config[key];
                    }
                });
            }

            return base;
        },
        /**
         * 获取浏览器连接上的参数
         * @method getParameter
         * @param param 参数名
         * @returns {string}
         */
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
        /**
         * 仅画布全屏展示
         * @method runPrefixMethod
         * @param element {document} 例:canvas
         * @param method {string} "RequestFullScreen"全屏的模式
         */
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
        /**
         * 浏览器全屏展示
         * @method launchFullScreen
         * @param element {document} 例:document.documentElement
         */
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
        /**
         * 关闭浏览器全屏
         * @method exitFullScreen
         * @param document {document} 例:window.document
         */
        exitFullScreen: function (document) {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            }
        },
        /**
         * 颜色字符串转换成rgb 16进制
         * @method transHex
         * @param color {string} 例:"#asdd00"
         * @return {string} 16进制 例:"255,255,255"
         */
        transHex: cached(function (color) {
            if (color && color.length == 7 && color.charAt(0) == '#') {
                return [
                    parseInt(color.substr(1, 2), 16),
                    parseInt(color.substr(3, 2), 16),
                    parseInt(color.substr(5, 2), 16)
                ].join(',');
            } else {
                return color;
            }
        }),
        /**
         * 数组添加元素,如果数组中不存在则存入，否则不做操作
         * @method arrayPush
         * @param arr 操作的数组
         * @param value 操作的元素
         * @return {boolean} 操作是否成功
         */
        arrayPush: function (arr, value) {
            if (arr.indexOf(value) < 0) {
                arr.push(value);
                return true;
            }
            return false;
        },
        /**
         * 数组删除元素,如果数组中不存在则删除，否则不做操作
         * @method arrayDelete
         * @param arr 操作的数组
         * @param value 操作的元素
         * @return {boolean} 操作是否成功
         */
        arrayDelete: function (arr, value) {
            var i = arr.indexOf(value);
            if (i >= 0) {
                arr.splice(i, 1);
                return true;
            }
            return false;
        },
        /**
         * 构造类继承关系
         * @method inherits
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
        /**
         * 深度克隆对象
         * @method deepClone
         * @param {object} obj 待克隆对象
         * @return {object} 克隆后的新对象
         */
        deepClone: function (obj) {
            var result, oClass = util.getClass(obj);
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
                if (util.getClass(copy) == "Object") {
                    result[key] = arguments.callee(copy);//递归调用
                } else if ($.isArray(copy)) {
                    result[key] = arguments.callee(copy);
                } else {
                    result[key] = obj[key];
                }
            }
            return result;
        },
        /**
         * 获取对象的类
         * @method getClass
         * @param {object} o 待处理对象
         * @return {string} 类名，如"Object","Array"
         */
        getClass: function (o) {
            if (o === null) return "Null";
            if (o === undefined) return "Undefined";
            return Object.prototype.toString.call(o).slice(8, -1);
        },
        /**
         * 加入时间戳的信息日志
         * @method info
         * @param {arguments} arguments
         */
        info: function () {
            if (QTopo.log.info) {
                console.info.apply(console, $.merge([util.dateFormat(new Date(), "hh:mm:ss")], arguments));
            }
        },
        /**
         * 加入时间戳的错误日志
         * @method error
         * @param {arguments} arguments
         */
        error: function () {
            if (QTopo.log.error) {
                console.error.apply(console, $.merge([util.dateFormat(new Date(), "hh:mm:ss")], arguments));
            }
        },
        /**
         * 格式化Date对象
         * @method dateFormat
         * @param {Date} date Date对象
         * @param {string} ftString 格式化字符串,如"hh:mm:ss"
         * @return {string}
         */
        dateFormat: function (date, ftString) {
            if (date instanceof Date) {
                var fomat = {
                    "M+": date.getMonth() + 1, //月份
                    "d+": date.getDate(), //日
                    "h+": date.getHours(), //小时
                    "m+": date.getMinutes(), //分
                    "s+": date.getSeconds(), //秒
                    "q+": Math.floor((date.getMonth() + 3) / 3), //季度
                    "S": date.getMilliseconds() //毫秒
                };
                if (/(y+)/.test(ftString)) {
                    ftString = ftString.replace(RegExp.$1, (date.getFullYear() + "")
                        .substr(4 - RegExp.$1.length));
                }
                for (var type in fomat) {
                    if (new RegExp("(" + type + ")").test(ftString)) {
                        var temp;
                        if (RegExp.$1.length == 1) {
                            temp = fomat[type];
                        } else {
                            temp = ("00" + fomat[type]).substr(("" + fomat[type]).length);
                        }
                        ftString = ftString.replace(RegExp.$1, temp);
                    }
                }
            }
            return ftString;
        },
        /**
         * 构造唯一Id字符串
         * @method makeId
         * @return {string}
         */
        makeId: function () {
            return S4() + "-" + S4() + "-" + S4();
        },
        /**
         * 判断对象是否是元素
         * @method isElement
         * @param element {element}
         * @return {boolean}
         */
        isElement: function (target) {
            return target &&target.getType &&target.getType() != QTopo.constant.SCENE && target.getUseType() != QTopo.constant.CASUAL;
        },
        /**
         * 判断QTopo对象是否是图层
         * @method isScene
         * @param element {element}
         * @return {boolean}
         */
        isScene: function (target) {
            return !target || target.getType() == QTopo.constant.SCENE;
        },
        /**
         * 判断QTopo对象是否是节点
         * @method isNode
         * @param element {element}
         * @return {boolean}
         */
        isNode: function (target) {
            return target && target.getType() == QTopo.constant.NODE && target.getUseType() != QTopo.constant.CASUAL;
        },
        /**
         * 判断QTopo对象是否是分组
         * @method isContainer
         * @param element {element}
         * @return {boolean}
         */
        isContainer: function (target) {
            return target && target.getType() == QTopo.constant.CONTAINER && target.getUseType() != QTopo.constant.CASUAL;
        },
        /**
         * 判断QTopo对象是否是链接
         * @method isLink
         * @param element {element}
         * @return {boolean}
         */
        isLink: function (target) {
            return target && target.getType() == QTopo.constant.LINK && target.getUseType() != QTopo.constant.CASUAL;
        }
    }
    ;
function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}
module.exports = util;