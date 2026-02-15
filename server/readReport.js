const fs = require('fs');
const lines = fs.readFileSync('assignReport.txt', 'utf8').split('\n');
lines.forEach((line, i) => {
    console.log((i + 1) + ': ' + line);
});
