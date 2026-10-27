import * as THREE from "three";
import { plate, put, disk, ring, textPlane } from "./geometry.js";
export function batteryFactory(p, m) {
  const g = new THREE.Group();
  put(g, plate(6.65, 7.7, 0.31, 0.22, m.battery, 0.04));
  put(g, plate(6.4, 7.4, 0.013, 0.17, m.ceramic, 0.004), 0, 0, -0.17);
  for (const [str, y, h, font] of [
    ["6800 mAh", 1.2, 0.8, 160],
    ["额定容量 6615 mAh", 0.3, 0.55, 110],
    ["锂离子电池 · 包络示意", -1, 0.5, 100],
    ["不可拆卸 · 非维修指导", -1.8, 0.45, 90],
  ]) {
    const t = textPlane(str, 5.8, h, "#c9d1c6", font);
    t.rotation.y = Math.PI;
    put(g, t, 0, y, -0.185);
  }
  put(g, plate(0.5, 0.6, 0.04, 0.02, m.flex, 0.004), 2.3, 4.1, 0);
  return g;
}
export function coilFactory(p, m) {
  const g = new THREE.Group();
  put(g, disk(2.3, 0.035, m.ceramic));
  const pts = [];
  for (let i = 0; i <= 1200; i++) {
    const t = i / 1200;
    const a = t * Math.PI * 2 * 13,
      r = 0.8 + t * 1.35;
    pts.push(new THREE.Vector3(Math.cos(a) * r, Math.sin(a) * r, -0.034));
  }
  const curve = new THREE.CatmullRomCurve3(pts);
  put(
    g,
    new THREE.Mesh(
      new THREE.TubeGeometry(curve, 1200, 0.018, 5, false),
      m.copper,
    ),
  );
  put(g, plate(0.35, 1, 0.018, 0.03, m.flex, 0.003), 0, -2.6, 0);
  return g;
}
export function slabFactory(p, m) {
  const g = new THREE.Group();
  const c = p.config;
  put(
    g,
    plate(
      c.w || 6.6,
      c.h || 9,
      c.d || 0.035,
      c.r || 0.3,
      m[c.material] || m.ceramic,
      0.008,
    ),
  );
  if (c.text) {
    const t = textPlane(c.text, 4, 0.7, "#bac2b8", 120);
    t.rotation.y = Math.PI;
    put(g, t, 0, 0, -0.04);
  }
  return g;
}
export function peripheralsFactory(p, m) {
  const g = new THREE.Group();
  const c = p.config;
  put(
    g,
    plate(
      c.w || 2,
      c.h || 0.9,
      c.d || 0.2,
      0.16,
      m[c.material] || m.black,
      0.025,
    ),
  );
  if (c.grille)
    for (let i = 0; i < 7; i++)
      put(
        g,
        plate(0.035, 0.5, 0.01, 0.015, m.silver, 0.002),
        -0.7 + i * 0.23,
        0,
        -0.12,
      );
  if (c.connector)
    for (let i = 0; i < 8; i++)
      put(
        g,
        plate(0.055, 0.18, 0.012, 0.01, m.copper, 0.002),
        -0.5 + i * 0.14,
        0,
        -0.12,
      );
  return g;
}
export function flexFactory(p, m) {
  const g = new THREE.Group();
  for (const [x, y, w, h] of [
    [-2.85, 0, 0.35, 6.3],
    [-1.1, -2.9, 3.8, 0.35],
    [2.7, 1.8, 0.3, 2.6],
  ])
    put(g, plate(w, h, 0.024, 0.04, m.flex, 0.004), x, y, 0);
  for (const [x, y] of [
    [-2.85, 3.15],
    [0.8, -2.9],
    [2.7, 3.1],
  ])
    put(g, plate(0.65, 0.28, 0.08, 0.04, m.black, 0.008), x, y, 0);
  return g;
}
export function screwFactory(p, m) {
  const g = new THREE.Group();
  for (const [x, y] of [
    [-3.5, 6.8],
    [3.5, 6.8],
    [-3.5, -6.8],
    [3.5, -6.8],
  ]) {
    put(g, disk(0.095, 0.05, m.silver), x, y, 0);
    put(g, plate(0.12, 0.018, 0.005, 0.006, m.black, 0.001), x, y, -0.03);
  }
  return g;
}
