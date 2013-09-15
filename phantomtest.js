var page = require("webpage").create();

// page.settings = {
//         webSecurityEnabled: false
//     };
    
page.open('http://erykpiast.kd.io:9876');

console.log(JSON.stringify(page.settings, null, "\t"));