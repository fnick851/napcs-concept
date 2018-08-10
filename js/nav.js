// AJAX load available state list
var loadStates = function () {
    $.ajax({
        'url': 'data/nav_keywords/state_keywords.json',
        'dataType': "json",
        'success': function (data) {
        	for (index in data) {
        		$('.nav_input_field select:first-child').not('#mgmt').append('<option value="'+ data[index] + '">' + data[index] + '</option>')
        	}
        }
    })
}
loadStates()  

function append_sub(el) {
	if (el.id === 'congressional') {
		var file = 'data/nav_keywords/congressional_dis_keywords.json'
	}
	if (el.id === 'school-dis') {
		var file = 'data/nav_keywords/school_dis_keywords.json'
	}
	if (el.id === 'mgmt') {
		var file = 'data/nav_keywords/mgmt_company_keywords.json'
	}
	if (el.id === 'authorizer') {
		var file = 'data/nav_keywords/authorizer_keywords.json'
	}
	if (el.id === 'school') {
		var file = 'data/nav_keywords/school_keywords.json'
	}
	var load_sub = function() {
		$.ajax({
	        'url': file,
	        'dataType': "json",
	        'success': function (data) {
	        	$('#'+el.id+'-sub option').remove()
	        	var option_val = el.options[el.selectedIndex].value
	        	var obj_key = option_val.toLowerCase()
	        	var sub_list = data[obj_key]
	        	for (index in sub_list) {
	        		$('#'+el.id+'-sub').append('<option value="'+ sub_list[index] + '">' + sub_list[index] + '</option>')
	        	}
	        }
	    })
	}
	load_sub()
	$('#'+el.id+'-sub').prop('disabled', false)
}

// when 'GO' is clicked, generate the URL and change the URL string
$(".nav_submit").click(
	function () {
		// get the number of input fields
		number_of_fields = $(this).siblings(".nav_input_field").children().length
		
		// if the number of input fields is 2, it means the user is on the latter 5 levels (*not national or state level)
		if ( number_of_fields === 2 ) {
			var input_field1 = $(this).siblings('.nav_input_field').children('select').eq(0)
			var input_field2 = $(this).siblings('.nav_input_field').children('select').eq(1)
			var chosen_state = input_field1.val()
			var chosen_key = input_field2.val()
			if ($(this).hasClass("school_dis_go")) {
                window.location = "index.html#school_district&"+chosen_state.replace(/ /g,'')+"&"+chosen_key.replace(/ /g,'').replace(/\./g,'')
                // window.location = "index.html#school_district&Wyoming&JohnsonCountySchoolDistrict1"
			}
			if ($(this).hasClass("congress_dis_go")) {
				window.location.href = "index.html#congressional_district&"+chosen_state.replace(/ /g,'')+"&"+chosen_key.replace(/ /g,'')
				// window.location = "index.html#congressional_district&Florida&CongressionalDistrict7"
			}
			if ($(this).hasClass("mgmt_company_go")) {
				window.location.href = "index.html#mgmt_company&"+chosen_key.replace(/ /g,'')
				// window.location = "index.html#mgmt_company&exampleMgmtCompany"
			}
			if ($(this).hasClass("authorizer_go")) {
				window.location.href = "index.html#authorizer&"+chosen_state.replace(/ /g,'')+"&"+chosen_key.replace(/ /g,'')
				// window.location = "index.html#authorizer&Arizona&exampleAuthorizer"
			}
			if ($(this).hasClass("school_go")) {
				window.location.href = "index.html#school&"+chosen_state.replace(/ /g,'')+"&"+chosen_key.replace(/ /g,'').replace(/\./g,'')
				// window.location = "index.html#school&Arizona&exampleSchool"
			}
		} else {
			// otherwise, the user is on the state level
			var input_field1 = $(this).siblings('.nav_input_field').children('select').eq(0)
			var chosen_state = input_field1.val()
			if ($(this).hasClass("state_go")) {
				window.location.href = "index.html#state&"+chosen_state.replace(/ /g,'')
			}
		}
	}
)

$(".home_tab").click(
	function() {
		window.location.href = "index.html"
		window.location.reload()
})

// when hash string change is detected, reload the page with new hash value
window.onhashchange = function() {
	window.location.reload()
}

// Amar Beeharry
// 7/7/2017
//Initialize Array to save searchResult from each json files

var searchResult = [];
$(function ()
{
    
    ////State Keywords
    $.ajax({
        url: "data/nav_keywords/state_keywords.json",
        dataType: "json",
        success:
             function (data) {
                 $.each(data, function (key, val) {
                     searchResult.push(toTitleCase(val));
                 });
             }
    });

    //////Authorizer Keywords
    $.ajax({
        url: "data/nav_keywords/authorizer_keywords.json",
        dataType: "json",
        success:
             function (data) {
                 Object.keys(data).forEach(function (k) {
                     data[k].forEach(function (i) { searchResult.push("Authorizer: " + toTitleCase(k) + ', ' + i); }
                         );
                 });
             }
    });

    //////Congressional District Keywords
    $.ajax({
        url: "data/nav_keywords/congressional_dis_keywords.json",
        dataType: "json",
        success:
             function (data) {
                 Object.keys(data).forEach(function (k) {
                     data[k].forEach(function (i) { searchResult.push("Congressional District: " + toTitleCase(k) + ', ' + i); }
                         );
                 });
             }
    });

    //////Management Company Keywords
    $.ajax({
        url: "data/nav_keywords/mgmt_company_keywords.json",
        dataType: "json",
        success:
             function (data) {
                 Object.keys(data).forEach(function (k) {
                     data[k].forEach(function (i) { searchResult.push("Management Company: " + toTitleCase(k) + ', ' + i); }
                         );
                 });
             }
    });

    //////School District Keywords
    $.ajax({
        url: "data/nav_keywords/school_dis_keywords.json",
        dataType: "json",
        success:
             function (data) {
                 Object.keys(data).forEach(function (k) {
                     data[k].forEach(function (i) { searchResult.push("School District: " + toTitleCase(k) + ', ' + i); }
                         );
                 });
             }
    });

    //////School Keywords
    $.ajax({
        url: "data/nav_keywords/school_keywords.json",
        dataType: "json",
        success:
             function (data) {
                 Object.keys(data).forEach(function (k) {
                     data[k].forEach(function (i) { searchResult.push("School: " + toTitleCase(k) + ', ' + i); }
                     );                              
                 });
             }
    });
               
        searchResult.sort;
        $("#search").autocomplete(
                       {
                           source: function (request, response) {
                               var results = $.ui.autocomplete.filter(searchResult, request.term);
                               response(results.splice(0, 500));
                           },
                           minLength: 3,
                           delay: 300                            
                       });           
    }    
);

searchResult.length = 0;
//Clear search when user clicks on Search box
$("#search").click(function () { $(this).val("") });

//Make Enter key run search
$(document).bind('keypress', function (e) {
    if (e.keyCode == 13) {
        $('#go_search').trigger('click');
    }
});

//Url string building
$("#go_search").click(function () {
    var s = $("#search").val();

    if ($("#search").val().includes(":")) {
        window.location = "index.html#" + $("#search")
            .val()
            .replace("Congressional District: ", "congressional_district&")
            .replace("School District: ", "school_district&")
            .replace("School: ", "school&")
            .replace("Authorizer: ", "authorizer&")
            .replace("Management Company: ", "mgmt_company&")
            .replace(/ /g, '')
            .replace(",", '&')
    }
    else
    {
        window.location = "index.html#state&" + $("#search")
            .val()
            .replace(/ /g, '')
    }

    if (s.includes("Management Company: ")) {
        window.location = "index.html#" + s.substring(s.indexOf(","), s.length)
            .replace(", ", "mgmt_company&").replace(/ /g, '')
    }
});

function toTitleCase(str) {
    return str.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
}


