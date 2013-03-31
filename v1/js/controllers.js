'use strict';

/* Controllers */
var MAX_LV = 30;
var MIN_LV = 0;

function PartyController($scope, $http, $location) {
 $http.get('data/characters.json').success(function(data) {
    $scope.characters = data;
  });

  $http.get('data/jobs.json').success(function(data) {
    $scope.jobs = data;
  });

  $http.get('data/party.json').success(function(data) {
    $scope.party = data;
  });

  $scope.unselectedCharacters = function() {
    var unselectedChars = [];
    angular.forEach($scope.characters, function(character) {
      var isSelected = false;
      angular.forEach($scope.party, function(member) {
        if (member.character.name == character.name)
          isSelected = true;
      });

      if (!isSelected) {
        unselectedChars.push(character);
      }
    });
    return unselectedChars;
  }

  $scope.unselectedJobs = function() {
    var unselectedJobArray = [];
    angular.forEach($scope.jobs, function(job) {
      var isSelected = false;
      angular.forEach($scope.party, function(member) {
        if (member.job.name == job.name)
          isSelected = true;
      });

      if (!isSelected) {
        unselectedJobArray.push(job);
      }
    });
    return unselectedJobArray;
  }

  $scope.computeAttack = function(member) {
    var attack = member.job.attack;
    attack += member.character.bonus.attack;
    return attack;
  }
}
