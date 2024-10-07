
var earthquakeURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
var tectonicBoundariesUrl = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"
var tectonicPlatesUrl = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json"


d3.json(earthquakeURL).then(function(data) {
    console.log('d3.json');
    console.log(data.features);
    createFeatures(data.features);
});

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
};


function createFeatures(earthquakeData) {

    console.log('Entering createFeatures');
    console.log('-'.repeat(20));


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
    console.log('-'.repeat(20));

    // Create tectonic plates and boundaries layer groups
    let tectonicPlates = new L.layerGroup();
    let tectonicBoundaries = new L.layerGroup();

    // Define variables for our tile layers.
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });

    let googleStreets = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',{
        maxZoom: 20,
        subdomains:['mt0','mt1','mt2','mt3']
    });

    let googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{
        maxZoom: 20,
        subdomains:['mt0','mt1','mt2','mt3']
    });

    let googleTerrain = L.tileLayer('http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',{
        maxZoom: 20,
        subdomains:['mt0','mt1','mt2','mt3']
    });

    // Only one base layer can be shown at a time.
    let baseMaps = {
        Street: street,
        Topography: topo,
        'Google Streets': googleStreets,
        'Google Satellite': googleSat,
        'Google Terrain': googleTerrain
    };

    // create overlay object to hold layer groups
    let overlayMaps = {
        'Earthquakes': earthQuakes,
        'Tectonic Plates': tectonicPlates,
        'Tectonic Boundaries': tectonicBoundaries
    };

    // Create a map object, and set the default layers.
    let myMap = L.map("map", {
        center: [34.0549, -118.2426],
        zoom: 6,
        layers: [googleSat, earthQuakes]
    });

    // Read the tectonic plates json
    d3.json(tectonicPlatesUrl).then((platesData) => {
        // create bindPopup to show plate name
        function onEachFeature(feature, layer) {
            layer.bindPopup('<h3>Tectonic Plate Name: ' + feature.properties.PlateName + '</h3>')
        }
        L.geoJSON(platesData, {
            onEachFeature: onEachFeature,
            style: function() {
                return{
                    color:'red',
                    fillOpacity:0
                }
            }            
        }).addTo(tectonicPlates);
        tectonicPlates.addTo(myMap);
    });

    // Read the tectonic plates json
    d3.json(tectonicBoundariesUrl).then((data) => {
        L.geoJSON(data, {
            color:'yellow',
            weight:2
        }).addTo(tectonicBoundaries);
        tectonicBoundaries.addTo(myMap);
    });
    
    // add a legend
    let legend = L.control({position:'bottomright'});
    legend.onAdd = function() {
        let div = L.DomUtil.create('div','info legend'),
            depth=[-10,10,30,50,70,90];

        div.innerHTML += "<h3 style='text-align: center'>Depth</h3>";

        for (let i = 0; i < depth.length; i++) {
            div.innerHTML +=
            '<i style="background:' + returnColor(depth[i] + 1) + '"></i> ' + depth[i] + (depth[i+1] ? '&ndash;' + depth[i+1] + '<br>' : '+');
            // console.log(depth[i+1] ? '&ndash;' + depth[i+1] + '<br>' : '+');
        };
        return div;
            
    };

    legend.addTo(myMap);

    // Pass our map layers into our layer control.
    // Add the layer control to the map.
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

};
