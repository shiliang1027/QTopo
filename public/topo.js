/**
 * Created by qiyc on 2017/2/28.
 */
var images = [
    "img/mo/eNodeB.png", "img/mo/eNodeB_1.png", "img/mo/eNodeB_2.png", "img/mo/eNodeB_3.png", "img/mo/eNodeB_4.png",
    "img/mo/eNodeB.png", "img/mo/eNodeB_1.png", "img/mo/eNodeB_2.png", "img/mo/eNodeB_3.png", "img/mo/eNodeB_4.png",
    "img/mo/eNodeB.png", "img/mo/eNodeB_1.png", "img/mo/eNodeB_2.png", "img/mo/eNodeB_3.png", "img/mo/eNodeB_4.png",
    "img/mo/eNodeB.png", "img/mo/eNodeB_1.png", "img/mo/eNodeB_2.png", "img/mo/eNodeB_3.png", "img/mo/eNodeB_4.png",
    "img/mo/eNodeB.png", "img/mo/eNodeB_1.png", "img/mo/eNodeB_2.png", "img/mo/eNodeB_3.png", "img/mo/eNodeB_4.png",
    "img/mo/eNodeB.png", "img/mo/eNodeB_1.png", "img/mo/eNodeB_2.png", "img/mo/eNodeB_3.png", "img/mo/eNodeB_4.png",
    "img/mo/eNodeB.png", "img/mo/eNodeB_1.png", "img/mo/eNodeB_2.png", "img/mo/eNodeB_3.png", "img/mo/eNodeB_4.png",
    "img/mo/eNodeB.png", "img/mo/eNodeB_1.png", "img/mo/eNodeB_2.png", "img/mo/eNodeB_3.png", "img/mo/eNodeB_4.png",
    "img/mo/eNodeB.png", "img/mo/eNodeB_1.png", "img/mo/eNodeB_2.png", "img/mo/eNodeB_3.png", "img/mo/eNodeB_4.png",
    "img/mo/eNodeB.png", "img/mo/eNodeB_1.png", "img/mo/eNodeB_2.png", "img/mo/eNodeB_3.png", "img/mo/eNodeB_4.png",
    "img/mo/eNodeB.png", "img/mo/eNodeB_1.png", "img/mo/eNodeB_2.png", "img/mo/eNodeB_3.png", "img/mo/eNodeB_4.png",
    "img/mo/eNodeB.png", "img/mo/eNodeB_1.png", "img/mo/eNodeB_2.png", "img/mo/eNodeB_3.png", "img/mo/eNodeB_4.png",
    "img/mo/eNodeB.png", "img/mo/eNodeB_1.png", "img/mo/eNodeB_2.png", "img/mo/eNodeB_3.png", "img/mo/eNodeB_4.png",
    "img/mo/eNodeB.png", "img/mo/eNodeB_1.png", "img/mo/eNodeB_2.png", "img/mo/eNodeB_3.png", "img/mo/eNodeB_4.png",
    "img/mo/eNodeB.png", "img/mo/eNodeB_1.png", "img/mo/eNodeB_2.png", "img/mo/eNodeB_3.png", "img/mo/eNodeB_4.png",
    "img/mo/eNodeB.png", "img/mo/eNodeB_1.png", "img/mo/eNodeB_2.png", "img/mo/eNodeB_3.png", "img/mo/eNodeB_4.png",
    "img/mo/eNodeB.png", "img/mo/eNodeB_1.png", "img/mo/eNodeB_2.png", "img/mo/eNodeB_3.png", "img/mo/eNodeB_4.png",
    "img/mo/eNodeB.png", "img/mo/eNodeB_1.png", "img/mo/eNodeB_2.png", "img/mo/eNodeB_3.png", "img/mo/eNodeB_4.png",
    "img/mo/eNodeB.png", "img/mo/eNodeB_1.png", "img/mo/eNodeB_2.png", "img/mo/eNodeB_3.png", "img/mo/eNodeB_4.png",
    "img/mo/eNodeB.png", "img/mo/eNodeB_1.png", "img/mo/eNodeB_2.png", "img/mo/eNodeB_3.png", "img/mo/eNodeB_4.png"
];
$(document).ready(function () {
    //使用QTopo先用init生成一个QTopo对象，要传入一个设好长宽的dom
    var topo = QTopo.init(document.getElementById("topo_base"),{
        backgroundColor:"#06243e"
    });
    var scene=topo.scene;
    var component=topo.component;
    var tools=component.tools;
    tools.setImageSelect(images);//初始化图片选择窗口内容
    tools.progress.open({state: 10, info: '正在读取'});
    //设置鼠标提示框显示内容，以及响应的元素
    tools.tips.open(function(target){
        return "<div> name: " + target.val("name") + "</div>" + "<div> id: " + target.val("id") + "</div>";
    },function(target){
        return target.getType()==QTopo.constant.NODE;
    });
    //自动设置大小
    $(window).resize(function(){
        topo.resize();
    });
    //init返回一个QTopo对象，可用该对象的setOption方法绘图
    var dataUrl="./data/data.json";
    var alarmUrl="./data/alarm.json";
    //自定义获取数据，Qtopo只管根据setOption内的参数绘图
    var table=$("#alarm_detail");
    function test(data){
        //data.node=[];
        //data.link=[];
        //data.container=[];
        data.node.push({
            position:[-200,-200],
            size:[100,100],
            id:11111
        },
            {
                position:[400,100],
                id:22222,
                size:[100,100]
            });
        data.link.push({
            start:11111,
            end:22222,
            width:10,
            radius:25,
            arrow:{
                end:true,
                start:true,
                size:10
            },
            type:QTopo.constant.link.FLEXIONAL
        });
    }
    $.ajax(dataUrl).done(function(data){
        $.ajax(alarmUrl).done(function(alarm){
            var myData=getTopoData(data, alarm);
            test(myData);
            //正式绘制topo图，传入参数绘图,setOption 接受2个参数，第一个为图的绘制，第2个为boolean类型,true则清空当前图重绘，false则在原图上添加,默认为false
            topo.setOption({
                node: {
                    style:{
                        size:[60,60],
                        image: "img/node.png",
                        font:{
                        }
                    },
                    value: ["id", "pid", "alarmId"],//value属性决定 将把data中各个节点对象的哪些属性额外挂在节点上
                    data: myData.node //数组，每个成员为一个节点
                },
                container: {
                    style:{
                        color:"#165782",
                        alpha:0.3,
                        border:{
                            radius:10
                        },
                        namePosition:"top"
                    },
                    children: "id",//这个决定了 每个分组根据data中的数据查找该加入的子,该属性应在node中的value中有配置
                    value: ["id", "pid"],
                    data: myData.container//数组 每个成员为一个分组，成员的data属性表明要检索的属性对应的子，如children设定为id,那么data数组内的数据该是对应的id值以查找
                    // 分组中可单独设置children属性指明该分组按什么属性查找插入的子。
                },
                link: {
                    style:{
                        color:"#00FFFF"
                    },
                    path: ["id"],//决定了线的起始节点由什么属性决定,数组长度为1则起始节点按统一属性查找，可分别设不同，0为起始节点属性.1为终点,该属性应在node中的value中有配置
                    value: ["pid"],
                    data: myData.link//数组，每个成员表明一条线，线的start和end的值应对应path中的设定
                },
                alarm: {
                    node: "alarmId",//指明节点上对应的查找属性,该属性应在node中的value中有配置,暂只支持节点告警
                    data: myData.alarm,
                    animate:{//可设置动画，每个点亮之间延迟多少毫秒，回调函数中能获取到点亮的节点信息
                        time:1000,
                        callBack:function(node){
                            var tr=$("<tr><td>"+node.attr.name+"</td><td>"+node.attr.alarm.text+"</td></tr>");
                            var name=$('<div>'+node.attr.name+'</div>');
                            tr.click(function(){
                                tools.view.open({
                                    content:name,
                                    width:500
                                });
                            });
                            table.append(tr);
                        }
                    }
                }
            });
        });
    });
    setTimeout(function(){
        tools.progress.open({state: 100, info: '已完成'});
    },3000);

    function getTopoData(data, alarm) {
        //这部分是构造数据，怎么获取数据自己定义，只要调用topo对象的setOption方法塞入对应的数据就行
        alarm = QTopo.util.toJson(alarm);
        data = QTopo.util.toJson(data);
        var node = data.WebTopo.NetView.Nodes.Node;
        var group = data.WebTopo.NetView.Groups.Group;
        var link = data.WebTopo.NetView.Links.Link;

        var fixX = parseInt(data.WebTopo.NetView.XY["@iMinX"]);
        var fixY = parseInt(data.WebTopo.NetView.XY["@iMinY"]);

        //构造节点数据
        //这部分是根据传来的json对象进行取值,具体需要哪些值看你想设哪些属性
        var nodeData = [];
        $.each(node, function (i, v) {
            var newNode = {
                name: v["@name"],
                position: [parseInt(v["@x"]) + fixX, parseInt(v["@y"]) + fixY],
                id: v["@id"],
                pid: v["@pid"]
            };
            if (v.p) {
                $.each(v.p, function (i, v) {
                    if (v["@k"] == "mo_id") {
                        newNode.alarmId = v["$"];
                    }
                });
            }
            nodeData.push(newNode);
        });
        //添加object数据到节点里
        var object = data.WebTopo.NetView.Objects.Object;
        nodeData.push({
            name: object["@name"],
            position: [parseInt(object["@x"]) + fixX, parseInt(object["@y"]) + fixY],
            id: object["@id"],
            pid: object["@pid"]
        });
        //构造分组数据
        var containerData = [];
        $.each(group, function (i, v) {
            var data = [];
            if ($.isArray(v["Node"])) {
                $.each(v["Node"], function (j, k) {
                    data.push(k["@id"]);
                });
            } else {
                data.push(v["Node"]["@id"]);
            }
            containerData.push({
                id: v["@id"],
                pid: v["@pid"],
                name: v["@name"],
                data: data,
                toggle:{
                    name:v["@name"],
                    image: "img/node.png"
                }
            });
        });
        //构造链接数据
        var linkData = [];
        $.each(link, function (i, v) {
            linkData.push({
                pid: v["@pid"],
                start: v["@from"],
                end: v["@to"]
            });
        });
        //构造告警
        var alarmData = [];
        var alarmColor = ["255,0,0", "255, 102, 0", "255,204,0", "0,0,255"];
        $.each(alarm, function (i, v) {
            alarmData.push({
                node: v["alarmneid"],
                color: alarmColor[v["alarmcolor"]],
                text:v["alarmcnt"]
            });
        });
        return {
            node:nodeData,
            link:linkData,
            container:containerData,
            alarm:alarmData
        }
    }
});