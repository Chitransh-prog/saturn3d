const fs = require('fs');
let code = fs.readFileSync('saturn-3d-main/src/components/Printer3D.tsx', 'utf8');
code = code.replace(/\r\n/g, '\n');
code = code.replace(/color="#F7931E" roughness=\{0\.3\} metalness=\{0\.8\}/g, 'color="#412f91" roughness={0.3} metalness={0.8}');
code = code.replace(/color="#F7931E" roughness=\{0\.3\}/g, 'color="#412f91" roughness={0.3}');
fs.writeFileSync('saturn-3d-main/src/components/Printer3D.tsx', code, 'utf8');
console.log('Printer3D.tsx updated!');
