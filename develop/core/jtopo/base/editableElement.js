module.exports = function (jtopo) {
    jtopo.EditableElement = EditableElement;
    var TEMP=jtopo.InteractiveElement.prototype;

    function EditableElement() {
        jtopo.InteractiveElement.apply(this, arguments);
        this.editAble = !1;
        this.selectedPoint = null;
    }
    jtopo.util.inherits(EditableElement,jtopo.InteractiveElement);
    EditableElement.prototype.getCtrlPosition = function (a) {
        var b = 5;
        var c = 5;
        var d = this.getPosition(a);
        return {
            left: d.x - b,
            top: d.y - c,
            right: d.x + b,
            bottom: d.y + c
        }
    };
    EditableElement.prototype.selectedHandler = function (event) {
        TEMP.selectedHandler.apply(this, arguments);
        this.selectedSize = {
            width: this.width,
            height: this.height
        };
        if (event.scene.mode == jtopo.SceneMode.edit) {
            this.editAble = !0
        }
    };
    EditableElement.prototype.unselectedHandler = function () {
        TEMP.unselectedHandler.apply(this, arguments);
        this.selectedSize = null;
        this.editAble = !1;
    };
    var b = ["Top_Left", "Top_Center", "Top_Right", "Middle_Left", "Middle_Right", "Bottom_Left", "Bottom_Center", "Bottom_Right"];
    EditableElement.prototype.paintCtrl = function (cx) {
        if (0 != this.editAble) {
            cx.save();
            for (var c = 0; c < b.length; c++) {
                var d = this.getCtrlPosition(b[c]);
                d.left -= this.cx;
                d.right -= this.cx;
                d.top -= this.cy;
                d.bottom -= this.cy;
                var e = d.right - d.left;
                var f = d.bottom - d.top;
                cx.beginPath();
                cx.strokeStyle = "rgba(0,0,0,0.8)";
                cx.rect(d.left, d.top, e, f);
                cx.stroke();
                cx.closePath();
                cx.beginPath();
                cx.strokeStyle = "rgba(255,255,255,0.3)";
                cx.rect(d.left + 1, d.top + 1, e - 2, f - 2);
                cx.stroke();
                cx.closePath();
            }
            cx.restore();
        }
    };
    EditableElement.prototype.isInBound = function (a, c) {
        if (this.selectedPoint = null, 1 == this.editAble)for (var e = 0; e < b.length; e++) {
            var f = this.getCtrlPosition(b[e]);
            if (a > f.left && a < f.right && c > f.top && c < f.bottom)return this.selectedPoint = b[e], !0
        }
        return TEMP.isInBound.apply(this, arguments);
    };
    EditableElement.prototype.mousedragHandler = function (a) {
        if (null == this.selectedPoint) {
            var b = this.selectedLocation.x + a.dx, c = this.selectedLocation.y + a.dy;
            this.setLocation(b, c), this.dispatchEvent("mousedrag", a)
        } else {
            if ("Top_Left" == this.selectedPoint) {
                var d = this.selectedSize.width - a.dx, e = this.selectedSize.height - a.dy, b = this.selectedLocation.x + a.dx, c = this.selectedLocation.y + a.dy;
                b < this.x + this.width && (this.x = b, this.width = d), c < this.y + this.height && (this.y = c, this.height = e)
            } else if ("Top_Center" == this.selectedPoint) {
                var e = this.selectedSize.height - a.dy, c = this.selectedLocation.y + a.dy;
                c < this.y + this.height && (this.y = c, this.height = e)
            } else if ("Top_Right" == this.selectedPoint) {
                var d = this.selectedSize.width + a.dx, c = this.selectedLocation.y + a.dy;
                c < this.y + this.height && (this.y = c, this.height = this.selectedSize.height - a.dy), d > 1 && (this.width = d)
            } else if ("Middle_Left" == this.selectedPoint) {
                var d = this.selectedSize.width - a.dx, b = this.selectedLocation.x + a.dx;
                b < this.x + this.width && (this.x = b), d > 1 && (this.width = d)
            } else if ("Middle_Right" == this.selectedPoint) {
                var d = this.selectedSize.width + a.dx;
                d > 1 && (this.width = d)
            } else if ("Bottom_Left" == this.selectedPoint) {
                var d = this.selectedSize.width - a.dx, b = this.selectedLocation.x + a.dx;
                d > 1 && (this.x = b, this.width = d);
                var e = this.selectedSize.height + a.dy;
                e > 1 && (this.height = e)
            } else if ("Bottom_Center" == this.selectedPoint) {
                var e = this.selectedSize.height + a.dy;
                e > 1 && (this.height = e)
            } else if ("Bottom_Right" == this.selectedPoint) {
                var d = this.selectedSize.width + a.dx;
                d > 1 && (this.width = d);
                var e = this.selectedSize.height + a.dy;
                e > 1 && (this.height = e)
            }
            this.dispatchEvent("resize", a)
        }
    };
};