import * as THREE from "three";
export function createPicking(engine, getModel, store, onSelect, onFocus) {
  const ray = new THREE.Raycaster(),
    pointer = new THREE.Vector2();
  const canvas = engine.renderer.domElement;
  let down = null;
  const vec = new THREE.Vector3();
  function pick(e) {
    const r = canvas.getBoundingClientRect();
    pointer.set(
      ((e.clientX - r.left) / r.width) * 2 - 1,
      (-(e.clientY - r.top) / r.height) * 2 + 1,
    );
    ray.setFromCamera(pointer, engine.camera);
    const model = getModel(),
      s = store.get();
    const hits = ray.intersectObjects(model.root.children, true);
    for (const hit of hits) {
      const id = hit.object.userData.partId,
        obj = model.groups.get(id);
      if (!id || !obj?.visible || !model.root.visible) continue;
      let visible = true;
      for (let p = hit.object; p; p = p.parent) if (!p.visible) visible = false;
      if (!visible) continue;
      if (s.xray && ["exterior"].includes(hit.object.userData.category))
        continue;
      return id;
    }
    return null;
  }
  canvas.addEventListener("pointerdown", (e) => {
    down = { x: e.clientX, y: e.clientY, id: e.pointerId };
  });
  canvas.addEventListener("pointerup", (e) => {
    if (
      down &&
      down.id === e.pointerId &&
      Math.hypot(e.clientX - down.x, e.clientY - down.y) < 5
    )
      onSelect(pick(e));
    down = null;
  });
  canvas.addEventListener("pointercancel", () => (down = null));
  canvas.addEventListener("pointermove", (e) => {
    if (down) return;
    const id = pick(e);
    if (id !== store.get().hover) store.set({ hover: id });
    canvas.style.cursor = id ? "pointer" : "grab";
  });
  canvas.addEventListener("pointerleave", () => {
    store.set({ hover: null });
  });
  canvas.addEventListener("dblclick", (e) => {
    const id = pick(e);
    if (id) {
      onSelect(id);
      onFocus();
    }
  });
  return { ray, pointer, pick, vector: vec };
}
