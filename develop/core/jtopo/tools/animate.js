module.exports=function (jtopo) {
    jtopo.Animate = {};
    jtopo.Effect = {};
    var stopAnimate = !1;
    jtopo.Effect.spring = spring;
    jtopo.Effect.gravity = ef_gravity;
    jtopo.Animate.stepByStep = stepByStep;
    jtopo.Animate.rotate = rotate;
    jtopo.Animate.scale = scale;
    jtopo.Animate.move = move;
    jtopo.Animate.cycle = cycle;
    jtopo.Animate.repeatThrow = repeatThrow;
    jtopo.Animate.dividedTwoPiece = dividedTwoPiece;
    jtopo.Animate.gravity = an_gravity;
    jtopo.Animate.startAll = startAll;
    jtopo.Animate.stopAll = stopAll;
    function AnimateObject(fn, time) {
        var intervalId;
        var messageBus = null;
        return {
            stop: function () {
                var self;
                if (intervalId) {
                    window.clearInterval(intervalId);
                    if (messageBus) {
                        messageBus.publish("stop");
                    }
                }
                return this;
            },
            start: function () {
                var self = this;
                intervalId = setInterval(function () {
                    fn.call(self)
                }, time);
                return this
            },
            onStop: function (fn) {
                if (null == messageBus) {
                    messageBus = new jtopo.util.MessageBus();
                }
                messageBus.subscribe("stop", fn);
                return this;
            }
        }
    }

    function ef_gravity(element, config) {
        config = config || {};
        var gravity = config.gravity || 0.1;
        var DX = config.dx || 0;
        var DY = config.dy || 5;
        var stop = config.stop;
        var h = config.interval || 30;
        return new AnimateObject(function () {
            if (stop && stop()) {
                DY = 0.5;
                this.stop();
            } else {
                DY += gravity;
                element.setLocation(element.x + DX, element.y + DY);
            }
        }, h);
    }

    function stepByStep(target, configs, time, e, f) {
        var intervalTime = 1e3 / 24;
        var temp = {};
        for (var config in configs) {
            var targetValue = configs[config];
            var needValue = targetValue - target[config];
            temp[config] = {
                oldValue: target[config],
                targetValue: targetValue,
                step: needValue / time * intervalTime,
                isDone: function (b) {
                    return this.step > 0 && target[b] >= this.targetValue || this.step < 0 && target[b] <= this.targetValue;
                }
            }
        }
        return new AnimateObject(function () {
            var notDone = !0;
            for (var config in configs) {
                if (!temp[config].isDone(config)) {
                    target[config] += temp[config].step;
                    notDone = !1;
                }
            }
            if (notDone) {
                if (!e) {
                    return this.stop();
                }
                for (var item in configs) {
                    if (f) {
                        var g = temp[item].targetValue;
                        temp[item].targetValue = temp[item].oldValue;
                        temp[item].oldValue = g;
                        temp[item].step = -temp[item].step;
                    } else {
                        target[item] = temp[item].oldValue;
                    }
                }
            }
            return this
        }, intervalTime);
    }

    function spring(config) {
        config = config || {};
        var sping = config.spring || .1; // 弹性系数
        var friction = config.friction || .8;// 摩擦系数
        var grivity = config.grivity || 0; // 引力大小
        var wind = config.minLength || 0;
        return {
            items: [],
            id: null,
            isPause: !1,
            addNode: function (node, target) {
                var item = {
                    node: node,
                    target: target,
                    vx: 0,
                    vy: 0
                };
                this.items.push(item);
                return this
            },
            play: function (interval) {
                this.stop();
                interval = interval || 1e3 / 24;
                var self = this;
                this.id = setInterval(function () {
                    self.nextFrame()
                }, interval)
            },
            stop: function () {
                window.clearInterval(this.id);
                this.id = null;
            },
            nextFrame: function () {
                for (var i = 0; i < this.items.length; i++) {
                    var item = this.items[i],
                        node = item.node,
                        target = item.target,
                        vx = item.vx,
                        vy = item.vy,
                        disX = target.x - node.x,
                        disY = target.y - node.y,
                        angle = Math.atan2(disY, disX);
                    if (0 != wind) {
                        var n = target.x - Math.cos(angle) * wind,
                            o = target.y - Math.sin(angle) * wind;
                        vx += (n - node.x) * sping;
                        vy += (o - node.y) * sping;
                    } else {
                        vx += disX * sping;
                        vy += disY * sping;
                    }
                    vx *= friction;
                    vy *= friction;
                    vy += grivity;
                    node.x += vx;
                    node.y += vy;
                    item.vx = vx;
                    item.vy = vy;
                }
            }
        }
    }

    function rotate(a, b) {
        function c() {
            return e = setInterval(function () {
                return stopAnimate ? void f.stop() : (a.rotate += g || .2, void(a.rotate > 2 * Math.PI && (a.rotate = 0)))
            }, 100), f
        }

        function d() {
            return window.clearInterval(e), f.onStop && f.onStop(a), f
        }

        var e = (b.context, null), f = {}, g = b.v;
        return f.run = c, f.stop = d, f.onStop = function (a) {
            return f.onStop = a, f
        }, f
    }

    function an_gravity(a, b) {
        function c() {
            return window.clearInterval(g), h.onStop && h.onStop(a), h
        }

        function d() {
            var d = b.dx || 0, i = b.dy || 2;
            return g = setInterval(function () {
                return stopAnimate ? void h.stop() : (i += f, void(a.y + a.height < e.stage.canvas.height ? a.setLocation(a.x + d, a.y + i) : (i = 0, c())))
            }, 20), h
        }

        var e = b.context, f = b.gravity || .1, g = null, h = {};
        return h.run = d, h.stop = c, h.onStop = function (a) {
            return h.onStop = a, h
        }, h
    }

    function dividedTwoPiece(b, c) {
        function d(c, d, e, f, g) {
            var h = new jtopo.Node;
            return h.setImage(b.image), h.setSize(b.width, b.height), h.setLocation(c, d), h.showSelected = !1, h.draggable = !1, h.paint = function (a) {
                a.save(), a.arc(0, 0, e, f, g), a.clip(), a.beginPath(), null != this.image ? a.drawImage(this.image, -this.width / 2, -this.height / 2) : (a.fillStyle = "rgba(" + this.style.fillStyle + "," + this.alpha + ")", a.rect(-this.width / 2, -this.height / 2, this.width / 2, this.height / 2), a.fill()), a.closePath(), a.restore()
            }, h
        }

        function e(c, e) {
            var f = c, g = c + Math.PI, h = d(b.x, b.y, b.width, f, g), j = d(b.x - 2 + 4 * Math.random(), b.y, b.width, f + Math.PI, f);
            b.visible = !1, e.add(h), e.add(j), jtopo.Animate.gravity(h, {context: e, dx: .3}).run().onStop(function () {
                e.remove(h), e.remove(j), i.stop()
            }), jtopo.Animate.gravity(j, {context: e, dx: -.2}).run()
        }

        function f() {
            return e(c.angle, h), i
        }

        function g() {
            return i.onStop && i.onStop(b), i
        }

        var h = c.context, i = (b.style, {});
        return i.onStop = function (a) {
            return i.onStop = a, i
        }, i.run = f, i.stop = g, i
    }

    function repeatThrow(a, b) {
        function c(a) {
            a.visible = !0, a.rotate = Math.random();
            var b = g.stage.canvas.width / 2;
            a.x = b + Math.random() * (b - 100) - Math.random() * (b - 100), a.y = g.stage.canvas.height, a.vx = 5 * Math.random() - 5 * Math.random(), a.vy = -25
        }

        function d() {
            return c(a), h = setInterval(function () {
                return stopAnimate ? void i.stop() : (a.vy += f, a.x += a.vx, a.y += a.vy, void((a.x < 0 || a.x > g.stage.canvas.width || a.y > g.stage.canvas.height) && (i.onStop && i.onStop(a), c(a))))
            }, 50), i
        }

        function e() {
            window.clearInterval(h)
        }

        var f = .8, g = b.context, h = null, i = {};
        return i.onStop = function (a) {
            return i.onStop = a, i
        }, i.run = d, i.stop = e, i
    }

    function stopAll() {
        stopAnimate = !0
    }

    function startAll() {
        stopAnimate = !1
    }

    function cycle(b, c) {
        function d() {
            return n = setInterval(function () {
                if (stopAnimate)return void m.stop();
                var a = f.y + h + Math.sin(k) * j;
                b.setLocation(b.x, a), k += l
            }, 100), m
        }

        function e() {
            window.clearInterval(n)
        }

        var f = c.p1, g = c.p2, h = (c.context, f.x + (g.x - f.x) / 2), i = f.y + (g.y - f.y) / 2, j = jtopo.util.getDistance(f, g) / 2, k = Math.atan2(i, h), l = c.speed || .2, m = {}, n = null;
        return m.run = d, m.stop = e, m
    }

    function move(element, config) {
        config = config || {};
        var position = config.position;
        var easing = config.easing || 0.2;
        return {
            id: null,
            run: function () {
                var self = this;
                if (self.id == null) {
                    self.id = setInterval(function () {
                        if (!stopAnimate) {
                            var totalX = position.x - element.x;
                            var totalY = position.y - element.y;
                            var stepX = totalX * easing;
                            var stepY = totalY * easing;
                            element.x += stepX;
                            element.y += stepY;
                            if (0.1 > stepX && 0.1 > stepY) {
                                self.stop();
                            }
                        } else {
                            self.stop()
                        }
                    }, 100);
                }
                return self;
            },
            stop: function () {
                window.clearInterval(this.id);
                this.id = null;
                if (this.onStop && typeof this.onStop == 'function') {
                    this.onStop();
                }
                return this;
            }
        };
    }

    function scale(a, b) {
        function c() {
            return j = setInterval(function () {
                a.scaleX += f, a.scaleY += f, a.scaleX >= e && d()
            }, 100), i
        }

        function d() {
            i.onStop && i.onStop(a), a.scaleX = g, a.scaleY = h, window.clearInterval(j)
        }

        var e = (b.position, b.context, b.scale || 1), f = .06, g = a.scaleX, h = a.scaleY, i = {}, j = null;
        return i.onStop = function (a) {
            return i.onStop = a, i
        }, i.run = c, i.stop = d, i
    }
};