module.exports = function initEagleEye(stage) {
    return {
        hgap: 16,
        visible: !1,
        exportCanvas: document.createElement("canvas"),
        getImage: function (b, c) {
            var d = stage.getBound();
            var e = 1;
            var f = 1;
            this.exportCanvas.width = stage.canvas.width;
            this.exportCanvas.height = stage.canvas.height;
            if (null != b && null != c) {
                this.exportCanvas.width = b;
                this.exportCanvas.height = c;
                e = b / d.width;
                f = c / d.height;
            } else {
                if (d.width > stage.canvas.width) {
                    this.exportCanvas.width = d.width;
                }
                if (d.height > stage.canvas.height) {
                    this.exportCanvas.height = d.height;
                }
            }
            var g = this.exportCanvas.getContext("2d");
            if (stage.childs.length > 0) {
                g.save();
                g.clearRect(0, 0, this.exportCanvas.width, this.exportCanvas.height);
                stage.childs.forEach(function (scene) {
                    if (1 == scene.visible) {
                        scene.save();
                        scene.translateX = 0;
                        scene.translateY = 0;
                        scene.scaleX = 1;
                        scene.scaleY = 1;
                        g.scale(e, f);
                        if (d.left < 0) {
                            scene.translateX = Math.abs(d.left)
                        }
                        if (d.top < 0) {
                            scene.translateY = Math.abs(d.top)
                        }
                        scene.paintAll = !0;
                        scene.paint(g);
                        scene.paintAll = !1;
                        scene.restore();
                    }
                });
                g.restore();
            }
            return this.exportCanvas.toDataURL("image/png");
        },
        canvas: document.createElement("canvas"),
        update: function () {
            this.eagleImageDatas = this.getData(stage);
        },
        setSize: function (a, b) {
            this.width = this.canvas.width = a;
            this.height = this.canvas.height = b;
        },
        getData: function (b, c) {
            function d(a) {
                var b = a.stage.canvas.width, c = a.stage.canvas.height, d = b / a.scaleX / 2, e = c / a.scaleY / 2;
                return {translateX: a.translateX + d - d * a.scaleX, translateY: a.translateY + e - e * a.scaleY}
            }

            null != j && null != k ? this.setSize(b, c) : this.setSize(200, 160);
            var context = this.canvas.getContext("2d");
            if (stage.childs.length > 0) {
                context.save();
                context.clearRect(0, 0, this.canvas.width, this.canvas.height);
                stage.childs.forEach(function (scene) {
                    if (1 == scene.visible) {
                        scene.save();
                        scene.centerAndZoom(null, null, context);
                        scene.paint(context);
                        scene.restore();
                    }
                });
                var f = d(stage.childs[0]), g = f.translateX * (this.canvas.width / stage.canvas.width) * stage.childs[0].scaleX, h = f.translateY * (this.canvas.height / stage.canvas.height) * stage.childs[0].scaleY, i = stage.getBound(), j = stage.canvas.width / stage.childs[0].scaleX / i.width, k = stage.canvas.height / stage.childs[0].scaleY / i.height;
                j > 1 && (j = 1), k > 1 && (j = 1), g *= j, h *= k, i.left < 0 && (g -= Math.abs(i.left) * (this.width / i.width)), i.top < 0 && (h -= Math.abs(i.top) * (this.height / i.height)), context.save(), context.lineWidth = 1, context.strokeStyle = "rgba(255,0,0,1)", context.strokeRect(-g, -h, context.canvas.width * j, context.canvas.height * k), context.restore();
                var l = null;
                try {
                    l = context.getImageData(0, 0, context.canvas.width, context.canvas.height)
                } catch (m) {
                }
                return l
            }
            return null
        },
        paint: function () {
            if (null != this.eagleImageDatas) {
                var b = stage.graphics;
                b.save();
                b.fillStyle = "rgba(211,211,211,0.3)";
                b.fillRect(stage.canvas.width - this.canvas.width - 2 * this.hgap, stage.canvas.height - this.canvas.height - 1, stage.canvas.width - this.canvas.width, this.canvas.height + 1);
                b.fill();
                b.save();
                b.lineWidth = 1;
                b.strokeStyle = "rgba(0,0,0,1)";
                b.rect(stage.canvas.width - this.canvas.width - 2 * this.hgap, stage.canvas.height - this.canvas.height - 1, stage.canvas.width - this.canvas.width, this.canvas.height + 1);
                b.stroke();
                b.restore();
                b.putImageData(this.eagleImageDatas, stage.canvas.width - this.canvas.width - this.hgap, stage.canvas.height - this.canvas.height);
                b.restore()
            } else {
                this.eagleImageDatas = this.getData(stage);
            }
        },
        eventHandler: function (a, b, c) {
            var d = b.x, e = b.y;
            if (d > c.canvas.width - this.canvas.width && e > c.canvas.height - this.canvas.height) {
                if (d = b.x - this.canvas.width, e = b.y - this.canvas.height, "mousedown" == a && (this.lastTranslateX = c.childs[0].translateX, this.lastTranslateY = c.childs[0].translateY), "mousedrag" == a && c.childs.length > 0) {
                    var f = b.dx, g = b.dy, h = c.getBound(), i = this.canvas.width / c.childs[0].scaleX / h.width, j = this.canvas.height / c.childs[0].scaleY / h.height;
                    c.childs[0].translateX = this.lastTranslateX - f / i, c.childs[0].translateY = this.lastTranslateY - g / j
                }
            }
        }
    }
}