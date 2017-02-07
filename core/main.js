/**
 * Created by qiyc on 2017/2/6.
 */
var $ = require('jquery');
require("./lib/jtopo/jtopo-min.js");
//模块
var greeter = require('./tools.js');
(function (global) {
    global.Qtopo = {
        init: function (json) {
            document.getElementById('root').appendChild(greeter());
            console.info($(window));
        }
    }
})(typeof window !== "undefined" ? window : this);