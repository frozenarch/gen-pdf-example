require('dotenv').config();

var argv = require('minimist')(process.argv.slice(2));
console.log(argv);

const { Client } = require('pg')
const client = new Client()
client.connect().then(() => {
	client.query('select public.test_pdf($1) as res ', [{"a": "b"},], (err, res) => {
		if (!err) {
			var PdfPrinter = require('pdfmake');
			var printer = new PdfPrinter(require(__dirname + '/fonts/Roboto'));
			var fs = require('fs');
			pdf_json = res.rows[0].res
			var pdfDoc = printer.createPdfKitDocument(pdf_json);
			pdfDoc.pipe(fs.createWriteStream(`pdfs/${pdf_json.filename || 'unknown.pdf'}`));
			pdfDoc.end();
		} else {
			console.error(err.stack);
		}
	   // Hello World!
	  client.end()
	});
}).catch(err => {
	console.error(err.stack)
})
