var socket = io();
let testVar = "ASDASDA"
let fetchLatLong = document.getElementById("fetchLatLong");
mapboxgl.accessToken = 'pk.eyJ1IjoiaWJyYWhpbXRoZXNweSIsImEiOiJja3I3M3QwcHIwd2F2MnBxbDQzdzVwMDcwIn0.QRPIKEhJWfwI8oTh4lp7cw';

var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: [-88.1050648, 41.758326], // starting position [lng, lat]
    zoom: 9 // starting zoom
});

var geojson = {
    type: 'FeatureCollection',
    features: [
       
    ]
};




socket.emit('requestFeatures', 1);
socket.on('sendingFeatures', (data) => {

    for (i = 0; i < data.length; i++) {
        geojson.features.push(data[i]);
    }

    geojson.features.forEach(function(marker) {
        
          



        console.log(marker.properties);

        var popup = new mapboxgl.Popup({
            offset: 25
        }).setText(marker.properties.description);
        // create a HTML element for each feature
        var el = document.createElement('div');
        el.className = 'marker';

        // make a marker for each feature and add to the map
        new mapboxgl.Marker(el)
            .setLngLat(marker.geometry.coordinates)
            .setPopup(popup)
            .addTo(map);
    });

})

let inputField = document.getElementById("inputLoc");

let long;
let lat;

function addLocation() {
    const d = new Date();
    let year = d.getFullYear();
    let month = d.getMonth()+1;
    let date = d.getDate();
    let hours = d.getHours();
    let minutes = d.getMinutes();
    let seconds = d.getSeconds();

    let timeInfo = month + "/" + date + "/" + year + " " + hours + ":" + minutes + ":" + seconds;

    let inputValue = inputField.value;


    console.log(inputValue);
    inputField.value = "";


    long = inputValue.substr(0, inputValue.indexOf(','));
    lat = inputValue.substr(inputValue.indexOf(',') + 1, inputValue.length);
   

    if (long < -90 || long > 90 || lat < -90 || lat > 90 || lat == "" || long == "") {
        alert("Please enter a valid lat/long value");
    } else {

        let testFeature = {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [long, lat]
            },
            properties: {
                title: 'Mapbox',
                description: timeInfo
            }
        }


        socket.emit("pointInsertion", testFeature);

        geojson.features.push(testFeature);

        var popup = new mapboxgl.Popup({
            offset: 25
        }).setText(testFeature.properties.description);

        var el = document.createElement('div');
        el.className = 'marker';

        new mapboxgl.Marker(el)
            .setLngLat(testFeature.geometry.coordinates)
            .setPopup(popup)
            .addTo(map);

    }

}

    fetchLatLong.addEventListener("click", function() {

        
        const d = new Date();
        let year = d.getFullYear();
        let month = d.getMonth()+1;
        let date = d.getDate();
        let hours = d.getHours();
        let minutes = d.getMinutes();
        let seconds = d.getSeconds();

        let timeInfo = month + "/" + date + "/" + year + " " + hours + ":" + minutes + ":" + seconds;

        
              navigator.geolocation.getCurrentPosition(function(position) {
                lat = position.coords.latitude;
                long = position.coords.longitude;

                console.log(lat);
                console.log(long);
                

                let testFeature = {
                    type: 'Feature',
                    geometry: {
                        type: 'Point',
                        coordinates: [long, lat]
                    },
                    properties: {
                        title: 'Mapbox',
                        description: timeInfo
                    }
                }

            console.log(testFeature.properties.description);

            socket.emit("pointInsertion", testFeature);


            geojson.features.push(testFeature);

            var popup = new mapboxgl.Popup({
                offset: 25
            }).setText(testFeature.properties.description);



            var el = document.createElement('div');
            el.className = 'marker';

            new mapboxgl.Marker(el)
                .setLngLat(testFeature.geometry.coordinates)
                .setPopup(popup)
                .addTo(map);


            });

              

  
    })
    
