var estacoesGeojson = {
"type": "FeatureCollection",
"features": [
{ "type": "Feature", "properties": { "Id": 0, "Nome": "Terminal Charitas" }, "geometry": { "type": "Point", "coordinates": [ -43.099156924940246, -22.932983912438413 ] } },
{ "type": "Feature", "properties": { "Id": 0, "Nome": "Estação BRT" }, "geometry": { "type": "Point", "coordinates": [ -43.027836101826097, -22.953465956285058 ] } },
{ "type": "Feature", "properties": { "Id": 0, "Nome": "Estação BRT" }, "geometry": { "type": "Point", "coordinates": [ -43.071492471048394, -22.9361155625583 ] } },
{ "type": "Feature", "properties": { "Id": 0, "Nome": "Estação BRT" }, "geometry": { "type": "Point", "coordinates": [ -43.062171439464329, -22.936957136690182 ] } },
{ "type": "Feature", "properties": { "Id": 0, "Nome": "Estação BRT" }, "geometry": { "type": "Point", "coordinates": [ -43.076832354034934, -22.933840323402247 ] } },
{ "type": "Feature", "properties": { "Id": 0, "Nome": "Estação BRT" }, "geometry": { "type": "Point", "coordinates": [ -43.066387176309966, -22.932902255212436 ] } },
{ "type": "Feature", "properties": { "Id": 0, "Nome": "Estação BRT" }, "geometry": { "type": "Point", "coordinates": [ -43.058293162267049, -22.940581324643247 ] } },
{ "type": "Feature", "properties": { "Id": 0, "Nome": "Estação BRT" }, "geometry": { "type": "Point", "coordinates": [ -43.053185470555363, -22.941144829248969 ] } },
{ "type": "Feature", "properties": { "Id": 0, "Nome": "Estação BRT" }, "geometry": { "type": "Point", "coordinates": [ -43.045572534695609, -22.940222247394448 ] } },
{ "type": "Feature", "properties": { "Id": 0, "Nome": "Estação BRT" }, "geometry": { "type": "Point", "coordinates": [ -43.041020898842298, -22.941325559677306 ] } },
{ "type": "Feature", "properties": { "Id": 0, "Nome": "Estação BRT" }, "geometry": { "type": "Point", "coordinates": [ -43.035431348756845, -22.944359498404577 ] } },
{ "type": "Feature", "properties": { "Id": 0, "Nome": "Estação BRT" }, "geometry": { "type": "Point", "coordinates": [ -43.032118621430293, -22.946672798407455 ] } },
{ "type": "Feature", "properties": { "Id": 0, "Nome": "Terminal Charitas" }, "geometry": { "type": "Point", "coordinates": [ -43.029690751944905, -22.949500499701237 ] } }
]
};

L.mapbox.accessToken = 'pk.eyJ1IjoianVzdHRlc3RpbmciLCJhIjoiMEg3ZWJTVSJ9.h41984pPh9afTYWBg2eoQQ';
var map = L.mapbox.map('map')
    .setView([  -22.946643, -43.058642], 15);

// Use styleLayer to add a Mapbox style created in Mapbox Studio
L.mapbox.styleLayer('mapbox://styles/justtesting/cj1fp79gl00092rr091yoxrr6').addTo(map);

// var poe_estacao_no_mapa = function(marker) {
//         console.dir(marker);
//         L.marker(marker.geometry.coordinates, {
//             //'icon': L.mapbox.marker.icon({'marker-symbol': 'bus','marker-color': '#422'}),
//             'riseOnHover': true
//         }).addTo(map);        
//     };

// L.geoJson(estacoesGeojson, {onEachFeature: poe_estacao_no_mapa});

    estacoesGeojson.features.forEach(function(marker) {
        console.dir(marker);
        L.marker([marker.geometry.coordinates[1], marker.geometry.coordinates[0]], {
            'icon': L.mapbox.marker.icon({'marker-symbol': 'bus','marker-color': '#422'}),
            //'riseOnHover': true
        }).addTo(map);
        
    });
