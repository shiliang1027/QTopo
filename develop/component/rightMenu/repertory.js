/**
 * Created by qiyc on 2017/2/17.
 */
module.exports={
    item:{
        DEBUG:function(menu){
            return {
                name: "Debug",
                click: function (e) {
                    if(menu.target){
                        console.info(menu.target);
                    }
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
    },
    subMenu:[{
        name:"节点操作",
        item:{
            CREATE:function(menu){
                return {
                    name:"创建图片节点",
                    click:function(){
                        menu.scene.windows.node.image.open({
                            type:"create",
                            position:[menu.x,menu.y]
                        });
                    }
                }
            },
            EDIT:function(menu){
                return {
                    name:"修改图片节点",
                    click:function(){
                        menu.scene.windows.node.image.open({
                            type:"edit",
                            target:menu.target
                        });
                    },
                    filter:function(target){
                        return target&&target.getType()==QTopo.constant.NODE&&target.getUseType()==QTopo.constant.node.IMAGE;
                    }
                }
            }
        }
    }]
};