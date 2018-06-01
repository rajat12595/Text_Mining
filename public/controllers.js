/**
 *
 */
(function () {
    'use strict';
    var myApp = angular.module('app');

    myApp.controller('FileUploadController', function ($scope, $http) {


        $scope.tableData = null;
        $scope.uploadFile = function () {
            var data = document.getElementById('file').files[0];
            console.log(data.toString());

            var file = data, read = new FileReader();
            read.readAsBinaryString(file);

            read.onloadend = function () {
                //console.log(read.result);
                var parameter = JSON.stringify({fileData: read.result, myFileText: $scope.myFileText});
                $http.post('/miner/csv', parameter).success(function (data, status, headers, config) {
                    // this callback will be called asynchronously
                    // when the response is available
                    var z = document.getElementById("csv1table");
                    var a = data.result;

                    console.log(a);
                    z.style.display = "block";
                    $scope.tableData = a;
                    console.log("hi");
                    console.log($scope);

                }).error(function (data, status, headers, config) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });
            }
        }
        $scope.isVisible = true;


//-------------------------------------------------------------------


        $scope.uploadFileText = function () {

            var text = $scope.myFileText;
            console.log($scope);


            var parameter = JSON.stringify({sen: text});
            $http.post('/miner', parameter).success(function (data, status, headers, config) {
                // this callback will be called asynchronously
                // when the response is available
                console.log(data);
                $scope.result = "Your Prediction: " + data.result;

            }).error(function (data, status, headers, config) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
            });


        };
    });

})();


function csvJSON(csv) {

    csv = csv;
    console.log(csv);
    var lines = csv.split("\n");

    var result = [];

    var headers = lines[0].split(",");

    for (var i = 1; i < lines.length; i++) {

        var obj = {};
        var currentline = lines[i].split(",");

        for (var j = 0; j < headers.length; j++) {
            obj[headers[j]] = currentline[j];
        }

        result.push(obj);

    }

    //return result; //JavaScript object
    return JSON.stringify(result); //JSON
}