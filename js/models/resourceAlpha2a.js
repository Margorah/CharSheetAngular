    var resourceAlpha = angular.module('resourceApp', ["ngRoute","mobile-angular-ui"]);

    resourceAlpha.run(function($location, $http, appData, localSave) {
        var userToAssign = localSave.getUser();
        var charToAssign = localSave.getCurrChar();
        var listToAssign;// = localSave.getl
        var resourceToAssign;

        //Add getting Meta (and Saving Below!)
        if (userToAssign !== null && charToAssign !== null) {
            appData.user = userToAssign;
            appData.selectedChar = charToAssign;
            appData.charList = localSave.getCharList(appData.user);
            resourceToAssign = localSave.getMeta(appData.user, appData.selectedChar);
            //resourceToAssign = localSave.getResource(appData.user, appData.selectedChar);
            if (resourceToAssign !== false)
                appData.resources = localSave.getResource(appData.user, appData.selectedChar);
            $location.path('/resourceList');
        }
        else if(userToAssign !== null) {
            appData.user = userToAssign;
            listToAssign = localSave.getCharList(appData.user);
            console.log(listToAssign);
            if (listToAssign !== null) {
                appData.charList = listToAssign;
                console.log(appData.charList);
            }
            $location.path('/characterSelect');
        }
    });

    resourceAlpha.factory('appData', function() {
        var appData = {};
        appData.user = {
            //username: '',
            //password: ''
        };
        appData.charList = [];
        appData.resources = [];
        appData.selectedChar = {
            //id:
            //name: '',
            //url: '',
            //savedOn: ''
        };

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

    resourceAlpha.factory('localSave', function() {
        var localSave = {};
        var helperFunctions = {

        };

        localSave.metaData = {
            savedOn: '',
            charListUpdate: '',
            arrayMap: []
        };

        localSave.saveUser = function(userToSave) {
            localStorage.setItem('currentUser', JSON.stringify(userToSave));
        };

        localSave.getUser = function() {
            var toParse = localStorage.getItem('currentUser');
            if (toParse === null)
                return null;
            return JSON.parse(toParse);
        };

        localSave.removeUser = function() {
            localStorage.removeItem('currentUser');
        };

        localSave.saveCurrChar = function(charToSave) {
            localStorage.setItem('currentChar', JSON.stringify(charToSave));
        };

        localSave.getCurrChar = function() {
            var toParse = localStorage.getItem('currentChar');
            if (toParse === null)
                return null;
            return JSON.parse(toParse);
        };

        localSave.removeCurrChar = function() {
            localStorage.removeItem('currentChar');
        };

        localSave.saveCharList = function(listToSave, currentUser) {
            var retrieveString = 'charList' + currentUser.username;
            localStorage.setItem(retrieveString, JSON.stringify(listToSave));
        };

        localSave.getCharList = function(currentUser) {
            var retrieveString = 'charList' + currentUser.username;
            var toParse = localStorage.getItem(retrieveString);
            if (toParse === null)
                return null;
            return JSON.parse(toParse);
        };

        localSave.removeCharList = function(currentUser) {
            var removeString = 'charList' + currentUser.username;
            localStorage.removeItem(removeString);
        };

        localSave.saveMeta = function(currentUser, currentChar) {
            var retrieveString = currentUser.username + currentChar.url + 'Meta';
            localStorage.setItem(retrieveString, JSON.stringify(this.metaData));
        };

        localSave.getMeta = function(currentUser, currentChar) {
            var retrieveString = currentUser.username + currentChar.url + 'Meta';
            var toParse = localStorage.getItem(retrieveString);
            if (toParse == null)
                return false;
            else {
                localSave.metaData = JSON.parse(toParse);
                return true;
            }
        };

        localSave.removeMeta = function(currentUser, currentChar) {
            var retrieveString = currentUser.username + currentChar.url + 'Meta';
            localStorage.removeItem(retrieveString);
        };

        localSave.getResource = function(currentUser, currentChar) {
            var objectToReturn = [];
            var itemString = '';
            var testVariable;

            /*itemString = currentUser.username + currentChar.url + 'Meta';
            testVariable = localStorage.getItem(itemString);

            if (testVariable == null)
                return null;

            localSave.metaData = JSON.parse(testVariable);*/

            //test if null is every reached
            //if (localSave.metaData.arrayMap.length < 1 || localSave.metaData.arrayMap === null)
            //    return null;

            localSave.metaData.arrayMap.forEach(function(element) {
                testVariable = localStorage.getItem(element);
                objectToReturn.push(JSON.parse(testVariable));
            });

            return objectToReturn; //of false
        };

        localSave.saveResource = function(currentUser, currentChar, newValue) {
            //make empty array?
            var itemString = '';
            localSave.metaData.savedOn = Date.now();
            if (newValue.constructor === Array) {
                for (var i = 0; i < newValue.length; i++) {
                    itemString = newValue[i]['id'];
                    localStorage.setItem(itemString, JSON.stringify(newValue[i]));
                    localSave.metaData.arrayMap.push(itemString);//] = itemString;
                }
                itemString = currentUser.username + currentChar.url + 'Meta';
                localStorage.setItem(itemString, JSON.stringify(localSave.metaData));
            }
            else {
                itemString = currentUser.username + currentChar.url + 'Meta';
                localStorage.setItem(newValue.id, JSON.stringify(newValue));
                localSave.metaData.arrayMap.push(newValue.id);//] = itemString;
                localStorage.setItem(itemString, JSON.stringify(localSave.metaData));
            }
        };

        localSave.removeResource = function(currentUser, currentChar, index) {
            //index will remove full array if 0, or an individual if greater
            var itemString = currentUser.username + currentChar.url + 'Meta';

            if (index === true) {
                //for(var i = 1; i < index; i++) {
                //    itemString = currentUser.username + currentChar.url + i;
                //    localStorage.removeItem(itemString);
                //}
                localSave.metaData.arrayMap.forEach(function(element) {
                     localStorage.removeItem(element);
                });
                localStorage.removeItem(itemString);
                localSave.metaData.savedOn = '';
                localSave.metaData.arrayMap = [];
            }
            else {
                //itemString = currentUser.username + currentChar.url + index;
                localStorage.removeItem(localSave.metaData.arrayMap[index]);
                localSave.metaData.savedOn = Date.now();
                localSave.metaData.arrayMap.splice(index, 1);
                localStorage.setItem(itemString, JSON.stringify(localSave.metaData));
            }
        };

        localSave.editResource = function(currentUser, currentChar, newValue) {
            var itemString = currentUser.username + currentChar.url + 'Meta';
            localSave.metaData.savedOn = Date.now();
            localStorage.setItem(newValue.id, JSON.stringify(newValue));
            localStorage.setItem(itemString, JSON.stringify(localSave.metaData));
        };

        return localSave;
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
    resourceAlpha.controller('resourceAppEditData', ['$scope', '$http', '$location', 'appData', 'localSave', function ($scope, $http, $location, appData, localSave) {
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
            localSave.editResource(appData.user, self.selectedChar, self.data[index]);
            this.toChange = "";
        };
        this.minus = function (index) {
            this.toChange ? self.data[index].value -= parseInt(eval(this.toChange)) : self.data[index].value -= 1;
            if (self.data[index].value < 0)
                self.data[index].value = 0;
            localSave.editResource(appData.user, self.selectedChar, self.data[index]);
            this.toChange = "";
        };
        this.refresh = function (index) {
            if (self.data[index].maximum > 0) {
                self.data[index].value = self.data[index].maximum;
                localSave.editResource(appData.user, self.selectedChar, self.data[index]);
            }
        };
        this.remove = function (index) {
           localSave.removeResource(appData.user, self.selectedChar, index);
            self.data.splice(index, 1);
        };
        this.add = function() {
            $location.path('/addResource');
        };
        this.changeChar = function() {
            //remove data here
            localSave.removeResource(appData.user, appData.selectedChar, true);
            localSave.removeMeta(appData.user, appData.selectedChar);
            localSave.removeCurrChar();
            $location.path('/characterSelect');
        };
        this.logOut = function() {
            //Remove data here
            localSave.removeResource(appData.user, appData.selectedChar, true);
            localSave.removeMeta(appData.user, appData.selectedChar);
            localSave.removeCurrChar();
            localSave.removeCharList(appData.user);
            localSave.removeUser();
            appData.user.username = '';
            appData.user.password = '';
            $location.path('/');
        };
        this.save = function () {
            //in ng-repeat need to add track by {uniqueProperty}
            //save needs to edit file
            var toSend = JSON.stringify(self.data);
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
                localSave.saveResource(appData.user, appData.selectedChar, self.data);
            }).error(function (data, status, headers, config) {
                console.log('Post Error"');
                console.log(data);
                console.log(status);
                console.log(headers);
                console.log(config);
            });
        };
    }]);
    resourceAlpha.controller('resourceAppTrueEdit', ['appData', function(appData) {
        this.currentView = 'Read';
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