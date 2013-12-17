function onerror(message) {
	console.error(message);
}

function handleFileSelect(event) {
	var files = event.target.files;

	root = xml.loadFromURL(URL.createObjectURL(files[0]));
	console.log(root);
}

document.getElementById('files').addEventListener('change', handleFileSelect, false);