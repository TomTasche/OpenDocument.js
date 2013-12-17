function onerror(message) {
	console.error(message);
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

function getFile() {
    zip.useWebWorkers = false;
	zip.createReader(new zip.HttpReader('sample.odt'), function(zipReader) {
		zipReader.getEntries(function(entries) {
			for (var i = 0; i < entries.length; i++) {
				var entry = entries[i];
				entry.getData(new zip.BlobWriter("text/plain"), closureHack(zipReader, entry, callback));
			}
		});
	}, onerror);
}

function downloadFile() {
    var request = new XMLHttpRequest();
    request.addEventListener("load", function() {
            var blob = new Blob([request.response]);
            
            zip.useWebWorkers = false;
        	unzipBlob(blob, function(entry, unzippedBlob) {
        		handleEntry(entry, unzippedBlob);
        	});
    }, false);
    request.addEventListener("error", onerror, false);
    request.open("GET", 'sample.odt');
    request.responseType = "arraybuffer";
    request.send();
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

downloadFile();