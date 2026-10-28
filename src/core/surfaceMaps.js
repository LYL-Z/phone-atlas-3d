import * as THREE from 'three';
// Seeded, light-independent pigment, tangent normal and roughness channels.
export function createSurfaceMaps(size=512,kind='fiber'){
 const color=new Uint8Array(size*size*4),normal=new Uint8Array(size*size*4),rough=new Uint8Array(size*size*4);let seed=0x9153ac77;
 const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
 for(let y=0;y<size;y++)for(let x=0;x<size;x++){const k=(y*size+x)*4,n=random()-.5;
  const vertical=(x<size/2)===(y<size/2),axis=vertical?x:y,period=kind==='fiber'?Math.max(2,size/200):Math.max(2,size/300);
  const wave=Math.sin(axis/period*Math.PI*2+n*.28),fine=Math.sin((x+y*1.7)*2.1);
  const value=kind==='fiber'?238+wave*16+n*5:250+n*5;
  for(let c=0;c<3;c++){color[k+c]=value;rough[k+c]=kind==='fiber'?190+wave*17+n*12:180+n*24;}
  const slope=kind==='fiber'?Math.cos(axis/period*Math.PI*2)*.31+n*.05:n*.15;
  const nx=vertical?slope:fine*.018,ny=vertical?fine*.018:slope,nz=Math.sqrt(Math.max(.1,1-nx*nx-ny*ny));
  normal.set([Math.round(127.5+127.5*nx),Math.round(127.5+127.5*ny),Math.round(127.5+127.5*nz),255],k);color[k+3]=rough[k+3]=255;
 }
 const texture=(data,space)=>{const t=new THREE.DataTexture(data,size,size);t.colorSpace=space;t.generateMipmaps=true;t.minFilter=THREE.LinearMipmapLinearFilter;t.magFilter=THREE.LinearFilter;t.anisotropy=4;t.needsUpdate=true;return t;};
 return {color:texture(color,THREE.SRGBColorSpace),normal:texture(normal,THREE.NoColorSpace),roughness:texture(rough,THREE.NoColorSpace)};
}
