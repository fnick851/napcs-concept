// get hash values from URL, will be accessed in subsequent scripts
var hash_value = window.location.hash.replace('#', '')
var keywords = hash_value.split('&')
var keyword1 = keywords[0]
var keyword2 = keywords[1]
var keyword3 = keywords[2]
var keyword4 = keywords[3]
var year = '2014'


/*============================================
=            define geo data path            =
============================================*/

// for mapping, get the correct geojson file, and json file(optional), based on the hash value
if (keyword1 === 'national' || keyword1 === 'mgmt_company') {
    var geojson_dir = '../data/map_data/national.geojson'
    if (keyword1 === 'mgmt_company') {
        var mgmt_company_name = keyword2
        // load mgmt company serving states JSON
        var mgmtData = (function () {
            var mgmtData = null;
            $.ajax({
                'async': false,
                'global': false,
                'url': '../data/map_data/mgmt_companies.json',
                'dataType': "json",
                'success': function (data) {
                    mgmtData = data;
                }
            });
            return mgmtData;
        })();
        // list of states served
        var states_served = mgmtData[mgmt_company_name].states;
    }
}
if (keyword1 === 'state' || keyword1 === 'school_district' || keyword1 === 'authorizer' || keyword1 === 'school') {
    var geojson_dir = '../data/map_data/SchoolDistricts_Processed/' + keyword2 + "_school_district.geojson"
    if (keyword1 === 'school_district') {
        var zoom_to = keyword3
    }
    if (keyword1 === 'authorizer') {
        var data_file2_name = keyword2 + ".json"
        var authorizer_name = keyword3
        // load state school locations data
        var authorizer_info = (function () {
            var authorizer_info = null;
            $.ajax({
                'async': false,
                'global': false,
                'url': '../data/map_data/authorizers/' + data_file2_name,
                'dataType': "json",
                'success': function (data) {
                    authorizer_info = data;
                }
            });
            return authorizer_info;
        })();
        var districts_served = authorizer_info[authorizer_name].districts_served;
    }
    if (keyword1 === 'school') {
        var data_file2_name = keyword2 + ".json";
        var school_name = keyword3;
        // load state school locations data
        var schoolLatLons = (function () {
            var schoolLatLons = null;
            $.ajax({
                'async': false,
                'global': false,
                'url': '../data/map_data/schools/' + data_file2_name,
                'dataType': "json",
                'success': function (data) {
                    schoolLatLons = data;
                }
            });
            return schoolLatLons;
        })();
        // zoom to the district the schools lives in, accoring to school lat lon json file.
        var zoom_to = schoolLatLons[school_name].school_district;
    }
}
if (keyword1 === 'congressional_district') {
    var geojson_dir = '../data/map_data/CongressionalDistricts_Processed/' + keyword2 + "_congressional_district.geojson"
    var zoom_to = keyword3
}

/*=====  End of define geo data path  ======*/






/*=====================================
=            define colors            =
=====================================*/

// two sets of color for donuts
var donut_color_spectrums = {
"school_view": ["#91664c", "#f39f53", "#ff7174", "#fddcb1", "#76c5d5", "#005f80"],
"student_view": ["#005f80", "#6c93ac", "#76c5d5", "#f26d78", "#f39f53", "#73aa4f"]
}
  
// two sets of color for bar charts
var bar_chart_colors = {
"school_view": '#f39f53',
"student_view": '#009fc3'
}

// color scale for map shapes
map_color = ['#969696', '#326b8a', '#608ca4', '#8dacbe', '#bacdd8', '#e8eef2'];

/*=====  End of define colors  ======*/






  

/*===============================================
=            national level snapshot            =
===============================================*/

	if (keyword1 === "national") {

		console.log('level ', keyword1 )
		var view = keyword2
		// assign donut color based on view
		var donut_color_spectrum = donut_color_spectrums[view]
		// assign bar color based on view
		var bar_chart_color = bar_chart_colors[view]


		/*----------  school view snapshot  ----------*/
		
		if (keyword2 === "school_view") {
			console.log("we are in school view")
			$(".container-fluid").addClass("schools")
			$(".state-info").empty().append("<div id='map' style='min-height: 250px; max-width: 500px;'>")


			// append title
			$(".region").text("National");

			// draw map
			$.getScript('map/national_map.js')
			
			// draw charts
			// define viz configs
			var donut_config1 = ["../data/chart_data/national/mgmt_type_donut/"+year+".tsv", "Schools by Management Type", "chart1", "translate(0,-25)"]
			var donut_config2 = ["../data/chart_data/national/locale_donut/"+year+".tsv", "Schools by Locale", "chart2", "translate(0,-25)"]
			var donut_config3 = ["../data/chart_data/national/non_charter_locale_donut/"+year+".tsv", "Schools by Locale", "chart3", "translate(0,-25)"]
			var bar_config = ["../data/chart_data/national/total_by_year.tsv", "chart4", "Total Number of Charter Schools", "translate(0,-25)"]
			var config_array = [donut_config1, donut_config2, donut_config3]
			config_array.forEach(function(el){
			  donut_multi(el)
			})
			bar(bar_config)

		}

		/*----------  student view snapshot  ----------*/
		
		if (keyword2 === "student_view") {
			console.log("we are in student view")
			$(".container-fluid").addClass("students")

			// clean state-info container
			$(".state-info").empty()
			$(".chart4").removeClass("total-chart")
			$(".state-info").addClass("total-chart")

			// append title
			$(".region").text("National"); // append the correct state name
			// draw charts
			// define viz configs
			var donut_config1 = ["../data/chart_data/national/enrollment_compare_donut/"+year+".tsv", "Student Enrollment Share", "chart1", "translate(0,-25)"]
			var donut_config2 = ["../data/chart_data/national/free_lunch_donut/"+year+".tsv", "Free or Reduced-price Lunch Status", "chart2", "translate(0,-25)"]
			var donut_config3 = ["../data/chart_data/national/non_charter_free_lunch_donut/"+year+".tsv", "Free or Reduced-price Lunch Status", "chart3", "translate(0,-25)"]
			var bar_config = ["../data/chart_data/national/total_by_year.tsv", "state-info", "Charter School Student Enrollment"]
			var donut_config4 = ["../data/chart_data/national/race_donut/"+year+".tsv", "Students by Race/Ethnicity", "chart4", "translate(0, 10)"]
			var donut_config5 = ["../data/chart_data/national/non_charter_race_donut/"+year+".tsv", "Students by Race/Ethnicity", "chart5", "translate(0,10)"]
			var config_array = [donut_config1, donut_config2, donut_config3, donut_config4, donut_config5]
			config_array.forEach(function(el){
			  donut_multi(el)
			})
			bar(bar_config)
		}
		
	}

/*=====  End of national level snapshot  ======*/








/*============================================
=            state level snapshot            =
============================================*/

	if (keyword1 === "state") {

		console.log('level ', keyword1 )
		var view = keyword3
		// assign donut color based on view
		var donut_color_spectrum = donut_color_spectrums[view]
		// assign bar color based on view
		var bar_chart_color = bar_chart_colors[view]

		/*----------  school view snapshot  ----------*/
		
		if (keyword3 === "school_view") {
			console.log("we are in school view")
			$(".container-fluid").addClass("schools")
			// draw map
			$.getScript('map/state_map.js')
			// append stats info
			// get hash value
			var state_keyword = keyword2
			// append the stats
			var stat = (function () {
			    var stat = null;
			    $.ajax({
			        'async': false,
			        'global': false,
			        'url': '../data/chart_data/state/'+state_keyword+"/stats.json",
			        'dataType': "json",
			        'success': function (data) {
			            stat = data;
			        }
			    });
			    return stat;
			})();
			// console.log(stat)
			$(".region").text(stat.state);
			$("#text-info").append("<h4>Senator(s)</h3>");
			for (var key in stat.senator) {
			  $("#text-info").append("<p>"+key+"</p><p><a href='"+stat.senator[key]+"'>"+stat.senator[key]+"</a><p>");
			}
		
			$("#text-info").append("<br>")

			$("#text-info").append("<h4>Organization(s)</h3>");
			for (var key in stat.org) {
			  $("#text-info").append("<p>"+key+"</p><p><a href='"+stat.org[key]+"'>"+stat.org[key]+"</a></p>");
			}
			// draw charts
			// define viz configs
			var donut_config1 = ["../data/chart_data/state/"+keyword2+"/mgmt_type_donut/"+year+".tsv", "Schools by Management Type", "chart1", "translate(0,-25)"]
			var donut_config2 = ["../data/chart_data/state/"+keyword2+"/locale_donut/"+year+".tsv", "Schools by Locale", "chart2", "translate(0,-25)"]
			var donut_config3 = ["../data/chart_data/state/"+keyword2+"/non_charter_locale_donut/"+year+".tsv", "Schools by Locale", "chart3", "translate(0,-25)"]
			var bar_config = ["../data/chart_data/state/"+keyword2+"/total_by_year.tsv", "chart4", "Total Number of Charter Schools", "translate(0,-25)"]
			var config_array = [donut_config1, donut_config2, donut_config3]
			config_array.forEach(function(el){
			  donut_multi(el)
			})
			bar(bar_config)
		}

		/*----------  student view snapshot  ----------*/
		
		if (keyword3 === "student_view") {
			console.log("we are in student view")
			$(".container-fluid").addClass("students")
			// clean state-info container
			$(".state-info").empty()
			$(".chart4").removeClass("total-chart")
			$(".state-info").addClass("total-chart")

			// get hash value
			var state_keyword = keyword2
			// append the stats
			var stat = (function () {
			    var stat = null;
			    $.ajax({
			        'async': false,
			        'global': false,
			        'url': '../data/chart_data/state/'+state_keyword+"/stats.json",
			        'dataType': "json",
			        'success': function (data) {
			            stat = data;
			        }
			    });
			    return stat;
			})();
			// console.log(stat)
			$(".region").text(stat.state); // append the correct state name
			// draw charts
			// define viz configs
			var donut_config1 = ["../data/chart_data/state/"+keyword2+"/enrollment_compare_donut/"+year+".tsv", "Student Enrollement Share", "chart1", "translate(0,-25)"]
			var donut_config2 = ["../data/chart_data/state/"+keyword2+"/free_lunch_donut/"+year+".tsv", "Free or Reduced-price Lunch Status", "chart2", "translate(0,-25)"]
			var donut_config3 = ["../data/chart_data/state/"+keyword2+"/non_charter_free_lunch_donut/"+year+".tsv", "Free or Reduced-price Lunch Status", "chart3", "translate(0,-25)"]
			var bar_config = ["../data/chart_data/state/"+keyword2+"/total_by_year.tsv", "state-info", "Charter School Student Enrollment"]
			var donut_config4 = ["../data/chart_data/state/"+keyword2+"/race_donut/"+year+".tsv", "Students by Race/Ethnicity", "chart4", "translate(0,10)"]
			var donut_config5 = ["../data/chart_data/state/"+keyword2+"/non_charter_race_donut/"+year+".tsv", "Students by Race/Ethnicity", "chart5", "translate(0,10)"]
			var config_array = [donut_config1, donut_config2, donut_config3, donut_config4, donut_config5]
			config_array.forEach(function(el){
			  donut_multi(el)
			})
			bar(bar_config)
			
		}
		
	}

/*=====  End of state level snapshot  ======*/


	






/*=============================================================
=            congressional district level snapshot            =
=============================================================*/

	if (keyword1 === "congressional_district") {

		console.log('level ', keyword1 )
		var view = keyword4
		// assign donut color based on view
		var donut_color_spectrum = donut_color_spectrums[view]
		// assign bar color based on view
		var bar_chart_color = bar_chart_colors[view]

		$(".vertical-text").css("background-color", "transparent")

		/*----------  school view snapshot  ----------*/
		
		if (keyword4 === "school_view") {
			console.log("we are in school view")
			$(".container-fluid").addClass("schools")
			$(".state-info").empty().append("<div id='map' style='min-height: 250px; max-width: 500px;'>")


			// draw map
			$.getScript('map/congressional_district_map.js')

			// get hash value
			var state_keyword = keyword2
			var district_keyword = keyword3
			// append the stats
			var stat = (function () {
			    var stat = null;
			    $.ajax({
			        'async': false,
			        'global': false,
			        'url': '../data/chart_data/congressional_district/'+state_keyword+"/"+district_keyword+"/stats.json",
			        'dataType': "json",
			        'success': function (data) {
			            stat = data;
			        }
			    });
			    return stat;
			})();
			$(".region").text(stat.district);
			

			// append representative info
			$(".chart1").append("<h4>Congressman</h4>")
			for (var key in stat.representative) {
			  $(".chart1").append("<p>"+key+"</p><a href='"+stat.representative[key]+"'>"+stat.representative[key]+"</a>");
			}

			// draw charts
			// define viz configs
			var donut_config1 = ["../data/chart_data/congressional_district/"+keyword2+"/"+keyword3+"/locale_donut/"+year+".tsv", "Schools by Locale", "chart2", "translate(0,-25)"]
			var donut_config2 = ["../data/chart_data/congressional_district/"+keyword2+"/"+keyword3+"/mgmt_type_donut/"+year+".tsv", "Schools by Management Type", "chart3", "translate(0,-25)"]
			var bar_config = ["../data/chart_data/congressional_district/"+keyword2+"/"+keyword3+"/total_by_year.tsv", "chart4", "Total Number of Charter Schools"]
			var config_array = [donut_config1, donut_config2]
			
			config_array.forEach(function(el){
			  donut_multi(el)
			})
			bar(bar_config)

		}

		/*----------  student view snapshot  ----------*/
		
		if (keyword4 === "student_view") {
			console.log("we are in student view")
			$(".container-fluid").addClass("students")

			$(".state-info").empty().append("<div id='map' style='min-height: 250px; max-width: 500px;'>")


			// draw map
			$.getScript('map/congressional_district_map.js')

			// get hash value
			var state_keyword = keyword2
			var district_keyword = keyword3
			// append the stats
			var stat = (function () {
			    var stat = null;
			    $.ajax({
			        'async': false,
			        'global': false,
			        'url': '../data/chart_data/congressional_district/'+state_keyword+"/"+district_keyword+"/stats.json",
			        'dataType': "json",
			        'success': function (data) {
			            stat = data;
			        }
			    });
			    return stat;
			})();
			$(".region").text(stat.district);
			

			// draw charts
			// define viz configs
			var donut_config1 = ["../data/chart_data/congressional_district/"+keyword2+"/"+keyword3+"/enrollment_compare_donut/"+year+".tsv", "Student Enrollment Share", "chart1", "translate(0,-25)"]
			var donut_config2 = ["../data/chart_data/congressional_district/"+keyword2+"/"+keyword3+"/free_lunch_donut/"+year+".tsv", "Free or Reduced-price Lunch Status", "chart2", "translate(0,-25)"]
			var donut_config3 = ["../data/chart_data/congressional_district/"+keyword2+"/"+keyword3+"/race_donut/"+year+".tsv", "Students by Race/Ethnicity", "chart3", "translate(0,-25)"]
			var bar_config = ["../data/chart_data/congressional_district/"+keyword2+"/"+keyword3+"/total_by_year.tsv", "chart4", "Charter School Student Enrollment"]
			var config_array = [donut_config1, donut_config2, donut_config3]
			
			config_array.forEach(function(el){
			  donut_multi(el)
			})
			bar(bar_config)
		}
		
	}

/*=====  End of congressional district level snapshot  ======*/




	
/*======================================================
=            school district level snapshot            =
======================================================*/

	if (keyword1 === "school_district") {

		console.log('level ', keyword1 )
		var view = keyword4
		// assign donut color based on view
		var donut_color_spectrum = donut_color_spectrums[view]
		// assign bar color based on view
		var bar_chart_color = bar_chart_colors[view]

		$(".vertical-text").css("background-color", "transparent")

		/*----------  school view snapshot  ----------*/
		
		if (keyword4 === "school_view") {
			console.log("we are in school view")
			$(".container-fluid").addClass("schools")

			$(".state-info").empty().append("<div id='map' style='min-height: 250px; max-width: 500px;'>")


			// draw map
			$.getScript('map/school_district_map.js')

			// get hash value
			var state_keyword = keyword2
			var district_keyword = keyword3
			// append the stats
			var stat = (function () {
			    var stat = null;
			    $.ajax({
			        'async': false,
			        'global': false,
			        'url': '../data/chart_data/school_district/'+state_keyword+"/"+district_keyword+"/stats.json",
			        'dataType': "json",
			        'success': function (data) {
			            stat = data;
			        }
			    });
			    return stat;
			})();
			$(".region").text(stat.district);
			

			// draw charts
			// define viz configs
			var donut_config1 = ["../data/chart_data/school_district/"+keyword2+"/"+keyword3+"/locale_donut/"+year+".tsv", "Schools by Locale", "chart1", "translate(0,-25)"]
			var donut_config2 = ["../data/chart_data/school_district/"+keyword2+"/"+keyword3+"/mgmt_type_donut/"+year+".tsv", "Schools by Management Type", "chart2", "translate(0,-25)"]
			var bar_config = ["../data/chart_data/school_district/"+keyword2+"/"+keyword3+"/total_by_year.tsv", "chart4", "Total Number of Charter Schools"]
			var config_array = [donut_config1, donut_config2]
			
			config_array.forEach(function(el){
			  donut_multi(el)
			})
			bar(bar_config)
		}

		/*----------  student view snapshot  ----------*/
		
		if (keyword4 === "student_view") {
			console.log("we are in student view")
			$(".container-fluid").addClass("students")

			$(".state-info").empty().append("<div id='map' style='min-height: 250px; max-width: 500px;'>")


			// draw map
			$.getScript('map/school_district_map.js')

			// get hash value
			var state_keyword = keyword2
			var district_keyword = keyword3
			// append the stats
			var stat = (function () {
			    var stat = null;
			    $.ajax({
			        'async': false,
			        'global': false,
			        'url': '../data/chart_data/school_district/'+state_keyword+"/"+district_keyword+"/stats.json",
			        'dataType': "json",
			        'success': function (data) {
			            stat = data;
			        }
			    });
			    return stat;
			})();
			$(".region").text(stat.district);
			

			// draw charts
			// define viz configs
			var donut_config1 = ["../data/chart_data/school_district/"+keyword2+"/"+keyword3+"/enrollment_compare_donut/"+year+".tsv", "Student Enrollment Share", "chart1", "translate(0,-25)"]
			var donut_config2 = ["../data/chart_data/school_district/"+keyword2+"/"+keyword3+"/free_lunch_donut/"+year+".tsv", "Free or Reduced-price Lunch Status", "chart2", "translate(0,-25)"]
			var donut_config3 = ["../data/chart_data/school_district/"+keyword2+"/"+keyword3+"/race_donut/"+year+".tsv", "Students by Race/Ethnicity", "chart3", "translate(0,-25)"]
			var bar_config = ["../data/chart_data/school_district/"+keyword2+"/"+keyword3+"/total_by_year.tsv", "chart4", "Charter School Student Enrollment"]
			var config_array = [donut_config1, donut_config2, donut_config3]
			
			config_array.forEach(function(el){
			  donut_multi(el)
			})
			bar(bar_config)
		}
		
	}

/*=====  End of school district level snapshot  ======*/






/*===================================================
=            mgmt company level snapshot            =
===================================================*/

	if (keyword1 === "mgmt_company") {

		console.log('level ', keyword1 )
		var view = keyword3
		// assign donut color based on view
		var donut_color_spectrum = donut_color_spectrums[view]
		// assign bar color based on view
		var bar_chart_color = bar_chart_colors[view]

		$(".vertical-text").css("background-color", "transparent")

		/*----------  school view snapshot  ----------*/
		
		if (keyword3 === "school_view") {
			console.log("we are in school view")
			$(".container-fluid").addClass("schools")


			// draw map
			$.getScript('map/mgmt_company_map.js')

			// get hash value
			var mgmt_company_keyword = keyword2
			// append the stats
			var stat = (function () {
			    var stat = null;
			    $.ajax({
			        'async': false,
			        'global': false,
			        'url': '../data/chart_data/mgmt_company/'+mgmt_company_keyword+"/stats.json",
			        'dataType': "json",
			        'success': function (data) {
			            stat = data;
			        }
			    });
			    return stat;
			})();
			$(".region").text(stat.name);
			$("#text-info").append("<h4 class='mgmt_company_states_title'>States with Management Company</h4>")
			for (var index in stat.schools_by_mgmt) {
			  $("#text-info").append("<p>"+stat.schools_by_mgmt[index].school+"</p>")
			}
			

			// draw charts
			// define viz configs
			var donut_config2 = ["../data/chart_data/mgmt_company/"+keyword2+"/locale_donut/"+year+".tsv", "Schools by Locale", "chart2", "translate(0,-25)"]
			var bar_config = ["../data/chart_data/mgmt_company/"+keyword2+"/total_by_year.tsv", "chart4", "Total Number of Charter Schools"]
			var config_array = [donut_config2]
			config_array.forEach(function(el){
			  donut_multi(el)
			})
			bar(bar_config)
			mgmt_type([".chart1", "translate(70,0)"])
		}

		/*----------  student view snapshot  ----------*/
		
		if (keyword3 === "student_view") {
			console.log("we are in student view")
			$(".container-fluid").addClass("students")
			$(".state-info").empty().append("<div id='map' style='min-height: 250px; max-width: 500px;'>")
			// draw map
			$.getScript('map/mgmt_company_map.js')

			// get hash value
			var mgmt_company_keyword = keyword2
			// append the stats
			var stat = (function () {
			    var stat = null;
			    $.ajax({
			        'async': false,
			        'global': false,
			        'url': '../data/chart_data/mgmt_company/'+mgmt_company_keyword+"/stats.json",
			        'dataType': "json",
			        'success': function (data) {
			            stat = data;
			        }
			    });
			    return stat;
			})();
			$(".region").text(stat.name);
			$("#text-info").append("<h4 class='mgmt_company_states_title'>States with Management Company</h4>")
			for (var index in stat.schools_by_mgmt) {
			  $("#text-info").append("<p>"+stat.schools_by_mgmt[index].school+"</p>")
			}
			

			// draw charts
			// define viz configs
			var donut_config1 = ["../data/chart_data/mgmt_company/"+keyword2+"/enrollment_compare_donut/"+year+".tsv", "Student Enrollment Share", "chart1", "translate(0,-25)"]
			var donut_config2 = ["../data/chart_data/mgmt_company/"+keyword2+"/free_lunch_donut/"+year+".tsv", "Free or Reduced-price Lunch Status", "chart2", "translate(0,-25)"]
			var donut_config3 = ["../data/chart_data/mgmt_company/"+keyword2+"/race_donut/"+year+".tsv", "Students by Race/Ethnicity", "chart3", "translate(0,-25)"]
			var bar_config = ["../data/chart_data/mgmt_company/"+keyword2+"/total_by_year.tsv", "chart4", "Total Number of Charter Schools"]
			var config_array = [donut_config1,donut_config2,donut_config3]
			config_array.forEach(function(el){
			  donut_multi(el)
			})
			bar(bar_config)
		}
		
	}

/*=====  End of mgmt company level snapshot  ======*/








/*=================================================
=            authorizer level snapshot            =
=================================================*/

	if (keyword1 === "authorizer") {

		console.log('level ', keyword1 )
		var view = keyword4
		// assign donut color based on view
		var donut_color_spectrum = donut_color_spectrums[view]
		// assign bar color based on view
		var bar_chart_color = bar_chart_colors[view]

		$(".vertical-text").css("background-color", "transparent")
		$(".state-info").empty().append("<div id='map' style='min-height: 250px; max-width: 500px;'>")

		/*----------  school view snapshot  ----------*/
		
		if (keyword4 === "school_view") {
			console.log("we are in school view")
			$(".container-fluid").addClass("schools")



			// draw map
			$.getScript('map/authorizer_map.js')

			// get hash value
			var state_keyword = keyword2
			var authorizer_keyword = keyword3
			// append the stats
			var stat = (function () {
			    var stat = null;
			    $.ajax({
			        'async': false,
			        'global': false,
			        'url': '../data/chart_data/authorizer/'+state_keyword+"/"+authorizer_keyword+"/stats.json",
			        'dataType': "json",
			        'success': function (data) {
			            stat = data;
			        }
			    });
			    return stat;
			})();

			$(".region").text(stat.authorizer);
			var donut_config1 = ["../data/chart_data/authorizer/"+keyword2+"/"+keyword3+"/locale_donut/"+year+".tsv", "Schools by Locale", "chart1", "translate(0,-25)"]
			var donut_config2 = ["../data/chart_data/authorizer/"+keyword2+"/"+keyword3+"/mgmt_type_donut/"+year+".tsv", "Schools by Management Type", "chart2", "translate(0,-25)"]
			var bar_config = ["../data/chart_data/authorizer/"+keyword2+"/"+keyword3+"/total_by_year.tsv", "chart4", "Total Number of Charter Schools"]
			var config_array = [donut_config1,donut_config2]
			config_array.forEach(function(el){
			  donut_multi(el)
			})
			bar(bar_config)

		}

		/*----------  student view snapshot  ----------*/
		
		if (keyword4 === "student_view") {
			console.log("we are in student view")
			$(".container-fluid").addClass("students")

			// draw map
			$.getScript('map/authorizer_map.js')

			// get hash value
			var state_keyword = keyword2
			var authorizer_keyword = keyword3
			// append the stats
			var stat = (function () {
			    var stat = null;
			    $.ajax({
			        'async': false,
			        'global': false,
			        'url': '../data/chart_data/authorizer/'+state_keyword+"/"+authorizer_keyword+"/stats.json",
			        'dataType': "json",
			        'success': function (data) {
			            stat = data;
			        }
			    });
			    return stat;
			})();

			$(".region").text(stat.authorizer);
			var donut_config1 = ["../data/chart_data/authorizer/"+keyword2+"/"+keyword3+"/enrollment_compare_donut/"+year+".tsv", "Student Enrollment Share", "chart1", "translate(0,-25)"]
			var donut_config2 = ["../data/chart_data/authorizer/"+keyword2+"/"+keyword3+"/free_lunch_donut/"+year+".tsv", "Free or Reduced-price Lunch Status", "chart2", "translate(0,-25)"]
			var donut_config3 = ["../data/chart_data/authorizer/"+keyword2+"/"+keyword3+"/race_donut/"+year+".tsv", "Students by Race/Ethnicity", "chart3", "translate(0,-25)"]
			var bar_config = ["../data/chart_data/authorizer/"+keyword2+"/"+keyword3+"/total_by_year.tsv", "chart4", "Charter School Student Enrollment"]
			var config_array = [donut_config1,donut_config2,donut_config3]
			config_array.forEach(function(el){
			  donut_multi(el)
			})
			bar(bar_config)

		}
		
	}

/*=====  End of authorizer level snapshot  ======*/







/*=============================================
=            school level snapshot            =
=============================================*/

	if (keyword1 === "school") {

		console.log('level ', keyword1 )
		$(".container-fluid").addClass("students")
		$(".vertical-text").css("background-color", "transparent")

		var view = "student_view"
		// assign donut color based on view
		var donut_color_spectrum = donut_color_spectrums[view]
		// assign bar color based on view
		var bar_chart_color = bar_chart_colors[view]



			// draw map
			$.getScript('map/school_map.js')
			// append stats info
			// get hash value
			var state_keyword = keyword2
			var school_keyword = keyword3
			// append the stats
			var stat = (function () {
			    var stat = null;
			    $.ajax({
			        'async': false,
			        'global': false,
			        'url': '../data/chart_data/school/'+state_keyword+"/"+school_keyword+"/stats.json",
			        'dataType': "json",
			        'success': function (data) {
			            stat = data;
			        }
			    });
			    return stat;
			})();
			// console.log(stat)
			$(".state-info").addClass("school-state-info")

			$("#text-info").append("<div class='col-xs-6' id='text-info-left'></div><div class='col-xs-6' id='text-info-right'></div>")
			$("#text-info-left").append("<p class='school-sub'>School District</p><p class='school-sub'>Year Opened</p><p class='school-sub'>Management Type</p><p class='school-sub'>Charter Type</p><p class='school-sub'>School Locale</p>")
			$("#text-info-right").append("<p class='school-sub'>Congressional District</p><p class='school-sub'>Grades</p><p class='school-sub'>Management Company</p><p class='school-sub'>Curriculum Type</p><p class='school-sub'>Authorizer</p>")

			$(".school-sub:eq(0)").after("<p class='school_dyn_stats'>"+stat.school_district+"</p>");
			$(".school-sub:eq(1)").after("<p class='school_dyn_stats'>"+stat.year_open+"</p>");
			$(".school-sub:eq(2)").after("<p class='school_dyn_stats'>"+stat.mgmt_type+"</p>");
			$(".school-sub:eq(3)").after("<p class='school_dyn_stats'>"+stat.charter_type+"</p>");
			$(".school-sub:eq(4)").after("<p class='school_dyn_stats'>"+stat.locale+"</p>");
			$(".school-sub:eq(5)").after("<p class='school_dyn_stats'>"+stat.congressional_district+"</p>");
			$(".school-sub:eq(6)").after("<p class='school_dyn_stats'>"+stat.grades+"</p>");
			$(".school-sub:eq(7)").after("<p class='school_dyn_stats'>"+stat.mgmt_company+"</p>");
			$(".school-sub:eq(8)").after("<p class='school_dyn_stats'>"+stat.curriculum_type+"</p>");
			$(".school-sub:eq(9)").after("<p class='school_dyn_stats'>"+stat.authorizer+"</p>");


			// draw charts
			// define viz configs
			var donut_config1 = ["../data/chart_data/school/"+keyword2+"/"+keyword3+"/free_lunch_donut/"+year+".tsv", "Free or Reduced-price Lunch Status", "chart2", "translate(0,-25)"]
			var donut_config2 = ["../data/chart_data/school/"+keyword2+"/"+keyword3+"/non_charter_locale_donut/"+year+".tsv", "Students by Race/Ethnicity", "chart3", "translate(0,-25)"]
			var bar_config = ["../data/chart_data/school/"+keyword2+"/"+keyword3+"/total_by_year.tsv", "chart4", "Total Number of Charter Schools", "translate(0,-25)"]
			var config_array = [donut_config1, donut_config2]
			config_array.forEach(function(el){
			  donut_multi(el)
			})
			bar(bar_config)
			donut_plain(["../data/chart_data/school/"+keyword2+"/"+keyword3+"/total_by_year.tsv", ".chart1", "Total Number of Students", "translate(50,0)"])
		
	}

/*=====  End of school level snapshot  ======*/






	



