import {readFileSync,writeFileSync} from 'node:fs';
const input=process.argv[2],data=JSON.parse(readFileSync(input)),trace=data.traceEvents||[],stats={};
for(const e of trace){const s=stats[e.name]||={count:0,totalMs:0,maxMs:0};s.count++;s.totalMs+=e.dur/1000;s.maxMs=Math.max(s.maxMs,e.dur/1000);}
const rows=Object.entries(stats).map(([name,s])=>({name,...s,meanMs:s.totalMs/s.count}));
writeFileSync(input.replace('.json','-cpu.json'),JSON.stringify(rows,null,2));
const colors=['#b9d898','#94bfca','#d4b48c','#be9fc6','#9eb7a3'];
const start=trace[0]?.ts||0,events=trace.filter(x=>x.ts-start<100000).slice(0,130);
const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="360"><rect width="1200" height="360" fill="#111716"/><text x="20" y="24" fill="#eef1e9" font-family="sans-serif">Instrumented main-thread flame chart — first 100 ms (not a Chrome DevTools CPU profile)</text>${events.map(e=>{const row=rows.findIndex(x=>x.name===e.name);return `<rect x="${200+(e.ts-start)/100}" y="${52+row*48}" width="${Math.max(.3,e.dur/100)}" height="30" fill="${colors[row%5]}"/>`;}).join('')}${rows.map((r,i)=>`<text x="8" y="${73+i*48}" fill="#eef1e9" font-size="12" font-family="sans-serif">${r.name.replaceAll('&','&amp;')}</text>`).join('')}<text x="200" y="330" fill="#eef1e9" font-family="sans-serif">0 → 100 ms; gaps are rAF wait / browser scheduling. Open JSON trace in Perfetto for complete timeline.</text></svg>`;
writeFileSync(input.replace('.json','-flame.svg'),svg);console.log(rows);
