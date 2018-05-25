

var myURL = jQuery( 'script[src$="leaf-demo.js"]' ).attr( 'src' ).replace( 'leaf-demo.js', '' )

var myIcon = L.icon({
  iconUrl: myURL + 'images/pin24.png',
  iconRetinaUrl: myURL + 'images/pin48.png',
  iconSize: [29, 24],
  iconAnchor: [9, 21],
  popupAnchor: [0, -14]
})




function show_the_map(data){

var no_of_locations = data['number_of_locations'];
var marker_;
var markers = new Array();

  for ( var i=0; i < no_of_locations; i++ )
  {
      if (data['locations']['i']!=null){

          var cordi = {
            'lat':parseFloat(data['locations']['i']['latitude']),
            'lng': parseFloat(data['locations']['i']['longitude'])
          };
        }
          else{
            var cordi = {
              'lat':28.7041,
              'lng': 77.1025
            };
          }
  
   if(i==0){
    var map = L.map( 'map', {

      center: [cordi['lat'],cordi['lng']],
      minZoom: 2,
      zoom: 11
    })

    L.tileLayer( 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      subdomains: ['a', 'b', 'c']
    }).addTo( map )
   }
    try{
  var html = `
        <div>
          <span>Speed Data: <b>` + data[i]['bus_number'] + `</b></span><br>
          <span>Fuel Data: <b>`+ data[i]['driver']+ `</b></span><br>
          <span>Distance Data: <b>`+ data[i]['running_status'] +`</b></span><br>
        </div>
  `
 marker_= L.marker( [parseFloat(cordi['lat']), parseFloat(cordi['lng'])], {icon: myIcon} )
   .bindPopup( html)
  .addTo( map );
    
  markers.push(marker_);
}

catch(err){}

}
  
return markers;
};


function addPathBetweenMarkers(markers){

 for(i=1; i<markers.length;i++){
    
    var latlngs = Array();

    //Get latlng from first marker
    latlngs.push(markers[i-1].getLatLng());

    //Get latlng from first marker
    latlngs.push(markers[i].getLatLng());

//You can just keep adding markers

//From documentation http://leafletjs.com/reference.html#polyline
// create a red polyline from an arrays of LatLng points
    var polyline = L.polyline(latlngs, {color: 'yellow'}).addTo(map);  
   }
}


function changeMarkerPosition(marker) {
  // console.log(marker);
  var bus_number = marker.bus_number;
  // console.log(bus_number);
    $.ajax({
      url: '/api/web/marker_update/',
      type: 'GET',
      dataType: 'json',
      data: {'bus_number': bus_number}
    })
    .done(function(data) {
       // console.log("marker update success", data);
        lat = parseFloat(data['lat']);
        lng = parseFloat(data['lng']);
try{        
marker.setLatLng([lat, lng])}
catch(err){
}
    })
    .fail(function() {
        console.log("error");
    })
    .always(function() {
      console.log("complete");
    });

};



initialize() ;
function initialize() {
  
 /* $.ajax({
    url: '/api/web/get_bus_locations/',
    type: 'GET',
    dataType: 'json',
  })*/
  $.ajax({
    url: 'http://13.58.183.35/api/get_bus_data_from_time/',
    type: 'POST',
    dataType: 'json',
  })
  .done(function(data) {
    console.log(data);
    
    var markers=show_the_map(data);
    addPathBetweenMarkers(markers);
    
    for(var i=0; i<markers.length; i++){
      // changeMarkerPosition(markers[i]);
      setInterval(changeMarkerPosition, 1000, markers[i]);
      
    }
  })
  .fail(function() {
    console.log("error");
  })
  .always(function() {
    console.log("complete");
  });
 }


