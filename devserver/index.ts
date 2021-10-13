import http from 'http';
import fs from 'fs';
import path from 'path';

// Basic development server - just serves static files with cache disabled.

let defaultPath = './app'
let port = 8080

const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.wav': 'audio/wav',
    '.mp4': 'video/mp4',
    '.woff': 'application/font-woff',
    '.ttf': 'application/font-ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.otf': 'application/font-otf',
    '.wasm': 'application/wasm'
}

type kMime = keyof typeof mimeTypes

http.createServer((request, response) => {

    let filePath = path.join(
        defaultPath,
        (request.url == '/') ? 'index.html' : request.url as string
    );

    console.log(`req: ${request.url}, host: ${request.headers.host} ,resolving ${filePath}`);

    let extname = String(path.extname(filePath)).toLowerCase();

    let contentType = mimeTypes[extname as kMime] || 'application/octet-stream'

    fs.readFile(filePath, function (error, content) {
        if (error) {
            response.writeHead(500);
            response.end(`Server failure: ${error.code}..\n`)
            console.log(error)
        }
        else {
            response.writeHead(200, {
                'Content-Type': contentType,
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': 0
            })

            response.end(content, 'utf-8')
        }
    });

}).listen(port);

console.log(`Dev server running at http://127.0.0.1:${port}/`)
