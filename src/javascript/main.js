getCSV("10");

function getCSV(year){
	var url = encodeURIComponent("https://www.osha.gov/dep/fatcat/FatalitiesFY" + year + ".csv");

	//this is a generic YQL statement, will get the contents of any page
	var yql = 'http://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent("select * from html where url='") + url + "'&format=json";

	$.getJSON(yql, function(data){
		var csv = data.query.results.body;
		csv = csv.replace(/\uFFFD/g, ''); // has random diamond quesiton marks

		var json = Papa.parse(csv);
		appendData(json);
	})
}

function appendData(json){
	var data = json.data;

	for(var i = 1; i < data.length; i++){
		if(data[i] !== ""){
			var summaryReportData = data[i][1];
			var dateOfIncident = data[i][2];
			var company = data[i][3];
			var description = data[i][4];

			var html = "<td>" + summaryReportData + "</td><td>" + dateOfIncident + "</td><td>" + company + "</td><td>" + description + "</td>";

			var tr = document.createElement("tr");
			tr.innerHTML = html;

			document.querySelector("#main-table tbody").appendChild(tr);
		}
	}

	new Tablesort(document.querySelector("#main-table"));
}