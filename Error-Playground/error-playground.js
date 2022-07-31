//test di errori
const sum = (a, b) => {
	if (a && b) {
		return a + b;
	}
	throw new Error('Invalid arguments.');
	//Questo è il modo in cui si crea un oggetto Error, che viene lanciato:
	//ovvero viene reso noto l'errore in console, e probabilmente viene bloccato
	//il programma.
};

try {
	console.log(sum(1));
} catch (error) {
	console.log('Error catched');
}
