import * as THREE from 'three';
import {createSurfaceMaps} from './surfaceMaps.js';
import {qualityPresets} from './quality.js';
export function createMaterials(color,quality='medium'){
 const q=qualityPresets[quality]||qualityPresets.medium,fiber=createSurfaceMaps(q.texture),grain=createSurfaceMaps(Math.min(512,q.texture),'grain');
 const standard=p=>new THREE.MeshStandardMaterial(p),physical=p=>new THREE.MeshPhysicalMaterial(p);
 const materials={
 metal:standard({color:color.metal,metalness:.96,roughness:.29,normalMap:grain.normal,normalScale:new THREE.Vector2(.09,.035),roughnessMap:grain.roughness,envMapIntensity:1.25}),
 shell:physical({color:color.shell,metalness:0,roughness:.5,clearcoat:.12,clearcoatRoughness:.3,normalMap:grain.normal,normalScale:new THREE.Vector2(.06,.06)}),
 textile:physical({color:color.inset,map:fiber.color,metalness:0,roughness:.65,roughnessMap:fiber.roughness,normalMap:fiber.normal,normalScale:new THREE.Vector2(.4,.4),clearcoat:.17,clearcoatRoughness:.36}),
 gem:physical({color:color.id==='green'?'#658d31':color.shell,metalness:0,roughness:.07,ior:1.83,clearcoat:1,clearcoatRoughness:.055,iridescence:q.film?.14:0,iridescenceThicknessRange:[110,190],envMapIntensity:1.5}),
 lens:physical({color:'#060d1b',metalness:0,roughness:.035,ior:1.5,clearcoat:1,clearcoatRoughness:.035,iridescence:q.film?.2:0,iridescenceThicknessRange:[95,155],envMapIntensity:1.4,side:THREE.DoubleSide}),
 glass:physical({color:'#122022',metalness:0,roughness:.055,ior:1.5,clearcoat:1}),
 cameraFace:physical({color:'#050809',metalness:0,roughness:.19,clearcoat:.95,clearcoatRoughness:.08}),
 medallion:standard({color:color.metal,metalness:.94,roughness:.23}),
 black:standard({color:'#101519',metalness:.03,roughness:.48}),
 board:standard({color:'#123d31',metalness:0,roughness:.63,normalMap:grain.normal,normalScale:new THREE.Vector2(.035,.035)}),
 silver:standard({color:'#aeb8b9',metalness:.96,roughness:.35,normalMap:grain.normal,normalScale:new THREE.Vector2(.07,.025)}),
 copper:standard({color:'#bb8357',metalness:.97,roughness:.31}),
 battery:standard({color:'#242a2e',metalness:0,roughness:.68}),
 flex:standard({color:'#a46b22',metalness:0,roughness:.49}),
 ceramic:standard({color:'#252b2c',metalness:0,roughness:.72,normalMap:grain.normal,normalScale:new THREE.Vector2(.035,.035)}),
 white:standard({color:'#ece8d8',metalness:0,roughness:.48})
 };
 for(const [role,m]of Object.entries(materials)){m.name=role;m.userData={surfaceRole:role,evidenceTier:'photo_inferred',parameters:'art-directed approximations; no measured IOR/BRDF'};}
 return materials;
}
