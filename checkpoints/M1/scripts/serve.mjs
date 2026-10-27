import http from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import path from 'node:path';
const root=process.cwd(), port=Number(process.env.PORT||4173);
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.png':'image/png','.svg':'image/svg+xml','.md':'text/plain; charset=utf-8'};
http.createServer(async(req,res)=>{try{const url=new URL(req.url,'http://localhost');let rel=decodeURIComponent(url.pathname).replace(/^\//,'')||'index.html';if(!/^(index\.html|styles\.css|src\/|vendor\/|favicon\.svg|README\.md|SOURCE_NOTES\.md|TEST_CHECKLIST\.md|tests\/browser\.html)/.test(rel))throw Error('not public');let file=path.resolve(root,rel);if(!file.startsWith(root+path.sep))throw Error('path');if(!(await stat(file)).isFile())throw Error('not file');res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream','Cache-Control':'no-cache'});res.end(await readFile(file));}catch{res.writeHead(404);res.end('Not found');}}).listen(port,'127.0.0.1',()=>console.log(`Phone Atlas 3D: http://127.0.0.1:${port}`));
