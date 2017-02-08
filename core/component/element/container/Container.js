/**
 * Created by qiyc on 2017/2/7.
 */
var Element = require("../Element.js");
Container.prototype = new Element();
module.exports = Container;
function Container() {
    this.type = "container";

}

