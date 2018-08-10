// draw national map based on view selected
function draw_map(statesData) {

    
    // get the view and the year
    which_year = year;
    which_view = view;

    // initiate map
    var map = L.map('map').setView([37.8, -96], 2);
        
    // map tiles from Openstreetmap
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    // control that shows state info on hover on upper right corner
    // var info = L.control();
    // info.onAdd = function (map) {
    //     this._div = L.DomUtil.create('div', 'info');
    //     this.update();
    //     return this._div;
    // };
    // info.update = function (props) {
    //     this._div.innerHTML = '<h4>Charter School Stats</h4>' +  (props ?
    //         (props[which_year] ? '<b>' + props.name + '</b><br>' + d3.format(",")(props[which_year].school) + 
    //             ' Charter Schools' + '<br>' + d3.format(",")(props[which_year].student) + ' Students': '<b>Data not available for this year</b>') +
    //                 (props.charter_law ? '<br> Charter Law Passed in ' + 
    //                     props.charter_law : '<br> No Charter Law') : '<h6>States by this management company are<br>highlighted with orange border.</h6>');
    // };
    // info.addTo(map);

    // get color depending on number of schools
    function getColor(a, b) {
        if (which_view === "student_view") {
            return !b ? map_color[0]:
                a > 400000 ? map_color[1] :
                a > 300000 ? map_color[2] :
                a > 100000 ? map_color[3] :
                a > 10000 ? map_color[4] :
                a > 0 ? map_color[5] :
                map_color[5];
        } else {
            return !b ? map_color[0]:
                a > 50 ? map_color[1] :
                a > 25 ? map_color[2] :
                a > 10 ? map_color[3] :
                a > 5 ? map_color[4] :
                a > 0 ? map_color[5] :
                map_color[5];     
        }
    }

    // style the polygons
    function style(feature) {
        if (feature.id === "15" || feature.id === "57") {
            return {
                opacity: 0,
                fillOpacity: 0
            }
        } else {
            return {
                weight: 1,
                opacity: 1,
                color: 'white',
                // dashArray: '3',
                fillOpacity: 0.6,
                fillColor: which_view === "student_view" ? (feature.properties[which_year] ? getColor( feature.properties[which_year].student, feature.properties.charter_law):'#969696') : (feature.properties[which_year] ? getColor(feature.properties[which_year].school, feature.properties.charter_law):'#969696')
            };
        }
        
    }

    // highlight polygons on hover or preset
    function highlightFeature(e) {
        var layer = e.target;
        layer.setStyle({
            // weight: 5,
            // fillColor: 'orange',
            // dashArray: '',
            // fillOpacity: 0.5
        });
        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
            layer.bringToFront();
        }
        // info.update(layer.feature.properties);
    }

    // reset highlights
    function resetHighlight(e) {
        geojson.resetStyle(e.target);
        // info.update();
    }

    // function zoomToFeature(e) {
    //     map.fitBounds(e.target.getBounds());
    // }

    // update the info section
    function updateInfo(e) {
        // info.update();
    }

    // bind mouse input events on layers
    function onEachFeature(feature, layer) {
        layer.on({
            mouseover: highlightFeature,
            mouseout: updateInfo,
            click: showPopUp
        });
    }

    // make popups
    var popup = L.popup();
    function showPopUp(e) {
        var state_name = e.target.feature.properties.name;
        var state_URL_name = state_name.replace(/\s/g, '');
        console.log(e.target.feature.properties.school)
        popup
            .setLatLng(e.latlng)
            .setContent(e.target.feature.properties.charter_law ? "<b>" + state_name + "</b><br>" + "<a href='index.html#state&" + state_URL_name + "'>View Page</a>" : state_name + " does not have charter law yet.")
            .openOn(map);
    }

    // add features to map using geojson data
    var geojson = L.geoJson(statesData, {
        style: style,
        onEachFeature: onEachFeature
    }).addTo(map);

    // an object for storing all lat lon bounds for each state - so that we can use it to zoom in each state.
    // also highlights states managed by this company
    var stateBounds = {};
    geojson.eachLayer(function (layer) {
        var state_name = layer.feature.properties.name;
        layer._id = state_name.replace(/\s/g, '');
        for (var index in states_served) {
             if (layer._id === states_served[index] ) {
                layer.setStyle({
                    weight: 2,
                    color: 'orange',
                    // dashArray: '',
                    fillOpacity: 0.6
                });
                if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
                    layer.bringToFront();
                }
            }
        }
        stateBounds[layer._id] = layer.getBounds();
    });

    // build legends
    // var legend = L.control({position: 'bottomright'});
    // legend.onAdd = function (map) {
    //     var div = L.DomUtil.create('div', 'info legend'),
    //         labels = [],
    //         from, to;
    //     var grades = which_view === "student_view" ? [0, 1, 10000, 100000, 300000, 400000] : [0, 1, 5, 10, 25, 50];
    //     for (var i = 0; i < grades.length; i++) {
    //         from = grades[i];
    //         to = grades[i + 1];
    //         if (i === 0) {
    //             which_view === "student_view" ? 
    //             labels.push(
    //                 'Number of Students:'
    //             ) : labels.push(
    //                 'Number of Schools:'
    //             );
    //             labels.push(
    //                 '<i style="background:' + getColor(from) + '"></i> ' + 'No Charter Law'
    //             );
    //         } else {
    //             which_view === "student_view" ? 
    //             labels.push(
    //                 '<i style="background:' + getColor(from + 1, "bIsTrue") + '"></i> ' +
    //                 d3.format(",")(from) + (to ? '&ndash;' + d3.format(",")(to) : '+')
    //             ) : labels.push(
    //                 '<i style="background:' + getColor(from + 1, "bIsTrue") + '"></i> ' +
    //                 d3.format(",")(from) + (to ? '&ndash;' + d3.format(",")(to) : '+')
    //             )
    //         }
    //     }
    //     div.innerHTML = labels.join('<br>');
    //     return div;
    // };
    // legend.addTo(map);

    // make triggers for panning to different positions
    // var panToTrigger = L.control({position: 'bottomleft'});
    // panToTrigger.onAdd = function (map) {
    //     var div = L.DomUtil.create('div', 'info'),
    //         labels = ["<b>Move to:</b>", "<a id='toUS'>Continental US</a>", "<a id='toAlaska'>Alaska</a>", "<a id='toHawaii'>Hawaii</a>", "<a id='toGuam'>Guam</a>"];
    //     div.innerHTML = labels.join('<br>');
    //     return div;
    // };
    // panToTrigger.addTo(map);

    // pan-to onclick events
    // document.getElementById("toUS").onclick = function() {
    //     map.setZoom((4), {animate: false});
    //     map.panTo([37.8, -96], {
    //         animate: false
    //     });
    // }
    // document.getElementById("toHawaii").onclick = function() {
    //     var lat_lon = stateBounds['Hawaii'];
    //     map.fitBounds(lat_lon);
    //     map.panTo([20.50, -156.95], {
    //         animate: false
    //     });
    // }
    // document.getElementById("toGuam").onclick = function() { 
    //     var lat_lon = stateBounds['Guam'];
    //     map.fitBounds(lat_lon);
    //     map.panTo([13.4443, -215.2], {
    //         animate: false
    //     });
    // }
    // document.getElementById("toAlaska").onclick = function() { 
    //     var lat_lon = stateBounds['Alaska'];
    //     map.fitBounds(lat_lon);
    //     map.panTo([64, -149], {
    //         animate: false
    //     });
    // }
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
