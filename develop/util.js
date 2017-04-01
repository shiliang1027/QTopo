var ruler;
var util = {
        cached: function (fn) {
            var cache = Object.create(null);
            return (function cachedFn(str) {
                var hit = cache[str];
                return hit || (cache[str] = fn(str))
            })
        },
        /**
         * 字符串转化json
         * @param json
         * @returns {*}
         */
        toJson: function (json) {
            if (typeof json == 'string') {
                json = $.parseJSON(json.replace(/'/g, '"'));
            }
            return json;
        },
        /**
         * 首字母大写
         * @param string
         * @returns {XML|*|void}
         */
        upFirst: util.cached(function (string) {
            return str.charAt(0).toUpperCase() + str.slice(1);
        }),
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
         * @param param 参数名
         * @returns {*}
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
        /** 数组添加元素,如果数组中不存在则存入，否则不做操作
         *  @param arr 操作的数组
         *  @param value 操作的元素
         */
        arrayPush: function (arr, value) {
            if (arr.indexOf(value) < 0) {
                arr.push(value);
                return true;
            }
            return false;
        },
        /** 数组删除元素,如果数组中不存在则删除，否则不做操作
         *  @param arr 操作的数组
         *  @param value 操作的元素
         */
        arrayDelete: function (arr, value) {
            var i = arr.indexOf(value);
            if (i >= 0) {
                arr.splice(i, 1);
                return true;
            }
            return false;
        }, /**
         * 构造类继承关系
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
        //深度克隆对象
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
                } else if (util.getClass(copy) == "Array") {
                    result[key] = arguments.callee(copy);
                } else {
                    result[key] = obj[key];
                }
            }
            return result;
        },
        getClass: function (o) {
            if (o === null) return "Null";
            if (o === undefined) return "Undefined";
            return Object.prototype.toString.call(o).slice(8, -1);
        },
        info: function () {
            if (QTopo.log.info) {
                console.info.apply(console, $.merge([util.dateFormat(new Date(), "hh:mm:ss")], arguments));
            }
        },
        error: function () {
            if (QTopo.log.error) {
                console.error.apply(console, $.merge([util.dateFormat(new Date(), "hh:mm:ss")], arguments));
            }
        },
        filterValue: function (filter, data, element) {
            if ($.isArray(filter)) {
                $.each(data, function (k, v) {
                    if (filter.indexOf(k) < 0) {
                        element.val(k, v);
                    }
                });
            }
        },
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
        makeId: function () {
            return S4() + "-" + S4() + "-" + S4();
        },
        isElement: function (target) {
            return target && target.getType() != QTopo.constant.SCENE && target.getUseType() != QTopo.constant.CASUAL;
        },
        isScene: function (target) {
            return !target || target.getType() == QTopo.constant.SCENE;
        },
        isNode: function (target) {
            return target && target.getType() == QTopo.constant.NODE && target.getUseType() != QTopo.constant.CASUAL;
        },
        isContainer: function (target) {
            return target && target.getType() == QTopo.constant.CONTAINER && target.getUseType() != QTopo.constant.CASUAL;
        },
        isLink: function (target) {
            return target && target.getType() == QTopo.constant.LINK && target.getUseType() != QTopo.constant.CASUAL;
        }
    }
    ;
function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}
module.exports = util;