# G3 · 材质与光照

Done：独立材料族、独立颜色/法线/粗糙度数据、固定种子纤维/加工微纹理；四色共享算法；五套可切环境（含v1.0）；低中高画质；OLED亮/灭；默认隐藏材质对照与白/灰标准；选中保留其他实体材质；按part缓存clone并明确资源回收；截图缓冲改为按需重绘。

实际检查：浏览器已建立PBR新场景，未发生应用初始化失败；代码/包络/拆装测试继续通过。四类材料和多角度最终比较、20次变色/切机、画质开销将在G5统一采集，尚不据此宣称摄影级真实性或主流手机性能通过。

Not Done：没有实测BRDF、光谱/IOR与色卡。宝石没有体散射/光谱色散，前玻璃是低成本透明近似，镜片数量仍schematic。不得写“真实光学处方”。

Blockers：物理材料数据缺失；最终材质视觉验收与真实手机门禁未关闭。

Artifact：`MATERIAL_SPEC.md`、`src/core/{materials,surfaceMaps,studio,quality,materialPreview}.js`、`src/core/model.js`；产品菜单“光影与画质”、开发入口`?materials=1`。
