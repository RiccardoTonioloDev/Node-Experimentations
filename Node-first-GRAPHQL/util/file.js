const path = require('path');
const fs = require('fs');

const clearImage = (filePath) => {
	filePath = path.join(__dirname, '..', filePath);
	fs.unlink(filePath, (err) =>
		console.log("Eventuale errore nella rimozione dell'immagine: " + err)
	);
};

exports.clearImage = clearImage;
