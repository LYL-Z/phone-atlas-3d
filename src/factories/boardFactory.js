import * as THREE from "three";
import { plate, put, textPlane } from "./geometry.js";
export function boardFactory(p, m) {
  const g = new THREE.Group();
  put(g, plate(6.7, 2.5, 0.09, 0.22, m.board, 0.015));
  put(g, plate(1.7, 2.3, 0.09, 0.18, m.board, 0.015), -2.5, -1.9, 0);
  for (const x of [-2.6, 2.6]) {
    put(g, plate(0.7, 0.25, 0.13, 0.03, m.black, 0.005), x, -0.9, 0);
    for (let i = 0; i < 6; i++)
      put(
        g,
        plate(0.035, 0.17, 0.01, 0.007, m.copper, 0.002),
        x - 0.22 + i * 0.085,
        -0.91,
        -0.075,
      );
  }
  const text = textPlane("PCB · 示意分区", 2.5, 0.45, "#d6dcc0", 120);
  text.rotation.y = Math.PI;
  put(g, text, 0, -0.8, -0.065);
  return g;
}
export function shieldsFactory(p, m) {
  const g = new THREE.Group();
  for (const [x, y, w, h] of [
    [-2.3, 0.3, 1.6, 1.5],
    [0.25, 0.2, 2.2, 1.7],
    [2.35, 0.25, 1.4, 1.6],
    [-2.45, -1.9, 1.1, 1.7],
  ]) {
    put(g, plate(w, h, 0.1, 0.08, m.silver, 0.014), x, y, 0);
    put(
      g,
      plate(w - 0.15, h - 0.15, 0.008, 0.06, m.ceramic, 0.002),
      x,
      y,
      -0.057,
    );
  }
  return g;
}
export function packageFactory(p, m) {
  const g = new THREE.Group(),
    w = p.config.w || 1.8,
    h = p.config.h || 1.8;
  put(g, plate(w, h, 0.07, 0.08, m.board, 0.01));
  put(g, plate(w - 0.15, h - 0.15, 0.1, 0.045, m.ceramic, 0.01), 0, 0, -0.065);
  const label = textPlane(
    p.config.text || "MODULE",
    w * 0.95,
    0.45,
    "#d4dbd0",
    120,
  );
  label.rotation.y = Math.PI;
  put(g, label, 0, 0, -0.122);
  for (let i = 0; i < 8; i++) {
    for (const side of [-1, 1]) {
      put(
        g,
        plate(0.035, 0.09, 0.014, 0.006, m.copper, 0.002),
        -w * 0.4 + i * w * 0.114,
        side * h * 0.48,
        -0.045,
      );
    }
  }
  return g;
}
