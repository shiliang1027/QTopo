module.exports = function (jtopo) {
    jtopo.CircleNode = CircleNode;
    function CircleNode(text) {
        jtopo.Node.apply(this, arguments);
        this._radius = 20;
        this.beginDegree = 0;
        this.endDegree = 2 * Math.PI;
        this.text = text;
    }
    jtopo.util.inherits(CircleNode, jtopo.Node);
    Object.defineProperties(
        CircleNode.prototype,
        {
            radius: {
                get: function () {
                    return this._radius
                },
                set: function (a) {
                    this._radius = a;
                    var b = 2 * this.radius;
                    var c = 2 * this.radius;
                    this.width = b;
                    this.height = c;
                }
            },
            width: {
                get: function () {
                    return this._width
                },
                set: function (a) {
                    this._radius = a / 2;
                    this._width = a;
                }
            },
            height: {
                get: function () {
                    return this._height;
                },
                set: function (a) {
                    this._radius = a / 2;
                    this._height = a;
                }
            }
        }
    );
    CircleNode.prototype.paint = function (context) {
        context.save();
        context.beginPath();
        context.fillStyle = "rgba(" + this.fillColor + "," + this.alpha + ")";
        context.arc(0, 0, this.radius, this.beginDegree, this.endDegree, !0);
        context.fill();
        context.closePath();
        context.restore();
        this.paintText(context);
        this.paintBorder(context);
        this.paintCtrl(context);
        this.paintAlarmText(context);
    };
    CircleNode.prototype.paintSelected = function (context) {
        context.save();
        context.beginPath();
        context.strokeStyle = "rgba(168,202,255, 0.9)";
        context.fillStyle = "rgba(168,202,236,0.7)";
        context.arc(0, 0, this.radius + 3, this.beginDegree, this.endDegree, !0);
        context.fill();
        context.stroke();
        context.closePath();
        context.restore();
    }
};