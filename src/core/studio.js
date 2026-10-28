import * as THREE from 'three';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';
export const studios={studio:{name:'棚拍',exposure:1.02,ambient:.32,key:.7,cards:[[-3,2,-12,7,17,4],[-8,5,-10,4,13,5.5],[7,1,-8,1.6,15,6],[0,12,3,12,7,3.4],[-5,-6,7,3,11,2.8]]},soft:{name:'自然柔光',exposure:1.06,ambient:.45,key:.55,cards:[[-6,7,-8,12,14,3],[8,4,4,9,12,2.5],[0,13,0,12,10,2.6]]},rim:{name:'侧逆光',exposure:.96,ambient:.2,key:.35,cards:[[-7,3,-7,1.3,16,8],[8,5,7,2,16,9],[3,12,-8,10,3,4]]},lowkey:{name:'低调科技',exposure:.9,ambient:.18,key:.3,cards:[[-9,3,-6,1,17,9],[8,7,-2,1,13,6],[0,10,8,9,2,4]]},room:{name:'v1.0 基准环境',exposure:.92,ambient:1.3,key:2.5}};
export function createStudio(renderer,scene,lights){let target=null,preset='studio',size=256;const pmrem=new THREE.PMREMGenerator(renderer);
 function apply(name='studio',resolution=256){const settings=studios[name]||studios.studio;preset=name;size=resolution;let world;
  if(name==='room')world=new RoomEnvironment();else{world=new THREE.Scene();world.add(new THREE.Mesh(new THREE.BoxGeometry(40,40,40),new THREE.MeshBasicMaterial({color:'#171a1b',side:THREE.BackSide})));
   for(const [x,y,z,w,h,intensity]of settings.cards){const material=new THREE.MeshBasicMaterial({color:new THREE.Color().setRGB(intensity,intensity*.98,intensity*.94),side:THREE.DoubleSide});const card=new THREE.Mesh(new THREE.PlaneGeometry(w,h),material);card.position.set(x,y,z);card.lookAt(0,0,0);world.add(card);}}
  const next=pmrem.fromScene(world,.025,.1,100,{size});scene.environment=next.texture;target?.dispose();target=next;
  world.traverse(o=>{o.geometry?.dispose();if(o.material)o.material.dispose();});
  renderer.toneMappingExposure=settings.exposure;lights.ambient.intensity=settings.ambient;lights.key.intensity=settings.key;lights.rim.intensity=name==='room'?1.8:.18;lights.fill.intensity=name==='room'?1.2:.14;
 }
 apply();return {apply,get preset(){return preset;},get size(){return size;},dispose(){target?.dispose();pmrem.dispose();}};
}
