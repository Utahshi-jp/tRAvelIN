const http = require("http");
const fs = require("fs");

const server = http.createServer((req, res) => {
  if (req.url === "/next") {
    fs.readFile("./next.html", "UTF-8", (err, data) => {
      if (err) {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.write("404 Not Found");
        res.end();
        return;
      }
      res.writeHead(200, { "Content-Type": "text/html" });
      res.write(data);
      res.end();
    });
  } else {
    fs.readFile("./index.html", "UTF-8", (err, data) => {
      if (err) {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.write("404 Not Found");
        res.end();
        return;
      }
      res.writeHead(200, { "Content-Type": "text/html" });
      res.write(data);
      res.end();
    });
  }
});

const port = 3000;
server.listen(port, function () {
  console.log("Node.js Server Started on port " + port);
});