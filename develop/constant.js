/**
 * @module QTopo
 */
/**
 * @class QTopo
 * @static
 */
/**
 * 定义的通用常量,一般用getType()来区分元素基本类型,getUseType()区分元素具体类型
 * @property constant
 * @type Object
 * @param SCENE {string}
 * @param CONTAINER {string}
 * @param LINK {string}
 * @param LINE {string}
 * @param NODE {string}
 * @param CASUAL {string} 临时元素，用以元素变换收缩等操作的过渡元素,一般不对其做操作
 * @param node.IMAGE {string}
 * @param node.TEXT {string}
 * @param node.SHAPE {string}
 * @param container.GROUP {string}
 * @param link.CURVE {string}
 * @param link.DIRECT {string}
 * @param link.FLEXIONAL {string}
 * @param link.FOLD {string}
 * @param line.DIRECT {string}
 * @param mode.NORMAL {string}
 * @param mode.EDIT {string}
 * @param mode.DRAG {string}
 * @param mode.SELECT {string}
 * @example
 *      if(node.getType()==QTopo.constant.NODE){.....}
 *      if(node.getUseType()!=QTopo.constant.CASUAL){.....}
 *      if(node.getUseType()==QTopo.constant.node.IMAGE){.....}
 */
module.exports = {
    SCENE:'10',
    CONTAINER:"100",
    LINK:"1000",
    LINE:"1100",
    NODE:'10000',
    CASUAL:"临时工",//
    node:{
        IMAGE:"10010",
        TEXT:"10001",
        SHAPE:"10011"
    },
    container:{
        GROUP:"101"
    },
    link:{
        CURVE:"1001",
        DIRECT:"1002",
        FLEXIONAL:"1003",
        FOLD:"1004"
    },
    line:{
        DIRECT:"1101"
    },
    mode:{
        NORMAL:"normal",
        EDIT:"edit",
        DRAG:"drag",
        SELECT:"select"
    }
};