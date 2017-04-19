module.exports=function(jtopo){
    jtopo.AnimateNode = AnimateNode;
    function AnimateNode() {
        var node = null;
        if (arguments.length <= 3) {
            node = new ImagesNode(arguments[0], arguments[1], arguments[2]);
        } else {
            node = new OneImageGif(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
        }
        node.stop = function () {
            node.isStop = !0
        };
        node.play = function () {
            node.isStop = !1;
            node.frameIndex = 0;
            node.nextFrame();
        };
        return node
    }
    function ImagesNode(frameImages, times, asImageSize) {
        jtopo.Node.apply(this);
        this.frameImages = frameImages || [];
        this.frameIndex = 0;
        this.isStop = !0;
        this.times=times || 1e3;
        this.repeatPlay = !1;
        this.asImageSize=asImageSize;
    }
    jtopo.util.inherits(ImagesNode,jtopo.Node);
    ImagesNode.prototype.nextFrame = function () {
        var self = this;
        if (!this.isStop && null != this.frameImages.length) {
            this.frameIndex++;
            if (this.frameIndex >= this.frameImages.length) {
                if (!this.repeatPlay){
                    return;
                }
                this.frameIndex = 0;
            }
            this.setImage(this.frameImages[this.frameIndex], this.asImageSize);
            setTimeout(function () {
                self.nextFrame();
            }, self.times /self.frameImages.length);
        }
    };

    // 1行4列，1000毫秒播放一轮，行偏移量
    function OneImageGif(image, rows, columns, times, rowOffset) {
        jtopo.Node.apply(this,arguments);
        this.setImage(image);
        this.frameIndex = 0;
        this.isPause = !0;
        this.repeatPlay = !1;
        this.times = times || 1e3;
        this.rowOffset = rowOffset || 0;
        this.rows=rows;
        this.columns=columns;
    }
    jtopo.util.inherits(OneImageGif,jtopo.Node);
    OneImageGif.prototype.paint = function (context) {
        if (this.image) {
            var width = this.width;
            var height = this.height;
            context.save();
            context.beginPath();
            context.fillStyle = "rgba(" + this.fillColor + "," + this.alpha + ")";
            var y = (Math.floor(this.frameIndex / this.columns) + this.rowOffset) * height;
            var x = Math.floor(this.frameIndex % this.columns) * width;
            context.drawImage(this.image, x, y, width, height, -width / 2, -height / 2, width, height);
            context.fill();
            context.closePath();
            context.restore();
            this.paintText(context);
            this.paintBorder(context);
            this.paintCtrl(context);
            this.paintAlarmText(context);
        }
    };
    OneImageGif.prototype.nextFrame = function () {
        var self = this;
        if (!this.isStop) {
            this.frameIndex++;
            if (this.frameIndex >= this.rows * this.columns) {
                if (!this.repeatPlay){
                    return;
                }
                this.frameIndex = 0
            }
            setTimeout(function () {
                if(!self.isStop){
                    self.nextFrame();
                }
            }, self.times / (self.rows * self.columns))
        }
    }
};