/**
 * Created by qiyc on 2017/2/7.
 */
var Node = {
    Normal: require("./Normal.js"),
    Text: require("./Text.js")
};
$.each(['Normal', 'Text'], function (i, v) {
    Node[v].prototype.type="node";
    Node[v].prototype.show = show;
    Node[v].prototype.hide = hide;
});
module.exports = Node;

function show() {
    this.jtopo.visible=true;
}
function hide() {
    this.jtopo.visible=false;
}
