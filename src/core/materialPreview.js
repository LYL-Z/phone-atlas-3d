import * as THREE from 'three';
import {textPlane,put} from '../factories/geometry.js';
export function showMaterialPreview(engine,model){
 const group=new THREE.Group(),roles=['metal','textile','lens','gem'];model.root.visible=false;
 for(let i=0;i<4;i++){const x=(i-1.5)*3.5;put(group,new THREE.Mesh(new THREE.SphereGeometry(1.1,64,40),model.materials[roles[i]]),x,1,0);const text=textPlane(['加工金属','锦纤近似','光学表面','宝石环近似'][i],3,.5,'#d8dfd3',90);text.rotation.y=Math.PI;put(group,text,x,-.7,-.25);}
 for(const [x,color,label]of [[-2,new THREE.Color().setRGB(.9,.9,.9),'白标准 .90'],[2,new THREE.Color().setRGB(.18,.18,.18),'灰标准 .18']]){put(group,new THREE.Mesh(new THREE.SphereGeometry(.65,48,32),new THREE.MeshStandardMaterial({color,roughness:.5,metalness:0})),x,-3,0);const t=textPlane(label,2,.35,'#d8dfd3',85);t.rotation.y=Math.PI;put(group,t,x,-4,-.2);}
 engine.scene.add(group);engine.controls.target.set(0,-.8,0);engine.camera.position.set(0,1,-24);engine.controls.update();
 const panel=document.createElement('p');panel.className='material-debug';panel.textContent='开发材质对照 · 金属 / 锦纤 / 光学 / 宝石；IOR、薄膜和表面参数均为近似。通过“光影与画质”切换环境；白/灰为线性反射率参考。退出：移除 URL 的 materials=1。';document.body.append(panel);
}
