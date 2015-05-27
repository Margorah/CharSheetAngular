resourceAlpha.controller('resourceAppMain', ['$http', '$location', 'appData', 'localSave', function ($http, $location, appData, localSave) {
    var self = this;
    self.user = appData.user;

    this.userLoad = function () {
        self.user.username = self.user.username.toLowerCase();
        $http({
            url: preface + 'user?name=' + self.user.username,// + '&pass=' + self.user.password,
            method: 'GET'
        }).success(function (loadedData) {
            if (loadedData.constructor === Array) {
                appData.charList = loadedData;
                localSave.saveCharList(appData.charList, self.user);
                localSave.saveUser(self.user);
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
resourceAlpha.controller('resourceAppCharList', ['$http', '$location', 'appData', 'localSave', function ($http, $location, appData, localSave) {
    //look into using $location
    var self = this;
    self.charList = appData.charList;
    self.selectedChar = appData.selectedChar;

    this.load = function (index) {
        self.selectedChar.name = appData.charList[index].name;
        self.selectedChar.url = appData.charList[index].url;
        localSave.saveCurrChar(self.selectedChar);
        $http({
            url: preface + 'loadChar?user=' + appData.user.username + '&url=' + self.selectedChar.url,
            method: 'GET'
        }).success(function (loadedData) {
            if (loadedData.constructor === Array) {
                appData.populateResourceList(loadedData);
                localSave.saveResource(appData.user, self.selectedChar, appData.resources);
            }
            $location.path('/resourceList');
            console.log('Get Success');
        }).error(function (data, status, headers, config) {
            console.log(data);
            console.log(status);
            console.log(headers);
            console.log(config);
        });
    };
    this.logOut = function() {
        localSave.removeCharList(appData.user);
        localSave.removeUser();
        appData.user.username = '';
        appData.user.password = '';
        $location.path('/');
    };
}]);
resourceAlpha.controller('resourceAppEditData', ['$scope', '$http', '$location', '$interval', 'appData', 'localSave', function ($scope, $http, $location, $interval, appData, localSave) {
    var self = this;
    var intervalSave = $interval(function() {
        self.save();
    }, 1000 * 15 * 60);
    self.selectedChar = appData.selectedChar;
    self.data = appData.resources;

    this.logOut = function() {
        //Remove data here
        $interval.cancel(intervalSave);
        localSave.removeResource(appData.user, appData.selectedChar, true);
        localSave.removeMeta(appData.user, appData.selectedChar);
        localSave.removeCurrChar();
        localSave.removeCharList(appData.user);
        localSave.removeUser();
        appData.user.username = '';
        appData.user.password = '';
        $location.path('/');
    };
    self.save = function () {
        //in ng-repeat need to add track by {uniqueProperty}
        //save needs to edit file
        var toSend = JSON.stringify(appData.resources);
        var url = self.selectedChar.url;
        $http({
            url: preface + 'saveChar',
            method: 'POST',
            data: {
                user: appData.user.username,
                url: url,
                data: toSend
            }
        }).success(function () {
            console.log('Post Success');
            //localSave.saveMeta(appData.user, appData.selectedChar);
            localSave.saveResource(appData.user, appData.selectedChar, appData.resources);
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
    this.changeChar = function() {
        //remove data here
        $interval.cancel(intervalSave);
        localSave.removeResource(appData.user, appData.selectedChar, true);
        localSave.removeMeta(appData.user, appData.selectedChar);
        localSave.removeCurrChar();
        $location.path('/characterSelect');
    };
}]);
resourceAlpha.controller('resourceAppTrueEdit', ['$location', 'appData', 'localSave', function($location, appData, localSave) {
    var self = this;
    this.currentView = 'Read';
    this.toChange = '';
    self.data = appData.resources;

    this.inView = function(current) {
        return this.currentView === current;
    };
    this.viewToggle = function() {
        if (this.currentView == 'Read')
            this.currentView = 'Edit';
        else
            this.currentView = 'Read';
    };
    this.plus = function (index) {
        this.toChange ? self.data[index].value += parseInt(eval(this.toChange)) : self.data[index].value += 1;
        if (self.data[index].maximum > 0) {
            if (self.data[index].value > self.data[index].maximum)
                self.data[index].value = self.data[index].maximum;
        }
        localSave.editResource(appData.user, appData.selectedChar, self.data[index]);
        this.toChange = "";
    };
    this.minus = function (index) {
        this.toChange ? self.data[index].value -= parseInt(eval(this.toChange)) : self.data[index].value -= 1;
        if (self.data[index].value < 0)
            self.data[index].value = 0;
        localSave.editResource(appData.user, appData.selectedChar, self.data[index]);
        this.toChange = "";
    };
    this.refresh = function (index) {
        if (self.data[index].maximum > 0) {
            self.data[index].value = self.data[index].maximum;
            localSave.editResource(appData.user, appData.selectedChar, self.data[index]);
        }
    };
    this.remove = function (index) {
        localSave.removeResource(appData.user, appData.selectedChar, index);
        self.data.splice(index, 1);
    };
}]);
resourceAlpha.directive('focusMe', function($timeout) {
    return {
        link: function(scope, element, attrs) {
            scope.$watch(attrs.focusMe, function(value) {
                if(value === true) {
                    $timeout(function() {
                        element[0].focus();
                        scope[attrs.focusMe] = false;
                    });
                }
            });
        }
    };
});
resourceAlpha.controller('resourceAppAddData', ['$location', 'appData', 'localSave', function ($location, appData, localSave) {
    var self = this;
    var objectToPush = {};
    self.data = appData.resources;

    this.push = function () {
        var idValue = ("0000" + (Math.random()*Math.pow(36,4) << 0).toString(36)).slice(-4);
        if (this.maximum === undefined || this.maximum < 0)
            this.maximum = 0;
        objectToPush['id'] = idValue;
        objectToPush['name'] = this.name;
        objectToPush['type'] = this.type;
        objectToPush['value'] = this.value;
        objectToPush['maximum'] = this.maximum;
        objectToPush['disabled'] = false;
        self.data.push(objectToPush);
        localSave.saveResource(appData.user, appData.selectedChar, objectToPush);
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