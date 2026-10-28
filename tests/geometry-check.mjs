import assert from 'node:assert/strict';
import * as THREE from 'three';
import {frameFactory,portsFactory,buttonsFactory} from '../src/factories/bodyFactory.js';
import {createMaterials} from '../src/core/materials.js';
import {device} from '../src/devices/mate90ProMaxCollector.js';
import {device as frozen} from '../checkpoints/M4/src/devices/mate90ProMaxCollector.js';
assert.deepEqual(device.parts.map(p=>[p.id,p.assembledTransform,p.explodeVector,p.explodeOrder]),frozen.parts.map(p=>[p.id,p.assembledTransform,p.explodeVector,p.explodeOrder]));
for(const c of device.colors){const m=createMaterials(c),g=frameFactory({},m,device);const size=new THREE.Box3().setFromObject(g).getSize(new THREE.Vector3());assert.ok(Math.abs(size.x*10-78.7)<.01);assert.ok(Math.abs(size.y*10-164.5)<.01);assert.ok(size.z*10<=8.15);for(const obj of [g,portsFactory({},m,device),buttonsFactory({},m,device)])obj.traverse(x=>{if(x.geometry){for(const v of x.geometry.attributes.position.array)assert.ok(Number.isFinite(v));x.geometry.dispose();}});for(const material of Object.values(m))if(material?.isMaterial)material.dispose();}
console.log('PASS: four-color frame envelope, finite aperture geometry, and frozen 31-part transform contract.');
