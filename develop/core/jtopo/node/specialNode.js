module.exports=function (jtopo) {
    function PieChartNode() {
        var CircleNode = new jtopo.CircleNode;
        CircleNode.radius = 150;
        CircleNode.colors = ["#3666B0", "#2CA8E0", "#77D1F6"];
        CircleNode.datas = [.3, .3, .4];
        CircleNode.titles = ["A", "B", "C"];
        CircleNode.paint = function (context) {
            CircleNode.width = 2 * CircleNode.radius;
            CircleNode.height = 2 * CircleNode.radius;
            for (var startAngle = 0, i = 0; i < this.datas.length; i++) {
                var dataAngle = this.datas[i] * Math.PI * 2;
                context.save();
                context.beginPath();
                context.fillStyle = CircleNode.colors[i];
                context.moveTo(0, 0);
                context.arc(0, 0, this.radius, startAngle, startAngle + dataAngle, !1);
                context.fill();
                context.closePath();
                context.restore();
                context.beginPath();
                context.font = this.font;
                var text = this.titles[i] + ": " + (100 * this.datas[i]).toFixed(2) + "%";
                var totalWidth = context.measureText(text).width;
                var textStartAngle = (startAngle + startAngle + dataAngle) / 2;
                var textStartX = this.radius * Math.cos(textStartAngle);
                var textStartY = this.radius * Math.sin(textStartAngle);
                if((textStartAngle > Math.PI / 2 && textStartAngle <= Math.PI)||(textStartAngle > Math.PI && textStartAngle < 2 * Math.PI * 3 / 4 )){
                    textStartX -= totalWidth;
                }
                context.fillStyle = "#FFFFFF";
                context.fillText(text, textStartX, textStartY);
                context.moveTo(this.radius * Math.cos(textStartAngle), this.radius * Math.sin(textStartAngle));
                context.fill();
                context.stroke();
                context.closePath();
                startAngle += dataAngle;
            }
        };
        return  CircleNode;
    }

    function BarChartNode() {
        var node = new jtopo.Node;
        node.showSelected = !1;
        node.width = 250;
        node.height = 180;
        node.colors = ["#3666B0", "#2CA8E0", "#77D1F6"];
        node.datas = [.3, .3, .4];
        node.titles = ["A", "B", "C"];
        node.paint = function (context) {
            var barGap = 3;
            var barWidth = (this.width - barGap) / this.datas.length;
            context.save();
            context.beginPath();
            context.fillStyle = "#FFFFFF";
            context.strokeStyle = "#FFFFFF";
            context.moveTo(-this.width / 2 - 1, -this.height / 2);
            context.lineTo(-this.width / 2 - 1, this.height / 2 + 3);
            context.lineTo(this.width / 2 + barGap + 1, this.height / 2 + 3);
            context.stroke();
            context.closePath();
            context.restore();
            for (var i = 0; i < this.datas.length; i++) {
                context.save();
                context.beginPath();
                context.fillStyle = node.colors[i];
                var data = this.datas[i];
                var startX = i * (barWidth + barGap) - this.width / 2;
                var startY = this.height - data - this.height / 2;
                context.fillRect(startX, startY, barWidth, data);
                var percent = "" + parseInt(this.datas[i]);
                var totalWidth = context.measureText(percent).width;
                var fontWidth = context.measureText("田").width;
                context.fillStyle = "#FFFFFF";
                context.fillText(percent, startX + (barWidth - totalWidth) / 2, startY - fontWidth);
                context.fillText(this.titles[i], startX + (barWidth - totalWidth) / 2 ,this.height / 2 + fontWidth);
                context.fill();
                context.closePath();
                context.restore();
            }
        };
        return  node;
    }

    jtopo.BarChartNode = BarChartNode;
    jtopo.PieChartNode = PieChartNode;
};