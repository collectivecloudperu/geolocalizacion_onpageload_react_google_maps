
var map, marker, myLatlng, mapOptions, geoCoder, currentLoc, ubicacionActual;

//Creamos nuestro componente para Geolocalizar
var Geolocalizar = React.createClass({ 

  //Creamos la funcion para el botón 'Busca mi ubicación'
  getUbicacion: function() {
    
    //Si el Navegador soporta Geolocalización HTML5 que proceda y si no enviamos una alerta
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) { 
        var lat = position.coords.latitude;
        var lng = position.coords.longitude;

        currentLoc = new google.maps.LatLng(lat, lng);

        //Eliminamos el marcador agregado previamente       
        if (marker) {
          marker.setMap(null);
        }        

        var popupContent = '<div id="content"><h5 align="center" id="firstHeading" class="heading">Tu ubicación! </h5></div>'

        var infowindow = new google.maps.InfoWindow({
          content: popupContent
        });

        map.setCenter(currentLoc);//Centramos nuestra ubicación en el centro del mapa

        //Personalizamos el icono de nuestra ubicación
        image = {
            url: 'images/mifp.jpg', // // ubicacion de la imagen de perfil
            scaledSize: new google.maps.Size(50, 50), // medidad de la imagen de perfil
            //origin: new google.maps.Point(0,0), // origin
            //anchor: new google.maps.Point(0, 0) // anchor
        };

        //Creamos el marcador e instanciamos la imagen creada anteriormente
        marker = new google.maps.Marker({
            position: currentLoc,
            map: map,
            zoom: 17,
            title: 'Mi Ubicación',
            icon:image
        });

        infowindow.open(map,marker);
      });
        
    }
    else {
      alert('Tu Navegador no soporta Geolocalización, por favor actualizalo!');
    }
  },
  
  //Renderizamos el boton para Buscar mi ubicación, el icono de nuestra ubicación y otros elementos
  render: function() {
    return (
      <div className="form-group">

        <h1>Geolocalizar on Page Load con Google Maps y React JS</h1>

        <div className="col-md-3">
          <div className="input-group">
              <button className="btn btn-default" id="buscarmi" onClick={this.getUbicacion}><i className="fa fa-location-arrow"></i>Buscar mi ubicación</button>              
          </div>
        </div>

      </div>
      
    );
  }
});

//Renderizamos el mapa
var Gmaps = React.createClass({
  
  render: function() {
    return (
      <div id="map"></div>
    );
  }
});

//Cargamos la pagina index con la funcion navigator.geolocation.getCurrentPosition nativa de HTML5 para que nos detecte la ubicación al entrar a la Página
var App = React.createClass({

  //Después de renderizar el componente Gmaps, llamamos a la función componentDidMount para enlazar Google Maps con React y sus demas componentes
  componentDidMount: function() {
    
    //Iniciamos Geocoder
    geocoder = new google.maps.Geocoder();

    //Geolocalizamos la ubicacion del usuario al entrer a la página
    myLatlng = navigator.geolocation.getCurrentPosition(function(position) {
      var geolocalizaralcargarpagina = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
      //map.setCenter(geolocalizaralcargarpagina);

        var lat = position.coords.latitude;
        var lng = position.coords.longitude;

        ubicacionActual = new google.maps.LatLng(lat, lng);

        //Eliminamos el marcador agregado previamente
        if (marker) {
          marker.setMap(null);
        }

        var popupContent = '<div id="content"><h5 align="center" id="firstHeading" class="heading">Tu ubicación! </h5></div>'

        var infowindow = new google.maps.InfoWindow({
          content: popupContent
        });

        map.setCenter(ubicacionActual);//Centramos nuestra ubicación en el centro del mapa

        image = {
            url: 'images/mifp.jpg', // url
            scaledSize: new google.maps.Size(50, 50), // scaled size
            origin: new google.maps.Point(0,0), // origin
            anchor: new google.maps.Point(0, 0) // anchor
        };

        marker = new google.maps.Marker({
            position: ubicacionActual,
            map: map,
            zoom: 17,
            title: 'Mi Ubicación',
            icon:image
        });

        infowindow.open(map,marker);

    });

    //Le damos opciones a nuestro mapa
    mapOptions = {
      zoom: 17,
      center: myLatlng
    };

    //Renderizamos el mapa
    map = new google.maps.Map(document.getElementById('map'), mapOptions);

    //Agregamos marcadores al mapa
    marker = new google.maps.Marker({
      position: ubicacionActual,
      map: map,
      title: 'location'
    });  

  },

  
  //Renderizamos los componentes Geolocalizar y Gmaps
  render : function() {
    return (
      <div>
        <Geolocalizar />
        <Gmaps />
      </div> 
    )
  }

});

//Enviamos todo al div o capa #contenedor_mapa
ReactDOM.render(<App />, document.getElementById('contenedor_mapa'));