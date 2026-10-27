import * as THREE from "three";
import { genericDevice } from "./devices/genericTestDevice.js";
import { createScene } from "./core/scene.js";
import { createModel } from "./core/model.js";
import { createStore } from "./core/stateStore.js";
import { createAnimator, clamp, statusAt } from "./core/animator.js";
import { createCameraController } from "./core/camera.js";
import { createPicking } from "./core/picking.js";
import {
  registerDevice,
  listDevices,
  getDevice,
} from "./core/modelRegistry.js";
import { device as collector } from "./devices/mate90ProMaxCollector.js";
import { createTree } from "./ui/componentTree.js";
import { createInfo } from "./ui/infoPanel.js";
import { createLabels } from "./ui/labels.js";
import { setupControls } from "./ui/controls.js";
registerDevice(collector);
registerDevice(genericDevice);
const viewport = document.querySelector("#viewport");
const engine = createScene(viewport),
  store = createStore(),
  camera = createCameraController(engine, viewport);
const reducedQuery = matchMedia("(prefers-reduced-motion: reduce)");
let reduced = reducedQuery.matches;
reducedQuery.addEventListener("change", (e) => (reduced = e.matches));
let device = collector,
  model,
  animator,
  tree,
  info,
  labels,
  controls,
  sku = collector.defaultSku,
  color = collector.colors[0],
  pendingFocus = false;
let unsubscribe;
let modelRevision = 0;
const $ = (id) => document.querySelector("#" + id);
function toast(text) {
  $("toast").textContent = text;
  $("toast").hidden = false;
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => ($("toast").hidden = true), 2600);
}
function download(blob, name) {
  const url = URL.createObjectURL(blob),
    a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function refreshRegistry() {
  $("device").replaceChildren();
  for (const d of listDevices())
    $("device").add(new Option(`${d.brand} · ${d.model} ${d.edition}`, d.id));
  $("device").value = device.id;
}
function style(s) {
  if (!model) return;
  for (const original of model.styleMaterials) {
    const { mat, id, category } = original;
    const xray = s.xray && category === "exterior";
    const muted = s.selected && s.selected !== id;
    mat.opacity = xray
      ? Math.min(0.12, original.opacity)
      : muted
        ? Math.min(0.25, original.opacity)
        : original.opacity;
    const transparent = xray || Boolean(muted) || original.transparent;
    if (mat.transparent !== transparent) {
      mat.transparent = transparent;
      mat.needsUpdate = true;
    }
    mat.depthWrite = xray || muted ? false : original.depthWrite;
    if (mat.emissive) {
      if (s.selected === id) {
        mat.emissive.set("#8aab4d");
        mat.emissiveIntensity = 0.28;
      } else if (s.hover === id) {
        mat.emissive.set("#a1bd7b");
        mat.emissiveIntensity = 0.08;
      } else {
        mat.emissive.copy(original.emissive);
        mat.emissiveIntensity = original.intensity;
      }
    }
  }
}
function focus() {
  const s = store.get();
  if (s.selected && model.groups.get(s.selected)?.visible)
    camera.focus(
      model.groups.get(s.selected),
      device.parts.find((p) => p.id === s.selected),
    );
}
function go(target) {
  pendingFocus = false;
  const s = store.get();
  store.set({
    target: clamp(target),
    playing: true,
    selected: null,
    status: target > s.t ? "EXPLODING" : "REASSEMBLING",
  });
  camera.view("iso", target > 0.1);
}
function select(id) {
  if (id && !model.groups.has(id)) return;
  const s = store.get();
  if (id && s.hidden.has(id)) {
    const hidden = new Set(s.hidden);
    hidden.delete(id);
    store.set({ hidden });
  }
  store.set({
    selected: id,
    status: id
      ? "FOCUSED"
      : s.t === 0
        ? "ASSEMBLED"
        : s.t === 1
          ? "EXPLODED"
          : "EXPLODING",
  });
  if (id) {
    const p = device.parts.find((p) => p.id === id);
    if (p.category !== "exterior" && s.t < 0.75) {
      store.set({ target: 0.85, playing: true, status: "EXPLODING" });
      camera.view("iso", true);
      pendingFocus = true;
    } else pendingFocus = true;
  } else pendingFocus = false;
}
function reset() {
  pendingFocus = false;
  animator?.resetOffsets();
  store.set({
    selected: null,
    hover: null,
    xray: false,
    hidden: new Set(),
    target: 0,
    playing: true,
    status: "REASSEMBLING",
  });
  camera.view("iso");
  $("search").value = "";
  tree = createTree(device, store, select, toggle);
  delete document.body.dataset.drawer;
}
function toggle(ids, hide) {
  const hidden = new Set(store.get().hidden);
  for (const id of ids) hide ? hidden.add(id) : hidden.delete(id);
  const selected = hidden.has(store.get().selected)
    ? null
    : store.get().selected;
  store.set({ hidden, selected });
}
function rebuild() {
  modelRevision++;
  viewport.dataset.modelRevision = String(modelRevision);
  unsubscribe?.();
  model?.dispose();
  model = createModel(device, color);
  engine.scene.add(model.root);
  animator = createAnimator(store, model, device, reduced);
  tree = createTree(device, store, select, toggle);
  info = createInfo(device, store, { focus, select, sku: () => sku });
  labels = createLabels(engine, () => model, store, device, viewport);
  let lastStyle = "",
    lastUI = "";
  unsubscribe = store.subscribe((s) => {
    controls?.sync(s);
    const ui = [s.selected, [...s.hidden].join(), sku].join("|");
    if (ui !== lastUI) {
      tree.sync(s);
      info.update(s);
      lastUI = ui;
    }
    const materialKey = [s.selected, s.hover, s.xray].join("|");
    if (materialKey !== lastStyle) {
      style(s);
      lastStyle = materialKey;
    }
  });
  style(store.get());
  $("colors").replaceChildren();
  for (const c of device.colors) {
    const b = document.createElement("button");
    b.className = "swatch" + (c.id === color.id ? " active" : "");
    b.style.setProperty("--swatch", c.shell);
    b.title = c.name;
    b.setAttribute("aria-label", c.name);
    b.setAttribute("aria-pressed", String(c.id === color.id));
    b.onclick = () => {
      color = c;
      rebuild();
    };
    $("colors").append(b);
  }
  $("color-name").textContent = color.name;
  $("model-title").textContent = device.model;
  $("edition-name").textContent = device.edition;
  $("sku").replaceChildren(...device.skus.map((s) => new Option(s, s)));
  $("sku").value = sku;
  $("sku-caption").textContent = `${device.ramLabel || "16 GB"} + ${sku}`;
  refreshRegistry();
}
const actions = {
  select,
  focus,
  go,
  reset,
  toggle,
  scrub(t) {
    pendingFocus = false;
    const s = store.get();
    if (s.selected || s.t < 0.1 !== t < 0.1) camera.view("iso", t > 0.1);
    const next = { ...s, t, target: t, playing: false, selected: null };
    store.set({
      t,
      target: t,
      playing: false,
      selected: null,
      status: statusAt(next),
    });
  },
  play() {
    const s = store.get();
    pendingFocus = false;
    if (s.playing)
      store.set({
        playing: false,
        target: s.t,
        status: s.selected
          ? "FOCUSED"
          : s.t === 0
            ? "ASSEMBLED"
            : s.t === 1
              ? "EXPLODED"
              : "EXPLODING",
      });
    else {
      const target = s.t >= 0.999 ? 0 : 1;
      store.set({
        target,
        playing: true,
        selected: null,
        status: target > s.t ? "EXPLODING" : "REASSEMBLING",
      });
      camera.view("iso", target > 0);
    }
  },
  step(dir) {
    pendingFocus = false;
    const s = store.get(),
      target = clamp(s.t + dir * 0.2);
    store.set({
      target,
      playing: true,
      selected: null,
      status: target > s.t ? "EXPLODING" : "REASSEMBLING",
    });
    camera.view("iso", target > 0.1);
  },
  view(name) {
    pendingFocus = false;
    camera.view(name, store.get().t > 0.1);
    document
      .querySelectorAll("[data-view]")
      .forEach((b) => b.classList.toggle("active", b.dataset.view === name));
  },
  setSku(value) {
    if (!device.skus.includes(value)) return;
    sku = value;
    $("sku-caption").textContent = `${device.ramLabel || "16 GB"} + ${sku}`;
    info.update(store.get(), true);
  },
  device(id) {
    device = getDevice(id);
    color = device.colors[0];
    sku = device.defaultSku;
    store.set({
      t: 0,
      target: 0,
      playing: false,
      selected: null,
      hover: null,
      xray: false,
      hidden: new Set(),
      status: "ASSEMBLED",
    });
    pendingFocus = false;
    rebuild();
    camera.view("iso");
  },
  screenshot() {
    engine.renderer.render(engine.scene, engine.camera);
    engine.renderer.domElement.toBlob((blob) => {
      if (blob) {
        download(blob, "phone-atlas-3d.png");
        toast("已导出透明背景三维场景 PNG");
      } else toast("截图生成失败，请重试。");
    }, "image/png");
  },
  export() {
    const s = store.get();
    download(
      new Blob(
        [
          JSON.stringify(
            {
              schemaVersion: 1,
              deviceId: device.id,
              sku,
              color: color.id,
              t: s.t,
              state: s.status,
              xray: s.xray,
              selected: s.selected,
              hidden: [...s.hidden],
              units: device.units,
              parts: device.parts.map((p) => ({
                id: p.id,
                assembledTransform: p.assembledTransform,
                explodeVector: p.explodeVector,
                explodeOrder: p.explodeOrder,
                confidence: p.confidence,
                sourceUrl: p.sourceUrl,
              })),
            },
            null,
            2,
          ),
        ],
        { type: "application/json" },
      ),
      "phone-atlas-config.json",
    );
    toast("已导出当前拆解配置 JSON");
  },
};
rebuild();
controls = setupControls(store, actions);
controls.sync(store.get());
camera.view("iso", false, true);
createPicking(engine, () => model, store, select, focus);
engine.controls.addEventListener("start", () => {
  camera.cancel();
  pendingFocus = false;
});
$("loading").hidden = true;
const diagnosticNode = document.createElement("script");
diagnosticNode.id = "runtime-diagnostics";
diagnosticNode.type = "application/json";
document.body.append(diagnosticNode);
let lastTime = performance.now(),
  fpsStart = lastTime,
  frames = 0,
  slowWindows = 0;
const perf = {
  fps: 0,
  samples: [],
  renderer: "",
  browser: navigator.userAgent,
};
const gl = engine.renderer.getContext();
const debug = gl.getExtension("WEBGL_debug_renderer_info");
perf.renderer = debug
  ? gl.getParameter(debug.UNMASKED_RENDERER_WEBGL)
  : gl.getParameter(gl.RENDERER);
function tick(time) {
  const dt = Math.min(1, (time - lastTime) / 1000);
  lastTime = time;
  animator.update(dt);
  camera.update(dt, reduced);
  if (pendingFocus && !store.get().playing) {
    pendingFocus = false;
    focus();
  }
  engine.controls.update();
  engine.renderer.render(engine.scene, engine.camera);
  labels.update();
  viewport.dataset.renderedRevision = String(modelRevision);
  viewport.dataset.renderedProgress = store.get().t.toFixed(3);
  frames++;
  if (time - fpsStart > 1500) {
    const fps = (frames * 1000) / (time - fpsStart);
    perf.fps = Number(fps.toFixed(1));
    perf.samples.push(perf.fps);
    if (perf.samples.length > 120) perf.samples.shift();
    $("performance").textContent = `${Math.round(fps)} FPS`;
    diagnosticNode.textContent = JSON.stringify(
      window.phoneAtlasDiagnostics?.() || {},
    );
    if (fps < 26) slowWindows++;
    else slowWindows = 0;
    if (slowWindows === 3) {
      engine.renderer.setPixelRatio(1);
      engine.resize();
      toast("已降低渲染分辨率以改善流畅度");
    }
    frames = 0;
    fpsStart = time;
  }
}
engine.renderer.setAnimationLoop(tick);
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    engine.renderer.setAnimationLoop(null);
    store.set({ playing: false, target: store.get().t });
  } else {
    lastTime = performance.now();
    fpsStart = lastTime;
    frames = 0;
    engine.renderer.setAnimationLoop(tick);
  }
});
engine.renderer.domElement.addEventListener("webglcontextlost", (e) => {
  e.preventDefault();
  $("fatal").hidden = false;
  $("fatal").textContent =
    "图形上下文已丢失。保存需要的配置后，刷新页面重新建立场景。";
  engine.renderer.setAnimationLoop(null);
});
engine.renderer.domElement.addEventListener("webglcontextrestored", () => {
  $("fatal").hidden = false;
  $("fatal").textContent = "图形上下文已恢复，请刷新页面重新建立资源。";
});
window.addEventListener("resize", () => {
  const desired = Math.min(devicePixelRatio, innerWidth < 761 ? 1.2 : 1.35);
  if (slowWindows < 3 && engine.renderer.getPixelRatio() !== desired) {
    engine.renderer.setPixelRatio(desired);
    engine.resize();
  }
});
window.phoneAtlasDiagnostics = () => ({
  deviceId: device.id,
  parts: device.parts.length,
  selected: store.get().selected,
  t: store.get().t,
  target: store.get().target,
  status: store.get().status,
  playing: store.get().playing,
  hidden: [...store.get().hidden],
  xray: store.get().xray,
  positions: device.parts.map((p) => ({
    id: p.id,
    position: model.groups.get(p.id).position.toArray(),
    base: p.assembledTransform.position,
  })),
  camera: {
    position: engine.camera.position.toArray(),
    target: engine.controls.target.toArray(),
  },
  drawCalls: engine.renderer.info.render.calls,
  triangles: engine.renderer.info.render.triangles,
  memory: { ...engine.renderer.info.memory },
  performance: { ...perf },
  dpr: engine.renderer.getPixelRatio(),
});
