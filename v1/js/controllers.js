'use strict';

/* Controllers */
var MIN_ABILITY_POINTS = 0;

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

  $http.get('data/objects.json').success(function(data) {
    $scope.objects = data;
  });

  $scope.unselectedCharacters = function() {
    var unselectedChars = [];
    angular.forEach($scope.characters, function(character) {
      var isSelected = false;
      angular.forEach($scope.party.members, function(member) {
        if (member.character == character.name)
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
      angular.forEach($scope.party.members, function(member) {
        if (member.job == job.name)
          isSelected = true;
      });

      if (!isSelected) {
        unselectedJobArray.push(job);
      }
    });
    return unselectedJobArray;
  }

  $scope.computeAttack = function(member) {
    var attack = $scope.getJob(member).attack;
    var character = $scope.getCharacter(member)
    if (typeof character != "undefined")
      if (character.hasOwnProperty("bonus"))
        if(character.bonus.hasOwnProperty("attack"))
          attack += $scope.getCharacter(member).bonus.attack;
    return attack;
  }

  $scope.computeXpPct = function(member) {
    var xp_pct = 100;
    var character = $scope.getCharacter(member)
    if (typeof character != "undefined")
      if (character.hasOwnProperty("bonus"))
        if(character.bonus.hasOwnProperty("xp_pct"))
          xp_pct += $scope.getCharacter(member).bonus.xp_pct;
    return xp_pct;
  }

  $scope.computeHpPct = function(member) {
    var hp_pct = 0;    var character = $scope.getCharacter(member)
    var character = $scope.getCharacter(member)
    if (typeof character != "undefined")
      if (character.hasOwnProperty("bonus"))
        if(character.bonus.hasOwnProperty("hp_pct"))
          hp_pct += $scope.getCharacter(member).bonus.hp_pct;
    return hp_pct;
  }

  $scope.computeMpPct = function(member) {
    var mp_pct = 0;
    var character = $scope.getCharacter(member)
    if (typeof character != "undefined")
      if (character.hasOwnProperty("bonus"))
        if(character.bonus.hasOwnProperty("mp_pct"))
         mp_pct += $scope.getCharacter(member).bonus.mp_pct;
    return mp_pct;
  }

  $scope.computeHp = function(member) {
    var hp = $scope.getJob(member).hp;
    var character = $scope.getCharacter(member)
    if (typeof character != "undefined")
      if (character.hasOwnProperty("bonus"))
        if(character.bonus.hasOwnProperty("hp"))
        hp += $scope.getCharacter(member).bonus.hp;
    var bonus = .01 * $scope.computeHpPct(member) * hp;
    hp += bonus;
    return hp;
  }

  $scope.computeThreat = function(member) {
    var threat = $scope.getJob(member).threat;
    var character = $scope.getCharacter(member)
    if (typeof character != "undefined")
      if (character.hasOwnProperty("bonus"))
        if(character.bonus.hasOwnProperty("threat"))
        threat += $scope.getCharacter(member).bonus.threat;
    return threat;
  }

  $scope.computeMp = function(member) {
    var mp = $scope.getJob(member).mp;
    var character = $scope.getCharacter(member)
    if (typeof character != "undefined")
      if (character.hasOwnProperty("bonus"))
        if(character.bonus.hasOwnProperty("mp"))
        mp += $scope.getCharacter(member).bonus.mp;
    var bonus = .01 * $scope.computeMpPct(member) * mp;
    mp += bonus;
    return mp;
  }

  $scope.computeInitiative = function(member) {
    var initiative = $scope.getJob(member).initiative;
    var character = $scope.getCharacter(member)
    if (typeof character != "undefined")
      if (character.hasOwnProperty("bonus"))
        if(character.bonus.hasOwnProperty("initiative"))
          initiative += $scope.getCharacter(member).bonus.initiative;
    return initiative;
  }

  $scope.computeCriticalPct = function(member) {
    var critical_pct = $scope.getJob(member).critical_pct;
    var character = $scope.getCharacter(member)
    if (typeof character != "undefined")
      if (character.hasOwnProperty("bonus"))
        if(character.bonus.hasOwnProperty("critical_pct"))
        critical_pct += $scope.getCharacter(member).bonus.critical_pct;
    return critical_pct;
  }

  $scope.computeDurationBonus = function(member) {
    var durationBonus = 0;
    var character = $scope.getCharacter(member)
    if (typeof character != "undefined")
      if (character.hasOwnProperty("bonus"))
        if(character.bonus.hasOwnProperty("duration"))
        durationBonus += $scope.getCharacter(member).bonus.duration;
    return durationBonus;
  }

  $scope.getJob = function(member) {
    var job = null;
    try{
      return $scope.jobs[member.job];
    } catch (err) {
    }
    return job;
  }

  $scope.getCharacter = function(member) {
    return $scope.characters[member.character];
  }

  $scope.incrementPointsSpent = function(member,ability) {
    var job = $scope.getJob(member);
    var indexOfAbility = job.abilities.indexOf(ability);
    return member.abilityPoints[indexOfAbility] ++;
  }

  $scope.decrementPointsSpent = function(member,ability) {
    var job = $scope.getJob(member);
    var indexOfAbility = job.abilities.indexOf(ability);
    if (member.abilityPoints[indexOfAbility] > MIN_ABILITY_POINTS)
      member.abilityPoints[indexOfAbility] --;
  }

  $scope.getPointsSpent = function(member,ability) {
    var job = $scope.getJob(member);
    var indexOfAbility = job.abilities.indexOf(ability);
    var abilityPoints = member.abilityPoints[indexOfAbility];
    return abilityPoints;
  }
}
