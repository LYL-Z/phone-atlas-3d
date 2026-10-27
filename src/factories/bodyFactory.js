import * as THREE from "three";
import { outline, plate, put, disk, textPlane } from "./geometry.js";
export function frameFactory(p, materials, device) {
  const g = new THREE.Group(),
    w = device.dimensions.width / 10,
    h = device.dimensions.length / 10;
  const s = outline(w - 0.08, h - 0.08, 0.87);
  const hole = outline(w - 0.32, h - 0.32, 0.74);
  s.holes.push(new THREE.Path(hole.getPoints().reverse()));
  const geo = new THREE.ExtrudeGeometry(s, {
    depth: 0.675,
    bevelEnabled: true,
    bevelSize: 0.04,
    bevelThickness: 0.04,
    bevelSegments: 4,
    curveSegments: 20,
  });
  geo.translate(0, 0, -0.3375);
  put(g, new THREE.Mesh(geo, materials.metal));
  return g;
}
export function backFactory(p, m, d, color) {
  const g = new THREE.Group(),
    w = d.dimensions.width / 10,
    h = d.dimensions.length / 10;
  put(g, plate(w - 0.12, h - 0.12, 0.07, 0.83, m.shell, 0.025));
  const c = document.createElement("canvas");
  c.width = 1024;
  c.height = 2048;
  const ctx = c.getContext("2d");
  ctx.fillStyle = color.inset;
  ctx.fillRect(0, 0, 1024, 2048);
  // Four textile quadrants alternate their fiber direction, matching the supplied rear reference.
  ctx.lineWidth = 1.35;
  ctx.strokeStyle = "rgba(228,243,201,.35)";
  for (let qy = 0; qy < 2; qy++)
    for (let qx = 0; qx < 2; qx++) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(qx * 512, qy * 1024, 512, 1024);
      ctx.clip();
      const vertical = (qx + qy) % 2 === 0;
      const extent = vertical ? 512 : 1024;
      for (let i = 0; i <= extent; i += 5) {
        ctx.beginPath();
        if (vertical) {
          ctx.moveTo(qx * 512 + i, qy * 1024);
          ctx.lineTo(qx * 512 + i, (qy + 1) * 1024);
        } else {
          ctx.moveTo(qx * 512, qy * 1024 + i);
          ctx.lineTo((qx + 1) * 512, qy * 1024 + i);
        }
        ctx.stroke();
      }
      ctx.restore();
    }
  const glow = ctx.createRadialGradient(340, 480, 0, 340, 480, 1100);
  glow.addColorStop(0, "rgba(205,231,134,.25)");
  glow.addColorStop(1, "rgba(0,0,0,.15)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, 1024, 2048);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  const mat = new THREE.MeshPhysicalMaterial({
    map: t,
    bumpMap: t,
    bumpScale: 0.012,
    metalness: 0.3,
    roughness: 0.33,
    clearcoat: 0.7,
  });
  const inset = plate(w - 0.36, h * 0.735, 0.012, 0.78, mat, 0.004);
  put(g, inset, 0, h * 0.09, -0.041);
  const label = textPlane(d.brand, 2.2, 0.55, "#52643f", 185);
  label.rotation.y = Math.PI;
  put(g, label, 0, -h * 0.365, -0.045);
  return g;
}
export function oledFactory(p, m, d) {
  const g = new THREE.Group(),
    w = d.dimensions.width / 10 - 0.25,
    h = d.dimensions.length / 10 - 0.25;
  put(g, plate(w, h, 0.065, 0.8, m.black, 0.015));
  const c = document.createElement("canvas");
  c.width = 660;
  c.height = 1424;
  const ctx = c.getContext("2d");
  ctx.fillStyle = "#09100e";
  ctx.fillRect(0, 0, 660, 1424);
  const grad = ctx.createRadialGradient(330, 660, 0, 330, 660, 630);
  grad.addColorStop(0, "#8aab65");
  grad.addColorStop(0.35, "#3b5c3c");
  grad.addColorStop(0.7, "#13291f");
  grad.addColorStop(1, "#080e0d");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 660, 1424);
  for (let i = 0; i < 5; i++) {
    ctx.strokeStyle = `rgba(202,231,154,${0.4 - i * 0.06})`;
    ctx.lineWidth = 4 + i * 4;
    ctx.beginPath();
    ctx.ellipse(330, 650 + i * 10, 270 - i * 25, 330, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.fillStyle = "#eaf3df";
  ctx.textAlign = "center";
  ctx.font = "200 100px sans-serif";
  ctx.fillText("09:41", 330, 300);
  ctx.font = "24px sans-serif";
  ctx.fillText("10 月 27 日 · 星期二", 330, 350);
  ctx.font = "23px sans-serif";
  ctx.fillText("探索，从好奇开始", 330, 1150);
  ctx.font = "19px sans-serif";
  ctx.fillStyle = "#bbc9ae";
  ctx.fillText("示意界面 · 非官方系统截图", 330, 1190);
  ctx.fillStyle = "#e5ecd9";
  ctx.fillRect(260, 1380, 140, 6);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  const screen = plate(
    w - 0.14,
    h - 0.14,
    0.009,
    0.72,
    new THREE.MeshBasicMaterial({ map: t }),
    0.002,
  );
  put(g, screen, 0, 0, 0.036);
  return g;
}
export function frontGlassFactory(p, m, d) {
  const g = new THREE.Group();
  const w = d.dimensions.width / 10 - 0.12,
    h = d.dimensions.length / 10 - 0.12;
  const s = outline(w, h, 0.86);
  const inner = outline(w - 0.2, h - 0.2, 0.76);
  s.holes.push(new THREE.Path(inner.getPoints().reverse()));
  const geo = new THREE.ExtrudeGeometry(s, {
    depth: 0.03,
    bevelEnabled: false,
    curveSegments: 20,
  });
  geo.translate(0, 0, -0.015);
  put(g, new THREE.Mesh(geo, m.black));
  const pane = plate(
    w - 0.2,
    h - 0.2,
    0.012,
    0.76,
    new THREE.MeshPhysicalMaterial({
      color: "#d9ede5",
      transparent: true,
      opacity: 0.045,
      roughness: 0.08,
      metalness: 0.1,
      depthWrite: false,
    }),
    0.002,
  );
  put(g, pane, 0, 0, 0.006);
  for (let i = -1; i <= 1; i++)
    put(g, disk(0.092, 0.016, m.black), i * 0.55, h / 2 - 0.5, 0.022);
  const earpiece = plate(0.95, 0.035, 0.012, 0.014, m.black, 0.002);
  put(g, earpiece, 0, h / 2 - 0.13, 0.02);
  return g;
}
export function buttonsFactory(p, m, d) {
  const g = new THREE.Group(),
    x = d.dimensions.width / 20 + 0.005;
  for (const [y, h] of [
    [3.9, 1.65],
    [1.55, 1.1],
  ]) {
    const b = plate(0.1, h, 0.4, 0.045, m.metal, 0.02);
    put(g, b, x, y, 0);
  }
  for (const y of [5.7, -5.2])
    for (const side of [-1, 1])
      put(
        g,
        plate(0.16, 0.06, 0.71, 0.025, m.ceramic, 0.005),
        side * (x - 0.1),
        y,
        0,
      );
  return g;
}
export function portsFactory(p, m, d) {
  const g = new THREE.Group(),
    bottom = -d.dimensions.length / 20;
  const usb = plate(0.92, 0.27, 0.025, 0.12, m.black, 0.005);
  usb.rotation.x = Math.PI / 2;
  put(g, usb, 0, bottom - 0.005, 0);
  const tongue = plate(0.6, 0.035, 0.025, 0.01, m.silver, 0.003);
  tongue.rotation.x = Math.PI / 2;
  put(g, tongue, 0, bottom - 0.023, 0);
  for (let i = 0; i < 6; i++) {
    const hole = disk(0.055, 0.02, m.black);
    hole.rotation.x = 0;
    put(g, hole, 1.3 + i * 0.23, bottom, 0);
  }
  for (const x of [-2.6, 2.6]) {
    const hole = plate(0.31, 0.09, 0.015, 0.04, m.black, 0.003);
    hole.rotation.x = Math.PI / 2;
    put(g, hole, x, -bottom, 0.02);
  }
  return g;
}
export function simFactory(p, m, d) {
  const g = new THREE.Group();
  const tray = plate(1.65, 0.3, 0.025, 0.12, m.silver, 0.005);
  tray.rotation.x = Math.PI / 2;
  put(g, tray, -2.0, -d.dimensions.length / 20 - 0.005, 0);
  const hole = disk(0.025, 0.035, m.black);
  hole.rotation.x = 0;
  put(g, hole, -2.55, -d.dimensions.length / 20 - 0.025, 0);
  return g;
}
