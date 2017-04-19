module.exports=function(jtopo){
    jtopo.DisplayElement = DisplayElement;
    function DisplayElement() {
        jtopo.Element.apply(this,arguments);
        this.elementType = "displayElement";
        this.x = 0;
        this.y = 0;
        this.width = 32;
        this.height = 32;
        this.visible = !0;
        this.alpha = 1;
        this.rotate = 0;
        this.scaleX = 1;
        this.scaleY = 1;
        this.strokeColor = "22,124,255";
        this.borderColor = "22,124,255";
        this.fillColor = "22,124,255";
        this.shadow = !1;
        this.shadowBlur = 5;
        this.shadowColor = "rgba(0,0,0,0.5)";
        this.shadowOffsetX = 3;
        this.shadowOffsetY = 6;
        this.transformAble = !1;
        this.zIndex = 0;
        var a = "x,y,width,height,visible,alpha,rotate,scaleX,scaleY,strokeColor,fillColor,shadow,shadowColor,shadowOffsetX,shadowOffsetY,transformAble,zIndex".split(",");
        this.serializedProperties = this.serializedProperties.concat(a);
    }
    jtopo.util.inherits(DisplayElement,jtopo.Element);
    DisplayElement.prototype.paint = function (a) {
        a.beginPath();
        a.fillStyle = "rgba(" + this.fillColor + "," + this.alpha + ")";
        a.rect(-this.width / 2, -this.height / 2, this.width, this.height);
        a.fill();
        a.stroke();
        a.closePath();
    };
    DisplayElement.prototype.getLocation = function () {
        return {
            x: this.x,
            y: this.y
        }
    };
    DisplayElement.prototype.setLocation = function (a, b) {
        if (this.qtopo && this.qtopo.attr && this.qtopo.attr.position) {
            this.qtopo.attr.position[0] = a;
            this.qtopo.attr.position[1] = b;
        }
        return this.x = a, this.y = b, this
    };
    DisplayElement.prototype.getCenterLocation = function () {
        return {
            x: this.x + this.width / 2,
            y: this.y + this.height / 2
        }
    };
    DisplayElement.prototype.setCenterLocation = function (a, b) {
        this.x = a - this.width / 2;
        this.y = b - this.height / 2;
        return this;
    };
    DisplayElement.prototype.getSize = function () {
        return {
            width: this.width,
            height: this.heith
        }
    };
    DisplayElement.prototype.setSize = function (a, b) {
        this.width = a;
        this.height = b;
        return this;
    };
    DisplayElement.prototype.getBound = function () {
        return {
            left: this.x,
            top: this.y,
            right: this.x + this.width,
            bottom: this.y + this.height,
            width: this.width,
            height: this.height
        }
    };
    DisplayElement.prototype.setBound = function (a, b, c, d) {
        this.setLocation(a, b);
        this.setSize(c, d);
        return this;
    };
    DisplayElement.prototype.getDisplayBound = function () {
        return {
            left: this.x,
            top: this.y,
            right: this.x + this.width * this.scaleX,
            bottom: this.y + this.height * this.scaleY
        }
    };
    DisplayElement.prototype.getDisplaySize = function () {
        return {
            width: this.width * this.scaleX,
            height: this.height * this.scaleY
        }
    };
    DisplayElement.prototype.getPosition = function (a) {
        var position,
            c = this.getBound();
        switch (a) {
            case "Top_Left":
                position = {x: c.left, y: c.top};
                break;
            case "Top_Center":
                position = {x: this.cx, y: c.top};
                break;
            case "Top_Right":
                position = {x: c.right, y: c.top};
                break;
            case "Middle_Left":
                position = {x: c.left, y: this.cy};
                break;
            case "Middle_Center":
                position = {x: this.cx, y: this.cy};
                break;
            case "Middle_Right":
                position = {x: c.right, y: this.cy};
                break;
            case "Bottom_Left":
                position = {x: c.left, y: c.bottom};
                break;
            case "Bottom_Center":
                position = {x: this.cx, y: c.bottom};
                break;
            case  "Bottom_Right":
                position = {x: c.right, y: c.bottom};
                break;
            default:
                position = {x: c.left, y: c.top};
        }
        return position;
    };
    Object.defineProperties(DisplayElement.prototype, {
        cx: {
            get: function () {
                return this.x + this.width / 2
            }, set: function (a) {
                this.x = a - this.width / 2
            }
        },
        cy: {
            get: function () {
                return this.y + this.height / 2
            }, set: function (a) {
                this.y = a - this.height / 2
            }
        }
    });
};
