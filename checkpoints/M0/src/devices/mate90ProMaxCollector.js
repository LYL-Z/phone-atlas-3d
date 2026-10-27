import {fact,source} from '../data/sources.js';
export const device={id:'huawei-mate90-collector',brand:'HUAWEI',model:'Mate 90 Pro Max',edition:'典藏版',year:2026,defaultSku:'512 GB',skus:['512 GB','1 TB'],units:{mmPerUnit:10,axes:'X width / Y length / +Z screen'},dimensions:{length:164.5,width:78.7,thickness:8.15},...source('specs'),
 colors:[{id:'green',name:'翡冷翠',shell:'#a6b877',inset:'#668643',metal:'#bfce91'},{id:'rose',name:'玫瑰金',shell:'#cfa58e',inset:'#b6826b',metal:'#e2baa4'},{id:'white',name:'晶钻白',shell:'#d1d3d0',inset:'#bec5c1',metal:'#e4e6e3'},{id:'black',name:'曜石黑',shell:'#373b3b',inset:'#22292a',metal:'#7c8380'}],
 facts:[fact('尺寸','164.5 × 78.7 × 8.15 mm'),fact('重量','约 235 g'),fact('屏幕','6.9 英寸 · 双层 OLED'),fact('分辨率','2848 × 1320'),fact('刷新率','1–120 Hz LTPO'),fact('保护玻璃','玄武昆仑玻璃'),fact('处理器','麒麟 9050 Pro'),fact('运行内存','16 GB'),fact('存储','512 GB / 1 TB'),fact('系统','HarmonyOS 7.0'),fact('电池','6800 mAh 典型 / 6615 mAh 额定'),fact('充电上限','100 W 有线 / 50 W 无线')],
 categories:[{id:'exterior',name:'外装结构'},{id:'imaging',name:'影像系统'},{id:'compute',name:'计算与存储'},{id:'energy',name:'能源与散热'},{id:'connection',name:'外围与连接'}],capabilities:{hinge:null,accessoryMount:'H1-reference-only'},parts:[]};
export function part(id,category,displayName,geometryFactory,config,pos,vector,order,facts=[],notes='',confidence='schematic',src='schematic'){
 return {id,parentId:category,category,displayName,geometryFactory,config,materialPreset:config.material||'metal',assembledTransform:{position:pos,rotation:[0,0,0],scale:[1,1,1]},explodeVector:vector,explodeOrder:order,pickable:true,visible:true,facts, ...source(src), notes, confidence};
}
device.parts=[part('frame','exterior','精密金属中框','frame',{},[0,0,0],[0,0,0],5,[], '整体尺寸按官方规格；圆角和边框截面按图片近似。','inferred','product')];
