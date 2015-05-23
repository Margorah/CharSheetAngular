(function() {
    var local = 'http://localhost:3000/';
    var aso = '../';
    var preface = local;

    var resourceAlpha = angular.module('resourceApp', ["ngTouch", "ngRoute","mobile-angular-ui"]);

    resourceAlpha.factory('appData', function() {
        var appData = {};
        appData.user = {
            username: '',
            password: ''
        };
        appData.charList = [];
        appData.resources = [];
        appData.selectedChar = {};

        appData.populateResourceList = function(list) {
              appData.resources = list;
        };
        appData.addResource = function(item) {
            appData.resources.push(item);
        };
        appData.editResource = function(index, newValue) {
            appData.resources[index]["value"] = newValue;
        };

        return appData;
    });

    resourceAlpha.config(function($routeProvider, $locationProvider) {
        $routeProvider.when('/', {
            templateUrl: 'signIn.html'
        });
        $routeProvider.when('/resourceList', {
            templateUrl: 'resourceList.html'
        });
        $routeProvider.when('/characterSelect', {
            templateUrl: 'characterSelect.html'
        });
        $routeProvider.when('/addResource', {
            templateUrl: 'addResource.html'
        });
    });

    resourceAlpha.controller('resourceAppMain', ['$http', '$location', 'appData', function ($http, $location, appData) {
        var self = this;
        self.user = appData.user;
        this.userLoad = function () {
            $http({
                url: preface + 'user?name=' + self.user.username.toLowerCase(),// + '&pass=' + self.user.password,
                method: 'GET'
            }).success(function (loadedData) {
                if (loadedData.constructor === Array) {
                    appData.charList = loadedData;
                    $location.path('/characterSelect');
                }
            }).error(function (data, status, headers, config) {
                console.log(data);
                console.log(status);
                console.log(headers);
                console.log(config);
            });
        };
    }]);
    resourceAlpha.controller('resourceAppCharList', ['$http', '$location', 'appData', function ($http, $location, appData) {
        //look into using $location
        var self = this;
        self.charList = appData.charList;
        self.selectedChar = appData.selectedChar;
        this.load = function (index) {
            self.selectedChar.name = appData.charList[index].name;
            self.selectedChar.url = appData.charList[index].url;
            $http({
                url: preface + 'loadChar?user=' + appData.user.username.toLowerCase() + '&url=' + self.selectedChar.url,
                method: 'GET'
            }).success(function (loadedData) {
                if (loadedData.constructor === Array)
                    appData.populateResourceList(loadedData);
                $location.path('/resourceList');
                console.log('Get Success');
            }).error(function (data, status, headers, config) {
                console.log(data);
                console.log(status);
                console.log(headers);
                console.log(config);
            });
        };
    }]);
    resourceAlpha.controller('resourceAppEditData', ['$http', '$location', 'appData', function ($http, $location, appData) {
        var self = this;
        self.selectedChar = appData.selectedChar;
        self.toChange = "";
        self.currentView = 'Read';
        self.data = appData.resources;

        this.plus = function (index) {
            this.toChange ? self.data[index].value += parseInt(eval(this.toChange)) : self.data[index].value += 1;
            if (self.data[index].maximum > 0) {
                if (self.data[index].value > self.data[index].maximum)
                    self.data[index].value = self.data[index].maximum;
            }
            this.toChange = "";
        };
        this.minus = function (index) {
            this.toChange ? self.data[index].value -= parseInt(eval(this.toChange)) : self.data[index].value -= 1;
            if (self.data[index].value < 0)
                self.data[index].value = 0;
            this.toChange = "";
        };
        this.refresh = function (index) {
            if (self.data[index].maximum > 0)
                self.data[index].value = self.data[index].maximum;
        };
        this.remove = function (index) {
            self.data.splice(index, 1);
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
        this.save = function () {
            //in ng-repeat need to add track by {uniqueProperty}
            toSend = angular.toJson(self.data);
            $http({
                url: preface + 'saveChar',
                method: 'POST',
                data: {
                    user: appData.user.username.toLowerCase(),
                    url: self.selectedChar.url,
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
        this.add = function() {
            $location.path('/addResource');
        };
    }]);
    resourceAlpha.controller('resourceAppAddData', ['$location', 'appData', function ($location, appData) {
        var self = this;
        self.data = appData.resources;
        this.push = function () {
            if (this.maximum === undefined || this.maximum < 0)
                this.maximum = 0;
            self.data.push({
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
            $location.path('/resourceList');
        };
        this.cancel = function() {
            $location.path('/resourceList');
        }
    }]);
})();