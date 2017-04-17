module.exports = function (JTopo) {
    function MessageBus(a) {
        this.name = a;
        this.messageMap = {};
        this.messageCount = 0;
    }

    MessageBus.prototype.subscribe = function (evenName, fn) {
        var d = this.messageMap[evenName];
        if (null == d) {
            this.messageMap[evenName] = [];
        }
        this.messageMap[evenName].push(fn);
        this.messageCount++;
    };
    MessageBus.prototype.unsubscribe = function (evenName, fn) {
        var event = this.messageMap[evenName];
        if (null != event) {
            if (fn && 'function' == typeof fn) {
                var index = event.indexOf(fn);
                if (index > -1) {
                    event.splice(index, 1);
                }
            } else {
                this.messageMap[evenName] = null;
                delete this.messageMap[evenName];
                this.messageCount--;
            }
        }
    };
    MessageBus.prototype.publish = function (evenName, e, boolean) {
        var eventMap = this.messageMap[evenName];
        if (null != eventMap) {
            eventMap.forEach(function (fn) {
                if (boolean) {
                    setTimeout(function () {
                        fn(e);
                    });
                } else {
                    if (e.target && e.target.qtopo) {
                        fn(e, e.target.qtopo);
                    } else {
                        fn(e);
                    }
                }
            });
        }
    };
    function getDistance(pointA, pointB, c, d) {
        var width, height;
        if (null == c && null == d) {
            if (pointA && pointB) {
                width = pointB.x - pointA.x;
                height = pointB.y - pointA.y;
            }
        } else {
            width = c - pointA;
            height = d - pointB;
        }
        return Math.sqrt(width * width + height * height);
    }

    function getElementsBound(elements) {
        var b = {
            left: Number.MAX_VALUE,
            right: Number.MIN_VALUE,
            top: Number.MAX_VALUE,
            bottom: Number.MIN_VALUE
        };
        elements.forEach(function (element) {
            if (!(element instanceof JTopo.Link)) {
                if (b.left > element.x) {
                    b.left = element.x;
                    b.leftNode = element;
                }
                if (b.right < element.x + element.width) {
                    b.right = element.x + element.width;
                    b.rightNode = element;
                }
                if (b.top > element.y) {
                    b.top = element.y;
                    b.topNode = element;
                }
                if (b.bottom < element.y + element.height) {
                    b.bottom = element.y + element.height;
                    b.bottomNode = element;
                }
            }
        });
        b.width = b.right - b.left;
        b.height = b.bottom - b.top;
        return b;
    }

    function getEventPosition(event) {
        event = cloneEvent(event);
        if (!event.pageX) {
            event.pageX = event.clientX + document.body.scrollLeft - document.body.clientLeft;
            event.pageY = event.clientY + document.body.scrollTop - document.body.clientTop;
        }
        return event;
    }

    function rotatePoint(aX, aY, bX, bY, c) {
        var width = bX - aX;
        var height = bY - aY;
        var ditance = Math.sqrt(width * width + height * height);
        var i = Math.atan2(height, width) + c;
        return {
            x: aX + Math.cos(i) * ditance,
            y: aY + Math.sin(i) * ditance
        }
    }

    function rotatePoints(root, childs, beginAngle) {
        for (var d = [], e = 0; e < childs.length; e++) {
            d.push(rotatePoint(root.x, root.y, childs[e].x, childs[e].y, beginAngle));
        }
        return d
    }

    function cloneEvent(a) {
        var b = {};
        for (var c in a) {
            if ("returnValue" != c && "keyLocation" != c) {
                b[c] = a[c];
            }
        }
        return b
    }

    function clone(object) {
        var b = {};
        for (var c in object) {
            b[c] = object[c];
        }
        return b
    }

    function isPointInRect(rect, points) {
        var X = points.x;
        var Y = points.y;
        var W = points.width;
        var H = points.height;
        return rect.x > X && rect.x < X + W && rect.y > Y && rect.y < Y + H;
    }

    function isPointInLine(points, start, end) {
        var line = JTopo.util.getDistance(start, end);
        var toStart = JTopo.util.getDistance(start, points);
        var toEnd = JTopo.util.getDistance(end, points);
        return Math.abs(toStart + toEnd - line) <= 0.5;
    }

    function removeFromArray(arr, item) {
        var index=arr.indexOf(item);
        if(index>-1){
            arr.splice(index,1);
        }
        return arr
    }

    function randomColor() {
        return Math.floor(255 * Math.random()) + "," + Math.floor(255 * Math.random()) + "," + Math.floor(255 * Math.random())
    }


    function loadStageFromJson(json, canvas) {
        var obj = eval(json), stage = new JTopo.Stage(canvas);
        for (var k in stageObj)if ("scenes" != k)stage[k] = obj[k]; else for (var scenes = obj.scenes, i = 0; i < scenes.length; i++) {
            var sceneObj = scenes[i], scene = new JTopo.Scene(stage);
            for (var p in sceneObj)if ("elements" != p)scene[p] = sceneObj[p]; else for (var nodeMap = {}, elements = sceneObj.elements, m = 0; m < elements.length; m++) {
                var elementObj = elements[m], type = elementObj.elementType, element;
                "Node" == type && (element = new JTopo.Node);
                for (var mk in elementObj)element[mk] = elementObj[mk];
                nodeMap[element.text] = element, scene.add(element)
            }
        }
        return console.log(stage), stage
    }

    function changeColor(ctx, image, color) {
        var colorArr = color.split(",");
        var R = parseInt(colorArr[0]);
        var G = parseInt(colorArr[1]);
        var B = parseInt(colorArr[2]);
        var imageWidth = canvas.width = image.width;
        var imageHeight = canvas.height = image.height;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(image, 0, 0);
        var ImageData = ctx.getImageData(0, 0, image.width, image.height);
        var data = ImageData.data;
        for (var i = 0; imageWidth > i; i++) {
            for (var j = 0; imageHeight > j; j++) {
                var n = 4 * (i + j * imageWidth);
                if (0 != data[n + 3]) {
                    if (null != R) {
                        data[n + 0] += R;
                    }
                    if (null != G) {
                        data[n + 1] += G;
                    }
                    if (null != B) {
                        data[n + 2] += B;
                    }
                }
            }
        }
        ctx.putImageData(ImageData, 0, 0, 0, 0, image.width, image.height);
        return canvas.toDataURL();
    }

    function genImageAlarm(image, color) {
        var src = image.src + color;
        if (alarmImageCache[src])return alarmImageCache[src];
        var newImage = new Image;
        newImage.src = changeColor(graphics, image, color);
        alarmImageCache[src] = newImage;
        return newImage;
    }

    function getOffsetPosition(canvas) {
        if (!canvas) {
            return {left: 0, top: 0};
        }
        var b = 0, c = 0;
        if ("getBoundingClientRect" in document.documentElement) {
            var d = canvas.getBoundingClientRect();
            var e = canvas.ownerDocument;
            var f = e.body;
            var g = e.documentElement;
            var h = g.clientTop || f.clientTop || 0;
            var i = g.clientLeft || f.clientLeft || 0;
            b = d.top + (self.pageYOffset || g && g.scrollTop || f.scrollTop) - h;
            c = d.left + (self.pageXOffset || g && g.scrollLeft || f.scrollLeft) - i;

        } else {
            do {
                b += canvas.offsetTop || 0;
                c += canvas.offsetLeft || 0;
                canvas = canvas.offsetParent;
            } while (canvas);
        }
        return {left: c, top: b}
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
        var newLineFn = JTopo.util.lineF(bound.left, bound.top, bound.left, bound.bottom);
        var d = JTopo.util.intersection(lineFn, newLineFn);
        if (null == d) {
            newLineFn = JTopo.util.lineF(bound.left, bound.top, bound.right, bound.top);
            d = JTopo.util.intersection(lineFn, newLineFn);
            if (null == d) {
                newLineFn = JTopo.util.lineF(bound.right, bound.top, bound.right, bound.bottom);
                d = JTopo.util.intersection(lineFn, newLineFn);
                if (null == d) {
                    newLineFn = JTopo.util.lineF(bound.left, bound.bottom, bound.right, bound.bottom);
                    d = JTopo.util.intersection(lineFn, newLineFn);
                }
            }
        }

        return d;
    }

    window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame || function (fn) {
            return setTimeout(fn, 1e3 / 24);
        };
    Array.prototype.del = function (item) {
        if ("number" != typeof item) {
            var index = this.indexOf(item);
            if (index > -1) {
                this.splice(index, 1);
            }
            return this
        } else {
            if (item > -1) {
                this.splice(item, 1);
            }
            return this;
        }
    };
    var canvas = document.createElement("canvas"), graphics = canvas.getContext("2d"), alarmImageCache = {};
    JTopo.util = {
        rotatePoint: rotatePoint,
        rotatePoints: rotatePoints,
        getDistance: getDistance,
        getEventPosition: getEventPosition,
        MessageBus: MessageBus,
        isFirefox: navigator.userAgent.indexOf("Firefox") > 0,
        isIE: !(!window.attachEvent || -1 !== navigator.userAgent.indexOf("Opera")),
        isChrome: null != navigator.userAgent.toLowerCase().match(/chrome/),
        clone: clone,
        isPointInRect: isPointInRect,
        isPointInLine: isPointInLine,
        removeFromArray: removeFromArray,
        cloneEvent: cloneEvent,
        randomColor: randomColor,
        loadStageFromJson: loadStageFromJson,
        getElementsBound: getElementsBound,
        genImageAlarm: genImageAlarm,
        getOffsetPosition: getOffsetPosition,
        lineF: lineF,
        intersection: intersection,
        intersectionLineBound: intersectionLineBound
    }
};