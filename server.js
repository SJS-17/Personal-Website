const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 3000;
const BASE = __dirname;

const mimeTypes = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
  ".json": "application/json",
  ".ico": "image/x-icon",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
};

const server = http.createServer((req, res) => {
  let filePath = path.join(BASE, req.url === "/" ? "index.html" : req.url);
  filePath = path.normalize(filePath);

  if (!filePath.startsWith(BASE)) {
    res.statusCode = 403;
    res.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.statusCode = err.code === "ENOENT" ? 404 : 500;
      res.setHeader("Content-Type", "text/plain");
      res.end(res.statusCode === 404 ? "Not Found" : "Server Error");
      return;
    }

    const ext = path.extname(filePath);
    const contentType = mimeTypes[ext] || "application/octet-stream";
    res.setHeader("Content-Type", contentType);
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
