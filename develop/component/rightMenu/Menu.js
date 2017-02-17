/**
 * Created by qiyc on 2017/2/17.
 */
module.exports = Menu;//菜单对象
require("./rightMenu.css");
function Menu(dom) {
    var self=this;
    self.body = $("<ul class='dropdown-menu'></ul>");
    dom.append(this.body);
    self.item = [];
}
//只调用一次，绑定父菜单切换
Menu.prototype.init=function(scene){
    var self=this;
    self.scene=scene;
    //显示
    scene.on("mouseup",function (e) {
        if(e.button == 2){
            self.body.css({
                left: e.pageX - 20,
                top: e.pageY - 20
            }).show();
            //按钮的事件需要知道触发的对象
            if(e.target){
                self.target=e.target.qtopo;
            }else{
                self.target=scene;
            }
            showItem(self.item, self.target);
        }
    });
    //隐藏
    self.body.on('mouseleave mouseup click', function (e) {
        e.stopPropagation();
        self.body.hide();
    });
};
Menu.prototype.addItem=function(options){
    if(options){
        var item=$("<li><a>"+options.name+"</a></li>");
        if(options.click){
            item.click(options.click);
        }
        this.body.append(item);
        this.item.push({
            body: item,
            type: 'item',
            name: options.name,
            filter: options.filter
        });
    }
};
Menu.prototype.addSubMenu=function(options){
    if(options){
        var item=$("<li class='subMenu'><a>"+options.name+"</a></li>");
        if(options.click){
            item.click(options.click);
        }
        var subMenu=new Menu(item);
        this.body.append(item);
        this.item.push({
            body: item,
            subMenu:subMenu,
            type: 'subMenu',
            name: options.name,
            filter: options.filter
        });
        return subMenu;
    }
};
function showItem(array, target){
    $.each(array, function (i, v) {
        if (v.filter && v.type == 'item') {
            v.filter(target)?v.body.show(): v.body.hide();
        } else if (v.type == 'subMenu') {
            if (v.filter) {
                if (v.filter(target)) {
                    v.body.show();
                    showItem(v.subMenu.item, target);//递归子项
                } else {
                    v.body.hide();
                }
            }else{
                showItem(v.subMenu.item, target);//递归子项
            }
        }


    });
}
