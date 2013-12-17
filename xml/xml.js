var xml = {

	loadFromURL: function (name) {
		if (window.XMLHttpRequest) {
			xhttp = new XMLHttpRequest();
		} else { // Internet Explorer compatibility
			xhttp = new ActiveXObject("Microsoft.XMLHTTP");
		}
		xhttp.open("GET", name, false);
		// not supported synchronously on firefox: xhttp.responseType = 'document';
		xhttp.overrideMimeType('text/xml');
		xhttp.send();
		return xhttp.responseXML;
	},

	loadFromString: function (text) {
		if (window.DOMParser) {
			parser = new DOMParser();
			xmlDoc = parser.parseFromString(text, "text/xml");
		} else { // Internet Explorer compatibility
			xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
			xmlDoc.async = false;
			xmlDoc.loadXML(text); 
		}
		return xmlDoc;
	}

}