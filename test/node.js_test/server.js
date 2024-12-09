// モジュール準備
const http = require("http");

// サーバー作成
const server = http.createServer((_, res) => {
  // HTMLファイルを返却する準備
  res.writeHead(200, {
    "Content-Type": "text/html; charset=utf-8",
  });
  // HTMLファイルの内容
  res.end("<h1>Hello World!</h1>");
});

// サーバー起動
const port = 3000;
server.listen(port, function () {
  console.log("Node.js Server Started:" + port);
});
