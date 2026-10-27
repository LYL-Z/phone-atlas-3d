import { confidenceNames } from "../data/sources.js";
export function createInfo(device, store, actions) {
  const root = document.querySelector("#info-content");
  let last = "";
  function update(s, force = false) {
    const key = (s.selected || "overview") + "|" + actions.sku();
    if (key === last && !force) return;
    last = key;
    root.replaceChildren();
    const part = device.parts.find((p) => p.id === s.selected);
    document.querySelector("#info-heading").textContent = part
      ? "部件档案"
      : "关于这部手机";
    const badge = document.createElement("span");
    badge.className =
      "confidence " +
      (!part && device.confidence === "official" ? "official" : "");
    badge.textContent = part
      ? confidenceNames[part.confidence] + " · 几何可信度"
      : confidenceNames[device.confidence] + " · 规格参数";
    root.append(badge);
    const title = document.createElement("h3");
    title.textContent = part ? part.displayName : device.model;
    root.append(title);
    const intro = document.createElement("p");
    intro.className = "info-intro";
    intro.textContent = part
      ? part.notes
      : device.edition === "虚构测试设备"
        ? "用于检验注册表扩展能力，不对应任何在售机型。"
        : "从外观走进内部，查看影像、计算与能源系统如何协作。选择一个部件，开始探索。";
    root.append(intro);
    const dl = document.createElement("dl");
    for (const f of part ? part.facts : device.facts) {
      const row = document.createElement("div"),
        dt = document.createElement("dt"),
        dd = document.createElement("dd");
      dt.textContent = f.label;
      dd.textContent = f.value;
      row.title = (confidenceNames[f.confidence] || "") + " · " + f.sourceUrl;
      row.append(dt, dd);
      dl.append(row);
    }
    if (part?.id === "storage") {
      const row = document.createElement("div");
      row.innerHTML = "<dt>当前演示 SKU</dt>";
      const dd = document.createElement("dd");
      dd.textContent = actions.sku();
      row.append(dd);
      dl.append(row);
    }
    root.append(dl);
    if (part) {
      for (const url of new Set(
        part.facts
          .filter((f) => f.confidence === "official")
          .map((f) => f.sourceUrl),
      )) {
        const officialLink = document.createElement("a");
        officialLink.className = "source-link";
        officialLink.href = url;
        officialLink.target = "_blank";
        officialLink.rel = "noopener";
        officialLink.textContent = "功能参数：官方确认 · 查看官网 ↗";
        root.append(officialLink);
      }
    }
    if (part) {
      const detail = document.createElement("p");
      detail.className = "note";
      detail.textContent = `示意中心坐标 X / Y / Z：${part.assembledTransform.position.map((n) => (n * 10).toFixed(1)).join(" / ")} mm。模型配置，不是测量值。`;
      root.append(detail);
      const group = document.createElement("div");
      group.className = "info-actions";
      for (const [label, fn] of [
        ["对焦部件", actions.focus],
        ["退出详情", () => actions.select(null)],
      ]) {
        const b = document.createElement("button");
        b.textContent = label;
        b.onclick = fn;
        group.append(b);
      }
      root.append(group);
    }
    const warning = document.createElement("p");
    warning.className = "info-warning";
    warning.textContent =
      "内部布局为工程示意，非实机拆解测绘。官方参数不证明封装、走线与装配位置。";
    root.append(warning);
    const link = document.createElement("a");
    link.className = "source-link";
    link.target = "_blank";
    link.rel = "noopener";
    link.href = part?.sourceUrl || device.sourceUrl;
    link.textContent = "查看对应来源 ↗";
    root.append(link);
    const date = document.createElement("p");
    date.className = "note";
    date.textContent = "核对日期：" + (part?.verifiedAt || device.verifiedAt);
    root.append(date);
  }
  return { update };
}
