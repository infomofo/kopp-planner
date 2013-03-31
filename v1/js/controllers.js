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
    if (member.character.hasOwnProperty("bonus"))
      if(member.character.bonus.hasOwnProperty("attack"))
        attack += member.character.bonus.attack;
    return attack;
  }

  $scope.computeXpPct = function(member) {
    var xp_pct = 100;
    if (member.character.hasOwnProperty("bonus"))
      if(member.character.bonus.hasOwnProperty("xp_pct"))
        xp_pct += member.character.bonus.xp_pct;
    return xp_pct;
  }

  $scope.computeHpPct = function(member) {
    var hp_pct = 0;
    if (member.character.hasOwnProperty("bonus"))
      if(member.character.bonus.hasOwnProperty("hp_pct"))
        hp_pct += member.character.bonus.hp_pct;
    return hp_pct;
  }

  $scope.computeMpPct = function(member) {
    var mp_pct = 0;
    if (member.character.hasOwnProperty("bonus"))
      if(member.character.bonus.hasOwnProperty("mp_pct"))
        mp_pct += member.character.bonus.mp_pct;
    return mp_pct;
  }

  $scope.computeHp = function(member) {
    var hp = member.job.hp;
    if (member.character.hasOwnProperty("bonus"))
      if(member.character.bonus.hasOwnProperty("hp"))
        hp += member.character.bonus.hp;
    var bonus = .01 * $scope.computeHpPct(member) * hp;
    hp += bonus;
    return hp;
  }

  $scope.computeThreat = function(member) {
    var threat = member.job.threat;
    if (member.character.hasOwnProperty("bonus"))
      if(member.character.bonus.hasOwnProperty("threat"))
        threat += member.character.bonus.threat;
    return threat;
  }

  $scope.computeMp = function(member) {
    var mp = member.job.mp;
    if (member.character.hasOwnProperty("bonus"))
      if(member.character.bonus.hasOwnProperty("mp"))
        mp += member.character.bonus.mp;
    var bonus = .01 * $scope.computeMpPct(member) * mp;
    mp += bonus;
    return mp;
  }

  $scope.computeInitiative = function(member) {
    var initiative = member.job.initiative;
    if (member.character.hasOwnProperty("bonus"))
      if(member.character.bonus.hasOwnProperty("initiative"))
        initiative += member.character.bonus.initiative;
    return initiative;
  }

  $scope.computeCriticalPct = function(member) {
    var critical_pct = member.job.critical_pct;
    if (member.character.hasOwnProperty("bonus"))
      if(member.character.bonus.hasOwnProperty("critical_pct"))
        critical_pct += member.character.bonus.critical_pct;
    return critical_pct;
  }
}
