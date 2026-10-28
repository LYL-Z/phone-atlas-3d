import {readFileSync,writeFileSync} from 'node:fs';
import {device} from '../src/devices/mate90ProMaxCollector.js';
const reference=JSON.parse(readFileSync('docs/reference/calibration.json'));
const w=device.dimensions.width/10,points=reference.points;
const estimated=(id)=>device.parts.find(p=>p.id===id).assembledTransform.position;
const comparisons=[];
for(const [id,landmark]of [['island','ring_left'],['main-camera','main_camera'],['ultrawide','ultrawide'],['telephoto','telephoto'],['flash','flash']]){const [x,y]=estimated(id),photo=id==='island'?[0,(points.ring_top.normalized[1]+points.ring_bottom.normalized[1])/2]:points[landmark].normalized;const model=[-x/w,y/w],error=Math.hypot(model[0]-photo[0],model[1]-photo[1]);comparisons.push({feature:id,photoNormalized:photo,modelNormalized:model,errorInBodyWidths:error,errorMM:error*78.7,withinPhotoInterval:error<=.035});}
const actual=JSON.parse(readFileSync('docs/upgrade-v1.1/evidence/G5/green-back.json'));
const nominal=[78.7,164.5,8.15],envelope=actual.bodyEnvelopeMM.map((value,i)=>({axis:['width','length','thickness'][i],modelMM:value,officialMM:nominal[i],relativeError:Math.abs(value-nominal[i])/nominal[i]}));
const out={method:'Geometry-space landmark comparison using width-normalized photo estimates; not pixel segmentation, CAD metrology or a colorimetric assessment.',photoUncertainty:reference.estimatedUncertainty,comparisons,envelope,withinOnePercentEnvelope:envelope.every(x=>x.relativeError<.01),gemDiameterRatio:2*(device.exteriorProfile.starRadius+.012)/w,referenceRingDiameterRatio:(489-177)/409,medallionDiameterRatio:2*(device.exteriorProfile.medallionRadius+.015)/w,rmseInBodyWidths:Math.sqrt(comparisons.reduce((s,x)=>s+x.errorInBodyWidths**2,0)/comparisons.length)};
writeFileSync('docs/upgrade-v1.1/evidence/G5/visual-metrics.json',JSON.stringify(out,null,2));console.log(out);
