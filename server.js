const http = require('node:http');
const fs = require('node:fs/promises');
const path = require('node:path');

const host = '127.0.0.1';
const port = 8765;
const assets = new Map([
  ['/', ['index.html', 'text/html']],
  ['/index.html', ['index.html', 'text/html']],
  ['/style.css', ['style.css', 'text/css']],
  ['/app.js', ['app.js', 'text/javascript']],
]);

const server = http.createServer(async (request, response) => {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.writeHead(405, { Allow: 'GET, HEAD' }).end();
    return;
  }

  const asset = assets.get(request.url.split('?')[0]);
  if (!asset) {
    response.writeHead(404).end();
    return;
  }

  const [filename, contentType] = asset;
  try {
    const contents = await fs.readFile(path.join(__dirname, filename));
    response.writeHead(200, { 'Content-Type': `${contentType}; charset=utf-8` });
    response.end(request.method === 'HEAD' ? undefined : contents);
  } catch (error) {
    console.error(`Could not read ${filename}: ${error.message}`);
    response.writeHead(500).end();
  }
});

server.on('error', (error) => {
  console.error(`Could not start Pairify at http://${host}:${port}: ${error.message}`);
  process.exitCode = 1;
});

server.listen(port, host, () => {
  console.log(`Pairify is running at http://${host}:${port}/`);
  console.log('Press Ctrl+C to stop.');
});
