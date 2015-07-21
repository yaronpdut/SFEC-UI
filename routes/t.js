var fs = require('fs');
var cfg = JSON.parse(fs.readFileSync('../cfg.json', 'utf8'));

console.log(cfg.serverAddress);
console.log(cfg.serverPort);