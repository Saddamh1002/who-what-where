var app = angular.module('who-what-where', []);
app.controller('myCtrl', function ($scope, $http, $rootScope) {

    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 14
    });

    var markers = [];

    $scope.responseDetails = [];
    $scope.search = function () {
        getData({
            query: $scope.query,
            location: $scope.location
        });
    };

    function addMarker(feature) {
        var marker = new google.maps.Marker({
            position: feature.position,
            map: map
        });

        var infowindow = new google.maps.InfoWindow({
            content: feature.title
        });

        marker.addListener('mouseover', function () {
            infowindow.open(map, marker);
        });

        marker.addListener('mouseout', function () {
            infowindow.close();
        });

        markers.push(marker);

    }

    function getData(input) {
        $scope.responseDetails = [];
        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(null);
        }
        markers = [];
        $http.post('/getdata', input).then(function (resp) {

            if (resp.data instanceof Array && resp.data.length > 0) {

                var responseDetails = resp.data;
                map.setCenter(new google.maps.LatLng(responseDetails[0].cords.lat, responseDetails[0].cords.lon));
                for (var i = 0; i < responseDetails.length; i++) {
                    $scope.responseDetails.push({
                        id: responseDetails[i].id,
                        name: responseDetails[i].name,
                        phone: responseDetails[i].phone,
                        image: responseDetails[i].photo,
                        rating: responseDetails[i].rating,
                        address: responseDetails[i].address,
                        city: responseDetails[i].city,

                    });

                    var business = responseDetails[i];

                    var _marker = {
                        position: new google.maps.LatLng(business.cords.lat, business.cords.lon),
                        title: business.name,
                        data: business
                    };

                    addMarker(_marker);
                }
            } else {
                console.error('No Results found');
            }
        }, function (error) {
            console.error(error);
        });
    }

    getData({query: 'food', location: 'new york'});


});

