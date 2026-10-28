import * as THREE from 'three';

// All profile dimensions are photo-inferred modelling values, not mechanical measurements.
export function roundedContour(w,h,r,segments=16){const points=[];for(const [cx,cy,start] of [[w/2-r,h/2-r,0],[-w/2+r,h/2-r,Math.PI/2],[-w/2+r,-h/2+r,Math.PI],[w/2-r,-h/2+r,Math.PI*1.5]])for(let j=0;j<=segments;j++){const a=start+j/segments*Math.PI/2;points.push(new THREE.Vector2(cx+r*Math.cos(a),cy+r*Math.sin(a)));}return points;}

export function profiledSolid(w,h,r,profile,material,{caps=true,openEnds=false}={}){
 const positions=[],uv=[],indices=[],n=roundedContour(w,h,r).length;
 const layers=profile.map(([z,inset])=>roundedContour(w-2*inset,h-2*inset,Math.max(.02,r-inset)));
 function vertex(p,z){positions.push(p.x,p.y,z);uv.push(p.x/w+.5,p.y/h+.5);return positions.length/3-1;}
 layers.forEach((layer,k)=>layer.forEach(p=>vertex(p,profile[k][0])));
 for(let k=0;k<layers.length-1;k++)for(let i=0;i<n;i++){const j=(i+1)%n,p=layers[k][i],q=layers[k][j];
  const straightEnd=Math.abs(p.y-q.y)<1e-6&&Math.abs(p.x-q.x)>.5;
  if(openEnds&&straightEnd&&Math.abs(profile[k][0])<=.24&&Math.abs(profile[k+1][0])<=.24)continue;
  const a=k*n+i,b=k*n+j,c=(k+1)*n+i,d=(k+1)*n+j;indices.push(a,b,c,b,d,c);
 }
 if(caps)for(const k of [0,layers.length-1]){const points=layers[k],base=positions.length/3;points.forEach(p=>vertex(p,profile[k][0]));for(const [a,b,c]of THREE.ShapeUtils.triangulateShape(points,[]))k===0?indices.push(base+c,base+b,base+a):indices.push(base+a,base+b,base+c);}
 const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));geometry.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));geometry.setIndex(indices);geometry.computeVertexNormals();return new THREE.Mesh(geometry,material);
}
export function turned(profile,material,segments=128){const geo=new THREE.LatheGeometry(profile.map(p=>new THREE.Vector2(...p)),segments);geo.rotateX(Math.PI/2);return new THREE.Mesh(geo,material);}
export function opticalDome(radius,sag,material){const pos=[],uv=[],idx=[],radial=10,segments=64;
 for(let j=0;j<=radial;j++){const t=j/radial,r=radius*t;for(let i=0;i<=segments;i++){const a=i/segments*Math.PI*2;pos.push(Math.cos(a)*r,Math.sin(a)*r,-sag*(1-t*t));uv.push((Math.cos(a)*t+1)/2,(Math.sin(a)*t+1)/2);}}
 for(let j=0;j<radial;j++)for(let i=0;i<segments;i++){const a=j*(segments+1)+i,b=a+segments+1;idx.push(a,a+1,b,a+1,b+1,b);}
 const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));geo.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));geo.setIndex(idx);geo.computeVertexNormals();return new THREE.Mesh(geo,material);
}
export function role(mesh,name){mesh.userData.submeshRole=name;return mesh;}
