var myMap;
var lyrOSM;
var lyrOpenTopoMap;
var lyrWorldImagery;
var baseLayers;
var overlays;
var lyrFields;

var mrkField;
var lineField;
var polyField;
var fgLayer;

var mrkCurrentLocation;
var popMinarEPakistan;
var ctlMousePosition;
var ctlMeasure;
var ctlEasyButton;
var ctlSidebar

var ctlDraw;
var fDrawGroup;
var ctlStyle;




$(document).ready(function () {
    // create map object
    myMap = L.map('map_div',  {center:[29.66542,72.63678], zoom:17
        , zoomControl:false });

    //popup Minar e Pakistan
    popMinarEPakistan = L.popup();
    popMinarEPakistan.setLatLng([31.59248,74.30966]);
    popMinarEPakistan.setContent("<h2>Minar e Pakistan</h2>" +
        "<img src='img/minar-e-pakistan.jpg'  width='300px'/>");


    // basemap layers

    //add basemap layer
    // lyrOSM = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png');
    lyrOSM = L.tileLayer.provider('OpenStreetMap.Mapnik');
    lyrOpenTopoMap = L.tileLayer.provider('OpenTopoMap');
    lyrWorldImagery = L.tileLayer.provider('Esri.WorldImagery');
    myMap.addLayer(lyrWorldImagery);

    // add image overlays
    lyrFields = L.imageOverlay('img/fields.png', [[29.66542,72.63678],[29.66320,72.64034]], {opacity:0.6}).addTo(myMap);



    //myMap.openPopup(popMinarEPakistan);
    //popMinarEPakistan.openOn(myMap);



    var latlngs = [
        [
            [29.66534,72.64021],
            [29.66535,72.63819],
            [29.66376,72.63817],
            [29.66372,72.63749],
            [29.66352,72.63749],
            [29.66352,72.63749],
            [29.66353,72.63713]
        ],
        [
            [29.66536,72.63683],
            [29.66373,72.63681],
            [29.66372,72.63714],
            [29.66353,72.63713]
        ]
    ];


    // polygon
    polyField = L.polygon([[[29.66536,72.63683],[29.66322,72.63681],[29.66324,72.64023],[29.66534,72.64023]],[[29.66403,72.63885],[29.66401,72.6395],[29.66373,72.63949],[29.66374,72.63885]]],
        {color:"red" , fillColor:"yellow", fillOpacity:0.6});
    // polyline
    lineField =  L.polyline(latlngs, {color: 'blue', weight:5});

    // point
    mrkField = L.marker([29.66350,72.63713],{draggable:true});
    mrkField.bindTooltip('Field No. 6');

    fgLayer = L.featureGroup([polyField, lineField]).bindPopup('Hello world!').addTo(myMap);
    fDrawGroup = new L.featureGroup().addTo(myMap);

    baseLayers = {
        "OpenStreetMap": lyrOSM,
        "OpenTopoMap": lyrOpenTopoMap,
        "Esri-WorldImagery": lyrWorldImagery

    };

    overlays = {
        // "OpenStreetMap": lyrOSM,
        // "OpenTopoMap": lyrOpenTopoMap,
        // "Esri-WorldImagery": lyrWorldImagery,
         "FieldsData": fgLayer,
        "Draw Items" : fDrawGroup

    };

    L.control.layers(baseLayers, overlays).addTo(myMap);




    // plugins
    
    ctlMousePosition = L.control.mousePosition().addTo(myMap);
    ctlMeasure =L.control.polylineMeasure().addTo(myMap);


    ctlSidebar = L.control.sidebar('side-bar').addTo(myMap);
    ctlEasyButton = L.easyButton('fa-exchange', function () {
        ctlSidebar.toggle();
    }).addTo(myMap);



    ctlDraw = new L.Control.Draw({
        edit:{
            featureGroup :fDrawGroup
        }

    });
    ctlDraw.addTo(myMap);

    myMap.on('draw:created',function (e) {
        fDrawGroup.addLayer(e.layer);
        alert(JSON.stringify(e.layer.toGeoJSON()));
    });

    ctlStyle = L.control.styleEditor({position:'topleft'}).addTo(myMap);

    // event handler and anonymous functions
    // myMap.on('click',function (e) {
    //
    //     alert(e.latlng.toString());
    //     alert(myMap.getZoom());
    //
    // });

    // right click
    myMap.on('contextmenu',function (e) {

        L.marker(e.latlng).addTo(myMap).bindPopup(e.latlng.toString());

    });



    //call method location
    myMap.on('keypress',function (e) {
        if(e.originalEvent.key = 'l'){
            myMap.locate();
        }

    });

    //create circle if location found
    myMap.on('locationfound',function (e) {
        if(mrkCurrentLocation){
            mrkCurrentLocation.remove();
        }
        mrkCurrentLocation = L.circleMarker(e.latlng).addTo(myMap);
        //mrkCurrentLocation = L.circle(e.latlng, {radius:e.accuracy/4}).addTo(myMap);
        myMap.setView(e.latlng, 18);
    });

    //call method location
    myMap.on('locationerror', function(e) {
        console.log(e);
        alert("Location was not found");
    });

    //get user location on button click
    $('#get_location_id').click(function () {
        myMap.locate();
    });

    // go to specific location
    $('#go_to_location').click(function () {
        myMap.setView([31.59248,74.30966], 18);
        myMap.openPopup(popMinarEPakistan);
    });

    // get map zoom level
    myMap.on('zoomend', function () {
        $('#zoom_level_id').html(myMap.getZoom());
    });

    // get map zoom level
    myMap.on('moveend', function (e) {
        $('#map_center_id').html(latLngToString(myMap.getCenter()));
    });

    // get mouse location
    myMap.on('mousemove',function (e) {

        $('#mouse_location_id').html(latLngToString(e.latlng));

    });

    // set opacity on image

    $('#change_opacity').on('change',function () {
        $('#img_opacity_display').html(this.value);
        lyrFields.setOpacity(this.value);
    })

    mrkField.on('dragend', function () {
        mrkField.setTooltipContent('Current Location:' +mrkField.getLatLng().toString());
    })


    $('#go_to_backFieldSix').click(function () {
        myMap.setView([29.66350,72.63713], 17);
        mrkField.setLatLng([29.66350,72.63713]);
        mrkField.setTooltipContent('Welcome back to Field Six');
    })

    $('#go_to_line_field').click(function () {
        myMap.fitBounds(lineField.getBounds());
    })


    $('#add_point_id').click(function () {
        if(fgLayer.hasLayer(mrkField)){
            fgLayer.removeLayer(mrkField);
            $('#add_point_id').html('Add Marker to Layer Group');
        }else {
            fgLayer.addLayer(mrkField);
            $('#add_point_id').html('Remove Marker from Layer Group');
        }


    });

    $('#setstyle_id').click(function () {
        fgLayer.setStyle({color:'green', fillColor: 'red', fillOpacity: 0.9});
    })

    //custom functions
    function latLngToString(ll) {
        return "["+ll.lat.toFixed(5)+","+ll.lng.toFixed(5)+"]";
    }
});
