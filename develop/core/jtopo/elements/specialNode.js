module.exports=function (jtopo) {
    function PieChartNode() {
        var b = new jtopo.CircleNode;
        return b.radius = 150, b.colors = ["#3666B0", "#2CA8E0", "#77D1F6"], b.datas = [.3, .3, .4], b.titles = ["A", "B", "C"], b.paint = function (a) {
            var c = 2 * b.radius, d = 2 * b.radius;
            b.width = c, b.height = d;
            for (var e = 0, f = 0; f < this.datas.length; f++) {
                var g = this.datas[f] * Math.PI * 2;
                a.save(), a.beginPath(), a.fillStyle = b.colors[f], a.moveTo(0, 0), a.arc(0, 0, this.radius, e, e + g, !1), a.fill(), a.closePath(), a.restore(), a.beginPath(), a.font = this.font;
                var h = this.titles[f] + ": " + (100 * this.datas[f]).toFixed(2) + "%", i = a.measureText(h).width, j = (a.measureText("田").width, (e + e + g) / 2), k = this.radius * Math.cos(j), l = this.radius * Math.sin(j);
                j > Math.PI / 2 && j <= Math.PI ? k -= i : j > Math.PI && j < 2 * Math.PI * 3 / 4 ? k -= i : j > 2 * Math.PI * .75, a.fillStyle = "#FFFFFF", a.fillText(h, k, l), a.moveTo(this.radius * Math.cos(j), this.radius * Math.sin(j)), j > Math.PI / 2 && j < 2 * Math.PI * 3 / 4 && (k -= i), j > Math.PI, a.fill(), a.stroke(), a.closePath(), e += g
            }
        }, b
    }

    function BarChartNode() {
        var b = new jtopo.Node;
        return b.showSelected = !1, b.width = 250, b.height = 180, b.colors = ["#3666B0", "#2CA8E0", "#77D1F6"], b.datas = [.3, .3, .4], b.titles = ["A", "B", "C"], b.paint = function (a) {
            var c = 3, d = (this.width - c) / this.datas.length;
            a.save(), a.beginPath(), a.fillStyle = "#FFFFFF", a.strokeStyle = "#FFFFFF", a.moveTo(-this.width / 2 - 1, -this.height / 2), a.lineTo(-this.width / 2 - 1, this.height / 2 + 3), a.lineTo(this.width / 2 + c + 1, this.height / 2 + 3), a.stroke(), a.closePath(), a.restore();
            for (var e = 0; e < this.datas.length; e++) {
                a.save(), a.beginPath(), a.fillStyle = b.colors[e];
                var f = this.datas[e], g = e * (d + c) - this.width / 2, h = this.height - f - this.height / 2;
                a.fillRect(g, h, d, f);
                var i = "" + parseInt(this.datas[e]), j = a.measureText(i).width, k = a.measureText("田").width;
                a.fillStyle = "#FFFFFF", a.fillText(i, g + (d - j) / 2, h - k), a.fillText(this.titles[e], g + (d - j) / 2, this.height / 2 + k), a.fill(), a.closePath(), a.restore()
            }
        }, b
    }

    jtopo.BarChartNode = BarChartNode;
    jtopo.PieChartNode = PieChartNode;
};