var JTopo=require('./main.js');
//-------工具
require('./tools/util.js')(JTopo);
require('./tools/layout.js')(JTopo);
require('./tools/animate.js')(JTopo);
//-------场景
require('./stage/stage.js')(JTopo);
//-------画布
require('./scene/scene.js')(JTopo);
require('./scene/event.js')(JTopo);
//-------基础元素
require('./base/displayElement.js')(JTopo);
require('./base/interactiveElement.js')(JTopo);
require('./base/editableElement.js')(JTopo);
//-------节点
require('./node/Node.js')(JTopo);
require('./node/TextNode.js')(JTopo);
require('./node/LinkNode.js')(JTopo);
require('./node/CircleNode.js')(JTopo);
require('./node/AnimateNode.js')(JTopo);
require('./node/specialNode.js')(JTopo);
//-------链接
require('./link/Link.js')(JTopo);
require('./link/FlexionalLink.js')(JTopo);
require('./link/FoldLink.js')(JTopo);
require('./link/CurveLink.js')(JTopo);
//-------容器
require('./container/container.js')(JTopo);

window.JTopo = JTopo;
module.exports=JTopo;