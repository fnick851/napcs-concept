///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// for mapping, get the correct geojson file, and json file(optional), based on the hash value
if (hash_value === '' || keyword1 === 'mgmt_company') {
    var geojson_dir = 'data/map_data/national.geojson'
    if (keyword1 === 'mgmt_company') {
        var mgmt_company_name = keyword2
        // load mgmt company serving states JSON
        var mgmtData = (function () {
            var mgmtData = null;
            $.ajax({
                'async': false,
                'global': false,
                // 'url': 'data/map_data/mgmt_companies.json',
                'url': 'data/chart_data/mgmt_company/'+ mgmt_company_name+ '/stats.json',
                'dataType': "json",
                'success': function (data) {
                    mgmtData = data;
                }
            });
            return mgmtData;
        })();
        // list of states served
        console.log(mgmtData)
        var states_served = mgmtData["states_by_mgmt"];
        // var states_served = mgmtData["exampleMgmtCompany"].states;
    }
}
if (keyword1 === 'state' || keyword1 === 'school_district' || keyword1 === 'authorizer' || keyword1 === 'school') {
    var geojson_dir = 'data/map_data/SchoolDistricts_Processed/' + keyword2 + "_school_district.geojson"
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
                'url': 'data/map_data/authorizers/' + data_file2_name,
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
                'url': 'data/map_data/schools/' + data_file2_name,
                'dataType': "json",
                'success': function (data) {
                    schoolLatLons = data;
                }
            });
            return schoolLatLons;
        })();
        // zoom to the district the schools lives in, accoring to school lat lon json file.
        var zoom_to = schoolLatLons[school_name].school_district;
        console.log(zoom_to)
    }
}
if (keyword1 === 'congressional_district') {
    var geojson_dir = 'data/map_data/CongressionalDistricts_Processed/' + keyword2 + "_congressional_district.geojson"
    var zoom_to = keyword3
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// draw the national page if hash value is empty
if (hash_value === '') {
	$.getScript('js/map/national_map.js')
	$('.national_link').children('a').addClass('current_page')
	$('.snapshot_button').click(function(e) {
	    e.preventDefault();  //stop the browser from following
	    window.location.href = 'snapshot/index.html#national&'+view;
	});
	var stat = (function () {
	    var stat = null;
	    $.ajax({
	        'async': false,
	        'global': false,
	        'url': 'data/chart_data/national/stats.json',
	        'dataType': "json",
	        'success': function (data) {
	            stat = data;
	        }
	    });
	    return stat;
	})();
	// function for draw all three donuts
	function draw_charts() {
	  $( ".chart_container" ).remove();
	  $( ".chart_inner" ).append( "<div class='chart_container'><div class='col-sm-4 text-center'><div class='chart1'></div></div><div class='col-sm-4 text-center'><div class='chart2'></div></div><div class='col-sm-4 text-center'><div class='chart3'></div></div></div>" );
	  if (view === "school_view") {
	    var data1 = "data/chart_data/national/mgmt_type_donut/"+year+".tsv"
	    var data2 = "data/chart_data/national/locale_donut/"+year+".tsv"
	    donut_multi(data1, "Schools by ", "Management Type", ".chart2");
	    donut_multi(data2, "Schools by", "Locale", ".chart3");
	  } else {
	    var data1 = "data/chart_data/national/race_donut/"+year+".tsv"
	    var data2 = "data/chart_data/national/free_lunch_donut/"+year+".tsv"
	    donut_multi(data1, "Students by", "Race/Ethnicity", ".chart2");
	    donut_multi(data2, "Students Qualifying", "for FRPL", ".chart3");
	  }
	  donut_plain("data/chart_data/national/total_by_year.tsv", ".chart1");
	}
	draw_charts();
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// draw the state page if hash value is state
if (keyword1 === 'state') {
	$.getScript('js/map/state_map.js')
	$('.state_container').css('display', 'block')
	$('.state_link').children('a').addClass('current_page')
	$('.snapshot_button').click(function(e) {
	    e.preventDefault();  //stop the browser from following
	    window.location.href = 'snapshot/index.html#'+keyword1+'&'+keyword2+'&'+view;
	});
	// get hash value
	var state_keyword = keyword2
	// append the stats
	var stat = (function () {
	    var stat = null;
	    $.ajax({
	        'async': false,
	        'global': false,
	        'url': 'data/chart_data/state/'+state_keyword+"/stats.json",
	        'dataType': "json",
	        'success': function (data) {
	            stat = data;
	        }
	    });
	    return stat;
	})();
	$(".header_title").text(stat.state);
	for (var key in stat.senator) {
	  $(".header_block:eq(0)").append("<p>"+key+"</p><a href='"+stat.senator[key]+"'>"+stat.senator[key]+"</a>");
	}
	for (var key in stat.org) {
	  $(".header_block:eq(1)").append("<p>"+key+"</p><a href='"+stat.org[key]+"'>"+stat.org[key]+"</a>");
	}
	// function for draw all three donuts
	function draw_charts() {
	  $( ".chart_container" ).remove();
	  $( ".chart_inner" ).append( "<div class='chart_container'><div class='col-sm-4 text-center'><div class='chart1'></div></div><div class='col-sm-4 text-center'><div class='chart2'></div></div><div class='col-sm-4 text-center'><div class='chart3'></div></div></div>" );
	  if (view === "school_view") {
	    var data1 = "data/chart_data/state/"+state_keyword+"/mgmt_type_donut/"+year+".tsv"
	    var data2 = "data/chart_data/state/"+state_keyword+"/locale_donut/"+year+".tsv"
	    donut_multi(data1, "Schools by ", "Management Type", ".chart2");
	    donut_multi(data2, "Schools by", "Locale", ".chart3");
	  } else {
	    var data1 = "data/chart_data/state/"+state_keyword+"/race_donut/"+year+".tsv"
	    var data2 = "data/chart_data/state/"+state_keyword+"/free_lunch_donut/"+year+".tsv"
	    donut_multi(data1, "Students by", "Race/Ethnicity", ".chart2");
	    donut_multi(data2, "Students Qualifying", "for FRPL", ".chart3");
	  }
	  donut_plain("data/chart_data/state/"+state_keyword+"/total_by_year.tsv", ".chart1");
	}
	draw_charts();
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// draw the congressional district page if the hash value is congressional district
if (keyword1 === 'congressional_district') {
	$.getScript('js/map/congressional_district_map.js')
	$('.congressional_dis_container').css('display', 'inline-block')
	$('.congressional_link').children('a').addClass('current_page')
	$('.snapshot_button').click(function(e) {
	    e.preventDefault();  //stop the browser from following
	    window.location.href = 'snapshot/index.html#'+keyword1+'&'+keyword2+'&'+keyword3+'&'+view;
	});
	// get hash value
	var state_keyword = keyword2
	var district_keyword = keyword3
	// append the stats
	var stat = (function () {
	    var stat = null;
	    $.ajax({
	        'async': false,
	        'global': false,
	        'url': 'data/chart_data/congressional_district/'+state_keyword+"/"+district_keyword+"/stats.json",
	        'dataType': "json",
	        'success': function (data) {
	            stat = data;
	        }
	    });
	    return stat;
	})();
	$(".header_title").text(stat.district);
	// append list of links to drop down on page
	for (var index in stat.schools_in_district) {
	  $(".drop_down_list").append("<option class='drop_down_link' value="+stat.schools_in_district[index].URL+">"+stat.schools_in_district[index].school+"</option>")
	}
	// go to new page on select option
	function navigateTo(selection) {
	    var url = selection.options[selection.selectedIndex].value;
	    window.location = "index.html#school&"+url;
	}
	// append representative info
	for (var key in stat.representative) {
	  $(".header_block").append("<p>"+key+"</p><a href='"+stat.representative[key]+"'>"+stat.representative[key]+"</a><br><br>");
	}
	// function for draw all three donuts
	function draw_charts() {
	  $( ".chart_container" ).remove();
	  $( ".chart_inner" ).append( "<div class='chart_container'><div class='col-sm-4 text-center'><div class='chart1'></div></div><div class='col-sm-4 text-center'><div class='chart2'></div></div><div class='col-sm-4 text-center'><div class='chart3'></div></div></div>" );
	  if (view === "school_view") {
	    var data1 = "data/chart_data/congressional_district/"+state_keyword+"/"+district_keyword+"/mgmt_type_donut/"+year+".tsv"
	    var data2 = "data/chart_data/congressional_district/"+state_keyword+"/"+district_keyword+"/locale_donut/"+year+".tsv"
	    donut_multi(data1, "Schools by ", "Management Type", ".chart2");
	    donut_multi(data2, "Schools by", "Locale", ".chart3");
	  } else {
	    var data1 = "data/chart_data/congressional_district/"+state_keyword+"/"+district_keyword+"/race_donut/"+year+".tsv"
	    var data2 = "data/chart_data/congressional_district/"+state_keyword+"/"+district_keyword+"/free_lunch_donut/"+year+".tsv"
	    donut_multi(data1, "Students by", "Race/Ethnicity", ".chart2");
	    donut_multi(data2, "Students Qualifying", "for FRPL", ".chart3");
	  }
	  donut_plain("data/chart_data/congressional_district/"+state_keyword+"/"+district_keyword+"/total_by_year.tsv", ".chart1");
	}
	draw_charts();
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// draw school district page if the hash is school district
if (keyword1 === 'school_district') {
	$.getScript('js/map/school_district_map.js')
	$('.school_dis_container').css('display', 'inline-block')
	$('.school_dis_link').children('a').addClass('current_page')
	$('.snapshot_button').click(function(e) {
	    e.preventDefault();  //stop the browser from following
	    window.location.href = 'snapshot/index.html#'+keyword1+'&'+keyword2+'&'+keyword3+'&'+view;
	});
	// get hash value
	var state_keyword = keyword2
	var district_keyword = keyword3
	// append the stats
	var stat = (function () {
	    var stat = null;
	    $.ajax({
	        'async': false,
	        'global': false,
	        'url': 'data/chart_data/school_district/'+state_keyword+"/"+district_keyword+"/stats.json",
	        'dataType': "json",
	        'success': function (data) {
	            stat = data;
	        }
	    });
	    return stat;
	})();
	$(".header_title").text(stat.district);
	// append list of links to drop down on page
	for (var index in stat.schools_in_district) {
	  $(".drop_down_list").append("<option class='drop_down_link' value="+stat.schools_in_district[index].URL+">"+stat.schools_in_district[index].school+"</option>")
	}
	// go to new page on select option
	function navigateTo(selection) {
	    var url = selection.options[selection.selectedIndex].value;
	    window.location = "index.html#school&"+url;
	}
	// function for draw all three donuts
	function draw_charts() {
	  $( ".chart_container" ).remove();
	  $( ".chart_inner" ).append( "<div class='chart_container'><div class='col-sm-4 text-center'><div class='chart1'></div></div><div class='col-sm-4 text-center'><div class='chart2'></div></div><div class='col-sm-4 text-center'><div class='chart3'></div></div></div>" );
	  if (view === "school_view") {
	    var data1 = "data/chart_data/school_district/"+state_keyword+"/"+district_keyword+"/mgmt_type_donut/"+year+".tsv"
	    var data2 = "data/chart_data/school_district/"+state_keyword+"/"+district_keyword+"/locale_donut/"+year+".tsv"
	    donut_multi(data1, "Schools by ", "Management Type", ".chart2");
	    donut_multi(data2, "Schools by", "Locale", ".chart3");
	  } else {
	    var data1 = "data/chart_data/school_district/"+state_keyword+"/"+district_keyword+"/race_donut/"+year+".tsv"
	    var data2 = "data/chart_data/school_district/"+state_keyword+"/"+district_keyword+"/free_lunch_donut/"+year+".tsv"
	    donut_multi(data1, "Students by", "Race/Ethnicity", ".chart2");
	    donut_multi(data2, "Students Qualifying", "for FRPL", ".chart3");
	  }
	  donut_plain("data/chart_data/school_district/"+state_keyword+"/"+district_keyword+"/total_by_year.tsv", ".chart1");
	}
	draw_charts();
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// draw mgmt co page if the hash is mgmt co
if (keyword1 === 'mgmt_company') {
	$.getScript('js/map/mgmt_company_map.js')
	$('.mgmt_company_container').css('display', 'inline-block')
	$('.mgmt_company_link').children('a').addClass('current_page')
	$('.snapshot_button').click(function(e) {
	    e.preventDefault();  //stop the browser from following
	    window.location.href = 'snapshot/index.html#'+keyword1+'&'+keyword2+'&'+view;
	});
	// mgmt stats.json is already loaded before for mapping
	var mgmt_company_keyword = keyword2
	var stat = mgmtData
	$(".header_title").text(stat.name);
	for (var index in stat.states_by_mgmt) {
		var value = stat.states_by_mgmt[index].replace(" ", "")
	  	$(".drop_down_list").append("<option class='drop_down_link' value=" + value + ">"+stat.states_by_mgmt[index]+"</option>")
	  	
	}
	// go to new page on select option
	function navigateTo(selection) {
	    var url = selection.options[selection.selectedIndex].value;
	    window.location = "index.html#state&"+url;
	}
	// function for draw all three donuts
	function draw_charts() {
	  $( ".chart_container" ).remove();
	  $( ".chart_inner" ).append( "<div class='chart_container'><div class='col-sm-4 text-center'><div class='chart1'></div></div><div class='col-sm-4 text-center'><div class='chart2'></div></div><div class='col-sm-4 text-center'><div class='chart3'></div></div></div>" );
	  if (view === "school_view") {
	    var data2 = "data/chart_data/mgmt_company/"+mgmt_company_keyword+"/locale_donut/"+year+".tsv"
	    mgmt_type(".chart3");
	    donut_multi(data2, "Schools by", "Locale", ".chart2");
	  } else {
	    var data1 = "data/chart_data/mgmt_company/"+mgmt_company_keyword+"/race_donut/"+year+".tsv"
	    var data2 = "data/chart_data/mgmt_company/"+mgmt_company_keyword+"/free_lunch_donut/"+year+".tsv"
	    donut_multi(data1, "Students by", "Race/Ethnicity", ".chart2");
	    donut_multi(data2, "Students Qualifying", "for FRPL", ".chart3");
	  }
	  donut_plain("data/chart_data/mgmt_company/"+mgmt_company_keyword+"/total_by_year.tsv", ".chart1");
	}
	draw_charts();
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// draw authorizer page if the hash is authorizer
if (keyword1 === 'authorizer') {
	$.getScript('js/map/authorizer_map.js')
	$('.authorizer_container').css('display', 'inline-block')
	$('.authorizer_link').children('a').addClass('current_page')
	$('.snapshot_button').click(function(e) {
	    e.preventDefault();  //stop the browser from following
	    window.location.href = 'snapshot/index.html#'+keyword1+'&'+keyword2+'&'+keyword3+'&'+view;
	});
	// get hash value
	var state_keyword = keyword2
	var authorizer_keyword = keyword3
	// append the stats
	var stat = (function () {
	    var stat = null;
	    $.ajax({
	        'async': false,
	        'global': false,
	        'url': 'data/chart_data/authorizer/'+state_keyword+"/"+authorizer_keyword+"/stats.json",
	        'dataType': "json",
	        'success': function (data) {
	            stat = data;
	        }
	    });
	    return stat;
	})();
	$(".header_title").text(stat.authorizer);
	// append list of links to drop down on page
	for (var index in stat.schools_by_authorizer) {
	  $(".drop_down_list").append("<option class='drop_down_link' value="+stat.schools_by_authorizer[index].URL+">"+stat.schools_by_authorizer[index].school+"</option>")
	}
	// go to new page on select option
	function navigateTo(selection) {
	    var url = selection.options[selection.selectedIndex].value;
	    window.location = "index.html#school&"+url;
	}
	// function for draw all three donuts
	function draw_charts() {
	  $( ".chart_container" ).remove();
	  $( ".chart_inner" ).append( "<div class='chart_container'><div class='col-sm-4 text-center'><div class='chart1'></div></div><div class='col-sm-4 text-center'><div class='chart2'></div></div><div class='col-sm-4 text-center'><div class='chart3'></div></div></div>" );
	  if (view === "school_view") {
	    var data1 = "data/chart_data/authorizer/"+state_keyword+"/"+authorizer_keyword+"/mgmt_type_donut/"+year+".tsv"
	    var data2 = "data/chart_data/authorizer/"+state_keyword+"/"+authorizer_keyword+"/locale_donut/"+year+".tsv"
	    donut_multi(data1, "Schools by ", "Management Type", ".chart2");
	    donut_multi(data2, "Schools by", "Locale", ".chart3");
	  } else {
	    var data1 = "data/chart_data/authorizer/"+state_keyword+"/"+authorizer_keyword+"/race_donut/"+year+".tsv"
	    var data2 = "data/chart_data/authorizer/"+state_keyword+"/"+authorizer_keyword+"/free_lunch_donut/"+year+".tsv"
	    donut_multi(data1, "Students by", "Race/Ethnicity", ".chart2");
	    donut_multi(data2, "Students Qualifying", "for FRPL", ".chart3");
	  }
	  donut_plain("data/chart_data/authorizer/"+state_keyword+"/"+authorizer_keyword+"/total_by_year.tsv", ".chart1");
	}
	draw_charts();
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// draw school page if the hash is school
if (keyword1 === 'school') {
	$('.side_tab').css('display', 'none')
	$.getScript('js/map/school_map.js')
	$('.school_container').css('display', 'block')
	$('.school_link').children('a').addClass('current_page')
	$('.snapshot_button').click(function(e) {
	    e.preventDefault();  //stop the browser from following
	    window.location.href = 'snapshot/index.html#'+keyword1+'&'+keyword2+'&'+keyword3;
	});
	// get hash value
	var state_keyword = keyword2
	var school_keyword = keyword3
	// append the stats
	var stat = (function () {
	    var stat = null;
	    $.ajax({
	        'async': false,
	        'global': false,
	        'url': 'data/chart_data/school/'+state_keyword+"/"+school_keyword+"/stats.json",
	        'dataType': "json",
	        'success': function (data) {
	            stat = data;
	        }
	    });
	    return stat;
	})();
	// append title content and conditionally append virtual sign
	$(".header_title").html(stat.school + (stat.virtual.toLowerCase() === "yes" ? "<span style='display:inline-block;height:32px;width:100px;margin-left:5px;background-color:rgb(31,120,180);text-align:center;color:white;'>Virtual</span>" : ""));
	// append address and website URL
	$(".header_title").after("<h4 class='header_title' style='color: grey;'>"+stat.address+"<br>"+stat.phone+" <br> <a "+"href='"+stat.URL+"'>"+"Website</a></h4>");
	// append ten stats text
	$(".school_dis").after("<p class='school_dyn_stats'>"+stat.school_district+"</p>");
	$(".year_open").after("<p class='school_dyn_stats'>"+stat.year_open+"</p>");
	$(".mgmt_type").after("<p class='school_dyn_stats'>"+stat.mgmt_type+"</p>");
	$(".chart_type").after("<p class='school_dyn_stats'>"+stat.charter_type+"</p>");
	$(".school_loc").after("<p class='school_dyn_stats'>"+stat.locale+"</p>");
	$(".cong_dis").after("<p class='school_dyn_stats'>"+stat.congressional_district+"</p>");
	$(".grades").after("<p class='school_dyn_stats'>"+stat.grades+"</p>");
	$(".mgmt_company").after("<p class='school_dyn_stats'>"+stat.mgmt_company+"</p>");
	console.log($(".school_stat_title:eq(6)"))
	$(".curriculum").after("<p class='school_dyn_stats'>"+stat.curriculum_type+"</p>");
	$(".authorizer").after("<p class='school_dyn_stats'>"+stat.authorizer+"</p>");
	// overrides view default value
	view = "student_view";
	// function for draw all three donuts
	function draw_charts() {
	  $( ".chart_container" ).remove();
	  $( ".chart_inner" ).append( "<div class='chart_container'><div class='col-sm-4 text-center'><div class='chart1'></div></div><div class='col-sm-4 text-center'><div class='chart2'></div></div><div class='col-sm-4 text-center'><div class='chart3'></div></div></div>" );
	  if (view === "school_view") {
	    var data1 = "data/chart_data/school/"+state_keyword+"/"+school_keyword+"/mgmt_type_donut/"+year+".tsv"
	    var data2 = "data/chart_data/school/"+state_keyword+"/"+school_keyword+"/locale_donut/"+year+".tsv"
	    donut_multi(data1, "Schools by ", "Management Type", ".chart2");
	    donut_multi(data2, "Schools by", "Locale", ".chart3");
	  } else {
	    var data1 = "data/chart_data/school/"+state_keyword+"/"+school_keyword+"/race_donut/"+year+".tsv"
	    var data2 = "data/chart_data/school/"+state_keyword+"/"+school_keyword+"/free_lunch_donut/"+year+".tsv"
	    donut_multi(data1, "Students by", "Race/Ethnicity", ".chart2");
	    donut_multi(data2, "Students Qualifying", "for FRPL", ".chart3");
	  }
	  donut_plain("data/chart_data/school/"+state_keyword+"/"+school_keyword+"/total_by_year.tsv", ".chart1");
	}
	draw_charts();
}
