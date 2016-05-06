
var select = document.querySelector("#fiscal-year");
var year = select.options[select.selectedIndex].value;
getCSV(year);

function getCSV(year){
	toggleLoading();

	var url = encodeURIComponent("https://www.osha.gov/dep/fatcat/FatalitiesFY" + year + ".csv");

	//this is a generic YQL statement, will get the contents of any page
	var yql = 'http://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent("select * from html where url='") + url + "'&format=json";

	$.getJSON(yql, function(data){
		var csv = data.query.results.body;
		csv = csv.replace(/\uFFFD/g, ''); // removes random diamond quesiton marks

		var json = Papa.parse(csv);
		appendData(json);

		toggleLoading();
	}).error(function(data){
		console.log(data);
		alert("There was an error accessing the resource")
	});
}

function appendData(json){
	var data = json.data;

	/*jshint multistr: true */
	var html = "<thead>\
					<tr>\
						<th>Summary Report Date</th>\
						<th>Date of Incident</th>\
						<th>Company</th>\
						<th>State</th>\
						<th>Description</th>\
					</tr>\
				</thead>\
				<tbody></tbody>";

	document.querySelector("#main-table").innerHTML = html;

	for(var i = 1; i < data.length; i++){
		if(data[i][0] !== ""){
			var summaryReportData = data[i][1];
			var dateOfIncident = data[i][2];
			var description = data[i][4];

			var companyInfo = data[i][3];
			
			//regex is fun... there are vast inconsistencies with the company info
			var stateArray = /([A-z]{2,})(?:,\.? ?|\* ?| |$|)(?:\d{1,}(?:\-\d{1,})?)?(?:$| \()/g.exec(companyInfo);
			var state = "UNK";

			if(stateArray) state = stateArray[1];

			html = "<td>" + summaryReportData + "</td>\
					<td>" + dateOfIncident + "</td>\
					<td>" + companyInfo + "</td>\
					<td>" + state + "</td>\
					<td>" + description + "</td>";

			var tr = document.createElement("tr");
			tr.innerHTML = html;

			document.querySelector("#main-table tbody").appendChild(tr);
		}
	}

	new Tablesort(document.querySelector("#main-table"));
}

function toggleLoading(){
	var loadingElement = document.querySelector(".loading");

	if(loadingElement.style.display == "none"){
		loadingElement.style.display = "inline-block";
	} else {
		loadingElement.style.display = "none";
	}
}