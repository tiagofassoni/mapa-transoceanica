$( document ).ready(function() {

  L.mapbox.accessToken = 'pk.eyJ1IjoianVzdHRlc3RpbmciLCJhIjoiMEg3ZWJTVSJ9.h41984pPh9afTYWBg2eoQQ';
  var map = L.mapbox.map('map')
      .setView([  -22.946643, -43.058642], 14);

  // Use styleLayer to add a Mapbox style created in Mapbox Studio
  // L.mapbox.styleLayer('mapbox://styles/justtesting/cj1fp79gl00092rr091yoxrr6').addTo(map);
  L.mapbox.styleLayer('mapbox://styles/mapbox/streets-v10').addTo(map);

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

  var default_bhs_line_style = {
    color: '#fd4d3d',
    weight: 9
  }

  function loadBhsLineLegend(feature) {
    var template = $('#hover-bhs-line-template').html();
    Mustache.parse(template);   // optional, speeds up future uses
    var rendered = Mustache.render(template, {feature: feature});
    $('#hover-de-baixo').html(rendered);
}

  var bhs_line_legends_hover = {};
  var bhs_line_legends_click = {};
  // var hoverDeBaixo = L.mapbox.legendControl({'position': 'bottomleft'})
  // hoverDeBaixo.onAdd = function(map){
  //   return document.getElementById('hover-de-baixo').innerHTML;
  // };

  function highlightFeature(e) {
      var layer = e.target;
      // console.log('Entrou highlightFeature!!!!');
      layer.setStyle({
          weight: 15,
          color: '#FAA286',
      //     dashArray: '',
      //     fillOpacity: 0.7
      });
      loadBhsLineLegend(layer.feature.properties);
      // hoverDeBaixo.addLegend(document.getElementById('hover-de-baixo').innerHTML);
      // hoverDeBaixo.addTo(map);
      // map.addControl(hoverDeBaixo);
      bhs_line_legends_hover[layer.feature.properties.Id].addLegend(document.getElementById('hover-de-baixo').innerHTML);
      map.addControl(bhs_line_legends_hover[layer.feature.properties.Id]);

      // if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
      //     layer.bringToFront();
      // }
  }

  function resetHighlight(e) {
    // console.log('Entrou reset!!!!');
      var layer = e.target;
      // map.removeControl(hoverDeBaixo);
      map.removeControl(bhs_line_legends_hover[layer.feature.properties.Id]);
      layer.setStyle(default_bhs_line_style);
  }

  var cocoen_started = false;

  function showFeatureDetails(e) {
    var layer = e.target;

    map.removeControl(bhs_line_legends_hover[layer.feature.properties.Id]);

    var legendaGiganta = L.mapbox.legendControl({'position': 'bottomleft'}).addLegend(document.getElementById('teste-da-bagaca').innerHTML);
    legendaGiganta.addTo(map);

    $('#botao-fechar-legenda-giganta').click(function(e) {
      var bla;
      var layer = e.target;
        map.removeControl(legendaGiganta)
    });

    // Inicia o antes e depois
    if (cocoen_started === false) {
      $('.cocoen').cocoen();
      cocoen_started = true;
    }


    // bhs_line_legends_click[layer.feature.properties.Id].addLegend(document.getElementById('teste-da-bagaca').innerHTML);
    // map.addControl(bhs_line_legends_click[layer.feature.properties.Id]);
  }

  $.getJSON("geojson/bhs.geojson", function(bhsGeojson) {
    L.geoJSON(bhsGeojson, {
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
        // bhs_line_legends_click[layer.feature.properties.Id] = L.mapbox.legendControl({'position': 'bottomleft'})
        // layer.bindPopup(feature.properties.name);
      }
    }).addTo(map);
    // }).bindPopup(function (layer) {
    //   return layer.feature.properties.description;

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



var linesLegend = L.mapbox.legendControl({position: 'topright'}).addLegend(document.getElementById('legenda-linhas').innerHTML);
  linesLegend.addTo(map);

// var mostraLegal = L.mapbox.legendControl({'position': 'bottomleft'}).addLegend(document.getElementById('legenda-transoceanica-benvindo').innerHTML);
// mostraLegal.addTo(map);



// var legendaGiganta = L.mapbox.legendControl({'position': 'bottomleft'}).addLegend(document.getElementById('teste-da-bagaca').innerHTML);
// legendaGiganta.addTo(map);
//Depois da legendaGiganta adicionada ao mapa (e, portanto, existindo), a gente acha o botão de fechar pelo id (que é mais confiável que o ego ou o superego)


});
