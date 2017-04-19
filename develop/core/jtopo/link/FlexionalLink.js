var util = require('./util.js');
module.exports = function (jtopo) {
    jtopo.FlexionalLink = FlexionalLink;
    function FlexionalLink(start, end, text) {
        jtopo.Link.apply(this, arguments);
        this.direction = "vertical";
        this.offset = 44;
    }
    jtopo.util.inherits(FlexionalLink, jtopo.Link);
    FlexionalLink.prototype.getStartPosition = function () {
        if(!util.isOverlay(this.nodeA,this.nodeZ)){
            var position = {
                x: this.nodeA.cx,
                y: this.nodeA.cy
            };
            if ("horizontal" == this.direction) {
                if (this.nodeZ.cx < position.x) {
                    position.x = this.nodeA.x;
                } else {
                    position.x = this.nodeA.x + this.nodeA.width
                }
            } else {
                if (this.nodeZ.cy < position.y) {
                    position.y = this.nodeA.y;
                } else {
                    position.y = this.nodeA.y + this.nodeA.height;
                }
            }
            return position;
        }
    };
    FlexionalLink.prototype.getEndPosition = function () {
        var position = {
            x: this.nodeZ.cx,
            y: this.nodeZ.cy
        };
        if ("horizontal" == this.direction) {
            if (this.nodeA.cx < position.x) {
                position.x = this.nodeZ.x;
            } else {
                position.x = this.nodeZ.x + this.nodeZ.width;
            }
        } else {
            if (this.nodeA.cy < position.y) {
                position.y = this.nodeZ.y;
            } else {
                position.y = this.nodeZ.y + this.nodeZ.height;
            }
        }
        return position;
    };
    FlexionalLink.prototype.getPath = function (index) {
        var path = [];
        var start = this.getStartPosition();
        var end = this.getEndPosition();
        if (start && end) {
            if (this.nodeA === this.nodeZ) {
                path.push(start);
                path.push(end);
            }else{
                var totalLinks = util.getNums(this.nodeA, this.nodeZ);
                var totalGap = (totalLinks - 1) * this.gap;
                var gap = this.gap * index - totalGap / 2;
                var linkOffset = this.offset;
                if ("horizontal" == this.direction) {
                    if (this.nodeA.cx > this.nodeZ.cx) {
                        linkOffset = -linkOffset
                    }
                    path.push({x: start.x, y: start.y + gap});
                    path.push({x: start.x + linkOffset, y: start.y + gap});
                    path.push({x: end.x - linkOffset, y: end.y + gap});
                    path.push({x: end.x, y: end.y + gap})
                } else {
                    if (this.nodeA.cy > this.nodeZ.cy) {
                        linkOffset = -linkOffset
                    }
                    path.push({x: start.x + gap, y: start.y});
                    path.push({x: start.x + gap, y: start.y + linkOffset});
                    path.push({x: end.x + gap, y: end.y - linkOffset});
                    path.push({x: end.x + gap, y: end.y});
                }
            }
        }
        return path;
    };

    function getfixedRight(start, end) {
        //重写线的绘制路径
        var littleSize = 50;
        var startRight = {
            x: start.x + start.width,
            y: start.y + start.height / 2
        };
        var endRight = {
            x: end.x + end.width,
            y: end.y + end.height / 2
        };
        var middleA = {};
        var middleB = {};
        if (startRight.x > endRight.x) {
            middleA.x = startRight.x + littleSize;
            middleA.y = startRight.y;
            middleB.x = startRight.x + littleSize;
            middleB.y = endRight.y;
        } else {
            middleA.x = endRight.x + littleSize;
            middleA.y = startRight.y;
            middleB.x = endRight.x + littleSize;
            middleB.y = endRight.y;
        }
        return [startRight, middleA, middleB, endRight];
    }
};