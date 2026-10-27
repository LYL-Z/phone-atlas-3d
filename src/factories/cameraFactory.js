import * as THREE from "three";
import { disk, ring, put, plate, textPlane } from "./geometry.js";
export function islandFactory(p, m) {
  const g = new THREE.Group();
  put(g, ring(3.18, 2.95, 0.17, m.metal));
  put(g, ring(3.08, 2.96, 0.025, m.silver), 0, 0, -0.1);
  put(g, ring(3.16, 3.09, 0.02, m.shell), 0, 0, -0.135);
  const face = disk(2.97, 0.055, m.black);
  put(g, face, 0, 0, -0.14);
  const med = disk(1.1, 0.07, m.metal);
  put(g, med, 0, 0, -0.205);
  put(g, ring(1.13, 1.07, 0.04, m.silver), 0, 0, -0.225);
  const logo = textPlane("XMAGE", 1.65, 0.35, "#e9efdf", 200);
  logo.rotation.y = Math.PI;
  put(g, logo, 0, 0, -0.245);
  for (let i = 0; i < 4; i++) {
    const contact = plate(0.28, 0.07, 0.04, 0.03, m.silver, 0.006);
    put(g, contact, -0.6 + i * 0.4, -3.04, -0.12);
  }
  return g;
}
export function lensFactory(p, m) {
  const g = new THREE.Group(),
    r = p.config.r || 0.48;
  put(g, disk(r, 0.18, m.black));
  put(g, ring(r + 0.015, r - 0.035, 0.035, m.black), 0, 0, -0.1);
  put(g, ring(r - 0.08, r - 0.16, 0.07, m.black), 0, 0, -0.145);
  for (let i = 0; i < 3; i++) {
    const glass = new THREE.MeshPhysicalMaterial({
      color: i === 1 ? "#183b58" : "#172537",
      metalness: 0.42,
      roughness: 0.055,
      iridescence: 0.6,
      iridescenceIOR: 1.35,
      clearcoat: 1,
      clearcoatRoughness: 0.04,
    });
    put(g, disk(r - 0.15 - i * 0.035, 0.018, glass), 0, 0, -0.15 - i * 0.027);
  }
  put(g, disk(r * 0.26, 0.01, m.black), 0, 0, -0.24);
  put(g, ring(r * 0.31, r * 0.27, 0.007, m.copper), 0, 0, -0.246);
  const glint = new THREE.Mesh(
    new THREE.SphereGeometry(r * 0.12, 16, 8),
    new THREE.MeshBasicMaterial({ color: "#839ab8" }),
  );
  glint.scale.set(1, 0.32, 0.05);
  put(g, glint, r * 0.23, r * 0.28, -0.25);
  const reflection = new THREE.Mesh(
    new THREE.CircleGeometry(r * 0.28, 32),
    new THREE.MeshBasicMaterial({
      color: "#b4cce8",
      transparent: true,
      opacity: 0.33,
      depthWrite: false,
      side: THREE.DoubleSide,
    }),
  );
  reflection.scale.set(1, 0.19, 1);
  reflection.rotation.z = -0.4;
  put(g, reflection, -r * 0.16, r * 0.35, -0.262);
  if (p.config.periscope) {
    const prism = plate(r * 1.3, r * 1.15, 0.025, 0.12, m.glass, 0.01);
    put(g, prism, 0, 0, -0.25);
  }
  return g;
}
export function flashFactory(p, m) {
  const g = new THREE.Group();
  put(g, plate(0.6, 0.2, 0.035, 0.09, m.silver, 0.005));
  put(g, plate(0.49, 0.14, 0.012, 0.06, m.white, 0.003), 0, 0, -0.026);
  return g;
}
export function lensCoverFactory(p, m) {
  const g = new THREE.Group();
  put(g, ring(2.97, 2.91, 0.015, m.silver));
  return g;
}
