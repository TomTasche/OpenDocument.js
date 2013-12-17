function onerror(message) {
	console.error(message);
}

function zipBlob(blob, callback) {
	zip.createWriter(new zip.BlobWriter("application/zip"), function(zipWriter) {
		zipWriter.add(FILENAME, new zip.BlobReader(blob), function() {
			zipWriter.close(callback);
		});
	}, onerror);
}

// http://stackoverflow.com/questions/750486/javascript-closure-inside-loops-simple-practical-example
function closureHack(zipReader, entry, callback) {
	return function(data) {
		zipReader.close();
		callback(entry, data);
	};
}

function unzipBlob(blob, callback) {
	zip.createReader(new zip.BlobReader(blob), function(zipReader) {
		zipReader.getEntries(function(entries) {
			for (var i = 0; i < entries.length; i++) {
				var entry = entries[i];
				entry.getData(new zip.BlobWriter("text/plain"), closureHack(zipReader, entry, callback));
			}
		});
	}, onerror);
}

function handleFileSelect(event) {
	var files = event.target.files;

	for (var i = 0, f; f = files[i]; i++) {
		zip.useWebWorkers = false;
		unzipBlob(f, function(entry, unzippedBlob) {
			handleEntry(entry, unzippedBlob);
		});
	}
}

function handleEntry(entry, blob) {
	if (entry.filename != "content.xml") return;

	root = xml.loadFromURL(URL.createObjectURL(blob));
	console.log(root);

    var output = document.getElementById('output');
    output.innerText = "";
    
    var children = root.documentElement.lastChild.childNodes[0].childNodes;
	for (var i = 0; i < children.length; i++) {
	    output.innerHTML += "<br />" + children[i].textContent;
	}
}

document.getElementById('files').addEventListener('change', handleFileSelect, false);