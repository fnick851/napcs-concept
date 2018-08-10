// function to draw state map based on view selected
function draw_map(statesData) {
    // get the view and the year
    which_year = year;
    which_view = view;

    // initiate map
    var map = L.map('map');
        
    // map tiles from Openstreetmap
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    // // control that shows state info on hover
    // var info = L.control();
    // info.onAdd = function (map) {
    //     this._div = L.DomUtil.create('div', 'info');
    //     this.update();
    //     return this._div;
    // };
    // info.update = function (props) {
    //     this._div.innerHTML = '<h4>Charter School Stats</h4>' +  (props ? 
    //         (props[which_year] ? '<b>' + props.name + '</b><br>' + d3.format(",")(props[which_year].school) + 
    //             ' Charter Schools' + '<br>' + d3.format(",")(props[which_year].student) + 
    //                 ' Students': '<b>Data not available for this year</b>') : '');
    // };
    // info.addTo(map);

    // get color depending on number of schools
    function getColor(a) {
        if (which_view === "student_view") {
            return a > 60000 ? map_color[1] :
                a > 40000 ? map_color[2] :
                a > 20000 ? map_color[3] :
                a > 2000 ? map_color[4] :
                a > 0 ? map_color[5] :
                map_color[5];
        } else {
            return a > 50 ? map_color[1] :
                a > 25 ? map_color[2] :
                a > 10 ? map_color[3] :
                a > 5 ? map_color[4] :
                a > 0 ? map_color[5] :
                map_color[5];
        }
    }

    // style the border and polygon
    function style(feature) {
        return {
            weight: 1,
            opacity: 1,
            color: 'white',
            // dashArray: '3',
            fillOpacity: 0.6,
            fillColor: which_view === "student_view" ? (feature.properties[which_year] ? getColor( feature.properties[which_year].student, feature.properties.charter_law):'#969696') : (feature.properties[which_year] ? getColor(feature.properties[which_year].school, feature.properties.charter_law):'#969696')
        };
    }

    // highlight on hover or preset
    function highlightFeature(e) {
        var layer = e.target;

        layer.setStyle({
            weight: 2,
            color: '#666',
            // dashArray: '',
            fillOpacity: 0.5
        });

        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
            layer.bringToFront();
        }

        // info.update(layer.feature.properties);
    }

    // reset highlight
    function resetHighlight(e) {
        geojson.resetStyle(e.target);
        // info.update();
    }

    // function zoomToFeature(e) {
    //     map.fitBounds(e.target.getBounds());
    // }

    // bind mouse input event on each polygon
    function onEachFeature(feature, layer) {
        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight,
            click: showPopUp
        });
    }

    // creating popups
    var popup = L.popup();  
    function showPopUp(e) {
        var district_name = e.target.feature.properties.name;
        console.log(e.target);
        var district_keyword = district_name.replace(/\s/g, '');
        popup
            .setLatLng(e.latlng)
            .setContent("<b>" + district_name + "</b><br>" + "<a href='index.html#school_district&" + state_keyword + "&" + district_keyword + "'>View Page</a>")
            .openOn(map);
    }

    // add features to map using geojson data
    var geojson = L.geoJson(statesData, {
        style: style,
        onEachFeature: onEachFeature
    }).addTo(map);

    // get bounds for multiple polygons(districts) representing the state, then zoom on the state.
    var bounds = geojson.getBounds();
    map.fitBounds(bounds);

    // // make legends
    // var legend = L.control({position: 'bottomright'});
    // legend.onAdd = function (map) {
    //     var div = L.DomUtil.create('div', 'info legend'),
    //         labels = [],
    //         from, to;
    //     var grades = which_view === "student_view" ? [0, 1, 2000, 20000, 40000, 60000] : [0, 1, 5, 10, 25, 50];
    //     for (var i = 0; i < grades.length; i++) {
    //         from = grades[i];
    //         to = grades[i + 1];
    //         if (i == 0) {
    //             which_view === "student_view" ? 
    //             labels.push(
    //                 'Number of Students:'
    //             ) : labels.push(
    //                 'Number of Schools:'
    //             );
    //         } else {
    //             which_view === "student_view" ? 
    //             labels.push(
    //                 '<i style="background:' + getColor(from + 1, "charterLawParameterPlaceholder") + '"></i> ' +
    //                 d3.format(",")(from) + (to ? '&ndash;' + d3.format(",")(to) : '+')
    //             ) : labels.push(
    //                 '<i style="background:' + getColor(from + 1, "charterLawParameterPlaceholder") + '"></i> ' +
    //                 d3.format(",")(from) + (to ? '&ndash;' + d3.format(",")(to) : '+')
    //             )
    //         }
        
           
    //     }
    //     div.innerHTML = labels.join('<br>');
    //     return div;
    // };
    // legend.addTo(map);

    // Show mouse click lat lon
    // map.on('click', function(e){
    //   var coord = e.latlng.toString().split(',');
    //   var lat = coord[0].split('(');
    //   var lng = coord[1].split(')');
    //   console.log("You clicked the map at latitude: " + lat[1] + " and longitude: " + lng[0]);
    // })
}

// AJAX to get geojoson data and draw the map
var loadData_draw = function () {
    $.ajax({
        'url': geojson_dir,
        'dataType': "json",
        'success': function (data) {
            // initiate map
            draw_map(data);
        }
    });
};
loadData_draw();
