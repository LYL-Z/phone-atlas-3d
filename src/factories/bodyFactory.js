import * as THREE from "three";
import {collectorExterior} from "../devices/exteriorProfiles.js";
import {profiledSolid,role} from "./profileGeometry.js";
import { outline, plate, put, disk, textPlane } from "./geometry.js";
export function frameFactory(p, m, d) {
  const g=new THREE.Group(),w=d.dimensions.width/10,h=d.dimensions.length/10;
  const profile=d.exteriorProfile||collectorExterior;
  put(g,role(profiledSolid(w,h,profile.cornerRadius,profile.bezelProfile,m.metal,{caps:false,openEnds:true}),'machined-frame'));
  // Separate end panels contain real apertures. Recess interiors belong to ports/SIM.
  for(const side of [-1,1]){
    const shape=outline(w-2*profile.cornerRadius,.48,.025);
    const holes=side<0?[{x:0,w:.96,h:.25},{x:-2,w:1.68,h:.28},...Array.from({length:6},(_,i)=>({x:1.3+i*.23,w:.105,h:.105}))]:[{x:-2.6,w:.31,h:.09},{x:2.6,w:.31,h:.09}];
    for(const q of holes){const hole=outline(q.w,q.h,Math.min(q.h/2,.11));const path=new THREE.Path(hole.getPoints(10).map(v=>new THREE.Vector2(v.x+q.x,v.y)).reverse());shape.holes.push(path);}
    const geo=new THREE.ExtrudeGeometry(shape,{depth:.10,bevelEnabled:false,curveSegments:12});geo.rotateX(side*Math.PI/2);
    put(g,role(new THREE.Mesh(geo,m.metal),'aperture-rim'),0,side*h/2,0);
  }
  for(const z of [-.365,.365])put(g,role(profiledSolid(w-.13,h-.13,.86,[[z-.008,0],[z+.008,0]],m.black,{caps:false}),'assembly-seam'));
  return g;
}
export function backFactory(p,m,d,color){
 const g=new THREE.Group(),w=d.dimensions.width/10,h=d.dimensions.length/10;
 put(g,role(profiledSolid(w-.06,h-.06,.9,(d.exteriorProfile||collectorExterior).backProfile,m.shell),'curved-back-shell'));
 const inset=profiledSolid(w-.30,h*.74,.73,[[-.0395,.018],[-.035,0]],m.textile||m.shell);
 put(g,role(inset,'textile-inlay'),0,h*.104,0);
 const label=textPlane(d.brand,2.05,.43,color.id==='black'?'#9da6a2':'#e4e9ce',170);label.rotation.y=Math.PI;put(g,role(label,'brand-mark'),0,-h*.365,-.0395);
 return g;
}
export function oledFactory(p, m, d) {
  const g = new THREE.Group(),
    w = d.dimensions.width / 10 - 0.25,
    h = d.dimensions.length / 10 - 0.25;
  put(g, plate(w, h, 0.065, 0.8, m.black, 0.015));
  const c = document.createElement("canvas");
  c.width = 660;
  c.height = 1424;
  const ctx = c.getContext("2d");
  ctx.fillStyle = "#09100e";
  ctx.fillRect(0, 0, 660, 1424);
  const grad = ctx.createRadialGradient(330, 660, 0, 330, 660, 630);
  grad.addColorStop(0, "#8aab65");
  grad.addColorStop(0.35, "#3b5c3c");
  grad.addColorStop(0.7, "#13291f");
  grad.addColorStop(1, "#080e0d");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 660, 1424);
  for (let i = 0; i < 5; i++) {
    ctx.strokeStyle = `rgba(202,231,154,${0.4 - i * 0.06})`;
    ctx.lineWidth = 4 + i * 4;
    ctx.beginPath();
    ctx.ellipse(330, 650 + i * 10, 270 - i * 25, 330, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.fillStyle = "#eaf3df";
  ctx.textAlign = "center";
  ctx.font = "200 100px sans-serif";
  ctx.fillText("09:41", 330, 300);
  ctx.font = "24px sans-serif";
  ctx.fillText("10 月 27 日 · 星期二", 330, 350);
  ctx.font = "23px sans-serif";
  ctx.fillText("探索，从好奇开始", 330, 1150);
  ctx.font = "19px sans-serif";
  ctx.fillStyle = "#bbc9ae";
  ctx.fillText("示意界面 · 非官方系统截图", 330, 1190);
  ctx.fillStyle = "#e5ecd9";
  ctx.fillRect(260, 1380, 140, 6);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  const screen = plate(
    w - 0.14,
    h - 0.14,
    0.009,
    0.72,
    Object.assign(new THREE.MeshPhysicalMaterial({color:"#030505",emissive:"#ffffff",emissiveMap:t,emissiveIntensity:.8,roughness:.12,clearcoat:1,metalness:0}),{userData:{surfaceRole:"oled"}}),
    0.002,
  );
  put(g, screen, 0, 0, 0.036);
  return g;
}
export function frontGlassFactory(p, m, d) {
  const g = new THREE.Group();
  const w = d.dimensions.width / 10 - 0.12,
    h = d.dimensions.length / 10 - 0.12;
  const s = outline(w, h, 0.86);
  const inner = outline(w - 0.2, h - 0.2, 0.76);
  s.holes.push(new THREE.Path(inner.getPoints().reverse()));
  const geo = new THREE.ExtrudeGeometry(s, {
    depth: 0.03,
    bevelEnabled: false,
    curveSegments: 20,
  });
  geo.translate(0, 0, -0.015);
  put(g, new THREE.Mesh(geo, m.black));
  const pane = profiledSolid(
    w - 0.19,
    h - 0.19,
    0.76,
    [[-.004,.03],[.008,.015],[.021,.035]],
    new THREE.MeshPhysicalMaterial({
      color: "#d9ede5",
      transparent: true,
      opacity: 0.045,
      roughness: 0.08,
      metalness: 0,
      ior: 1.5,
      clearcoat: 1,
      depthWrite: false,
    }),
  );
  put(g, pane, 0, 0, 0);
  for (let i = -1; i <= 1; i++)
    put(g, disk(0.092, 0.016, m.black), i * 0.55, h / 2 - 0.5, 0.0135);
  const earpiece = plate(0.95, 0.035, 0.012, 0.014, m.black, 0.002);
  put(g, earpiece, 0, h / 2 - 0.13, 0.0155);
  return g;
}
export function buttonsFactory(p, m, d) {
  const g = new THREE.Group(),
    x = d.dimensions.width / 20 + 0.005;
  for (const [y, h] of [
    [4.73, 1.78],
    [2.16, 1.27],
  ]) {
    const gasket = plate(0.102,h+.045,.42,.045,m.black,.015); put(g,gasket,x-.018,y,0);
    const b = plate(0.08, h, 0.36, 0.038, m.metal, 0.018);
    put(g, b, x, y, 0);
  }
  for (const y of [5.7, -5.2])
    for (const side of [-1, 1])
      put(
        g,
        plate(0.16, 0.06, 0.71, 0.025, m.ceramic, 0.005),
        side * (x - 0.1),
        y,
        0,
      );
  return g;
}
export function portsFactory(p, m, d) {
  const g = new THREE.Group(),
    bottom = -d.dimensions.length / 20;
  const usb = plate(0.92, 0.27, 0.025, 0.12, m.black, 0.005);
  usb.rotation.x = Math.PI / 2;
  put(g, usb, 0, bottom + 0.09, 0);
  const tongue = plate(0.6, 0.035, 0.025, 0.01, m.silver, 0.003);
  tongue.rotation.x = Math.PI / 2;
  put(g, tongue, 0, bottom + 0.027, 0);
  for (let i = 0; i < 6; i++) {
    const hole = disk(0.055, 0.02, m.black);
    hole.rotation.x = 0;
    put(g, hole, 1.3 + i * 0.23, bottom + .05, 0);
  }
  for (const x of [-2.6, 2.6]) {
    const hole = plate(0.31, 0.09, 0.015, 0.04, m.black, 0.003);
    hole.rotation.x = Math.PI / 2;
    put(g, hole, x, -bottom-.005, 0.02);
  }
  return g;
}
export function simFactory(p, m, d) {
  const g = new THREE.Group();
  const tray = plate(1.65, 0.3, 0.025, 0.12, m.silver, 0.005);
  tray.rotation.x = Math.PI / 2;
  put(g, tray, -2.0, -d.dimensions.length / 20 + 0.02, 0);
  const hole = disk(0.025, 0.035, m.black);
  hole.rotation.x = 0;
  put(g, hole, -2.55, -d.dimensions.length / 20 + 0.004, 0);
  return g;
}
