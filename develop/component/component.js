/**
 * Created by qiyc on 2017/2/16.
 */
var rightMenu=require("./rightMenu/rightMenu.js");
module.exports ={
    //组装
    assemble:function(QtopoInstance){
        rightMenu.init(QtopoInstance.document,QtopoInstance.scene);
    }
};
