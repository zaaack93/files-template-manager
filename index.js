const fs = require('fs');
const carbone = require('carbone');

// data object to inject
let data = {
  firstname : 'John',
  lastname : 'Wick'
};

// options object is used to pass more parameters to carbone render function 
let options = {
  convertTo: 'pdf' //can be docx, txt, ...
}

carbone.render('./helloo.odt', data, options, (err, res) => {
    if (err) {
      return console.log(err);
    }
    // fs is used to create the PDF file from the render result
    fs.writeFileSync('./result.pdf', res);
    process.exit();
});