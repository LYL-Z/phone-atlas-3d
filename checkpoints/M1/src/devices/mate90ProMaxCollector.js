import {fact,source} from '../data/sources.js';
export const device={id:'huawei-mate90-collector',brand:'HUAWEI',model:'Mate 90 Pro Max',edition:'典藏版',year:2026,defaultSku:'512 GB',skus:['512 GB','1 TB'],units:{mmPerUnit:10,axes:'X width / Y length / +Z screen'},dimensions:{length:164.5,width:78.7,thickness:8.15},...source('specs'),
 colors:[{id:'green',name:'翡冷翠',shell:'#a6b877',inset:'#668643',metal:'#bfce91'},{id:'rose',name:'玫瑰金',shell:'#cfa58e',inset:'#b6826b',metal:'#e2baa4'},{id:'white',name:'晶钻白',shell:'#d1d3d0',inset:'#bec5c1',metal:'#e4e6e3'},{id:'black',name:'曜石黑',shell:'#373b3b',inset:'#22292a',metal:'#7c8380'}],
 facts:[fact('尺寸','164.5 × 78.7 × 8.15 mm'),fact('重量','约 235 g'),fact('屏幕','6.9 英寸 · 双层 OLED'),fact('分辨率','2848 × 1320'),fact('刷新率','1–120 Hz LTPO'),fact('保护玻璃','玄武昆仑玻璃'),fact('处理器','麒麟 9050 Pro'),fact('运行内存','16 GB'),fact('存储','512 GB / 1 TB'),fact('系统','HarmonyOS 7.0'),fact('电池','6800 mAh 典型 / 6615 mAh 额定'),fact('充电上限','100 W 有线 / 50 W 无线')],
 categories:[{id:'exterior',name:'外装结构'},{id:'imaging',name:'影像系统'},{id:'compute',name:'计算与存储'},{id:'energy',name:'能源与散热'},{id:'connection',name:'外围与连接'}],capabilities:{hinge:null,accessoryMount:'H1-reference-only'},parts:[]};
export function part(id,category,displayName,geometryFactory,config,pos,vector,order,facts=[],notes='',confidence='schematic',src='schematic'){
 return {id,parentId:category,category,displayName,geometryFactory,config,materialPreset:config.material||'metal',assembledTransform:{position:pos,rotation:[0,0,0],scale:[1,1,1]},explodeVector:vector,explodeOrder:order,pickable:true,visible:true,facts, ...source(src), notes, confidence};
}
const external=(id,name,factory,pos,vector,order,facts=[],config={})=>part(id,'exterior',name,factory,config,pos,vector,order,facts,'外观以官方图片及附件校准；局部厚度、圆角、孔径为比例近似。','inferred','product');
const imaging=(id,name,pos,vector,facts,config={})=>part(id,'imaging',name,'lens',config,pos,vector,3,facts,'功能参数官方确认；外露镜头位置按图近似。镜片层数、封装厚度与内部光路仅作工程示意。','inferred','specs');
device.parts=[
 external('frame','精密金属中框','frame',[0,0,0],[0,0,0],5,[fact('机身包络','164.5 × 78.7 × 8.15 mm')]),
 external('back','晶格纹理背盖','back',[0,0,-.368],[0,0,-8],0,[fact('官方配色','翡冷翠 / 玫瑰金 / 晶钻白 / 曜石黑','sku')]),
 external('front-glass','玄武昆仑玻璃','frontGlass',[0,0,.386],[0,0,7],0,[fact('保护玻璃','玄武昆仑玻璃')]),
 external('oled','双层 OLED 显示模组','oled',[0,0,.31],[0,0,5.5],1,[fact('面板','6.9 英寸 · 双层 OLED'),fact('刷新率','1–120 Hz LTPO'),fact('分辨率','2848 × 1320')]),
 external('buttons','侧键与天线断点','buttons',[0,0,0],[2.6,0,0],4,[fact('功能','音量键 / 电源与侧边指纹')]),
 external('ports','USB-C 与声学开孔','ports',[0,0,0],[0,-2.4,0],4,[fact('接口','USB Type-C · USB 3.1 Gen 1')]),
 external('sim','SIM 卡托','sim',[0,0,0],[-2,-1.2,0],2,[fact('卡型','双 nano SIM，支持 eSIM')]),
 external('island','星环与 XMAGE 饰盖','island',[0,4.75,-.535],[0,0,-8],0,[]),
 external('lens-cover','镜头保护玻璃边缘','lensCover',[0,4.75,-.84],[0,0,-9.5],0,[]),
 imaging('main-camera','5000 万像素主摄',[1.98,4.75,-.64],[2.8,0,-4.8],[fact('像素','5000 万像素'),fact('光圈','F1.4–F4.0 可变光圈'),fact('防抖 / 阵列','OIS / RYYB')],{r:.48}),
 imaging('ultrawide','4000 万像素超广角',[0,6.66,-.64],[0,1.3,-4.8],[fact('像素','4000 万像素'),fact('光圈 / 阵列','F2.2 / RYYB')],{r:.38}),
 imaging('telephoto','2 亿像素长焦',[-1.98,4.75,-.64],[-2.8,0,-4.8],[fact('像素','2 亿像素'),fact('光圈 / 防抖','F2.6 / OIS'),fact('功能','长焦微距 / RYYB')],{r:.5,periscope:true}),
 imaging('redmaple','第三代红枫原色摄像头',[-1.02,6.49,-.64],[-1.4,1.4,-4.8],[fact('代际','第三代红枫原色摄像头')],{r:.18}),
 part('flash','imaging','LED 闪光灯','flash',{},[0,2.68,-.78],[0,-.8,-4.8],3,[fact('类型','LED 闪光灯')],'位置按图近似。','inferred','specs'),
 imaging('front-camera','前摄与 3D 深感组件',[0,7.58,.15],[0,1.2,3.6],[fact('前置','1300 万像素超广角，F2.0'),fact('辅助','3D 深感摄像头')],{r:.18})
];
