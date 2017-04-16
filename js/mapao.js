$( document ).ready(function() {

  var default_zoom = 14

  if (window.innerWidth < 900) {
    default_zoom = 13
  }

  L.mapbox.accessToken = 'pk.eyJ1IjoianVzdHRlc3RpbmciLCJhIjoiMEg3ZWJTVSJ9.h41984pPh9afTYWBg2eoQQ';
  var map = L.mapbox.map('map', 'mapbox.streets', {
    scrollWheelZoom: false,
    tap: false
  })
      .setView([  -22.946643, -43.058642], default_zoom)
      .on('click', function(e) {
        // map.scrollWheelZoom.enable();
        map.dragging.enable();
      });
      map.dragging.disable()

      //  map.scrollWheelZoom.enable();
      //  map.dragging.enable();

  // Use styleLayer to add a Mapbox style created in Mapbox Studio
  // L.mapbox.styleLayer('mapbox://styles/justtesting/cj1fp79gl00092rr091yoxrr6').addTo(map);
  L.mapbox.styleLayer('mapbox://styles/mapbox/streets-v10').addTo(map);

  L.mapbox.legendControl({position: 'topright'}).addLegend(document.getElementById('legenda-linhas').innerHTML).addTo(map);

  var mostraLegal = L.mapbox.legendControl({'position': 'bottomleft'}).addLegend(document.getElementById('legenda-transoceanica-benvindo').innerHTML);
  mostraLegal.addTo(map);

  map.createPane('info');
  map.getPane('info').style.zIndex = 650;

  var default_bhs_line_style = {
    color: '#fd4d3d',
    weight: 30,
    // fillOpacity: 0.4,
    opacity: 0.0
  }

  var highlight_line_style = {
    weight: 30,
    color: '#FAA286',
    fillOpacity: 0.3,
    opacity: 0.4
  }
  var bhs_line_legends_hover = {};
  var bhs_line_legends_click = {};
  var bhs_line_legends_click_displayed = false;

  function loadBhsLineLegend(feature) {
    var template = $('#hover-bhs-line-template').html();
    Mustache.parse(template);   // optional, speeds up future uses
    var rendered = Mustache.render(template, {feature: feature});
    $('#hover-de-baixo').html(rendered);
  }

  function loadBhsLineBigLegend(feature) {
    var template = $('#click-bhs-line-template').html();
    Mustache.parse(template);   // optional, speeds up future uses
    var rendered = Mustache.render(template, {feature: feature});
    $('#teste-da-bagaca').html(rendered);
  }

  function highlightFeature(e) {

    //Oculta call to action
    map.removeControl(mostraLegal);

    if (bhs_line_legends_click_displayed === false) {
      var layer = e.target;
      layer.setStyle(highlight_line_style);
      loadBhsLineLegend(layer.feature.properties);
      bhs_line_legends_hover[layer.feature.properties.Id].addLegend(document.getElementById('hover-de-baixo').innerHTML);
      map.addControl(bhs_line_legends_hover[layer.feature.properties.Id]);
    }
  }

  function resetHighlight(e) {
    if (bhs_line_legends_click_displayed === false) {
      var layer = e.target;
      map.removeControl(bhs_line_legends_hover[layer.feature.properties.Id]);
      layer.setStyle(default_bhs_line_style);
      map.addControl(mostraLegal);
    }
  }

  function showFeatureDetails(e) {
    // Evita exibir a legenda duas vezes
    if (bhs_line_legends_click_displayed === false) {

      map.removeControl(mostraLegal);
      bhs_line_legends_click_displayed = true;
      var layer = e.target;

      map.removeControl(bhs_line_legends_hover[layer.feature.properties.Id]);

      // Processa template Mustache
      loadBhsLineBigLegend(layer.feature.properties);
      // Adiciona elemento a legenda
      bhs_line_legends_click[layer.feature.properties.Id].addLegend(document.getElementById('teste-da-bagaca').innerHTML);
      // Adiciona legenda ao mapa
      map.addControl(bhs_line_legends_click[layer.feature.properties.Id]);

      layer.setStyle(highlight_line_style);

      $('#botao-fechar-legenda-giganta').click(function(e) {
        bhs_line_legends_click_displayed = false;
        map.removeControl(bhs_line_legends_click[layer.feature.properties.Id]);
        layer.setStyle(default_bhs_line_style);
        map.addControl(mostraLegal);
        // Tira hitghlight da linha bhc
        layer.setStyle(default_bhs_line_style);
        //Exibe call to action
        map.addControl(mostraLegal);
      });
      // Liga o slider antes <-> depois
      $('.cocoen').cocoen();
    }
  }

  $.getJSON("geojson/bhs.geojson", function(bhsGeojson) {
    var bhs = L.geoJSON(bhsGeojson, {
      style: {
        color: '#fd4d3d',
        weight: 10
      },
    }).addTo(map);
  });

  $.getJSON("geojson/ciclovias.geojson", function(cicloviasGeojson) {
    L.geoJSON(cicloviasGeojson, {
      style: function (feature) {
          return {
            color: '#8dc53f',
            weight: 4
          };
      }
    }).addTo(map);
  });

  $.getJSON("geojson/carros.geojson", function(carrosGeojson) {
    L.geoJSON(carrosGeojson, {
      style: function (feature) {
          return {
            color: '#f58b33',
            weight: 5
          };
      }
    }).addTo(map);
  });

  var events_config = {click: showFeatureDetails};

  if (window.innerWidth > 900) {
    events_config = {
      click: showFeatureDetails,
      mouseover: highlightFeature,
      mouseout: resetHighlight
    };
  }

  $.getJSON("geojson/bhs.geojson", function(infoGeojson) {
    var info = L.geoJSON(infoGeojson, {
      style: function (feature) {
          return default_bhs_line_style;
      },
      onEachFeature: function (feature, layer) {
        layer.on(events_config);
        bhs_line_legends_hover[feature.properties.Id] = L.mapbox.legendControl({'position': 'bottomleft'});
        bhs_line_legends_click[layer.feature.properties.Id] = L.mapbox.legendControl({'position': 'bottomleft'})
      },
      pane: 'info'
    }).addTo(map);
  });

  function markerClickCallback(feature, layer, type) {
  // does this feature have a property named popupContent?
  if (feature.properties && feature.properties.name) {
    var className = type + '-popup';
    layer.bindPopup(feature.properties.name, {
      className: className,
      closeButton: false
    });
  }
}

  var bhs_station_icon = L.icon({
    iconUrl: 'img/bhs-station-icon.png',
    iconSize:     [25, 45], // size of the icon
    iconAnchor:   [12.5, 45], // point of the icon which will correspond to marker's location
    popupAnchor:  [-3, -50] // point from which the popup should open relative to the iconAnchor
  });

  var passages_icon = L.icon({
    iconUrl: 'img/passages-icon.png',
    iconSize:     [25, 45], // size of the icon
    iconAnchor:   [12.5, 0], // point of the icon which will correspond to marker's location
    popupAnchor:  [-4, 15] // point from which the popup should open relative to the iconAnchor
  });

  var return_icon = L.icon({
    iconUrl: 'img/return-icon.png',
    iconSize:     [25, 45], // size of the icon
    iconAnchor:   [12.5, 0], // point of the icon which will correspond to marker's location
    popupAnchor:  [-4, 15] // point from which the popup should open relative to the iconAnchor
  });

  // Pontos
  $.getJSON("geojson/estacoes.geojson", function(estacoesGeojson) {
    L.geoJSON(estacoesGeojson, {
      pointToLayer: function (feature, latlng) {
        return L.marker(latlng, {
          'icon': bhs_station_icon
        }).addTo(map);
      },
      onEachFeature: function(feature, layer) {
        return markerClickCallback(feature, layer, 'bhs-stations');
      }
    }).addTo(map);
  });

  $.getJSON("geojson/retornos.geojson", function(retornosGeojson) {
    L.geoJSON(retornosGeojson, {
      pointToLayer: function (feature, latlng) {
        return L.marker(latlng, {
          'icon': return_icon
        }).addTo(map);
      },
      onEachFeature: function(feature, layer) {
        return markerClickCallback(feature, layer, 'returns');
      }
    }).addTo(map);
  });

  $.getJSON("geojson/passagens.geojson", function(passagensGeojson) {
    L.geoJSON(passagensGeojson, {
      pointToLayer: function (feature, latlng) {
        return L.marker(latlng, {
          'icon': passages_icon
        }).addTo(map);
      },
      onEachFeature: function(feature, layer) {
        return markerClickCallback(feature, layer, 'passages');
      }
    }).addTo(map);
  });

});
