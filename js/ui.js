//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
// school & student tabs animations
// value for SCHOOL tab TEXT when it SHOWS
student_tab_leftShift = "-13px"
// value for STUDENT tab TEXT when it HIDES
school_tab_leftShift = "-40px"
// value for STUDENT tab TEXT when it SHOWS
school_tab_showShift = "-17px"
// #student_tab refers to Schools tab, vice versa
$( "#student_tab" ).css("width", "30px").css("background", studentTabColor)
$(".student_text").css("margin-left", student_tab_leftShift)
// school tab behavior
$( "#student_tab" ).hover(
	function() {
		if ($(this).hasClass("not_clicked")) {
			$( this ).css("width", "30px").css("background", studentTabColor)
			$(".student_text").css("margin-left", student_tab_leftShift)
		}
	}, function() {
		if ($(this).hasClass("not_clicked")) {
			$( this ).css("width", "15px").css("background", studentTabColor)
			$(".student_text").css("margin-left", school_tab_leftShift)
		}
	}
)
$("#student_tab").click(
	function() {
		$("#school_tab").css("width", "15px").css("background", schoolTabColor).addClass("not_clicked")
		$(".school_text").css("margin-left", school_tab_leftShift)
		$(".student_text").css("margin-left", student_tab_leftShift)
		$(this).css("width", "30px").removeClass("not_clicked")
	}	
)
// student tab behavior
$( "#school_tab" ).hover(
	function() {
		if ($(this).hasClass("not_clicked")) {
			$( this ).css("width", "30px").css("background", schoolTabColor)
			$(".school_text").css("margin-left", school_tab_showShift)
		}
	}, function() {
		if ($(this).hasClass("not_clicked")) {
			$( this ).css("width", "15px").css("background", schoolTabColor)
			$(".school_text").css("margin-left", school_tab_leftShift)
		}
	}
)
$("#school_tab").click(
	function() {
		$("#student_tab").css("width", "15px").css("background", studentTabColor).addClass("not_clicked")
		$(".student_text").css("margin-left", school_tab_leftShift)
		$(".school_text").css("margin-left", school_tab_showShift)
		$(this).css("width", "30px").removeClass("not_clicked")
	}	
)

//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
// switch between school or student view
$("#student_tab").click(
    function() {
        view = "school_view"
        loadData_draw()
        draw_charts()
    }
)
$("#school_tab").click(
    function() {
        view = "student_view"
        loadData_draw()
        draw_charts()
    }  
)
// set the default view variable 
view = "school_view"

//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
// initial year
year = 2014
// initiate slider
$( function() {
    var handle = $( "#custom-handle" )
    $( "#slider" ).slider({
        value: 2014,
        max: 2014,
        min: 2005,
        create: function() {
            handle.text( $( this ).slider( "value" ) )
        },
        slide: function( event, ui ) {
            handle.text( ui.value )
        },
        stop: function( event, ui ) {
            handle.text( ui.value )
            year = $( "#slider" ).slider( "value" )
            loadData_draw()
            draw_charts()
        }
    })
})
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
// click nav tab to show dropdown form & hide it
function change_label(el) {
    // console.log(el.siblings())
    el.siblings().children('a').children('p').addClass('tab_label')  
    el.siblings().children('a').removeClass('clicked_tab')
    el.children("a").children("p").toggleClass("tab_label")
    el.children("a").toggleClass("clicked_tab")
}
$(".state_link").click(
	function() {
    	$(this).children(".dropdown_form").toggle()
    	$(".school_link").children(".dropdown_form").hide()
    	$(".congressional_link").children(".dropdown_form").hide()
    	$(".mgmt_company_link").children(".dropdown_form").hide()
    	$(".authorizer_link").children(".dropdown_form").hide()
    	$(".school_dis_link").children(".dropdown_form").hide()
        $(".school_link").children(".dropdown_form").hide()
        change_label($(this))
        state_selected = false
        district_selected = false
	}
)
$(".state_link form").click(function(e) {
        e.stopPropagation()
   })
$(".congressional_link").click(
	function() {
    	$(this).children(".dropdown_form").toggle()
    	$(".state_link").children(".dropdown_form").hide()
    	$(".school_link").children(".dropdown_form").hide()
    	$(".mgmt_company_link").children(".dropdown_form").hide()
    	$(".authorizer_link").children(".dropdown_form").hide()
    	$(".school_dis_link").children(".dropdown_form").hide()
        $(".nav_input_field").children().val("")
        change_label($(this))
        state_selected = false
        district_selected = false
	}
)
$(".congressional_link form").click(function(e) {
        e.stopPropagation()
   })
$(".mgmt_company_link").click(
	function() {
    	$(this).children(".dropdown_form").toggle()
    	$(".state_link").children(".dropdown_form").hide()
    	$(".school_link").children(".dropdown_form").hide()
    	$(".congressional_link").children(".dropdown_form").hide()
    	$(".authorizer_link").children(".dropdown_form").hide()
    	$(".school_dis_link").children(".dropdown_form").hide()
        $(".nav_input_field").children().val("")
        change_label($(this))
        // $("#mgmt-type").click(function() {
        //         $(this).val("")
        //     }
        // )
        state_selected = false
        district_selected = false
	}
)
$(".mgmt_company_link form").click(function(e) {
        e.stopPropagation()
   })
$(".authorizer_link").click(
	function() {
    	$(this).children(".dropdown_form").toggle()
    	$(".state_link").children(".dropdown_form").hide()
    	$(".school_link").children(".dropdown_form").hide()
    	$(".mgmt_company_link").children(".dropdown_form").hide()
    	$(".congressional_link").children(".dropdown_form").hide()
    	$(".school_dis_link").children(".dropdown_form").hide()
        $(".nav_input_field").children().val("")
        change_label($(this))
        state_selected = false
        district_selected = false
	}
)
$(".authorizer_link form").click(function(e) {
        e.stopPropagation()
   })
$(".school_dis_link").click(
	function() {
    	$(this).children(".dropdown_form").toggle()
    	$(".state_link").children(".dropdown_form").hide()
    	$(".school_link").children(".dropdown_form").hide()
    	$(".mgmt_company_link").children(".dropdown_form").hide()
    	$(".authorizer_link").children(".dropdown_form").hide()
    	$(".congressional_link").children(".dropdown_form").hide()
        $(".nav_input_field").children().val("")
        change_label($(this))
        state_selected = false
        district_selected = false
	}
)
$(".school_dis_link form").click(function(e) {
        e.stopPropagation()
   })
$(".school_link").click(
	function() {
    	$(this).children(".dropdown_form").toggle()
    	$(".state_link").children(".dropdown_form").hide()
    	$(".congressional_link").children(".dropdown_form").hide()
    	$(".mgmt_company_link").children(".dropdown_form").hide()
    	$(".authorizer_link").children(".dropdown_form").hide()
    	$(".school_dis_link").children(".dropdown_form").hide()
        $(".nav_input_field").children().val("")
        change_label($(this))
        state_selected = false
        district_selected = false
	}
)
$(".school_link form").click(function(e) {
        e.stopPropagation()
   })
// hide dropdown when clicked outsite
$(document).click(function(event) {
    hide_dropdown(event)
})
function hide_dropdown(event) {
    // console.log(event.target.localName)
    var class_name = event.target.className
    var event_target = event.target.localName
    if ( event_target === "body" || class_name === 'state_link' || class_name === 'congressional_link' || class_name === 'school_dis_link' || class_name === 'authorizer_link' || class_name === 'mgmt_company_link' || class_name === 'school_link' ) {
        return
    } else if ( $(".state_link").children(".dropdown_form").is(':visible') || $(".congressional_link").children(".dropdown_form").is(':visible') || $(".school_dis_link").children(".dropdown_form").is(':visible') || $(".authorizer_link").children(".dropdown_form").is(':visible') || $(".mgmt_company_link").children(".dropdown_form").is(':visible') || $(".school_link").children(".dropdown_form").is(':visible') ) {
        $('.dropdown_form').hide()
        $('.clicked_tab').find('p').addClass('tab_label')  
        $('.clicked_tab').removeClass('clicked_tab')
    }
}

//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
// glossary page 
// Get the modal
var modal = document.getElementById('myModal')
// Get the button that opens the modal
var btn = document.getElementById("note_page_link")
// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0]
// attach jQuery tooltip to it
$("#note_page_link").tooltip()
// When the user clicks the button, open the modal 
btn.onclick = function() {
    modal.style.display = "block"
}
// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none"
}
// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none"
    }
}
$('#note_page_link').click(function() { 
    $('body').css('overflow', 'hidden')
})
$('.close').click(function() { 
    $('body').css('overflow', 'auto')
})

//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
// enter keypress for search and nav go buttons
// enter keypress will trigger the correpsonding button insteand form submit
$('.search_box form').on('keypress', function(e) {
  var keyCode = e.keyCode || e.which
  if (keyCode === 13) { 
    e.preventDefault()
  }
})
$('.dropdown_form').on('keypress', function(e) {
  var keyCode = e.keyCode || e.which
  if (keyCode === 13) { 
    e.preventDefault()
    $(".nav_submit").click()  
  }
})

//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
// scroll to shrink the header & nav section
$(document).on("scroll", function(){
    if
  ($(document).scrollTop() > 50){
        $(".header").addClass("shrinkHeader")
        $(".nav_fix").addClass("shrinkNav_fix")
        $(".header-img").addClass("shrinkImg")
        $(".search_form").addClass("shrinkForm")
        $(".search_box").addClass("shrinkSearch_box")
    }
    else
    {
        $(".header").removeClass("shrinkHeader")
        $(".nav_fix").removeClass("shrinkNav_fix")
        $(".header-img").removeClass("shrinkImg")
        $(".search_form").removeClass("shrinkForm")
        $(".search_box").removeClass("shrinkSearch_box")
    }
})
