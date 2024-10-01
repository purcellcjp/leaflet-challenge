const CONST_URL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Define variables for our tile layers.
let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
})

let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
	attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});

let en_layer = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    {
   attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
   subdomains: 'abcd',
   maxZoom: 20
   }
   );

// Only one base layer can be shown at a time.
let baseMaps = {
    Street: street,
    Topography: topo,
    English:en_layer
  };

  // Create a map object, and set the default layers.
let myMap = L.map("map", {
    center: [36.2048, 138.2529],
    zoom: 6,
    layers: [en_layer]
  });

// Pass our map layers into our layer control.
// Add the layer control to the map.
L.control.layers(baseMaps).addTo(myMap);

function init() {


    d3.json(CONST_URL).then(function(data) {
    
        console.log('data:')
        console.log(data);
        console.log('-'.repeat(20));
        
        console.log('features:')
        let features = data.features;
        console.log(features);
        console.log('-'.repeat(20));
    
    });
    

};

init();
