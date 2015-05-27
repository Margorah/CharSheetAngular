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
        localStorage.setItem('charList' + currentUser.username, JSON.stringify(listToSave));
    };

    localSave.getCharList = function(currentUser) {
        var toParse = localStorage.getItem('charList' + currentUser.username);
        if (toParse === null)
            return null;
        return JSON.parse(toParse);
    };

    localSave.removeCharList = function(currentUser) {
        localStorage.removeItem('charList' + currentUser.username);
    };

    localSave.saveMeta = function(currentUser, currentChar) {
        localStorage.setItem(currentUser.username + currentChar.url + 'Meta', JSON.stringify(this.metaData));
    };

    localSave.getMeta = function(currentUser, currentChar) {
        var toParse = localStorage.getItem(currentUser.username + currentChar.url + 'Meta');
        if (toParse == null)
            return false;
        else {
            localSave.metaData = JSON.parse(toParse);
            return true;
        }
    };

    localSave.removeMeta = function(currentUser, currentChar) {
        localStorage.removeItem(currentUser.username + currentChar.url + 'Meta');
    };

    localSave.getResource = function(currentUser, currentChar) {
        var objectToReturn = [];

        localSave.metaData.arrayMap.forEach(function(element) {
            objectToReturn.push(JSON.parse(localStorage.getItem(element)));
        });

        return objectToReturn;
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
        //index will remove full array if true
        var itemString = currentUser.username + currentChar.url + 'Meta';

        if (index === true) {
            localSave.metaData.arrayMap.forEach(function(element) {
                localStorage.removeItem(element);
            });
            localStorage.removeItem(itemString);
            localSave.metaData.savedOn = '';
            localSave.metaData.arrayMap = [];
        }
        else {
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