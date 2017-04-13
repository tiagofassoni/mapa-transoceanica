$( document ).ready(function() {

  L.mapbox.accessToken = 'pk.eyJ1IjoianVzdHRlc3RpbmciLCJhIjoiMEg3ZWJTVSJ9.h41984pPh9afTYWBg2eoQQ';
  var map = L.mapbox.map('map')
      .setView([  -22.946643, -43.058642], 15);

  // Use styleLayer to add a Mapbox style created in Mapbox Studio
  L.mapbox.styleLayer('mapbox://styles/justtesting/cj1fp79gl00092rr091yoxrr6').addTo(map);

  // Pontos
  $.getJSON("geojson/estacoes.geojson", function(estacoesGeojson) {
      estacoesGeojson.features.forEach(function(marker) {
          L.marker([marker.geometry.coordinates[1], marker.geometry.coordinates[0]], {
              'icon': L.mapbox.marker.icon({'marker-symbol': 'bus','marker-color': '#fd4d3d'}), // bus
              //'riseOnHover': true
          }).addTo(map);

      });
  });

  $.getJSON("geojson/retornos.geojson", function(retornosGeojson) {
    retornosGeojson.features.forEach(function(marker) {
        L.marker([marker.geometry.coordinates[1], marker.geometry.coordinates[0]], {
            'icon': L.mapbox.marker.icon({'marker-symbol': 'circle-stroked','marker-color': '#8dc53f'}), // ciclovia
            //'riseOnHover': true
        }).addTo(map);
    });
  });

  $.getJSON("geojson/passagens.geojson", function(passagensGeojson) {
    passagensGeojson.features.forEach(function(marker) {
        L.marker([marker.geometry.coordinates[1], marker.geometry.coordinates[0]], {
            'icon': L.mapbox.marker.icon({'marker-symbol': 'car','marker-color': '#f58b33'}), //carros
            //'riseOnHover': true
        }).addTo(map);
    });
  });

  $.getJSON("geojson/bhs.geojson", function(bhsGeojson) {
    L.geoJSON(bhsGeojson, {
      style: function (feature) {
          return {
            color: '#fd4d3d',
            weight: 10
          };
      }
    }).addTo(map);
    // }).bindPopup(function (layer) {
    //   return layer.feature.properties.description;

  });

  $.getJSON("geojson/carros.geojson", function(carrosGeojson) {
    L.geoJSON(carrosGeojson, {
      style: function (feature) {
          return {color: '#f58b33'};
      }
    }).addTo(map);
  });

  $.getJSON("geojson/ciclovias.geojson", function(cicloviasGeojson) {
    L.geoJSON(cicloviasGeojson, {
      style: function (feature) {
          return {color: '#8dc53f'};
      }
    }).addTo(map);
  });

var mostraLegal = L.mapbox.legendControl({'position': 'bottomleft'}).addLegend(document.getElementById('legenda-transoceanica-benvindo').innerHTML);
mostraLegal.addTo(map);

});



