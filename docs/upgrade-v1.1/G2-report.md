# G2 · 外观几何

Done：配置化圆角截面和多段金属台阶；背盖独立曲面与嵌合边；端面真实挖孔、凹入USB舌片/声孔/SIM；按官方侧视调整侧键局部位置；悬浮星环独立肩部/金属加工圈/宝石截面/胶圈/开孔面板/中心饰盖；曲面光学表面替换全部固定球/圆片亮片；前盖边缘分段曲面。合批保留submeshRoles，31部件ID及所有装配/拆解变换未改。

验证：`node --experimental-loader ./tests/three-loader.mjs tests/geometry-check.mjs`通过四色中框包络与坐标有限值、冻结变换契约；`npm test`6项通过，build通过。新几何已在浏览器实际建立。星环直径从63.6mm改为约59.8mm，中饰盖直径由22mm改为25.6mm，均为照片推断，非机械测量。

Not Done：G2只能确认几何工程项，第四色/多角度最终视觉PASS须在G3材质落地后统一记录于G5；当前使用旧材质观察的黄色平涂效果不视为材质质量达标。光学处方、密封深度、内部装配仍schematic，未把照片变成维修测绘。

Blockers：独立材料实测与实体多角度误差认证不可得。下一阶段只补材料和摄影棚，G5保持这些验收边界，不将本报告作为合并许可。

Artifact：`src/devices/exteriorProfiles.js`、`src/factories/profileGeometry.js`、body/cameraFactory；`tests/geometry-check.mjs`。性能与最终画面待G3/G5。
