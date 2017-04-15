$( document ).ready(function() {

  L.mapbox.accessToken = 'pk.eyJ1IjoianVzdHRlc3RpbmciLCJhIjoiMEg3ZWJTVSJ9.h41984pPh9afTYWBg2eoQQ';
  var map = L.mapbox.map('map', 'mapbox.streets', {scrollWheelZoom: false})
      .setView([  -22.946643, -43.058642], 14)
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

    map.removeControl(mostraLegal);

    if (bhs_line_legends_click_displayed === false) {
      var layer = e.target;
      layer.setStyle({
          weight: 30,
          color: '#FAA286',
      //     dashArray: '',
          fillOpacity: 0.3,
          opacity: 0.4
      });
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
    if (bhs_line_legends_click_displayed === false) {
      bhs_line_legends_click_displayed = true;
      var layer = e.target;

      map.removeControl(bhs_line_legends_hover[layer.feature.properties.Id]);

      loadBhsLineBigLegend(layer.feature.properties);
      bhs_line_legends_click[layer.feature.properties.Id].addLegend(document.getElementById('teste-da-bagaca').innerHTML);
      map.addControl(bhs_line_legends_click[layer.feature.properties.Id]);

      $('#botao-fechar-legenda-giganta').click(function(e) {
        bhs_line_legends_click_displayed = false;
        map.removeControl(bhs_line_legends_click[layer.feature.properties.Id]);
        layer.setStyle(default_bhs_line_style);
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

  $.getJSON("geojson/bhs.geojson", function(infoGeojson) {
    var info = L.geoJSON(infoGeojson, {
      style: function (feature) {
          return default_bhs_line_style;
      },
      onEachFeature: function (feature, layer) {
        layer.on({
          mouseover: highlightFeature,
          mouseout: resetHighlight,
          click: showFeatureDetails
        });
        bhs_line_legends_hover[feature.properties.Id] = L.mapbox.legendControl({'position': 'bottomleft'});
        bhs_line_legends_click[layer.feature.properties.Id] = L.mapbox.legendControl({'position': 'bottomleft'})
      },
      pane: 'info'
    }).addTo(map);
  });

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

});
