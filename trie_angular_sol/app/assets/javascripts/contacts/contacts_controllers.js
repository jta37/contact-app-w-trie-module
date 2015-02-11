(function () {
  "use strict";

  var ContactsCtrls = angular.module("ContactsCtrls", []);

  ContactsCtrls.controller("ContactsCtrl", ["$scope", "$http", "Contacts", "Trie",
   function ($scope, $http, Contacts, Trie) {
    // define contacts
    $scope.contacts = [];
    console.log(Trie)

    $scope.contactNames = new Trie();

    // get all contacts
    Contacts.all().
      error(function () {
        console.log(arguments);
      }).
      success(function (data) {
        console.log(data)
        $scope.contacts = data;
        for (var i = 0; i < $scope.contacts.length; i+=1) {
          $scope.contactNames.learn($scope.contacts[i].name);
        };
      });

    // create a contact
    $scope.createContact = function () {
      // Contacts => api
      // api.create
      // api.update
      // api.delete
      // api.all
      Contacts.create($scope.newContact).
        error(function () {
          $scope.formError = true;
        }).
        success(function (data) {
          $scope.contacts.push(data);
          $scope.contactNames.learn(data.name);
          $scope.newContact = {};
        });
    };

    $scope.delete = function () {
      var contact = this.contact;
      var that = this;
      Contacts.delete(contact).
        error(function () {
          console.log(arguments);
        }). 
        success(function () {
          $scope.contacts.splice(that.$index, 1);
          $scope.contactNames.find(contact.name).isWord = false;
        });
    };

    $scope.edit = function () {
      this.editing = true;
    };

    $scope.updateContact = function () {
      var contact = this.contact;
      var that = this;
      $http.patch("/contacts/" + contact.id + ".json",{contact: contact}).
        error(function () {
          $scope.formError = true;
        }).
        success(function (data) {
          that.editing = false;
        });
    };

    $scope.getSuggestions = function () {
      $scope.searchResults = $scope.contactNames.autoComplete($scope.searchName);
    };

    $scope.findContact = function () {
      var name = this.name;
      for (var i = 0; i < $scope.contacts.length; i++) {
        if ($scope.contacts[i].name === name) {
          $scope.foundContact = $scope.contacts[i];
          return undefined;
        }
      };
    };


  }]);
})();