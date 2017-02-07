/**
 * Created by qiyc on 2017/2/7.
 */
//一般节点
function Direct(config) {
    var self=this;
    config=$.extend(defaults, config||{});
    self.attr=config;
    self.jtopo = new JTopo.Node();
    //函数
    self.set=setJTopo;
    self.set(config);//初始化
}
module.exports = Direct;

function setJTopo(attr){
    if(attr){
        var jtopo=this.jtopo;
        $.extend(true, this.attr, attr||{});
        if(attr.image){
            setImage(attr.image,this);
        }
        if(attr.textPosition||attr.namePosition){
            setTextPosition(attr.textPosition||attr.namePosition,this);
        }else if(attr.name){
            setTextPosition('Bottom_Center',this);
        }
        if(attr.size){
            jtopo.setSize(attr.size[0], attr.size[1]);
        }
        if(attr.position){
            jtopo.setLocation(attr.position[0], attr.position[1]);
        }
        if(attr.alpha){
            jtopo.alpha=attr.alpha;
        }
    }
}
