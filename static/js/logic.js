
var earthquakeURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(earthquakeURL).then(function(data) {
    console.log('d3.json');
    console.log(data.features);
    createFeatures(data.features);
});


function createFeatures(earthquakeData) {

    console.log('Entering createFeatures');
    console.log('-'.repeat(20));

    function returnColor(depth){
        return depth > 90 ? 'red':
               depth > 70 ? 'orangered':
               depth > 50 ? 'orange':
               depth > 30 ? 'gold':
               depth > 10 ? 'yellow':
                            'lightgreen';
    
    };
    function returnRadius(magnitude){
        return magnitude === 0 ? 1:
                     magnitude * 4;
    }
    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]}</p>`);
    }

    let earthquakes = L.geoJSON(earthquakeData, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, {
                radius:returnRadius(feature.properties.mag),
                fillColor:returnColor(feature.geometry.coordinates[2]),
                color:'#000',
                weight:1,
                opacity:1,
                fillOpacity:0.8
            });
        },
        onEachFeature: onEachFeature
    });

    // Pass the earthquake data to a createMap() function.
    createMap(earthquakes);
};

function createMap(earthQuakes) {

    console.log('Entering createMap()');
    // console.log(earthQuakes);
    console.log('-'.repeat(20));

    // Define variables for our tile layers.
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });

    // Only one base layer can be shown at a time.
    let baseMaps = {
        Street: street,
        Topography: topo
    };

    let overlayMaps = {Earthquakes: earthQuakes};

    // Create a map object, and set the default layers.
    let myMap = L.map("map", {
        center: [34.0549, -118.2426],
        zoom: 6,
        layers: [street, earthQuakes]
    });

    // Pass our map layers into our layer control.
    // Add the layer control to the map.
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

};
