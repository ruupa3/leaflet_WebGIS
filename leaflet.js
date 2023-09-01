
var map = L.map('map', {
  fullscreenControl: true,
  fullscreenControlOptions: {
    position: 'topleft',
    pseudoFullscreen: false
  }
}).setView([23.680223, 87.269842], 12);

var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 20,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});

var url = 'http://localhost:8080/geoserver/coalrr/wms';

var wmsLayers = L.tileLayer.wms("http://localhost:8080/geoserver/coalrr/wms", {
    layers: 'coalrr:jhajra_owner_join, coalrr:sonepur_owner_join',
    format: 'image/png',
    transparent: true,
});

osm.addTo(map);
wmsLayers.addTo(map);

// map.on('click', function (e) {
//     getFeatureInfo(e.u_plot_no);
// });

// add a toolbar
// var toolbar = L.Toolbar();
// toolbar.addToolbar(map);

//add map scale
var MapScale = L.control.scale(); 
MapScale.addTo(map);

//full screen map view JavaScript
// var FullScreen = document.getElementById('map');
// function fullScreenView()
// {
//     FullScreen.requestFullscreen();
// }
//THIS IS WORKING

//full screen map view Leaflet
// map.addControl(new L.Control.Fullscreen());

//map coordinate display
map.on('mousemove', function(e){
    // console.log(e)
    $('.coordinate').html(`Lat: ${e.latlng.lat} lng: ${e.latlng.lng}`)
})

//leaflet layer control ENDING

//Leaflet Search
//L.Control.geocoder().addTo(MyMap);
var SearchControl = L.Control.geocoder();
SearchControl.addTo(map);

//add marker to map
// var marker = L.marker ([23.717853, 87.243203]).addTo(MyMap);

//search location by lat/lng
// $('#search-btn').click(function() {
//     var latlng = $('#search').val(); //taking the value of search
//     var latlngArr = latlng.split(','); //to accept the lat-lng separated by comma
//     var lat = latlngArr[0]; //latitude is the first value
//     var lng = latlngArr[1]; //longitude is the second value
//     map.setView([lat, lng], 8); //zoom level 8
//     marker.setLatLng([lat, lng]); //setting the marker
// });

//Popup onclick without marker
// Attach a click event listener to the map
// map.on('click', function(event) {
//   var clickedLatLng = event.latlng;
// //   var clickedFeature = event.feature;
//   var popupContent = "<p>Clicked coordinates:</p>" + clickedLatLng.lat + "," + clickedLatLng.lng;
// //   var popup_Content = "<p>Plot No: <p>" + clickedFeature.properties.text;
// //   // Create a popup at the clicked location
//   var popup = L.popup()
//     .setLatLng(clickedLatLng)
//     .setContent(popupContent)
//     popup.openOn(map);
// });
//THIS IS WORKING

// function getInfo(latlng) {
//     var params = {
//         request: 'GetFeatureInfo',
//         service: 'WMS',
//         srs: 'EPSG:4326',
//         styles: '',
//         transparent: true,
//         version: '1.1.1',
//         format: 'image/png',
//         bbox: map.getBounds().toBBoxString(),
//         height: map.getSize().y,
//         width: map.getSize().x,
//         layers: 'coalrr:jhajra_owner_join, coalrr:sonepur_owner_join',
//         query_layers: 'coalrr:jhajra_owner_join, coalrr:sonepur_owner_join',
//         info_format: 'text/html'
//     };
//     params[params.version === '1.3.0' ? 'i' : 'x'] = latlng.lng;
//     params[params.version === '1.3.0' ? 'j' : 'y'] = latlng.lat;
//     fetch('http://localhost:8080/geoserver/coalrr/wms', {
//         method: 'GET',
//         params: params
//     })
//     .then(function(response) {
//         return response.u_plot_no();
//     })
//     .then(function(data) {
//         // Display the retrieved feature info in a popup or any other way you prefer
//         console.log(data);
//     });
// }

//Geoserver Web Feature Service
var jhajraGeoJSON = $.ajax('http://localhost:8080/geoserver/coalrr/wfs',{
  type: 'GET',
  data: {
    service: 'WFS',
    version: '1.1.0',
    request: 'GetFeature',
    typename: 'coalrr:jhajra_owner_join, coalrr:sonepur_owner_join',
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
                                                          /////////////////////////////////////////////
            //  layer.on('click', function (e) {
              //var uniq = feature.properties.u_plot_no;
              //var url = '';
              //var d = [];
           
            // var APIcall = $.ajax({
            //     type: "GET",
            //     url: 'url',
            //     dataType: 'json',
            //     //action : '',
            //     uniq : 'uniq',
            //     success: function (data) {d = data;},
            //     async: false
            // });

            //d.mouza_name;
            //d.owner_name;

            // if (popupContent == uniq)
            //   {
            //     popupContent = "<p> MouzaName:" + d.mouza_name, "<p> OwnerName:" + d.owner_name;
            //   }

            //  });
            var uniq = feature.properties.u_plot_no;
            $.ajax({
              type: "GET",
              url: 'leaflet.php',
              //action : '',
              data: {uniq: uniq},
              success: function(popupContent)
              {
                var popupContent = L.popup({
                  'maxWidth': '400',
                  'width': '200',
                  'closeButton': 'true',
                  // 'className': 'map-popup',
                })
                // .setContent("<table>"+
                //   "<tr>"+"<td colspan = 2>"+"<center>"+"<b>"+"--PLOT INFORMATION--"+"</b>"+"</center>"+"</td>"+"</tr>"+
                //   "<tr>"+"<td colspan = 2>"+"<center>"+"------"+"</center>"+"</td>"+"</tr>"+
                //   "<tr>"+"<td>"+"<b>"+"Unique Plot No:"+"</b>"+"</td>"+"<td>"+feature.properties.u_plot_no+"</td>"+"</tr>"+
                //   "<tr>"+"<td>"+"<b>"+"Plot No:"+"</b>"+"</td>"+"<td>"+feature.properties.plot_num+"</td>"+"</tr>"+
                //   "<tr>"+"<td>"+"<b>"+"JL No:"+"</b>"+"</td>"+"<td>"+feature.properties.jl_no+"</td>"+"</tr>"+
                //   "<tr>"+"<td>"+"<b>"+"Land Type ID:"+"</b>"+"</td>"+"<td>"+feature.properties.landt_id+"</td>"+"</tr>"+
                //   "<tr>"+"<td>"+"<b>"+"Mouza Name:"+"</b>"+"</td>"+"<td>"+feature.properties.mouza_name+"</td>"+"</tr>"+
                //   "<tr>"+"<td>"+"<b>"+"Owner Name:"+"</b>"+"</td>"+"<td>"+feature.properties.owner_name+"</td>"+"</tr>"+
                //   "<tr>"+"<td>"+"<b>"+"Khatian No:"+"</b>"+"</td>"+"<td>"+feature.properties.khatian_no+"</td>"+"</tr>"+
                //   "<tr>"+"<td>"+"<b>"+"Shared Area:"+"</b>"+"</td>"+"<td>"+feature.properties.share_area+"</td>"+"</tr>"+
                //   "<tr>"+"<td>"+"<b>"+"Land Shared:"+"</b>"+"</td>"+"<td>"+feature.properties.land_share+"</td>"+"</tr>"+
                //   "<tr>"+"<td>"+"<b>"+"Khatian Area Possessed:"+"</b>"+"</td>"+"<td>"+feature.properties.area_possd+"</td>"+"</tr>"+
                //   "<tr>"+"<td>"+"<b>"+"Acquisition ID:"+"</b>"+"</td>"+"<td>"+feature.properties.acq_id+"</td>"+"</tr>"+
                //   "<tr>"+"<td>"+"<b>"+"Land Use ID:"+"</b>"+"</td>"+"<td>"+feature.properties.land_use_id+"</td>"+"</tr>"+
                //   "<tr>"+"<td>"+"<b>"+"Present Land Use:"+"</b>"+"</td>"+"<td>"+feature.properties.present_land_use+"</td>"+"</tr>"+
                //   "<tr>"+"<td>"+"<b>"+"Possession Status:"+"</b>"+"</td>"+"<td>"+feature.properties.poss_is_full+"</td>"+"</tr>"+
                //   "<tr>"+"<td>"+"<b>"+"Possession Reference No:"+"</b>"+"</td>"+"<td>"+feature.properties.poss_ref_no+"</td>"+"</tr>"+
                //   "<tr>"+"<td>"+"<b>"+"Possession Date:"+"</b>"+"</td>"+"<td>"+feature.properties.poss_dt+"</td>"+"</tr>"+
                //   "<tr>"+"<td>"+"<b>"+"Plot Area Possessed:"+"</b>"+"</td>"+"<td>"+feature.properties.poss_area+"</td>"+"</tr>"+
                // "</table>"
                // );
              layer.bindPopup(popupContent);
              }
          })
                                                        //////////////////////////////////////////////
        //   var popupContent = L.popup({
        //     'maxWidth': '400',
        //     'width': '200',
        //     'closeButton': 'true',
        //     // 'className': 'map-popup',
        //   })
        //   .setContent("<table>"+
        //     "<tr>"+"<td colspan = 2>"+"<center>"+"<b>"+"--PLOT INFORMATION--"+"</b>"+"</center>"+"</td>"+"</tr>"+
        //     "<tr>"+"<td colspan = 2>"+"<center>"+"------"+"</center>"+"</td>"+"</tr>"+
        //     "<tr>"+"<td>"+"<b>"+"Unique Plot No:"+"</b>"+"</td>"+"<td>"+feature.properties.u_plot_no+"</td>"+"</tr>"+
        //     "<tr>"+"<td>"+"<b>"+"Plot No:"+"</b>"+"</td>"+"<td>"+feature.properties.plot_num+"</td>"+"</tr>"+
        //     "<tr>"+"<td>"+"<b>"+"JL No:"+"</b>"+"</td>"+"<td>"+feature.properties.jl_no+"</td>"+"</tr>"+
        //     "<tr>"+"<td>"+"<b>"+"Land Type ID:"+"</b>"+"</td>"+"<td>"+feature.properties.landt_id+"</td>"+"</tr>"+
        //     "<tr>"+"<td>"+"<b>"+"Mouza Name:"+"</b>"+"</td>"+"<td>"+feature.properties.mouza_name+"</td>"+"</tr>"+
        //     "<tr>"+"<td>"+"<b>"+"Owner Name:"+"</b>"+"</td>"+"<td>"+feature.properties.owner_name+"</td>"+"</tr>"+
        //     "<tr>"+"<td>"+"<b>"+"Khatian No:"+"</b>"+"</td>"+"<td>"+feature.properties.khatian_no+"</td>"+"</tr>"+
        //     "<tr>"+"<td>"+"<b>"+"Shared Area:"+"</b>"+"</td>"+"<td>"+feature.properties.share_area+"</td>"+"</tr>"+
        //     "<tr>"+"<td>"+"<b>"+"Land Shared:"+"</b>"+"</td>"+"<td>"+feature.properties.land_share+"</td>"+"</tr>"+
        //     "<tr>"+"<td>"+"<b>"+"Khatian Area Possessed:"+"</b>"+"</td>"+"<td>"+feature.properties.area_possd+"</td>"+"</tr>"+
        //     "<tr>"+"<td>"+"<b>"+"Acquisition ID:"+"</b>"+"</td>"+"<td>"+feature.properties.acq_id+"</td>"+"</tr>"+
        //     "<tr>"+"<td>"+"<b>"+"Land Use ID:"+"</b>"+"</td>"+"<td>"+feature.properties.land_use_id+"</td>"+"</tr>"+
        //     "<tr>"+"<td>"+"<b>"+"Present Land Use:"+"</b>"+"</td>"+"<td>"+feature.properties.present_land_use+"</td>"+"</tr>"+
        //     "<tr>"+"<td>"+"<b>"+"Possession Status:"+"</b>"+"</td>"+"<td>"+feature.properties.poss_is_full+"</td>"+"</tr>"+
        //     "<tr>"+"<td>"+"<b>"+"Possession Reference No:"+"</b>"+"</td>"+"<td>"+feature.properties.poss_ref_no+"</td>"+"</tr>"+
        //     "<tr>"+"<td>"+"<b>"+"Possession Date:"+"</b>"+"</td>"+"<td>"+feature.properties.poss_dt+"</td>"+"</tr>"+
        //     "<tr>"+"<td>"+"<b>"+"Plot Area Possessed:"+"</b>"+"</td>"+"<td>"+feature.properties.poss_area+"</td>"+"</tr>"+
        //   "</table>"
        //   );
        // layer.bindPopup(popupContent);
      }
    });
    wfsLayers.addTo(map);
  map.fitBounds(wfsLayers.getBounds());
//leaflet layer control START
var baseMaps = {
    'Open Street Map': osm
};
var overlayMaps = {
    'WMSlayers': wmsLayers,
    'WFSlayers': wfsLayers
};
var LayerControl = L.control.layers(baseMaps, overlayMaps);
LayerControl.addTo(map);
//leaflet layer control END

//Layer Switcher on left DIV
const layerSwitcher = L.control.layers();
layerSwitcher.onAdd = function() {
    const div = L.DomUtil.create('div', 'layer-switcher');
    // div.innerHTML = 
    //     `<input type="checkbox" id="osm" checked>
    //     <label for="osm">Open Street Map</label><br>
    //     <input type="checkbox" id="wmsLayers">
    //     <label for="wmsLayers">WMS layers</label><br>
    //     <input type="checkbox" id="wfsLayers">
    //     <label for="wfsLayers">WFS layers</label>`;
    L.DomEvent.disableClickPropagation(div);
    return div;
};
// layerSwitcher.addTo(map);
//layers
const OSM = L.layerGroup([osm]);
const WMS = L.layerGroup([wmsLayers]);
const WFS = L.layerGroup([wfsLayers]);
// Add layers to the map
OSM.addTo(map);
WMS.addTo(map);
WFS.addTo(map);
// Toggle layers based on checkboxes
document.getElementById('osm').addEventListener('change', function() {
    if (this.checked) {
        map.addLayer(OSM);
    } else {
        map.removeLayer(OSM);
    }
});
document.getElementById('wmsLayers').addEventListener('change', function() {
    if (this.checked) {
        map.addLayer(WMS);
    } else {
        map.removeLayer(WMS);    
      }
});
document.getElementById('wfsLayers').addEventListener('change', function() {
  if (this.checked) {
      map.addLayer(WFS);
  } else {
      map.removeLayer(WFS);
  }
});

}
