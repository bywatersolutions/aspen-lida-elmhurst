const fs = require('fs');

function getArgs() {
     const args = {};
     process.argv.slice(2, process.argv.length).forEach((arg) => {
          // long arg
          if (arg.slice(0, 2) === '--') {
               const longArg = arg.split('=');
               const longArgFlag = longArg[0].slice(2, longArg[0].length);
               args[longArgFlag] = longArg.length > 1 ? longArg[1] : true;
          }
          // flags
          else if (arg[0] === '-') {
               const flags = arg.slice(1, arg.length).split('');
               flags.forEach((flag) => {
                    args[flag] = true;
               });
          }
     });
     return args;
}

const args = getArgs();
let copyDefaultEnv = true;
if ("instance" in args) {
     const instance = args.instance;

     if (fs.existsSync('../app-configs/' + instance + '.env')) {
          fs.copyFileSync('../app-configs/' + instance + '.env', '../code/.env', 0, (err) => {
               if (err) {
                    console.log(err);
                    console.log('Could not copy .env for ' + instance + ' to ../code/.env');
                    return false;
               }
          });
          console.log("✅ Copied .env for " + instance);
          copyDefaultEnv = false;
     }else{
          console.log("No local environment defined");
     }
}
if (copyDefaultEnv) {
     fs.copyFileSync('../app-configs/.env', '../code/.env', 0, (err) => {
          if (err) {
               console.log(err);
               console.log('Could not copy default .env to ../code/.env');
               return false;
          }
     });
     console.log("✅ Copied default .env");
}

fs.copyFile("../app-config-templates/app.config.js", "../code/app.config.js", (err) => {
     if (err) {
          return console.log(err);
     } else {
          console.log("✅ Copied config file template.")
     }
});

fs.copyFile("../app-config-templates/eas.json", "../code/eas.json", (err) => {
     if (err) {
          return console.log(err);
     } else {
          console.log("✅ Copied eas.json file template.")
     }
});

