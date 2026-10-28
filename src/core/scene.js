import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import {createStudio} from "./studio.js";
import {qualityPresets} from "./quality.js";
export function createScene(container) {
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    preserveDrawingBuffer: false,
  });
  renderer.setPixelRatio(
    Math.min(devicePixelRatio, innerWidth < 761 ? 1.2 : 1.35),
  );
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.92;
  container.prepend(renderer.domElement);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 220);
  camera.position.set(-14, 8, -30);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.075;
  controls.minDistance = 6;
  controls.maxDistance = 75;
  controls.enablePan = true;
  const ambient=new THREE.HemisphereLight(0xf3f5f1,0x242c2a,.32);scene.add(ambient);
  const key = new THREE.DirectionalLight(0xfff8e4, 2.5);
  key.position.set(-8, 12, -14);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xa5c5df, 1.8);
  rim.position.set(9, 4, 8);
  scene.add(rim);
  const fill = new THREE.DirectionalLight(0xd6edbd, 1.2);
  fill.position.set(4, -6, -10);
  scene.add(fill);
  const resize = () => {
    const { width, height } = container.getBoundingClientRect();
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  };
  new ResizeObserver(resize).observe(container);
  resize();
  const studio=createStudio(renderer,scene,{ambient,key,rim,fill});
  let quality='medium';
  function setQuality(value){quality=qualityPresets[value]?value:'medium';const q=qualityPresets[quality];renderer.setPixelRatio(Math.min(devicePixelRatio,q.dpr));resize();studio.apply(studio.preset,q.environment);}
  return {renderer,scene,camera,controls,resize,studio,setQuality,get quality(){return quality;}};
}
