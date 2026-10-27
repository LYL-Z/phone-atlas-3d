import * as THREE from "three";
export function createLabels(engine, getModel, store, device, container) {
  const label = document.querySelector("#part-label"),
    line = document.querySelector("#leader path"),
    pos = new THREE.Vector3(),
    world = new THREE.Vector3(),
    direction = new THREE.Vector3(),
    ray = new THREE.Raycaster();
  let last = "";
  return {
    update() {
      const s = store.get(),
        model = getModel(),
        obj = model.groups.get(s.selected);
      if (!obj || !obj.visible) {
        label.hidden = true;
        line.setAttribute("d", "");
        return;
      }
      obj.getWorldPosition(world);
      direction.copy(world).sub(engine.camera.position);
      const distance = direction.length();
      ray.set(engine.camera.position, direction.normalize());
      const hits = ray
        .intersectObjects(model.root.children, true)
        .filter((h) => {
          let visible = true;
          for (let p = h.object; p; p = p.parent)
            if (!p.visible) visible = false;
          return (
            visible && !(s.xray && h.object.userData.category === "exterior")
          );
        });
      if (
        hits.length &&
        hits[0].distance < distance - 0.8 &&
        hits[0].object.userData.partId !== s.selected
      ) {
        label.hidden = true;
        line.setAttribute("d", "");
        return;
      }
      pos.copy(world).project(engine.camera);
      const r = container.getBoundingClientRect();
      const x = (pos.x * 0.5 + 0.5) * r.width,
        y = (-pos.y * 0.5 + 0.5) * r.height;
      if (
        pos.z > 1 ||
        x < 10 ||
        x > r.width - 10 ||
        y < 10 ||
        y > r.height - 90
      ) {
        label.hidden = true;
        line.setAttribute("d", "");
        return;
      }
      if (last !== s.selected) {
        label.textContent = device.parts.find(
          (p) => p.id === s.selected,
        )?.displayName;
        last = s.selected;
      }
      const mobile = r.width < 761,
        left = mobile
          ? 16
          : document.querySelector("#tree-panel").getBoundingClientRect()
              .right + 8,
        right = mobile
          ? r.width - 155
          : document.querySelector("#info-panel").getBoundingClientRect().left -
            155;
      const lx = Math.max(left, Math.min(right, x + 50)),
        ly = Math.max(145, Math.min(r.height - 100, y - 35));
      label.hidden = false;
      label.style.transform = `translate(${lx}px,${ly}px)`;
      line.setAttribute(
        "d",
        `M${x},${y} L${lx - 8},${ly + 12} L${lx},${ly + 12}`,
      );
    },
  };
}
