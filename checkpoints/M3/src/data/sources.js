export const verifiedAt='2026-10-27';
export const sources=[
 {id:'specs',title:'华为 · 典藏版规格参数',sourceUrl:'https://consumer.huawei.com/cn/phones/mate90-pro-max/specs/',sourceType:'manufacturer',confidence:'official',verifiedAt,notes:'本轮读取：区分普通版与典藏版。功能确认不代表几何测绘。'},
 {id:'product',title:'华为 · 产品介绍及外观',sourceUrl:'https://consumer.huawei.com/cn/phones/mate90-pro-max/',sourceType:'manufacturer',confidence:'official',verifiedAt,notes:'本轮读取，图片用于人工对照。'},
 {id:'sku',title:'华为 · Mate 90 系列购买指引',sourceUrl:'https://consumer.huawei.com/cn/support/content/zh-cn16119533/',sourceType:'manufacturer',confidence:'official',verifiedAt,notes:'本轮读取型号、存储及四色。'},
 {id:'features',title:'华为 · 系列卖点',sourceUrl:'https://consumer.huawei.com/cn/support/content/zh-cn16119534/',sourceType:'manufacturer',confidence:'official',verifiedAt,notes:'本轮读取，系列表述需注意适用机型。'},
 {id:'appearance',title:'附件 · 典藏版外观标注图',sourceUrl:'https://consumer.huawei.com/cn/support/content/zh-cn16119818/',sourceType:'user_supplied_reference',confidence:'inferred',verifiedAt,notes:'本地图片已查看；原支持页本轮无法读取。仅作外观比例、孔位参考。'},
 {id:'z10',title:'华为 · 睿影 Z10 规格',sourceUrl:'https://consumer.huawei.com/cn/accessories/xmage-z10-modular-camera/specs/',sourceType:'manufacturer',confidence:'official',verifiedAt,notes:'可选外接模块；本版仅资料说明，不画成固定镜头。'},
 {id:'weki',title:'WekiHome · 用户提供拆机参考',sourceUrl:'https://www.bilibili.com/video/BV1rRpy6XEDF/',sourceType:'user_supplied_reference',confidence:'schematic',verifiedAt,notes:'仅查看本地封面和低清截图，未观看原视频；包含 Pro Max / RS 对照，不认证典藏版精确结构。'},
 {id:'schematic',title:'项目 · 工程示意说明',sourceUrl:'./SOURCE_NOTES.md',sourceType:'engineering_illustration',confidence:'schematic',verifiedAt,notes:'结构仅解释硬件功能与装配层次，未获得典藏版测绘。'}
];
export const source=id=>{const {id:sourceId,...evidence}=sources.find(s=>s.id===id);return {sourceId,...evidence};};
export const fact=(label,value,id='specs')=>({label,value,...source(id)});
export const confidenceNames={official:'官方确认',teardown_verified:'拆机验证',inferred:'合理推断',schematic:'示意建模'};
