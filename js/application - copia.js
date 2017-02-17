/**================================================
JS : MY CUSTOM SCRIPTS
===================================================*/

var map, marker, myLatlng, mapOptions, geoCoder, currentLoc, searchBtn;

//Search component
var Searchbar = React.createClass({
  
  //Search click event
  getAddress: function(event) {
    
    //Get address from input
    var address = document.getElementById('search-input').value;

    //If no address is entered, display an alert and return;
    if (address === '') {
      alert('Ingresa una dirección para buscar ...');
      return;
    }
      
    //Use address and add a marker to the searched address
    geocoder.geocode( { 'address': address}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        
        //Remove previously added marker
        if (marker) {
          marker.setMap(null);
        }

        map.setCenter(results[0].geometry.location);
        
        marker = new google.maps.Marker({
            map: map,
            zoom: 17,
            position: results[0].geometry.location
        });
      } 
      else {
        alert('No se encuentra el lugar, Vuelve a intentarlo');
      }
    });
  },

  //Current location click event
  getCurrentLocation: function() {
    
    //If brower supports HTML5 geoLocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) { 
        var lat = position.coords.latitude;
        var lng = position.coords.longitude;

        currentLoc = new google.maps.LatLng(lat, lng);

        //Remove previously added marker
        if (marker) {
          marker.setMap(null);
        }

        var popupContent = '<div id="content"><h5 align="center" id="firstHeading" class="heading">Tu ubicación! </h5></div>'

        var infowindow = new google.maps.InfoWindow({
          content: popupContent
        });

        map.setCenter(currentLoc);//Set the map to center of location

        image = {
            url: 'images/mifp.jpg', // url
            scaledSize: new google.maps.Size(50, 50), // scaled size
            origin: new google.maps.Point(0,0), // origin
            anchor: new google.maps.Point(0, 0) // anchor
        };

        marker = new google.maps.Marker({
            position: currentLoc,
            map: map,
            zoom: 17,
            title: 'Mi ubicación',
            icon:image
        });

        infowindow.open(map,marker);
      });
        
    }
    else {
      alert('Tu Navegador no soporta Geolocalización, por favor actualizalo!');
    }
  },
  
  //Render search input, search btn, current location image
  render: function() {
    return (
      <div className="form-group">

        <h1>Google maps usando React JS</h1>        

        <div className="col-md-12">
          <div className="input-group">
            <input type="text" className="form-control" id="search-input" placeholder="Av. Canaval y Moreyra 755" />
            <span className="input-group-btn">
              <button id="search" className="btn btn-default" onClick={this.getAddress}>Buscar</button>
            </span>            
          </div>
        </div>

        <div className="col-md-3">
          <div className="input-group">
              <button className="btn btn-default" id="buscarmi" onClick={this.getCurrentLocation}><i className="fa fa-location-arrow"></i>Buscar mi ubicación</button>              
          </div>
        </div>

      </div>
      
    );
  }
});

//Google maps component
var Gmaps = React.createClass({

  //Render search input
  render: function() {
    return (
      <div id="map"></div>
    );
  }
});

//All Components  combined to to load in the index page
var App = React.createClass({

  //After Gmaps component is rendered, call this function to bind google maps
  componentDidMount: function() {
    
    //Initializing geoCoder
    geocoder = new google.maps.Geocoder();

    //Geolocalizar al cargar la página
    myLatlng = navigator.geolocation.getCurrentPosition(function(position) {
      var initialLocation = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
      //map.setCenter(initialLocation);

        var lat = position.coords.latitude;
        var lng = position.coords.longitude;

        currentLoc = new google.maps.LatLng(lat, lng);

        //Remove previously added marker
        if (marker) {
          marker.setMap(null);
        }

        var popupContent = '<div id="content"><h5 align="center" id="firstHeading" class="heading">Tu ubicación! </h5></div>'

        var infowindow = new google.maps.InfoWindow({
          content: popupContent
        });

        map.setCenter(currentLoc);//Set the map to center of location

        image = {
            url: 'images/mifp.jpg', // url
            scaledSize: new google.maps.Size(50, 50), // scaled size
            origin: new google.maps.Point(0,0), // origin
            anchor: new google.maps.Point(0, 0) // anchor
        };

        marker = new google.maps.Marker({
            position: currentLoc,
            map: map,
            zoom: 17,
            title: 'Mi ubicación',
            icon:image
        });

        infowindow.open(map,marker);

    });

    //Map option
    mapOptions = {
      zoom: 17,
      center: myLatlng
    };

    //Render google maps in #map container
    map = new google.maps.Map(document.getElementById('map'), mapOptions);

    //Adding maker to maps
    marker = new google.maps.Marker({
      position: currentLoc,
      map: map,
      title: 'location'
    });


    var searchBar = document.getElementById('search-input');

    //Adding autocomplete to search bar
    var autocomplete = new google.maps.places.Autocomplete(searchBar);
    autocomplete.bindTo('bounds', map); //Binding autocomplete

    //On click of autocomplete search, add marker to palce
    google.maps.event.addListener(autocomplete, 'place_changed', function(event) {
      
      marker.setVisible(false);//set marker to not visible
      
      //Selected place
      var place = autocomplete.getPlace();

      if (marker) {
        marker.setMap(null);
      }

      //Adding marker to the selected location
      var position = new google.maps.LatLng(place.geometry.location.A, place.geometry.location.F);

      //Marker
      marker = new google.maps.Marker({
        map: map,
        zoom: 25,
        position: position
      });

      map.setZoom(17);
      map.setCenter(marker.getPosition());
      
      marker.setVisible(true); //Set marker to visible
    });

  },
  
  //Render google maps and search bar in page
  render : function() {
    return (
      <div>
        <Searchbar />
        <Gmaps />
      </div> 
    )
  }
});

//Set rendering targer as #main-container
React.render(<App />, document.getElementById('main-container'));