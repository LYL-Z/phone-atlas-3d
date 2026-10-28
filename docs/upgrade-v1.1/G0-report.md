# G0 — 冻结现状

Done：2026-10-27 完整阅读升级任务书与11张附件，核对本地和 origin/main 均为 af3bfea460677119a8a163249a5ae37c7ec3393b。建立 feature/v1.1-material-fidelity。用户新任务书保持私有未跟踪，历史 M0–M4 不删除。

基线 npm test：6/6 PASS；npm run build：PASS。原31个部件ID、配置、装配及拆解向量保存为 evidence/baseline/device.json；既有截图及浏览器测试保留在 evidence/baseline/，这些截图是历史记录，不冒充本轮实时测量。

| 基线问题 | 文件级修改 | 参数依据/保护项 |
|---|---|---|
| 平截面中框/薄平背盖/贴片孔位 | factories/bodyFactory.js、geometry.js | 官方总包络；照片关键点区间；保留31 ID及装配坐标 |
| 锦纤呈金属，颜色纹理充当高度 | render/proceduralTextures.js、materialLibrary.js | 官方介电材质类别，颜色/法线/粗糙度分别生成；数值是调试近似 |
| 硬圆环及静态球/圆片反光 | factories/cameraFactory.js | 独立基座/阶梯环/密封/曲面镜片；删掉假亮片 |
| RoomEnvironment 已存在，但缺少可控棚光 | render/studioEnvironment.js、core/scene.js | 保留基线，4种环境光卡；标准白灰金属样片 |
| 选中导致全模型透明与shader变动 | core/model.js、app.js、ui/labels.js | 显式X-ray保留；选中弱轮廓；资源有唯一所有者 |
| 1–3.8FPS受调度影响，不能直接归因GPU | tests/performance-benchmark/、core/profiler.js | 30s静止+30s旋转+30s拆解，无截图；记录焦点/可见性与分阶段计时 |
| 芯片图出处/三维尺度未核实 | docs/upgrade-v1.1/CHIP_EVIDENCE.md | 独立概念层，禁止搬到实机PCB；参数不升级为官方 |

性能基准先记录每阶段CPU跨度和Chrome trace格式的时间轨迹，形成可复核火焰图；GPU计时/GC若浏览器不提供，记unavailable。剖析后才调整热路径，不以猜测替代证据。桌面前台/后台分开；真机需要实际连接设备，不用390px模拟替代。

Not Done：G1资料校准与前台基准、G2–G5。

Blockers：暂无影响G0的阻断；真机是否可接入待在G1只读探测。

Artifact：本目录、evidence/baseline/；回滚依据af3bfea。主干不变，G5全部P0通过前不合并、不改变正式Pages。
