/**
 * Created by qiyc on 2017/2/17.
 */
module.exports={
    item:{
        DEBUG:function(menu){
            return {
                name: "Debug",
                click: function (e) {
                    console.info(menu.target);
                    menu.target.getLinks();
                }
            }
        },
        DELETE: function (menu) {
            return {
                name: '删除对象',
                click: function () {
                    menu.scene.remove(menu.target);
                },
                filter: function (target) {
                    return target.getType()!=QTopo.constant.SCENE;
                }
            }
        },
        CREATE:function(menu){
            return {
                name:"创建节点",
                click:function(){
                }
            }
        },
        UPZINDEX:function(menu){
            return {
                name:"提升层级",
                click:function(){
                    menu.scene.toggleZIndex(menu.target);
                }
            }
        },
        DOWNZINDEX:function(menu){
            return {
                name:"降低层级",
                click:function(){
                    menu.scene.toggleZIndex(menu.target,true);
                }
            }
        }
    }
};