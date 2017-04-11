/**
 * @module component
 */
/**
 * 工具条模块
 * @class toolBar
 * @static
 */
require("./toolBar.css");
var toolBar = require("./toolBar.html");
var selectResult = require("./selectResult.html");
module.exports = {
    init: init
};
function init(instance,config) {
    config=config||{};
    var dom = instance.document;
    var scene = instance.scene;
    var wrap = $(dom).find(".qtopo-toolBar");
    if (wrap.length == 0) {
        wrap = $("<div class='qtopo-toolBar'></div>");
        $(dom).append(wrap);
    }
    toolBar = $(toolBar);
    editBar = toolBar.find(".edit-children");
    selectResult = $(selectResult).hide();
    wrap.append(toolBar);
    wrap.append(selectResult);
    wrap.find("[data-toggle*='tooltip']").tooltip();//开启提示框
    //切换模式和子菜单栏显示位置
    wrap.find("[name=topo_mode]").click(function (e) {
        var mode = $(this).find("input").val();
        scene.setMode(mode);
        if (mode == "normal") {
            editBar.show();
        } else {
            editBar.hide();
        }
    });
    /**
     * 调用scene.goCenter()缩放和居中展示
     * @property 居中展示
     */
    toolBar.find("button[name=center]").click(function () {
        scene.goCenter();
    });
    /**
     * 调用scene.resize(1)还原比例
     * @property 正常显示
     */
    toolBar.find("button[name=common]").click(function () {
        scene.resize(1);
    });
    /**
     * 调用scene.toggleZoom()开启鼠标缩放,操作鼠标滚轮放大和缩小图层
     * @property 鼠标缩放
     */
    toolBar.find("button[name=zoom_checkbox]").click(function () {
        scene.toggleZoom();
    });
    /**
     * 调用scene.toggleEagleEye()切换鹰眼
     * @property 鹰眼
     */
    toolBar.find("button[name=eagle_eye]").click(function () {
        scene.toggleEagleEye();
    });
    /**
     * 调用scene.getPicture()新窗口打开图层截图
     * @property 导出png
     */
    toolBar.find("button[name=export_image]").click(function () {
        scene.getPicture();
    });
    var doSave=function(e){
        var w = window.open('about:blank', 'SaveData');
        w.document.write(JSON.stringify(instance.toJson()));
    };
    toolBar.find("button[name=save]").click(function(e){
            doSave(e);
    });
    /**
     * 开启自动布局设置窗口,需要载入windows模块
     * @property 自动布局
     */
    editBar.find("button[name=auto_layout]").click(function () {
        if($.isFunction(instance.open)){
            instance.open("autoLayout");
        }else{
            QTopo.util.error("The autoLayout window need init windows conponent!");
        }
    });
    var addSearch = initSearchMode(instance, scene, toolBar, selectResult);
    if (!config.hideDefaultSearch) {
        addSearch({
            type: "value",
            name: "default",
            hideResult: false,
            search: function (val) {
                return scene.find(val, "node")
                    .map(function (i) {
                        return {
                            content: i.attr.name,
                            target: i
                        }
                    });
            },
            clickResult: function (result) {
                if (result.target) {
                    scene.moveToNode(result.target);
                }
            }
        });
    }
    return {
        /**
         * 添加搜索模块
         * @method addSearch
         * @param searchMode {object|array} 搜索模块配置，可为配置集合
         *  @param searchMode.name 显示在选择框中的名称
         *  @param searchMode.type  唯一标识
         *  @param [searchMode.selected] 是否初始被选中
         *  @param [searchMode.search] 回车或点击搜索按钮时的事件处理,传入的参数为Input的输入值，返回参数content属性为结果面板中展示的内容
         *  @param [searchMode.hideResult] 是否启用结果面板
         *  @param [searchMode.clickResult] 结果面板被选中后的事件处理,传入的参数为search的结果
         *  @example
         *      instance.setComponent({
                    toolBar: {
                        addSearch:[
                            {   //自定义的搜索配置，该搜索不调用预定义的任何事件
                                //自定义了额外面板展示,工具条上条目仅用来触发额外的搜索面板
                                type:"deviceType",
                                name:"设备型号",
                                hideResult:true
                            },
                            {//默认的搜索模块配置,可以初始化时 hideDefaultSearch: true禁止加载
                               type: "value",
                               name: "default",
                               hideResult: false,
                               search: function (val) {//val值为Input内容
                                   return scene.find(val, "node")
                                       .map(function (i) {
                                           return {
                                               content: i.attr.name,//该属性用以展示文字
                                               target: i //自定义
                                           }
                                       });
                               },
                               clickResult: function (result) {
                                   if (result.target) {//此处target为search结果中设置，content属性被用以展示文字
                                       scene.moveToNode(result.target);
                                   }
                               }
                           }
                        ]
         */
        addSearch: addSearch,
        /**
         * 配置点击保存按钮时事件处理,重复设置会替换上次设置
         *
         * 默认动作为序列化当前图层信息并打开新页面展示
         * @method save
         * @param fn {function}
         * @example
         *       instance.setComponent({
                    toolBar: {
                         save: function (e) {//e事件对象
                                ...
                         }
                    }
             })
         */
        save: function(fn) {
            if ($.isFunction(fn)) {
                doSave=fn;
            }
        }
    };
}

/*
 * 添加搜索模块
 * @param instance
 * @param scene
 * @param toolBar
 * @param resultWin 搜索结果展示区
 * @returns {Function}返回添加搜索方式的接口
 */
function initSearchMode(instance, scene, toolBar, resultWin) {
    var resultSelect = resultWin.find(".result-select");
    var resultShow = resultWin.find(".result-show");
    var selectWin = toolBar.find("select[name=search_mode]");
    var searchBtn = toolBar.find("button[name=search]");
    var input = toolBar.find("input[name=search_value]");
    var clear = toolBar.find(".clear-input");
    var inputGroup = toolBar.find(".t-search-input");
    selectWin.data("searchMode", {});
    clear.hide();
    clear.click(function () {
        input.val("");
        clear.hide();
        resultWin.hide();
    });
    selectWin.change(function () {
        showGroup();
        clear.click();
    });
    input.keydown(function (e) {
        if (e.keyCode == 13) {
            doSearch();
        }
        clear.show();
    });
    searchBtn.click(function () {
        doSearch();
    });
    resultSelect.click(function () {
        resultShow.toggle();
    });
    resultShow.click(function (e) {
        if (e.target) {
            $(e.target).data("doResult")();
        }
    });
    resultShow.on('mouseleave', function (e) {
        e.stopPropagation();
        resultShow.hide();
    });
    function doSearch() {
        resultWin.hide();
        var searchConfig = selectWin.data("searchMode")[selectWin.val()];
        if ($.isFunction(searchConfig.search)) {
            var results = searchConfig.search(input.val());
            if (!searchConfig.hideResult) {
                addResult(results, searchConfig.clickResult);
            }
        }
    }

    function addResult(results, click) {
        if ($.isArray(results) && results.length > 0) {
            resultShow.empty();
            $.each(results, function (i, result) {
                var li = $("<li title='" + result.content + "'>" + result.content + "</li>")
                    .data('doResult', function () {
                        if ($.isFunction(click)) {
                            click(result);
                        }
                    });
                resultShow.append(li);
            });
            resultWin.show();
        } else {
            instance.open("view", {
                content: "无查询结果!",
                width: 200
            });
        }
    }
    var showTime;
    function showGroup() {
        clear.attr("style","opacity: 1");
        selectWin.attr("style","display: block");
        input.attr("style","display: block");
        inputGroup.attr("style","width: 180px");
        if(showTime){
            clearTimeout(showTime);
        }
        showTime=setTimeout(function () {
            clear.attr("style","");
            selectWin.attr("style","");
            input.attr("style","");
            inputGroup.attr("style","");
        },3000);
    }

    return function (search) {
        if ($.isArray(search)) {
            search.map(function (i) {
                addSearch(i);
            });
        } else {
            addSearch(search);
        }

        return instance;
        function addSearch(config) {
            if (config) {
                selectWin.data("searchMode")[config.type] = config;
                selectWin.prepend("<option value='" + config.type + "' " + (config.selected ? 'selected' : '') + ">" + config.name || config.type + "</option>");
            }
        }
    }
}