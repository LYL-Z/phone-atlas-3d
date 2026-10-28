import { sources } from "../data/sources.js";
export function setupControls(store, actions) {
  const $ = (id) => document.querySelector("#" + id);
  $("immersive").onclick=()=>actions.immerse(document.body.dataset.immersive!=="true");
  $("studio").onchange=e=>actions.studio(e.target.value);
  $("quality").onchange=e=>actions.quality(e.target.value);
  $("screen-power").onchange=e=>actions.screen(e.target.checked);
  $("progress").oninput = (e) => actions.scrub(Number(e.target.value));
  $("play").onclick = actions.play;
  $("reset").onclick = actions.reset;
  $("step-back").onclick = () => actions.step(-1);
  $("step-forward").onclick = () => actions.step(1);
  $("speed").onchange = (e) => store.set({ speed: Number(e.target.value) });
  $("mode-solid").onclick = () => actions.go(0);
  $("mode-explode").onclick = () => actions.go(1);
  $("mode-xray").onclick = () => store.set({ xray: !store.get().xray });
  document
    .querySelectorAll("[data-view]")
    .forEach((b) => (b.onclick = () => actions.view(b.dataset.view)));
  $("sku").onchange = (e) => actions.setSku(e.target.value);
  $("screenshot").onclick = actions.screenshot;
  $("export").onclick = actions.export;
  $("device").onchange = (e) => actions.device(e.target.value);
  document
    .querySelectorAll("[data-open]")
    .forEach(
      (b) =>
        (b.onclick = () => (document.body.dataset.drawer = b.dataset.open)),
    );
  document
    .querySelectorAll("[data-close]")
    .forEach((b) => (b.onclick = () => delete document.body.dataset.drawer));
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      delete document.body.dataset.drawer;
      actions.select(null);
    }
  });
  $("sources").onclick = () => $("source-dialog").showModal();
  $("source-list").replaceChildren();
  for (const source of sources) {
    const article = document.createElement("article"),
      a = document.createElement("a"),
      p = document.createElement("p");
    a.href = source.sourceUrl;
    a.target = "_blank";
    a.rel = "noopener";
    a.textContent = source.title + " ↗";
    p.textContent = source.notes;
    article.append(a, p);
    $("source-list").append(article);
  }
  document
    .querySelectorAll("[data-dialog-close]")
    .forEach((b) => (b.onclick = () => b.closest("dialog").close()));
  let guideStep = 0;
  const steps = [
    [
      "把手机握在光里",
      "在模型上拖动旋转，滚轮缩放。手机触控可单指旋转、双指缩放。点击视角按钮，直接查看正面、背面或侧面。",
      '<rect x="24" y="8" width="32" height="64" rx="7"/><path d="M10 30C-3 54 56 67 72 43m-4-5 5 5-5 4"/>',
    ],
    [
      "拆开每一层",
      "拖动底部进度条分层拆解，也可以逐步前进、后退或自动播放。随时暂停、反向重装、变速和还原。",
      '<path d="m40 8 30 15-30 15L10 23Zm-30 30 30 15 30-15M10 53l30 15 30-15"/>',
    ],
    [
      "让每个部件说清楚",
      "点击模型或部件树查看资料，双击模型对焦。每条功能参数和每个示意位置分开标注来源。小屏使用“部件总览”和“部件详情”抽屉。",
      '<circle cx="32" cy="35" r="20"/><path d="m47 50 20 20M32 25v12m0 7v1"/>',
    ],
  ];
  function guide() {
    const [title, copy, art] = steps[guideStep];
    $("guide-title").textContent = title;
    $("guide-copy").textContent = copy;
    $("guide-art").innerHTML = `<svg viewBox="0 0 80 80">${art}</svg>`;
    $("guide-step").textContent = `${guideStep + 1} / 3`;
    $("guide-next").textContent = guideStep === 2 ? "开始探索" : "下一步";
  }
  $("help").onclick = () => {
    guideStep = 0;
    guide();
    $("guide-dialog").showModal();
  };
  $("guide-next").onclick = () => {
    if (guideStep === 2) {
      $("guide-dialog").close();
      try {
        localStorage.setItem("phone-atlas-guide", "1");
      } catch {}
      return;
    }
    guideStep++;
    guide();
  };
  let seen = false;
  try {
    seen = localStorage.getItem("phone-atlas-guide") === "1";
  } catch {}
  if (!seen) {
    guide();
    $("guide-dialog").showModal();
  }
  let lastTick = -1;
  return {
    sync(s) {
      $("progress").value = String(s.t);
      $("progress-output").textContent = Math.round(s.t * 100) + "%";
      $("play").setAttribute("aria-label", s.playing ? "暂停动画" : "播放拆解");
      $("play").querySelector("span").textContent = s.playing
        ? "暂停"
        : s.t >= 1
          ? "重新装配"
          : "自动拆解";
      $("play")
        .querySelector("path")
        .setAttribute("d", s.playing ? "M8 5v14M16 5v14" : "m9 5 10 7-10 7Z");
      $("mode-xray").classList.toggle("active", s.xray);
      $("mode-xray").setAttribute("aria-pressed", String(s.xray));
      $("mode-solid").classList.toggle("active", !s.xray && s.t < 0.01);
      $("mode-explode").classList.toggle("active", !s.xray && s.t >= 0.01);
      const names = {
        ASSEMBLED: "整体装配",
        EXPLODING: "分层展开",
        EXPLODED: "完整分层",
        FOCUSED: "部件聚焦",
        REASSEMBLING: "还原装配",
      };
      $("state-caption").textContent = names[s.status];
      const tick = Math.min(4, Math.floor(s.t * 5));
      if (tick !== lastTick) {
        $("stage-caption").textContent = [
          "整体装配 · 外观探索",
          "外壳与玻璃 · 展开外装",
          "连接与热管理 · 分离辅助层",
          "能源与影像 · 查看核心模组",
          "计算与中框 · 完整工程示意",
        ][tick];
        lastTick = tick;
      }
    },
  };
}
