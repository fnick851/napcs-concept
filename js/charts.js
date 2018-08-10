// determine keywords for bar charts file path
if (hash_value === '') {
  file_string_bar = 'data/chart_data/national/total_by_year.tsv'
  file_string_stacked = 'data/chart_data/national'
}
if (keyword1 === 'state') {
  file_string_bar = 'data/chart_data/state/'+keyword2+'/total_by_year.tsv'
  file_string_stacked = 'data/chart_data/state/'+keyword2
}
if (keyword1 === 'congressional_district') {
  file_string_bar = 'data/chart_data/congressional_district/'+keyword2+"/"+keyword3+'/total_by_year.tsv'
  file_string_stacked = 'data/chart_data/congressional_district/'+keyword2+"/"+keyword3
}
if (keyword1 === 'school_district') {
  file_string_bar = 'data/chart_data/school_district/'+keyword2+"/"+keyword3+'/total_by_year.tsv'
  file_string_stacked = 'data/chart_data/school_district/'+keyword2+"/"+keyword3
}
if (keyword1 === 'mgmt_company') {
  file_string_bar = 'data/chart_data/mgmt_company/'+keyword2+'/total_by_year.tsv'
  file_string_stacked = 'data/chart_data/mgmt_company/'+keyword2
}
if (keyword1 === 'authorizer') {
  file_string_bar = 'data/chart_data/authorizer/'+keyword2+"/"+keyword3+'/total_by_year.tsv'
  file_string_stacked = 'data/chart_data/authorizer/'+keyword2+"/"+keyword3
}
if (keyword1 === 'school') {
  file_string_bar = 'data/chart_data/school/'+keyword2+"/"+keyword3+'/total_by_year.tsv'
  file_string_stacked = 'data/chart_data/school/'+keyword2+"/"+keyword3
}

// view variable value is already loaded - either the dafault value by the school/student tab
// multi-layers donuts
function donut_multi(data_file_path, title_line_1, title_line_2, container) {
  if (view === "school_view"){
    donut_multi_center_color = multiCenterColor_school
    donut_multi_text_color = multi_text_school
    donut_multi_color_range = multi_school
  } else {
    donut_multi_center_color = multiCenterColor_student
    donut_multi_text_color = multi_text_student
    donut_multi_color_range = multi_student
  }

  if (title_line_2 === "Management Type") {
    var stacked_data_file = file_string_stacked+"/mgmt_type_stacked_bar.tsv"
    var svg_attr = "mgmt_type_donut"
    var bar_title = "Schools by Management Type"
    var latest_data_year = stat.latest_data.mgmt_type
  }
  if (title_line_2 === "Locale") {
    var stacked_data_file = file_string_stacked+"/locale_stacked_bar.tsv"
    var svg_attr = "locale_donut"
    var bar_title = "Schools by Locale"
    var latest_data_year = stat.latest_data.locale
  }
  if (title_line_2 === "Race/Ethnicity") {
    var stacked_data_file = file_string_stacked+"/race_stacked_bar.tsv"
    var bar_title = "Schools by Race/Ethnicity"
    var svg_attr = "race_donut"
    var latest_data_year = stat.latest_data.race
  }
  if (title_line_2 === "for FRPL") {
    var stacked_data_file = file_string_stacked+"/free_lunch_stacked_bar.tsv"
    var svg_attr = "free_lunch_donut"
    var bar_title = "Students Qualifying for FRPL"
    var latest_data_year = stat.latest_data.lunch
  }


  var width = 220,
      height = single_donut_svgHeight,
      radius = Math.min(width, height) / 2 - 5;

  // tooltip
  var tooltip = d3.select(container).append("div").attr("class", "toolTip");
  function mouseover() {
      tooltip.style("display", "inline");
    }
  function mouseout() {
    tooltip.style("display", "none");
  }

  var color = d3.scaleOrdinal()
      .range(donut_multi_color_range);
  

  var arc = d3.arc()
      .outerRadius(radius-5)
      .innerRadius(radius - 25);

  var pie = d3.pie()
      .sort(null)
      .value(function(d) { return d.population; });

  var svg = d3.select(container).append("svg").attr("class", svg_attr)
      .attr("width", width)
      .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + donut_y_translate + ")");

  svg.append("circle")
    .attr("r", radius)
    .attr("cx", 0)
    .attr("cy", 0)
    .style("fill", donut_grey);

  d3.tsv(data_file_path, type, function(error, data) {
    var popu_total = 0;
    // console.log(data)
    for (i=0;i<(data.length);i++) {
      // console.log(data[i])
      var popu_total = popu_total + data[i].population;
    }
    // console.log(popu_total)
    if (error) throw error;
    var g = svg.selectAll(".arc")
        .data(pie(data))
        .enter().append("g")
        .attr("class", "arc");
      g.append("path")
        .attr("d", arc)
        .style("fill", function(d) { return color(d.data.category); })
        .on("mouseover", mouseover)
        .on("mousemove", function(d){
            tooltip
              .html("<b>"+d.data.category+"</b>"+":<br>"+d3.format(",")(d.data.population)+" ("+d3.format(".0%")(d.data.population/popu_total)+")"+"<br><h6>Click for details</h6>")
        })
        .on("mouseout", mouseout);
     // apend the canvas for donut legends
    var legends_svg = d3.select(container).append("svg")
        .attr("width", width)
        .attr("height", height)
        // .attr("transform", "translate(" + 0 + ","+ 0 + ")")
    var legends_title = legends_svg.append("text")
      .text(title_line_1+" "+title_line_2)
      .style("font-size", "13px")
      .attr("x", 0)
      .attr("y", 10)

    var legends_line = legends_svg.append("line")          // attach a line
      .style("stroke", "black")  // colour the line
      .attr("x1", 0)     // x position of the first end of the line
      .attr("y1", 17)      // y position of the first end of the line
      .attr("x2", 220)     // x position of the second end of the line
      .attr("y2", 17); 

    var legends = legends_svg.append("g")
        .attr("class", container+"legends_g")

    var legend = legends.selectAll("g")
        .data(function() {
          return color.domain()
        })
        .enter()
        .append("g")
        .attr("transform", function(d, i) { return "translate(0," + (i+0.3) * 35 + ")"; })

    // g.append("text")
    //     .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
    //     .attr("dy", ".35em")
    //     .text(function(d) { return d.data.age; });

    //append legends retangles to svg
    legend.append("rect")
        .attr("width", "15px")
        .attr("height", "15px")
        .style("fill", color);
    // append texts to svg
    legend.append("text")
        .attr("x", 22)
        .style("font-size", 12)
        .text(function(d) { 
          return d; 
        })
        .call(wrap, 100)
    // calculate percentage numbers and append them to svg
    sum = data.reduce(function(sum, value){
      return sum + value.population
    }, 0)
    legend.append("text")
      .attr("x", 120)
      .attr("y", 12)
      .style("fill", "black")
      .style("font-size", 12)
      .data(data)
      .text(function(d) { 
        return d3.format(".0%")(d.population / sum) + " | " + d3.format(",")(d.population);
      })


      var legends_x_translate = (width - legends.node().getBBox().width)/2
      legends.attr("transform", "translate("+ legends_x_translate + ",20)")

    

  });

  function type(d) {
    d.population = +d.population;
    return d;
  }

  var inner_circle = svg.append("circle")
    .attr("r", radius - centerCircle_shrink)
    .attr("cx", 0)
    .attr("cy", 0)
    .style("fill", donut_multi_center_color);

    // donut_title = title_line_1 + " " + title_line_2
    // svg.append("svg:foreignObject")
    //     .attr("y", "-30px")
    //     .attr("x", "-30px")
    //     .append("xhtml:span")
    //     .text(donut_title)
    //     .attr("class", "donutTitleText")
    //     .style("color", donut_multi_text_color)

  svg.append("text")
      .attr("class", "donutTitleText")
      .text(title_line_1)
      .style("fill", donut_multi_text_color)
      .attr("transform", "translate(" + 0 + "," + -5 + ")");

  svg.append("text")
        .attr("class", "donutTitleText")
        .text(title_line_2)
        .style("fill", donut_multi_text_color)
        .attr("transform", "translate(" + 0 + "," + 15 + ")")

  if (title_line_2 === "for FRPL") {
    // svg.append("svg:foreignObject")
    //   .attr("y", "-1px")
    //   .attr("x", "32px")
    //   .attr("font-size", "12px")
    //   .append("xhtml:span")
    //   .text("ⓘ")
    svg.append('text')
    .attr('font-size', '11px' )
    .attr("transform", "translate(" + 32 + "," + 8 + ")")
    .text('ⓘ')
        .on("mouseover", mouseover)
        .on("mousemove", function(){
              tooltip
                .style("left", width/2 + 10 + "px")
                .style("top", height/3 - 20 + "px")
                .style("font-size", 12+"px")
                .html(
                  'FRPL: Free or Reduced Price Lunch'
                )
          })
        .on("mouseout", mouseout)
  }

  // latest date of available data --- one for each donut --- old
  // svg.append("text")
  //     .attr("class", "donutTitleText")
  //     .text("Latest Data: " + latest_data_year)
  //     .style("font-size", "12pt")
  //     .style("font-weight", "bold")
  //     .attr("transform", "translate(" + 0 + "," + data_note_y_translate + ")");

  



  // clickability of donuts
    $("."+svg_attr).click(
      function() {
        $( ".chart_container" ).remove();
          $( ".chart_inner" ).append( "<div class='chart_container'></div>" );
          stacked_bar(stacked_data_file, bar_title);
      }
    )




};












// plain donuts
function donut_plain(data_file, container) {
  // console.log("view is " + view);

  if (view === "school_view"){
    title_keyword = "Schools";
    inner_circle_color = innerDonutColor_school;
    outer_circle_color = outerDonutColor_school;
  } else {
    title_keyword = "Students";
    inner_circle_color = innerDonutColor_student;
    outer_circle_color = outerDonutColor_student;
  }

  var width = 220,
      height = single_donut_svgHeight,
      radius = Math.min(width, height) / 2;

  var svg = d3.select(container).append("svg").attr("class", "plain_donut")
    .attr("width", width)
    .attr("height", height);
  // append the canvas for donut legends
  var legend = d3.select(container).append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")



  svg.append("circle")
    .attr("r", radius - 7)
    .attr("cx", radius)
    .attr("cy", radius)
    .style("fill", outer_circle_color);

  svg.append("circle")
    .attr("r", radius-inner_offset)
    .attr("cx", radius)
    .attr("cy", radius)
    .style("fill", inner_circle_color);

  svg.append("text")
      .attr("class", "donutTitleText")
      .text("Total Number of")
      .attr("transform", "translate(" + width / 2 + "," + height / 1.8 + ")")
      .style("fill", "white")

  svg.append("text")
      .attr("class", "donutTitleText")
      .text(title_keyword)
      .attr("transform", "translate(" + width / 2 + "," + height / 1.5 + ")")
      .style("fill", "white")

  d3.tsv(data_file, function(d) {
      var donut_plain_data = {};
      for (var i=0; i < d.length; i++){
        donut_plain_data[d[i].year] = {
          'student_view': d[i].student_view,
          'school_view': d[i].school_view}
      }

  if (donut_plain_data[year]) {
    var number_with_comma = d3.format(",")(donut_plain_data[year][view]);
    var donutTitleClass = "donutTitleNumber";
  } else {
    var number_with_comma = 'Data not available for '+year;
    var donutTitleClass = "donutTitleNotAvailable";

  }

  svg.append("text")
      .attr("class", donutTitleClass)
      .text(number_with_comma)
      .attr("transform", "translate(" + width / 2 + "," + height / 2.5 + ")")
      .style("fill", "white")

  // latest year of available data --- for plain donut --- old
  var latest_data_year = year;
  // svg.append("text")
  //     .attr("class", "donutTitleText")
  //     .text("Latest Data: " + latest_data_year)
  //     .style("font-size", "12pt")
  //     .style("font-weight", "bold")
  //    .attr("transform", "translate(" + width / 2 + "," + height/1.145 + ")");

  legend.append("text")
    .text(function() {
      return latest_data_year
    })
    .style("fill", "rgb(28, 90, 125)")
    .style("font-size", "30px")
    .attr("transform", "translate(" + width/8 + "," + 25 + ")");

  legend.append("text")
    .text("Click donuts for Trends and Details")
    .style("font-size", "15px")
    .attr("transform", "translate(" + width/8 + "," + height/5 + ")")
    .call(wrap, 200)

    // clickability of donuts
    $(".plain_donut").click(
      function() {
        $( ".chart_container" ).remove();
          $( ".chart_inner" ).append( "<div class='chart_container'></div>" );
          bar();
      }
    )
  })



};





// plain donuts for mgmt type
function mgmt_type(container) {

      var width = 220,
      height = 220,
      radius = Math.min(width, height) / 2;

  var svg = d3.select(container).append("svg").attr("class", "mgmt_type_label")
    .attr("width", width)
    .attr("height", height);


  svg.append("circle")
    .attr("r", radius - 7)
    .attr("cx", radius)
    .attr("cy", radius)
    .style("fill", outerDonutColor_school);

  svg.append("circle")
    .attr("r", radius-inner_offset)
    .attr("cx", radius)
    .attr("cy", radius)
    .style("fill", innerDonutColor_school);

  svg.append("text")
      .attr("class", "donutTitleText")
      .text(stat['type'][year.toString()])
      .attr("transform", "translate(" + width / 2 + "," + height / 1.8 + ")")
      .style("fill", "white")
      .style("font-size", "30px")
};






// bar charts
function bar() {

  if (view === "school_view"){
    bar_color = bar_color_school
    bar_title = "Total Number of Schools"
  } else {
    bar_color = bar_color_student
    bar_title = "Total Number of Students"
  }

  var margin = {top: 70, right: 20, bottom: 50, left: 40},
      svg = d3.select(".chart_container").append("svg")

  var svgwidth = $("svg").parent().width() * 1.0
  var svgheight = stackBarSvgHeight
  svg.attr("width", svgwidth).attr("height", svgheight)

  var width = +svg.attr("width") - margin.left - margin.right,
      height = +svg.attr("height") - margin.top - margin.bottom

  // tooltip
  var tooltip = d3.select(".chart_container").append("div").attr("class", "toolTip");
  function mouseover() {
      tooltip.style("display", "inline");
    }
  function mouseout() {
    tooltip.style("display", "none");
  }

  svg.append("text")
      .attr("class", "barTitle")
      .text(bar_title)
      .attr("transform", "translate("+ barTitleX +"," + 20 + ")")

  // back button
  var back_icon = svg.append("text")
    .text("\uf190")
    .style("font-family", "FontAwesome")
    .attr("transform", "translate("+ (width-15) +"," + 20 + ")")
    .attr("class", "back_button")
  var back_text = svg.append("text")
    .text("Back")
    .attr("transform", "translate("+ width +"," + 20 + ")")
    .attr("class", "back_button")
    .on("mouseover", function() {
      d3.select(this).attr("text-decoration", "underline")
    })
    .on("mouseout", function() {
      d3.select(this).attr("text-decoration", "none")
    })

  $(".back_button").click(
    function() {
      $( ".chart_container" ).remove();
        $( ".chart_inner" ).append( "<div class='chart_container'></div>" );
        draw_charts();
    }
  )

  var x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
      y = d3.scaleLinear().rangeRound([height, 0]);

  var g = svg.append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  d3.tsv(file_string_bar, function(d) {
    d[view] = +d[view];
    return d;
  }, function(error, data) {
    if (error) throw error;

    x.domain(data.map(function(d) { return d.year; }));
    y.domain([0, d3.max(data, function(d) { return d[view]; })]);

    var xAxis = g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")

    if (width < 260) {
      xAxis.attr("y", 10)
        .attr("x", -20)
        .attr("transform", "rotate(315)")
        .style("text-anchor", "start")
      back_icon
        .attr("transform", "translate("+ barTitleX +"," + 40 + ")")
      back_text
        .attr("transform", "translate("+ (barTitleX+15) +"," + 40 + ")")
    }

    g.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(y).ticks(10).tickFormat(d3.format(".2s")))
      // .append("text")
      //   .attr("transform", "rotate(-90)")
      //   .attr("y", 6)
      //   .attr("dy", "0.71em")
      //   .attr("text-anchor", "end")
      //   .text("number");

    function mouseover() {
      tooltip.style("display", "inline");
    }

    function mouseout() {
      tooltip.style("display", "none");
    }

    var tooltip_label = view === "student_view" ? "Students" : "Schools";
    g.selectAll(".bar")
      .data(data)
      .enter().append("rect")
        .attr("class", "bar"+tooltip_label)
        .attr("fill", bar_color)
        .attr("x", function(d) { return x(d.year); })
        .attr("y", function(d) { return y(d[view]); })
        .attr("width", x.bandwidth())
        .attr("height", function(d) { return height - y(d[view]); })
        .on("mouseover", mouseover)
        .on("mousemove", function(d){
            tooltip
              .style("left", d3.event.pageX - 50 + "px")
              .style("top", d3.event.pageY - 100 + "px")
              .html("<b>Number of " + tooltip_label + "</b><br>" + (d3.format(",")(d[view])));
        })
        .on("mouseout", mouseout);
  });


};

















//
// function for drawing stacked bar charts
//
function stacked_bar(data_file_path, bar_title){
  // console.log(data_file_path)
  var margin = {top: 70, right: 75, bottom: 50, left: 20},
      svg = d3.select(".chart_container").append("svg")

  var svgwidth = $("svg").parent().width() * 1;
  var svgheight = stackBarSvgHeight
  svg.attr("width", svgwidth).attr("height", svgheight)

  var width = +svg.attr("width") - margin.left - margin.right,
      height = +svg.attr("height") - margin.top - margin.bottom,
      g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // tooltip
  var tooltip = d3.select(".chart_container").append("div").attr("class", "toolTip");
  function mouseover() {
      tooltip.style("display", "inline");
    }
  function mouseout() {
    tooltip.style("display", "none");
  }

  // title
  svg.append("text")
      .attr("class", "barTitle")
      .text(bar_title)
      .attr("transform", "translate("+ stackBarTitleX +"," + 20 + ")")
  // tooltip for FRPL
  if (bar_title === "Students Qualifying for FRPL") {
    // svg.append("svg:foreignObject")
    //   .attr("y", "1px")
    //   .attr("x", "301px")
    //   .attr("font-size", "12px")
    //   .append("xhtml:span")
    //   .text("ⓘ")
    svg.append('text')
      .attr('font-size', '11px' )
      .attr("transform", "translate(" + 302 + "," + 11 + ")")
      .text('ⓘ')
          .on("mouseover", mouseover)
          .on("mousemove", function(){
                tooltip
                  .style("left", d3.event.pageX + 10 + "px")
                  .style("top", d3.event.pageY - 20 + "px")
                  .style("font-size", 12+"px")
                  .html(
                    'FRPL: Free or Reduced Price Lunch'
                  )
            })
          .on("mouseout", mouseout);
  }

  // back button
  var back_icon = svg.append("text")
    .text("\uf190")
    .attr("class", "back_button")
    .attr("transform", "translate("+ (width+margin.right-55) +"," + 20 + ")")
    .style("font-family", "FontAwesome")
  var back_text = svg.append("text")
    .text("Back")
    .attr("class", "back_button")
    .attr("transform", "translate("+ (width+margin.right-5) +"," + 20 + ")")
    .attr("text-anchor", "end")
    .on("mouseover", function() {
      d3.select(this).attr("text-decoration", "underline")
    })
    .on("mouseout", function() {
      d3.select(this).attr("text-decoration", "none")
    })
  $(".back_button").click(
    function() {
      $( ".chart_container" ).remove();
        $( ".chart_inner" ).append( "<div class='chart_container'></div>" );
        draw_charts();
    }
  )

  var x = d3.scaleBand()
      .rangeRound([0, width])
      .paddingInner(0.05)
      .align(0.1);

  var y = d3.scaleLinear()
      .rangeRound([height, 0]);

  var z = d3.scaleOrdinal()
      .range(donut_multi_color_range);

  d3.tsv(data_file_path, function(d, i, columns) {
    // console.log(d);
    for (i = 1, t = 0; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];
    d.total = t;
    return d;
  }, function(error, data) {
    if (error) throw error;
    var keys = data.columns.slice(1);
    x.domain(data.map(function(d) { return d.year; }));
    y.domain([0, d3.max(data, function(d) { return d.total; })]).nice();
    z.domain(keys);
    g.append("g")
      .selectAll("g")
      .data(d3.stack().keys(keys)(data))
      .enter().append("g")
        .attr("fill", function(d) { return z(d.key); })
      .selectAll("rect")
      .data(function(d) { return d; })
      .enter().append("rect")
        .attr("x", function(d) { return x(d.data.year); })
        .attr("y", function(d) { return y(d[1]); })
        .attr("height", function(d) { return y(d[0]) - y(d[1]); })
        .attr("width", x.bandwidth())
        .on("mouseover", mouseover)
        .on("mousemove", function(d){
          for (i in d.data) {
            if (d[1]-d[0] === d.data[i]) {
              var label = i
            }
          }
            tooltip
              .style("left", d3.event.pageX + 10 + "px")
              .style("top", d3.event.pageY - 30 + "px")
              .style("font-size", 12+"px")
              .html(
                label + ": " + (d[1]-d[0])
              )
        })
        .on("mouseout", mouseout);

    var xAxis = g.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")

    if (width < 260) {
      xAxis.attr("y", 10)
        .attr("x", -20)
        .attr("transform", "rotate(315)")
        .style("text-anchor", "start")
      back_icon
        .attr("transform", "translate("+ barTitleX +"," + 40 + ")")
      back_text
        .attr("transform", "translate("+ (barTitleX+15) +"," + 40 + ")")
    }

    g.append("g")
        .attr("class", "axis")
        .call(d3.axisLeft(y).ticks(null, "s"))
      // .append("text")
      //   .attr("x", 2)
      //   .attr("y", y(y.ticks().pop()) + 0.5)
      //   .attr("dy", "0.32em")
      //   .attr("fill", "#000")
      //   .attr("font-weight", "bold")
      //   .attr("text-anchor", "start")
      //   .text("Number of Students");

    var legend = g.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .attr("text-anchor", stackLegendTextAnchor)
      .selectAll("g")
      .data(keys.slice().reverse())
      .enter().append("g")
        .attr("transform", function(d, i) { return "translate(0," + i * 15 + ")"; });

    legend.append("rect")
        .attr("x", width + stackLegendOffset)
        .attr("width", 10)
        .attr("height", 10)
        .attr("fill", z);

    legend.append("text")
        .attr("x", width + stackLegendTextOffset)
        .attr("y", 9)
        .text(function(d) { return d; })
  });

}





//
// function that does SVG text line wrapping
//
function wrap(text, width) {
  text.each(function() {
    var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1, // ems
        y = 0,
        dy = 1,
        x = text.attr("x"),
        tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
        if (x === null ) {
          x = 0
        }
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));

      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
      }
    }
    text.selectAll("tspan").attr("x", x).attr("y", -lineHeight*(lineNumber/2)+"em")
  })
}
