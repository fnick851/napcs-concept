// get hash values from URL, will be accessed in subsequent scripts
var hash_value = window.location.hash.replace('#', '')
var keywords = hash_value.split('&')
var keyword1 = keywords[0]
var keyword2 = keywords[1]
var keyword3 = keywords[2]

// shallow grey used in page
donut_grey = '#eff2f4';
// svg height for single piece donut
single_donut_svgHeight = 220;

// color scale for multi-pieces donut and stacked bar charts
multi_school = ["#91664c", "#f39f53", "#fddcb1", "#e1da1a", "#c8ac99", "#f6f5cd"]
multi_student = ["#1d5b7d", "#657e9b", "#76c5d5", "#c4e4ed", "#ced3de", "#e6f3f8"]
multiCenterColor_school = 'white';
multiCenterColor_student = 'white';
centerCircle_shrink = 20;
multi_text_school = '#7f654a';
multi_text_student = '#1d5b7d';
donut_y_translate = single_donut_svgHeight/2;
data_note_y_translate = 150;

// spec for plain donut
innerDonutColor_student = '#1C5A7d';
outerDonutColor_student = donut_grey;
innerDonutColor_school = '#f39f53';
outerDonutColor_school = donut_grey;
inner_offset = 12;

// spec for bar chart
// barSvgWidth = 660;
barSvgHeight = 300;
barTitleX = 0;
bar_color_school = 'rgb(243, 159, 83)';
bar_color_student = 'rgb(28, 90, 125)';

// spec for stack bar chart canvas
// stackBarSvgWidth = 660;
stackBarSvgHeight = 300;
stackBarTitleX = 0;
stackLegendOffset = 15;
stackLegendTextOffset = 30;
stackLegendTextAnchor = "start";

// color scale for map shapes
map_color = ['#969696', '#326b8a', '#608ca4', '#8dacbe', '#bacdd8', '#e8eef2'];

// color for tabs
schoolTabColor = 'rgb(28, 90, 125)';
studentTabColor = '#f39f53';
