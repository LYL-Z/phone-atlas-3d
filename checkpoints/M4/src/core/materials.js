import * as THREE from "three";
export function createMaterials(color) {
  return {
    metal: new THREE.MeshStandardMaterial({
      color: color.metal,
      metalness: 0.87,
      roughness: 0.24,
    }),
    shell: new THREE.MeshPhysicalMaterial({
      color: color.shell,
      metalness: 0.3,
      roughness: 0.32,
      clearcoat: 0.65,
      clearcoatRoughness: 0.23,
    }),
    black: new THREE.MeshStandardMaterial({
      color: "#0d1416",
      metalness: 0.36,
      roughness: 0.24,
    }),
    board: new THREE.MeshStandardMaterial({
      color: "#1c4945",
      metalness: 0.2,
      roughness: 0.6,
    }),
    silver: new THREE.MeshStandardMaterial({
      color: "#b3bfbd",
      metalness: 0.85,
      roughness: 0.3,
    }),
    copper: new THREE.MeshStandardMaterial({
      color: "#bb8357",
      metalness: 0.8,
      roughness: 0.35,
    }),
    battery: new THREE.MeshStandardMaterial({
      color: "#242a2e",
      metalness: 0.28,
      roughness: 0.52,
    }),
    flex: new THREE.MeshStandardMaterial({
      color: "#c88936",
      metalness: 0.42,
      roughness: 0.45,
    }),
    glass: new THREE.MeshPhysicalMaterial({
      color: "#172b37",
      metalness: 0.25,
      roughness: 0.08,
      clearcoat: 1,
    }),
    ceramic: new THREE.MeshStandardMaterial({
      color: "#30393b",
      roughness: 0.6,
    }),
    white: new THREE.MeshStandardMaterial({ color: "#ece8cb", roughness: 0.3 }),
  };
}
