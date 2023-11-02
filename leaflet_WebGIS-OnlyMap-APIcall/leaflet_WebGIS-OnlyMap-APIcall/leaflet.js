
//Defining the map variable
var map = L.map('map', {
  fullscreenControl: true,
  fullscreenControlOptions: {
    position: 'topleft',
    pseudoFullscreen: false
  }
}).setView([23.680223, 87.269842], 12);

//Assigning the OpenStreetMap to a variable
var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 20,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});

//Assigning the WMS layers 
var wmsLayers = L.tileLayer.wms("http://localhost:8080/geoserver/coalrr/wms", {
    layers: 'coalrr:kumarkhala_owner_join_modified, coalrr:benibandei_owner_join_modified',
    format: 'image/png',
    transparent: true,
});

//Adding the OSM layer to the map
osm.addTo(map);

//Adding the WMS layer to the map
wmsLayers.addTo(map);

//Add a scale to the map
var MapScale = L.control.scale(); 
MapScale.addTo(map);

//Displaying the coordinate at the cursor position
map.on('mousemove', function(e){
    // console.log(e)
    $('.coordinate').html(`Lat: ${e.latlng.lat} lng: ${e.latlng.lng}`)
})

//Latitude-Longitude search in Leaflet
var SearchControl = L.Control.geocoder();
SearchControl.addTo(map);

// HomeButtonControl: Start
var homeControl = L.Control.extend({
  options: {
      position: 'topleft' // Adjust the position as needed
  },
  onAdd: function (map) {
      var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
  container.innerHTML = 
  '<a href="#" title="Home" role="button" aria-label="Home" id="home-button"><svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M575.8 255.5c0 18-15 32.1-32 32.1h-32l.7 160.2c0 2.7-.2 5.4-.5 8.1V472c0 22.1-17.9 40-40 40H456c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1H416 392c-22.1 0-40-17.9-40-40V448 384c0-17.7-14.3-32-32-32H256c-17.7 0-32 14.3-32 32v64 24c0 22.1-17.9 40-40 40H160 128.1c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2H104c-22.1 0-40-17.9-40-40V360c0-.9 0-1.9 .1-2.8V287.6H32c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z"/></svg></a>';
  L.DomEvent.disableClickPropagation(container);
    return container;
  }
});
map.addControl(new homeControl());
document.getElementById('home-button').addEventListener('click', function () {
  map.setView([23.680223, 87.269842], 12); // Replace with your initial coordinates and zoom level
});
// HomeButtonControl: End

//Geoserver Web Feature Service
var jhajraGeoJSON = $.ajax('http://localhost:8080/geoserver/coalrr/wfs',{
  type: 'GET',
  data: {
    service: 'WFS',
    version: '1.1.0',
    request: 'GetFeature',
    typename: 'coalrr:kumarkhala_owner_join_modified, coalrr:benibandei_owner_join_modified',
    // CQL_FILTER: "column='text'",
    srsname: 'EPSG:4326',
    outputFormat: 'text/javascript',
    },
  dataType: 'jsonp',
  jsonpCallback:'callback:handleJson',
  jsonp:'format_options',
 });

//Geojson style file
var myStyle = {
    'color': 'violet'
  }

// the ajax callback function BEGINS
function handleJson(data) {
  wfsLayers = L.geoJson(data,{
        style: myStyle,
        // style: function (feature) {
        //     //style the objects based on type of geometry
        //     // switch (feature.properties.text) //feature.properties.xxx according to requirement
        //     // {
        //     //     // case '1' : return {
        //     //     //     color: '#FFFF00',
        //     //     //     fillColor: '#FFFF00',
        //     //     //     fillOpacity: 1,
        //     //     //     weight: 2
        //     //     // };
        //     // }
        // },
        // the popup function BEGINS
        onEachFeature: function(feature, layer) { 
          ////////////////////////////////////////
          layer.on('click', function (e) {
          // console.log('123');
          var uniq = feature.properties.u_plot_no;
          var form = new FormData();
          form.append("plot_no", "192820011190");
          
          var settings = {
            "url": "http://164.100.211.220/api/getplotdetails",
            "method": "POST",
            "data": {
                "api_key":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTY0LjEwMC4yMTEuMjIwL2FwaS9sb2dpbiIsImlhdCI6MTY5ODY2NTgzNywiZXhwIjoxNjk4NjY5NDM3LCJuYmYiOjE2OTg2NjU4MzcsImp0aSI6ImQ4Y3dKYXQ5VTBBSE13UzMiLCJzdWIiOiI2MSIsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.K4FRjD87RMMJkBEjMEziJUdjzFet2dofjBKH3ii-UQ8",
                "plot_no": "192820011190"
            }};
       
            $.ajax(settings).done(function (response) {
              var popupContent = L.popup({
                'maxWidth': '400',
                'width': '200',
                'closeButton': 'true',
                // 'className': 'map-popup',
              });
            
              // Create a table for khatian details
              var khatianTable = "<table class='khatian_table' style='width:100%; colsep='1''>" +
                "<tr><td colspan='4'><center><b>KHATIAN DETAILS</b></center></td></tr>" +
                "<tr><td><b>Khatian No</b></td><td><b>Khatian Area</b></td><td><b>Owner Name</b></td><td><b>Beneficiary Name</b></td></tr>";
            
              for (var i = 0; i < response.phase.length; i++) {
                var phase = response.phase[i];
            
                for (var j = 0; j < phase.acquisition[0].possession[0].khatian_det.length; j++) {
                  var khatianDet = phase.acquisition[0].possession[0].khatian_det[j];
                  var khatian = khatianDet.khatian;
                  var KhatianArea = khatianDet.owner_land_share[0];
                  var owner = khatianDet.owner_land_share[0].owner;
                  var beneficiary = owner.beneficiary[0];
            
                  // Add khatian details to the table
                  khatianTable += "<tr><td><small>" + khatian.khatian_no + "</small></td><td><small>" + KhatianArea.area_possd + "</small></td><td><small>" + owner.owner_name + "</small></td><td><small>" + beneficiary.benf_name + "</small></td></tr>";
                }
              }
            
              khatianTable += "</table>";
            
              // Add khatian details table to the popup content
              popupContent.setContent("<table class='plot_table' style='width:100%; colsep='1'>" +
                "<tr><td colspan='2'><center><b>PLOT INFORMATION</b></center></td></tr>" +
                "<tr><td><small><b>Plot Number:</b></small></td><td style='text-align: right;'><small>" + response.plot_number + "</small></td></tr>" +
                "<tr><td><small><b>Total Area:</b></small></td><td style='text-align: right;'><small>" + response.tot_area + "</small></td></tr>" +
                "<tr><td><small><b>Acquired Area:</b></small></td><td style='text-align: right;'><small>" + response.area_acqrd + "</small></td></tr>" +
                "<tr><td><small><b>Sanctioned Area:</b></small></td><td style='text-align: right;'><small>" + response.area_sanc + "</small></td></tr>" +
                "<tr><td><small><b>Unused Area:</b></small></td><td style='text-align: right;'><small>" + response.area_un_poss + "</small></td></tr>" +
                "<tr><td><small><b>Vacant Area:</b></small></td><td style='text-align: right;'><small>" + response.area_vac + "</small></td></tr>" +
                "</table>" + khatianTable);
            
              layer.bindPopup(popupContent);
              // console.log('324');
            });
            // layer.bindPopup('<div>Hello</div>');
          });

      }

      //End of onEachFeature
    });
    wfsLayers.addTo(map);
  map.fitBounds(wfsLayers.getBounds());

//leaflet layer control: START
//keeping the layer control within function handleJson
var baseMaps = {
    'Open Street Map': osm
};
var overlayMaps = {
    'WMS Layers': wmsLayers,
    'WFS Layers': wfsLayers
};
var LayerControl = L.control.layers(baseMaps, overlayMaps);
LayerControl.addTo(map);
//leaflet layer control: END

} //End of function HandleJson

