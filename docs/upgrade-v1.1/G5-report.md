# G5 · 验收与公开待审交付

Done：四色20张多视角、3组A/B、材料标准场景、390px/降级路径；归一化点与包络指标；本机90秒性能与最小化对照；完整拆装和资源/画质回归；真实下载PNG/JSON；源代码、启动说明、资料/材料/性能/芯片/验收报告、可浏览画册及CI配置。

Not Done：真实Android/HarmonyOS触控和30FPS目标未测；没有实物/色卡/光谱测量一致性认证；高低档90秒长样本与低端GPU长稳未测；芯片独立探索DEFERRED。`ACCEPTANCE.md`逐项保留NOT_TESTED/DEFERRED。

Blockers：无已连接物理手机，HDC返回Empty；四色完整实拍与材料测量数据不足。根据任务书“所有P0 PASS才合并”，**G5未出关，不合并、不部署v1.1、不打正式发布tag**。公开审查分支与Draft PR是本次交付形式，已有main/Pages v1.0不受替换。

Artifact：本目录全部报告、`gallery.html`、`evidence/G1`和`G5`；根README与SOURCE_NOTES/TEST_CHECKLIST；运行`npm start`，画册`http://127.0.0.1:4173/docs/upgrade-v1.1/gallery.html`。源代码压缩包与最终SHA由交付消息和PR提供，避免将自指提交号写进提交自身。

回滚：未合并候选无需改main；本地需查看旧版时可独立检出`af3bfea460677119a8a163249a5ae37c7ec3393b`，或进入保留的`checkpoints/M4`运行。不要在当前有改动的目录中强制reset。
