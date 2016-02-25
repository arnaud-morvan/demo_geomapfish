var fs = require('fs');
var nomnom = require('nomnom');
var Compiler = require('angular-gettext-tools').Compiler;

function main(inputs) {
  var compiler = new Compiler({format: 'json'});

  var contents = [];
  inputs.forEach(function(input) {
    fs.exists(input, function(exists) {
      // ignore un existing and empty files
      if (exists) {
            fs.readFile(input, {encoding: 'utf-8'}, function(err, content) {
              if (!err) {
                contents.push(content);
                if (contents.length == inputs.length) {
                    process.stdout.write(compiler.convertPo(contents.filter(function (content) {
                      return content.length != 0;
                    })));
                }
              }
              else {
                console.error(err);
                process.exit(1);
              }
            });
      }
      else {
        contents.push("")
      }
    });
  });
}

// If running this module directly then call the main function.
if (require.main === module) {
  var options = nomnom.parse();
  var inputs = options._;
  main(inputs);
}

module.exports = main;
