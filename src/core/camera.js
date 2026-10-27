import * as THREE from "three";
export function createCameraController(engine, container) {
  const { camera, controls } = engine;
  let motion = null;
  const desired = new THREE.Vector3(),
    target = new THREE.Vector3();
  let current = "iso";
  const directions = {
    front: [0, 0, 1],
    back: [0, 0, -1],
    left: [-1, 0, 0],
    right: [1, 0, 0],
    iso: [-1, 0.26, -1],
  };
  const responsiveDistance = () => {
    const r = container.getBoundingClientRect();
    return Math.max(
      container.clientWidth < 761 ? 56 : 46,
      32 / Math.max(0.62, r.width / r.height),
    );
  };
  function move(pos, look) {
    motion = {
      from: camera.position.clone(),
      to: pos.clone(),
      fromTarget: controls.target.clone(),
      toTarget: look.clone(),
      elapsed: 0,
    };
  }
  return {
    view(name = "iso", exploded = false, immediate = false) {
      current = name;
      const dir = new THREE.Vector3(...directions[name]).normalize();
      target.set(0, container.clientWidth < 761 ? -0.8 : 1.9, 0);
      desired
        .copy(dir)
        .multiplyScalar(responsiveDistance() + (exploded ? 11 : 0))
        .add(target);
      if (immediate) {
        camera.position.copy(desired);
        controls.target.copy(target);
        motion = null;
        controls.update();
      } else move(desired, target);
    },
    focus(obj, part) {
      const box = new THREE.Box3().setFromObject(obj);
      box.getCenter(target);
      const size = box.getSize(desired);
      const aspect = container.clientWidth / container.clientHeight;
      let dist = Math.max(
        8.5,
        size.y * 2.7,
        (size.x * 2.7) / Math.max(0.35, aspect),
      );
      const dir = camera.position.clone().sub(controls.target).normalize();
      if (part.assembledTransform.position[2] > 0.2)
        dir.set(0.16, 0.09, 1).normalize();
      else if (dir.z > 0.25) dir.set(-0.2, 0.1, -1).normalize();
      desired.copy(dir).multiplyScalar(dist).add(target);
      move(desired, target);
    },
    cancel() {
      motion = null;
    },
    update(dt, reduced) {
      if (!motion) return;
      motion.elapsed += dt;
      const t = reduced ? 1 : Math.min(1, motion.elapsed / 0.8),
        k = 1 - (1 - t) ** 4;
      camera.position.lerpVectors(motion.from, motion.to, k);
      controls.target.lerpVectors(motion.fromTarget, motion.toTarget, k);
      if (t === 1) motion = null;
    },
    current: () => current,
  };
}
