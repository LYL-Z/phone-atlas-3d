import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
// Static factory output shares transforms; batch only meshes with the same material inside one selectable part.
export function batchPart(group) {
  if (group.children.some((c) => !c.isMesh)) return group;
  const batches = new Map();
  for (const mesh of group.children) {
    if (Array.isArray(mesh.material)) return group;
    mesh.updateMatrix();
    let geo = mesh.geometry.index
      ? mesh.geometry.toNonIndexed()
      : mesh.geometry.clone();
    geo.applyMatrix4(mesh.matrix);
    const key = mesh.material.uuid;
    if (!batches.has(key))
      batches.set(key, { material: mesh.material, geometries: [], roles: new Set() });
    batches.get(key).geometries.push(geo);
    if(mesh.userData.submeshRole)batches.get(key).roles.add(mesh.userData.submeshRole);
  }
  for (const mesh of [...group.children]) {
    mesh.geometry.dispose();
    group.remove(mesh);
  }
  for (const { material, geometries, roles } of batches.values()) {
    const merged = mergeGeometries(geometries, false);
    geometries.forEach((g) => g.dispose());
    if (!merged) throw Error("Cannot merge part geometry");
    const mesh=new THREE.Mesh(merged,material);mesh.userData.submeshRoles=[...roles];group.add(mesh);
  }
  return group;
}
