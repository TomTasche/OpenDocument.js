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
				console.log(entry);

				entry.getData(new zip.BlobWriter("text/plain"), closureHack(zipReader, entry, callback));
			}
		});
	}, onerror);
}

function logBlobText(entry, blob) {
	var reader = new FileReader();
	reader.onload = function(e) {
		if (entry.filename == 'content.xml') {
			document.getElementById('output').innerText = e.target.result;
		}

		console.log(e.target.result);
		console.log("--------------");
	};
	reader.readAsText(blob);
}

function handleFileSelect(event) {
	var files = event.target.files;

	for (var i = 0, f; f = files[i]; i++) {
		zip.useWebWorkers = false;
		unzipBlob(f, function(entry, unzippedBlob) {
			logBlobText(entry, unzippedBlob);
		});
	}
}

document.getElementById('files').addEventListener('change', handleFileSelect, false);
