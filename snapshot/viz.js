
// function for draw donuts with multiple pieces
function donut_multi(donut_config) {
  var data_file_path = donut_config[0]
  var title_line = donut_config[1]
  var chart_container = "."+donut_config[2]
  var translate = donut_config[3]

  var width = height = 230,
    radius = Math.min(width, height) / 2

  var color = d3.scaleOrdinal()
    .range(donut_color_spectrum)

  var arc = d3.arc()
    .outerRadius(radius-20)
    .innerRadius(radius-50)

  var pie = d3.pie()
    .value(function(d) { 
      return d.population;
    })
    .padAngle(.03)
    .sort(null)

  var svg = d3.select(chart_container).append("svg")
    .attr("transform", translate)
    .style("margin-left", "50px")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width/2 + "," + height/2 + ")")

  svg.append("circle")
    .attr("r", radius - 15)
    .attr("cx", 0)
    .attr("cy", 0)
    .style("fill", "#eff2f4")

  d3.tsv(data_file_path, type, function(error, data) {
    // sort the data so that the biggest one comes first (uses the darkest color)
    data = data.sort(function(a,b) {
      return b.population - a.population
    })

    var popu_total = 0
    for (i=0; i<(data.length); i++) {
      var popu_total = popu_total + data[i].population
    }
    if (error) throw error
    
    var g = svg.selectAll(".arc")
      .data(pie(data))
      .enter()
      .append("g")
      .attr("class","arc")
    
    // append arc paths based on data
    // calculate a hidden path (only has the outer arc) for use of centering arc text labels (so you can use 50% startOffset)
    g.append("path")
      .attr("class", "arc_paths")
      .attr("d", arc)
      .style("fill", function(d) { 
        return color(d.data.category) 
      })
      .attr("id", function(d, i) { 
        return chart_container+"arc_path"+i
      })
      .each(function(d,i) {
        //A regular expression that captures all in between the start of a string (denoted by ^) 
        //and the first capital letter L
        var firstArcSection = /(^.+?)L/; 

        //The [1] gives back the expression between the () (thus not the L as well) 
        //which is exactly the arc statement
        var newArc = firstArcSection.exec( d3.select(this).attr("d") )[1];

        //Replace all the comma's so that IE can handle it -_-
        //The g after the / is a modifier that "find all matches rather than stopping after the first match"
        newArc = newArc.replace(/,/g , " ");

        //
        // uncomment below to rotate labels on lower arcs
        //
        // If the middle angle lies beyond a quarter of a circle (90 degrees or pi/2) and less than 270 degrees
        // flip the end and start position

        if (((d.startAngle + d.endAngle)/2 * 180/Math.PI > 90) && ((d.startAngle + d.endAngle)/2 * 180/Math.PI < 270)) {

          var startLoc  = /M(.*?)A/,    //Everything between the capital M and first capital A
            middleLoc   = /A(.*?)0 \d \d/,  //Everything between the capital A and 0 0 1
            endLoc    = /0 \d \d (.*?)$/; //Everything between the 0 0 1 and the end of the string (denoted by $)

          //Flip the direction of the arc by switching the start and end point (and sweep flag)
          var newStart = endLoc.exec( newArc )[1];
          var newEnd = startLoc.exec( newArc )[1];
          var middleSec = middleLoc.exec( newArc )[1];


          //Build up the new arc notation, set the sweep-flag to 0
          var large_arc_flag = (d.endAngle - d.startAngle) > 180 * Math.PI/180 ? "1" : "0"
          newArc = "M" + newStart + "A" + middleSec + "0 " + large_arc_flag + " 0 " + newEnd;

        }//if
                
        //Create a new invisible arc that the text can flow along
        svg.append("path")
          .attr("class", chart_container+"hiddenDonutArcs")
          .attr("id", chart_container+"hiddneDonutArc"+i)
          .attr("d", newArc)
          .style("fill", "none");
      })
    
    //
    // two choices for adding labels on donut arc
    // // 
    // // choice 1: labels all landscape-sitted
    // // 
    // g.append("text")
    //   .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
    //   .attr("dy", ".35em")
    //   .style("text-anchor", "middle")
    //   .style("font-size", "11px")
    //   .style("fill", "white")
    //   .text(function(d) { 
    //     return d.value
    //   })

    // 
    // choice 2: labels sitted along the path
    // 
    //Append the number texts to each hidden path created
    svg.selectAll(".arc_text")
      .data(pie(data))
      .enter()
      .append("text")
      .style("fill", function(d,i) {
        if (i === 0) {
          return "white"
        } else {
          return "black"
        }
      } )
      .style("font-size", "11px")
      .style("text-anchor", "middle")
      .attr("letter-spacing", "2px")
      .attr("class", "arc_text")
      // .attr("x", 5)   //Move the text from the start angle of the arc
      .append("textPath")
      .attr("startOffset", "50%")
      .attr("xlink:href",function(d,i){
        return "#"+chart_container+"hiddneDonutArc"+i
      })
      .text(function(d){ 
        return d.data.population
      })
    svg.selectAll(".arc_text")
      .attr("dy", function(d) { 
        // console.log( this.childNodes[0].getComputedTextLength() ) 
        // console.log( (d.endAngle - d.startAngle) )
        //
        // uncomment below if rotate lower labels
        //
        return (((d.startAngle + d.endAngle)/2 * 180/Math.PI > 90) && ((d.startAngle + d.endAngle)/2 * 180/Math.PI < 270) ? -12 : 20)
        //
        // uncomment below for regular non-rotate labels
        //
        // return 20
      }) //Move the text down

    // 
    // make legends
    //
    // create another svg container for legends
    // height and width for small squares
    var square_height = 17
    var legend = d3.select(chart_container).append("svg")
        .attr("transform", translate)
        .attr("class", "legend")
        .attr("width", 200)
        .attr("height", 230)
        // .attr("transform", "translate(" + 0 + ","+ 0 + ")")
        .selectAll("g")
        .data(color.domain())
        .enter()
        .append("g")
        .attr("transform", function(d, i) { 
          /*===========================================================================================================================
          =            calculate vertical translate for each square so that the entire legend group is centered vertically            =
          ===========================================================================================================================*/
          
            // the vertical distance unit (distance from the top edge of previous square to the top edge of the next square)
            var translate_pad = 30
            // total height of the entire legend group (the height of the last square plus its vertical distance from the top edge of the first square)
            var legends_total_height = (data.length-1)*(translate_pad) + square_height
            // the distance from the top of the svg container to the top of the entire legend group
            var offset = (230 - legends_total_height)/2
            // the distance ffrom the top of the svg container to the top of each individual square
            var pad = i * translate_pad + offset
            return "translate(0," + pad +")"
          
          /*=====  End of calculate vertical translate for each square so that the entire legend group is centered vertically  ======*/
        })
    
    // append legends retangles to svg
    legend.append("rect")
        .attr("width", square_height)
        .attr("height", square_height)
        .style("fill", color);
    // append texts to svg
    legend.append("text")
        .attr("x", 60)
        .style("font-size", 12)
        .text(function(d) { 
          return d; 
        })
        .call(wrap, 120)
    // calculate percentage numbers and append them to svg
    sum = data.reduce(function(sum, value){
      return sum + value.population
    }, 0)
    legend.append("text")
      .attr("x", 22)
      .attr("y", 13)
      .style("fill", "black")
      .style("font-size", 11)
      .data(data)
      .text(function(d) { 
        return d3.format(".0%")(d.population / sum);
      });
  })

  // clean up values to be consistently numerical
  function type(d) {
    d.population = +d.population
    return d
  }

  // append the inner white circle for aesthetic
  var inner_circle = svg.append("circle")
    .attr("r", radius - 50)
    .attr("cx", 0)
    .attr("cy", 0)
    .style("fill", "white")

  // appen two lines of tilte text due to svg text element lacks auto line-wrapping
  // might be improved by custom line wrapping functions or using regular html element
  svg.append("text")
      .text(title_line)
      .attr("class", "donutTitleText")
      .attr("text-anchor", "middle")
      .attr("transform", "translate(" + 0 + "," + -10 + ")")
      .attr("overflow", "auto")
      .call(wrap, 80)

  // svg.append("text")
  //     .attr("class", "donutTitleText")
  //     .text(title_line_2)
  //     .style("font-size", "12px")
  //     .attr("text-anchor", "middle")
  //     .attr("transform", "translate(" + 0 + "," + 10 + ")")
}



// plain donuts
function donut_plain(donut_config) {

  var data_file = donut_config[0]
  var container = donut_config[1]
  var title_keyword = donut_config[2]
  var translate = donut_config[3]

  // console.log(container)
  var width = 220,
      height = 220,
      radius = Math.min(width, height) / 2;

  var svg = d3.select(container).append("svg").attr("class", "plain_donut")
    .attr("width", width)
    .attr("height", height)
    .attr("transform", translate);


  svg.append("circle")
    .attr("r", radius - 7)
    .attr("cx", radius)
    .attr("cy", radius)
    .style("fill", "#84cbdf");

  svg.append("circle")
    .attr("r", radius-15)
    .attr("cx", radius)
    .attr("cy", radius)
    .style("fill", "#009fc1");

  svg.append("text")
      .text(title_keyword)
      .attr("class", "donutTitleText")
      .attr("text-anchor", "middle")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
      .attr("overflow", "auto")
      .style("fill", "white")
      .call(wrap, 80)

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
      .style("font-size", 25)
      .attr("text-anchor", "middle")
  })


  
};




// plain donuts for mgmt type
function mgmt_type(config) {
  var container = config[0],
    translate = config[1]

      var width = 220,
      height = 220,
      radius = Math.min(width, height) / 2;
      
  var svg = d3.select(container).append("svg").attr("class", "mgmt_type_label")
    .attr("transform", translate)
    .attr("width", width)
    .attr("height", height);


  svg.append("circle")
    .attr("r", radius - 7)
    .attr("cx", radius)
    .attr("cy", radius)
    .style("fill", "fddcb1");

  svg.append("circle")
    .attr("r", radius-15)
    .attr("cx", radius)
    .attr("cy", radius)
    .style("fill", "#f39f53");

  svg.append("text")
      .attr("class", "donutTitleText")
      .text(stat['type'][year.toString()])
      .attr("transform", "translate(" + width / 3 + "," + height / 1.8 + ")")
      .style("fill", "white")
      .style("font-size", "30px")
};




// function for draw bar charts
function bar(bar_config) {

var data = bar_config[0]
var container = "." + bar_config[1]
var bar_title = bar_config[2]
  
  var margin = {top: 50, right: 20, bottom: 50, left: 40},
      svg = d3.select(container).append("svg").attr("width", 500).attr("height", 250).attr("class", "bar_chart"),
      width = +svg.attr("width") - margin.left - margin.right,
      height = +svg.attr("height") - margin.top - margin.bottom

  svg.append("text")
      .text(bar_title)
      .attr("transform", "translate("+ 0 +"," + 20 + ")")
   
  // define the scale
  var x = d3.scaleBand().rangeRound([0, width]).padding(0.2),
      y = d3.scaleLinear().rangeRound([height, 0])

  var grid_g = svg.append("g")     
        .attr("class", "axis-grid")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

  var g = svg.append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

  // gridlines in y axis function
  function make_y_gridlines() {   
      return d3.axisLeft(y)
          .ticks(5)
  }

  d3.tsv(data, function(d) {
    d[view] = +d[view]
    return d
  }, function(error, data) {

    if (error) throw error

    // link the domains with scales
    x.domain(data.map(function(d) { return d.year }))
    y.domain([0, d3.max(data, function(d) { return d[view] })])



    // add the Y gridlines
    grid_g.call(make_y_gridlines()
            .tickSize(-width)
            .tickFormat("")
        )
    
    // draw the axises (use the scales)
    g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).tickSize(0))
    g.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(y).ticks(5).tickFormat(d3.format(".2s")).tickSize(0))
    
    // append all bars based on data
    g.selectAll(".bar")
      .data(data)
      .enter().append("rect")
        .attr("fill", bar_chart_color)
        .attr("x", function(d) { return x(d.year) })
        .attr("y", function(d) { return y(d[view]) })
        .attr("width", x.bandwidth())
        .attr("height", function(d) { return height - y(d[view]) })
    
    // append number text labels on the top of bars based on data
    g.selectAll(".barLabel")
      .data(data)
      .enter()
      .append("text")
      .text(function(d) {
        if (d[view]>99999) {
          return d3.format(".2s")(d[view])
        } else {
          return d3.format(",")(d[view])
        }
      })
      .style("font-size", "9px")
      .style("fill", "white")
      .style("text-anchor", "middle")
      .attr("x", function(d) {
        return x(d.year) + x.bandwidth()/2
      })
      .attr("y", function(d) {
        return (y(d[view]) + 12)
      })
  })
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
        dy = 1.1,
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

