#!/usr/bin/env node
// Minimal server for the design workbench.
// Serves static files + handles PUT /.mood-boards-spec.json to save the confirmed spec.
import { createServer } from 'http';
import { readFile, writeFile } from 'fs/promises';
import { join, extname } from 'path';

const PORT = parseInt(process.argv[2] || '3333', 10);
const ROOT = process.cwd();

const MIME = {
  '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.woff2': 'font/woff2',
};

createServer(async (req, res) => {
  // Handle PUT to save spec
  if (req.method === 'PUT' && req.url === '/.mood-boards-spec.json') {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const body = Buffer.concat(chunks).toString();
    try {
      JSON.parse(body); // validate
      await writeFile(join(ROOT, '.mood-boards-spec.json'), body);
      res.writeHead(200, { 'Content-Type': 'text/plain', 'Access-Control-Allow-Origin': '*' });
      res.end('saved');
    } catch (e) {
      res.writeHead(400); res.end('invalid json');
    }
    return;
  }

  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,PUT', 'Access-Control-Allow-Headers': 'Content-Type' });
    res.end();
    return;
  }

  // Static file serving
  const urlPath = req.url === '/' ? '/index.html' : req.url.split('?')[0];
  const filePath = join(ROOT, urlPath);
  try {
    const data = await readFile(filePath);
    const ext = extname(filePath);
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream', 'Access-Control-Allow-Origin': '*' });
    res.end(data);
  } catch {
    res.writeHead(404); res.end('not found');
  }
}).listen(PORT, () => {
  console.log(`Workbench server running at http://localhost:${PORT}`);
});
