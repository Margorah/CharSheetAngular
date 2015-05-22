(function() {
    var local = 'http://localhost:3000/';
    var aso = '../';
    var preface = local;

    var resourceAlpha = angular.module('resourceApp', ["ngTouch", "ngRoute","mobile-angular-ui"]);

    resourceAlpha.config(function($routeProvider, $locationProvider) {
        $routeProvider.when('/', {
            templateUrl: 'signIn.html'
        });
    });

    resourceAlpha.controller('resourceAppMain', ['$scope', '$http', function ($scope, $http) {
        $scope.charList = "";
        $scope.selectedChar = null;
        $scope.data = [];
        this.userLoad = function () {
            $scope.data = [];
            $scope.selectedChar = null;
            $http({
                url: preface + 'user?name=' + $scope.userName.toLowerCase(),
                method: 'GET'
            }).success(function (loadedData) {
                if (loadedData.constructor === Array)
                    $scope.charList = loadedData;
            }).error(function (data, status, headers, config) {
                console.log(data);
                console.log(status);
                console.log(headers);
                console.log(config);
            });
        };
    }]);
    resourceAlpha.controller('resourceAppCharList', ['$scope', '$http', function ($scope, $http) {
        //look into using $location
        this.load = function () {
            $http({
                url: preface + 'loadChar?user=' + $scope.userName.toLowerCase() + '&url=' + $scope.selectedChar.url,
                method: 'GET'
            }).success(function (loadedData) {
                if (loadedData.constructor === Array)
                    $scope.$parent.data = loadedData;
                else
                    $scope.data = [];
                console.log('Get Success');
            }).error(function (data, status, headers, config) {
                console.log(data);
                console.log(status);
                console.log(headers);
                console.log(config);
            });
        };
        this.save = function () {
            //in ng-repeat need to add track by {uniqueProperty}
            toSend = angular.toJson($scope.$parent.data);
            $http({
                url: preface + 'saveChar',
                method: 'POST',
                data: {
                    user: $scope.userName.toLowerCase(),
                    url: $scope.selectedChar.url,
                    data: toSend
                }
            }).success(function () {
                console.log('Post Success');
            }).error(function (data, status, headers, config) {
                console.log('Post Error"');
                console.log(data);
                console.log(status);
                console.log(headers);
                console.log(config);
            });
        };
    }]);
    resourceAlpha.controller('resourceAppEditData', ['$scope', function ($scope) {
        this.toChange = "";
        this.currentView = 'Read';
        this.plus = function (index) {
            this.toChange ? $scope.data[index].value += parseInt(eval(this.toChange)) : $scope.data[index].value += 1;
            if ($scope.data[index].maximum > 0) {
                if ($scope.data[index].value > $scope.data[index].maximum)
                    $scope.data[index].value = $scope.data[index].maximum;
            }
            this.toChange = "";
        };
        this.minus = function (index) {
            this.toChange ? $scope.data[index].value -= parseInt(eval(this.toChange)) : $scope.data[index].value -= 1;
            if ($scope.data[index].value < 0)
                $scope.data[index].value = 0;
            this.toChange = "";
        };
        this.refresh = function (index) {
            if ($scope.data[index].maximum > 0)
                $scope.data[index].value = $scope.data[index].maximum;
        };
        this.remove = function (index) {
            $scope.data.splice(index, 1);
        };
        this.inView = function(current) {
            return this.currentView === current;
        };
        this.viewToggle = function() {
            if (this.currentView == 'Read')
                this.currentView = 'Edit';
            else
                this.currentView = 'Read';
        };
    }]);
    resourceAlpha.controller('resourceAppAddData', ['$scope', function ($scope) {
        this.push = function () {
            if (this.maximum === undefined || this.maximum < 0)
                this.maximum = 0;
            $scope.data.push({
                name: this.name,
                type: this.type,
                value: this.value,
                maximum: this.maximum,
                disabled: false
            });
            this.name = '';
            this.type = '';
            this.value = "";
            this.maximum = "";
        };
    }]);
    resourceAlpha.controller('resourceAppAddShow', function () {
        this.buttonText = 'Add';
        this.showToggle = function () {
            if (this.buttonText == 'Add')
                this.buttonText = 'Cancel';
            else
                this.buttonText = 'Add';
        };
        this.isVisible = function (toggleValue) {
            return this.buttonText === toggleValue;
        };
    });
})();