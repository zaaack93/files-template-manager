const fs = require('fs');
const carbone = require('carbone');

var data = {
    firstname : 'John',
    lastname : 'Doe'
  };

  var options = {
    "convertTo" : "pdf", //can be docx, txt, ...
    "extension" : "pdf"
  };

  carbone.render('./node_modules/carbone/examples/simple.odt', data, options, function(err, result){
    if (err) return console.log(err);
    fs.writeFileSync('result1.pdf', result);
    process.exit(); // to kill automatically LibreOffice workers
  });