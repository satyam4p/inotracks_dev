

var myURL = jQuery( 'script[src$="leaf-demo.js"]' ).attr( 'src' ).replace( 'leaf-demo.js', '' )

var myIconGreen = L.icon({
  iconUrl: myURL + 'images/greenpin-1.png',
  iconRetinaUrl: myURL + '/images/greenpin-2.png',                      
  iconSize: [29, 24],
  iconAnchor: [9, 21],
  popupAnchor: [0, -14]
})

var myIconRed = L.icon({
  iconUrl: myURL + 'images/redpin-1.png',
  iconRetinaUrl: myURL + 'images/redpin-2.png',                         
  iconSize: [29, 24],
  iconAnchor: [9, 21],
  popupAnchor: [0, -14]
})



function show_the_map(data){

var no_of_buses = Object.keys(data).length;

      if (no_of_buses>0 && data[0]['latitude']!=null){

          var cordi = {
            'lat':parseFloat(data[0]['latitude']),
            'lng': parseFloat(data[0]['longitude'])
          };
        }
          else{
            var cordi = {
              'lat':28.7041,
              'lng': 77.1025
            };
          }

    var map = L.map( 'map', {

      center: [cordi['lat'],cordi['lng']],
      minZoom: 2,
      zoom: 11
    })

    L.tileLayer( 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      subdomains: ['a', 'b', 'c']
    }).addTo( map )

var marker_;
var markers = new Array();
for ( var i=0; i < no_of_buses; i++ )
{
try{
  var html = `
        <div>
          <span>Bus Number: <b>` + data[i]['bus_number'] + `</b></span><br>
          <span>Driver Name: <b>`+ data[i]['driver']+ `</b></span><br>
          <span>Running Status: <b>`+ data[i]['running_status'] +`</b></span><br>
          <span>Shifts: <b>`+ data[i]['shifts'] + `</b></span><br>
        </div>
  `
 if(data[i]['running_status']){
    marker_= L.marker( [parseFloat(data[i]['latitude']), parseFloat(data[i]['longitude'])], {icon: myIconGreen} )
    .bindPopup( html)
    .addTo( map );
    marker_['bus_number']=data[i]['bus_number'];
  }else{
    marker_= L.marker( [parseFloat(data[i]['latitude']), parseFloat(data[i]['longitude'])], {icon: myIconRed} )
    .bindPopup( html)
    .addTo( map );

  }
  
  markers.push(marker_);
}
catch(err){}
}
return markers;
};



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
  
  $.ajax({
    url: '/api/web/get_bus_locations/',
    type: 'GET',
    dataType: 'json',
  })
  .done(function(data) {
    console.log(data);
    
    var markers=show_the_map(data);
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


