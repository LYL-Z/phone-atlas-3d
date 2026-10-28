import * as THREE from "three";
import { batchPart } from "./optimize.js";
import { factories } from "../factories/index.js";
import { createMaterials } from "./materials.js";
export function createModel(device, color, quality="medium") {
  const root = new THREE.Group(),
    groups = new Map(),
    categories = new Map(),
    materials = createMaterials(color, quality),
    styleMaterials = [],
    factoryMaterials=new Set(), perPartMaterials=new Map();
  for (const c of device.categories) {
    const g = new THREE.Group();
    g.name = c.id;
    categories.set(c.id, g);
    root.add(g);
  }
  for (const part of device.parts) {
    const factory = factories[part.geometryFactory];
    if (!factory) throw Error("Missing factory " + part.geometryFactory);
    const obj = factory(part, materials, device, color);
    obj.traverse(o=>{for(const m of o.material?(Array.isArray(o.material)?o.material:[o.material]):[])factoryMaterials.add(m);});
    batchPart(obj);
    obj.name = part.id;
    obj.position.fromArray(part.assembledTransform.position);
    obj.rotation.fromArray(part.assembledTransform.rotation);
    obj.scale.fromArray(part.assembledTransform.scale);
    obj.visible = part.visible;
    obj.traverse((child) => {
      child.userData.partId = part.id;
      child.userData.category = part.category;
      if (child.isMesh) {
        const mats = Array.isArray(child.material)
          ? child.material
          : [child.material];
        child.material = mats.map((mat) => {
          const key=part.id+':'+mat.uuid;
          if(perPartMaterials.has(key))return perPartMaterials.get(key);
          const clone = mat.clone();perPartMaterials.set(key,clone);
          styleMaterials.push({
            mat: clone,
            id: part.id,
            category: part.category,
            opacity: clone.opacity,
            transparent: clone.transparent,
            depthWrite: clone.depthWrite,
            emissive: clone.emissive?.clone(),
            intensity: clone.emissiveIntensity,
          });
          return clone;
        });
        if (child.material.length === 1) child.material = child.material[0];
      }
    });
    categories.get(part.category).add(obj);
    groups.set(part.id, obj);
  }
  return {
    root,
    groups,
    categories,
    materials,
    styleMaterials,
    dispose() {
      const geos = new Set(),
        mats = new Set(),
        textures = new Set();
      root.traverse((o) => {
        if (o.geometry) geos.add(o.geometry);
        if (o.material)
          for (const m of Array.isArray(o.material)
            ? o.material
            : [o.material]) {
            mats.add(m);
            for (const v of Object.values(m)) if (v?.isTexture) textures.add(v);
          }
      });
      geos.forEach((g) => g.dispose());
      mats.forEach((m) => m.dispose());
      factoryMaterials.forEach(m=>{for(const v of Object.values(m))if(v?.isTexture)textures.add(v);m.dispose();});
      Object.values(materials).forEach((m) => {if(m?.isMaterial){for(const v of Object.values(m))if(v?.isTexture)textures.add(v);m.dispose();}});
      textures.forEach((t) => t.dispose());
      root.removeFromParent();
    },
  };
}
