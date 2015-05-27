 var resourceAlpha = angular.module('resourceApp', ["ngRoute","mobile-angular-ui"]);

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

 resourceAlpha.run(function($location, $http, appData, localSave) {
     var userToAssign = localSave.getUser();
     var charToAssign = localSave.getCurrChar();
     var listToAssign;
     var resourceToAssign;

     //Add getting Meta (and Saving Below!)
     if (userToAssign !== null && charToAssign !== null) {
         appData.user = userToAssign;
         appData.selectedChar = charToAssign;
         appData.charList = localSave.getCharList(appData.user);
         resourceToAssign = localSave.getMeta(appData.user, appData.selectedChar);
         if (resourceToAssign !== false)
             appData.resources = localSave.getResource(appData.user, appData.selectedChar);
         $location.path('/resourceList');
     }
     else if(userToAssign !== null) {
         appData.user = userToAssign;
         listToAssign = localSave.getCharList(appData.user);
         if (listToAssign !== null) {
             appData.charList = listToAssign;
         }
         $location.path('/characterSelect');
     }
 });