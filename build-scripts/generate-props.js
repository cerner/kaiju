const fs = require('fs');
const PropsGen = require('./doc-gen/properties');

PropsGen.print(fs.readFileSync(process.argv[2]));
