const fs = require('fs');
const path = require('path');

const homePath = path.resolve(__dirname, '../src/views/Home.tsx');
let content = fs.readFileSync(homePath, 'utf8');

content = content.replace("</div>\r\n\r\n      }\r\n      \r\n      {/* 02.", "</div>\r\n\r\n      {/* 02.");
content = content.replace("</div>\n\n      }\n      \n      {/* 02.", "</div>\n\n      {/* 02.");

fs.writeFileSync(homePath, content, 'utf8');
console.log('Fixed orphan brace in Home.tsx!');
