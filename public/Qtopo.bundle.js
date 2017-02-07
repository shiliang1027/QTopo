/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	eval("/**\r\n * Created by qiyc on 2017/2/6.\r\n */\r\n//main.js\r\nvar greeter = __webpack_require__(1);\r\n(function (global) {\r\n    global.Qtopo = {\r\n        init: function () {\r\n            document.getElementById('root').appendChild(greeter());\r\n        }\r\n    }\r\n})(typeof window !== \"undefined\" ? window : this);//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9jb3JlL21haW4uanM/NTk3NSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQyIsImZpbGUiOiIwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIENyZWF0ZWQgYnkgcWl5YyBvbiAyMDE3LzIvNi5cclxuICovXHJcbi8vbWFpbi5qc1xyXG52YXIgZ3JlZXRlciA9IHJlcXVpcmUoJy4vdG9vbHMuanMnKTtcclxuKGZ1bmN0aW9uIChnbG9iYWwpIHtcclxuICAgIGdsb2JhbC5RdG9wbyA9IHtcclxuICAgICAgICBpbml0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyb290JykuYXBwZW5kQ2hpbGQoZ3JlZXRlcigpKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0pKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB0aGlzKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2NvcmUvbWFpbi5qc1xuLy8gbW9kdWxlIGlkID0gMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9");

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	eval("/**\r\n * Created by qiyc on 2017/2/6.\r\n */\r\nvar config;\r\n    try{\r\n        config=__webpack_require__(!(function webpackMissingModule() { var e = new Error(\"Cannot find module \\\"topo.config.json\\\"\"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));\r\n    }catch (e){\r\n        try{\r\n            config=__webpack_require__(2);\r\n        }catch (e){\r\n            console.error(\"need topo.config.json\");\r\n        }\r\n    }\r\n\r\nmodule.exports = function() {\r\n    var greet = document.createElement('div');\r\n    greet.textContent = config.config;\r\n    return greet;\r\n};//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9jb3JlL3Rvb2xzLmpzP2NlMjgiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiMS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IHFpeWMgb24gMjAxNy8yLzYuXHJcbiAqL1xyXG52YXIgY29uZmlnO1xyXG4gICAgdHJ5e1xyXG4gICAgICAgIGNvbmZpZz1yZXF1aXJlKFwidG9wby5jb25maWcuanNvblwiKTtcclxuICAgIH1jYXRjaCAoZSl7XHJcbiAgICAgICAgdHJ5e1xyXG4gICAgICAgICAgICBjb25maWc9cmVxdWlyZShcIi4uL3RvcG8uY29uZmlnLmpzb25cIik7XHJcbiAgICAgICAgfWNhdGNoIChlKXtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIm5lZWQgdG9wby5jb25maWcuanNvblwiKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgdmFyIGdyZWV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICBncmVldC50ZXh0Q29udGVudCA9IGNvbmZpZy5jb25maWc7XHJcbiAgICByZXR1cm4gZ3JlZXQ7XHJcbn07XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9jb3JlL3Rvb2xzLmpzXG4vLyBtb2R1bGUgaWQgPSAxXG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdLCJzb3VyY2VSb290IjoiIn0=");

/***/ },
/* 2 */
/***/ function(module, exports) {

	eval("module.exports = {\n\t\"config\": \"Hi there and greetings11111!\"\n};//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi90b3BvLmNvbmZpZy5qc29uPzMyNjQiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBIiwiZmlsZSI6IjIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IHtcblx0XCJjb25maWdcIjogXCJIaSB0aGVyZSBhbmQgZ3JlZXRpbmdzMTExMTEhXCJcbn07XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi90b3BvLmNvbmZpZy5qc29uXG4vLyBtb2R1bGUgaWQgPSAyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdLCJzb3VyY2VSb290IjoiIn0=");

/***/ }
/******/ ]);