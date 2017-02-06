/**
 * Created by qiyc on 2017/2/6.
 */
//main.js
var greeter = require('./tools.js');
(function (global) {
    global.ToPo = {
        init: function () {
            document.getElementById('root').appendChild(greeter());
        }
    }
})(typeof window !== "undefined" ? window : this);