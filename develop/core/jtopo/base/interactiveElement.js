module.exports=function(jtopo){
    jtopo.InteractiveElement = InteractiveElement;
    
    function InteractiveElement() {
        jtopo.DisplayElement.apply(this,arguments);
        this.elementType = "interactiveElement";
        this.draggable = !1;
        this.selected = !1;
        this.showSelected = !0;
        this.selectedLocation = null;
        this.isMouseOver = !1;
        var a = "draggable,selected,showSelected,isMouseOver".split(",");
        this.serializedProperties = this.serializedProperties.concat(a);
    }

    jtopo.util.inherits(InteractiveElement,jtopo.DisplayElement);

    ["click","dbclick","mousedown","mouseup","mouseover","mouseout","mousemove","mousedrag","touchstart","touchmove","touchend"]
        .forEach(function (eventName) {
            InteractiveElement.prototype[eventName] = function (e) {
                if (null != e) {
                    this.addEventListener(eventName, e);
                } else {
                    this.dispatchEvent(eventName);
                }
            }
        });
    InteractiveElement.prototype.paintSelected = function (a) {
        a.save();
        a.beginPath();
        a.strokeStyle = "rgba(168,202,255, 0.9)";
        a.fillStyle = "rgba(168,202,236,0.7)";
        a.rect(-this.width / 2 - 3, -this.height / 2 - 3, this.width + 6, this.height + 6);
        a.fill();
        a.stroke();
        a.closePath();
        a.restore();
        return this;
    };
    InteractiveElement.prototype.paintMouseover = function (a) {
        return this.paintSelected(a);
    };
    InteractiveElement.prototype.isInBound = function (pointX, pointY) {
        return pointX > this.x && pointX < this.x + this.width * Math.abs(this.scaleX) && pointY > this.y && pointY < this.y + this.height * Math.abs(this.scaleY)
    };
    InteractiveElement.prototype.selectedHandler = function () {
        this.selected = !0;
        this.selectedLocation = {
            x: this.x,
            y: this.y
        };
        return this;
    };
    InteractiveElement.prototype.unselectedHandler = function () {
        this.selected = !1;
        this.selectedLocation = null;
        return this;
    };
    InteractiveElement.prototype.dbclickHandler = function (a) {
        this.dispatchEvent("dbclick", a);
        return this;
    };
    InteractiveElement.prototype.clickHandler = function (a) {
        this.dispatchEvent("click", a);
        return this;
    };
    InteractiveElement.prototype.mousedownHander = function (a) {
        this.dispatchEvent("mousedown", a);
        return this;
    };
    InteractiveElement.prototype.mouseupHandler = function (a) {
        this.dispatchEvent("mouseup", a);
        return this;
    };
    InteractiveElement.prototype.mouseoverHandler = function (a) {
        this.isMouseOver = !0;
        this.dispatchEvent("mouseover", a);
        return this;
    };
    InteractiveElement.prototype.mousemoveHandler = function (a) {
        this.dispatchEvent("mousemove", a);
        return this;
    };
    InteractiveElement.prototype.mouseoutHandler = function (a) {
        this.isMouseOver = !1;
        this.dispatchEvent("mouseout", a);
        return this;
    };
    InteractiveElement.prototype.mousedragHandler = function (a) {
        var b = this.selectedLocation.x + a.dx;
        var c = this.selectedLocation.y + a.dy;
        this.setLocation(b, c);
        this.dispatchEvent("mousedrag", a);
        return this;
    };
    InteractiveElement.prototype.addEventListener = function (event, fn) {
        if (!this.messageBus) {
            this.messageBus = new jtopo.util.MessageBus;
        }
        this.messageBus.subscribe(event, fn);
        return this;
    };
    InteractiveElement.prototype.dispatchEvent = function (event, e) {
        if (this.messageBus) {
            this.messageBus.publish(event, e);
            return this;
        }
    };
    InteractiveElement.prototype.removeEventListener = function (event, fn) {
        this.messageBus.unsubscribe(event, fn);
    };
    InteractiveElement.prototype.removeAllEventListener = function () {
        this.messageBus = new jtopo.util.MessageBus
    };
    
};