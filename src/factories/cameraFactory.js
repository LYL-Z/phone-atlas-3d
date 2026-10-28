import * as THREE from "three";
import {disk,ring,put,plate,textPlane} from "./geometry.js";
import {turned,opticalDome,role} from "./profileGeometry.js";
import {collectorExterior} from "../devices/exteriorProfiles.js";
export function islandFactory(p,m,d){
 const g=new THREE.Group(),r=(d.exteriorProfile||collectorExterior).starRadius;
 put(g,role(turned([[r-.16,.13],[r-.02,.075],[r+.035,-.01],[r+.035,-.09],[r-.005,-.15],[r-.12,-.18],[r-.16,.13]],m.metal),'mount-shoulder'));
 put(g,role(turned([[r-.075,-.105],[r+.012,-.155],[r-.005,-.235],[r-.035,-.28],[r-.10,-.272],[r-.16,-.22],[r-.15,-.15],[r-.075,-.105]],m.gem||m.glass),'gem-star-ring'));
 put(g,role(turned([[r-.18,-.15],[r-.16,-.20],[r-.17,-.275],[r-.22,-.28],[r-.23,-.18],[r-.18,-.15]],m.black),'optical-gasket'));
 // Openings follow visible lenses; no assumed sensor package or optical prescription.
 const shape=new THREE.Shape();shape.absarc(0,0,r-.19,0,Math.PI*2,false);
 for(const [x,y,radius]of [[1.98,0,.59],[-1.98,0,.57],[0,1.91,.43],[-1.02,1.74,.18],[0,-2.07,.35]]){const h=new THREE.Path();h.absarc(x,y,radius,0,Math.PI*2,true);shape.holes.push(h);}
 const faceGeo=new THREE.ExtrudeGeometry(shape,{depth:.025,bevelEnabled:false,curveSegments:48});faceGeo.translate(0,0,-.275);
 put(g,role(new THREE.Mesh(faceGeo,m.cameraFace||m.black),'optical-face'));
 const mr=(d.exteriorProfile||collectorExterior).medallionRadius;
 put(g,role(turned([[0,-.30],[mr*.25,-.298],[mr*.55,-.288],[mr*.82,-.266],[mr,-.24],[mr+.015,-.19],[mr-.035,-.16],[0,-.16]],m.medallion||m.metal),'xmage-medallion'));
 const logo=textPlane('XMAGE',1.5,.33,'#e4e8d9',165);logo.rotation.y=Math.PI;put(g,role(logo,'xmage-print'),0,0,-.304);
 // Fine machining lines on the visible collar, not a fabricated bayonet mechanism.
 for(let i=0;i<3;i++)put(g,role(ring(r+.015,r+.003,.012,m.metal),'collar-machining'),0,0,.04-i*.035);
 for(let i=0;i<4;i++)put(g,role(plate(.18,.055,.024,.018,m.silver,.004),'accessory-contact'),-.4+i*.27,-r+.03,-.08);
 return g;
}
export function lensFactory(p,m){
 const g=new THREE.Group(),r=p.config.r||.48;
 put(g,role(turned([[r*.88,.05],[r*.94,-.025],[r*.94,-.13],[r*.82,-.18],[r*.69,-.18],[r*.69,-.05],[r*.88,.05]],m.black),'lens-barrel'));
 put(g,role(turned([[r*.73,-.13],[r*.76,-.17],[r*.71,-.195],[r*.65,-.185],[r*.73,-.13]],m.metal),'lens-bevel'));
 put(g,role(disk(r*.61,.025,m.black),'aperture'),0,0,-.125);
 for(let i=0;i<2;i++)put(g,role(opticalDome(r*(.64-i*.1),.018+i*.008,m.lens||m.glass),'curved-optical-element'),0,0,-.185-i*.022);
 if(p.config.periscope){const prism=plate(r*.93,r*.78,.016,.08,m.lens||m.glass,.005);put(g,role(prism,'periscope-window'),0,0,-.212);}
 return g;
}
export function flashFactory(p,m){const g=new THREE.Group();put(g,role(plate(.6,.2,.035,.09,m.metal,.007),'flash-recess'));put(g,role(plate(.49,.14,.012,.06,m.white,.004),'flash-diffuser'),0,0,-.026);return g;}
export function lensCoverFactory(p,m,d){
 const g=new THREE.Group(),r=(d.exteriorProfile||collectorExterior).starRadius;
 put(g,role(turned([[r-.24,.015],[r-.19,0],[r-.20,-.014],[r-.255,-.01],[r-.24,.015]],m.glass),'cover-edge'));
 return g;
}
