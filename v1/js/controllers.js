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

  $http.get('data/buffs.json').success(function(data) {
    $scope.buffs = data;
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
    var job = $scope.getJob(member);
    var atk = job.atk;
    var character = $scope.getCharacter(member)
    if (typeof character != "undefined")
      if (character.hasOwnProperty("bonus"))
        if(character.bonus.hasOwnProperty("atk"))
          atk += $scope.getCharacter(member).bonus.atk;
    atk += ($scope.computeLevel(member) - 1) * job.step.atk;
    return atk;
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
    var job = $scope.getJob(member);
    var hp = job.hp;
    var character = $scope.getCharacter(member)
    if (typeof character != "undefined")
      if (character.hasOwnProperty("bonus"))
        if(character.bonus.hasOwnProperty("hp"))
        hp += $scope.getCharacter(member).bonus.hp;
    hp += ($scope.computeLevel(member) - 1) * job.step.hp;
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
    var job = $scope.getJob(member);
    var mp = job.mp;
    var character = $scope.getCharacter(member)
    if (typeof character != "undefined")
      if (character.hasOwnProperty("bonus"))
        if(character.bonus.hasOwnProperty("mp"))
        mp += $scope.getCharacter(member).bonus.mp;
    mp += ($scope.computeLevel(member) - 1) * job.step.mp;
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

  $scope.computeLevel = function(member) {
    var min_level_required = 1;
    angular.forEach(member.abilityPoints, function(abilityPoint) {
      min_level_required += abilityPoint;
    });
    return min_level_required;
  }

  $scope.getBuff = function(key) {
    var buff_return = null;
    angular.forEach($scope.buffs, function(buff) {
      if (buff.key == key) {
        buff_return = buff;
      }
    });
    return buff_return;
  }

  $scope.getAbilityTooltip = function(member,ability) {
    var abilityPoints = $scope.getPointsSpent(member,ability);
    var tooltip = ability.type;
    if (abilityPoints > 0) {
      var tooltipAddition = [];
      var mp = ability.mp;
      if (mp > 0) {
        mp += abilityPoints * ability.step.mp;
        tooltipAddition.push("cost: " + mp);
      } 

      var heal = ability.heal;
      if (heal > 0) {
        heal += abilityPoints * ability.step.heal;
        tooltip += "heal: " + heal +" ";
      } 

      var damage = ability.damage;
      if (damage > 0) {
        damage += abilityPoints * ability.step.damage;
        tooltipAddition.push("damage: " + damage)
      } 

      var atk = ability.atk;
      if (atk > 0) {
        atk += abilityPoints * ability.step.atk;
        tooltipAddition.push("atk: " + atk);
      } 

      var threat = ability.threat;
      if (threat > 0) {
        threat += abilityPoints * ability.step.threat;
        tooltipAddition.push("threat: " + threat);
      } 

      var crit_pct = ability.critical_pct;
      if (crit_pct > 0) {
        crit_pct += abilityPoints * ability.step.critical_pct;
        tooltipAddition.push("crit%: " + crit_pct);
      }

      var hp_steal_pct = ability.hp_steal_pct;
      if (hp_steal_pct > 0) {
        hp_steal_pct += abilityPoints * ability.step.hp_steal_pct;
        tooltipAddition.push("hp steal%: " + hp_steal_pct);
      } 

      var hp_regen = ability.hp_regen;
      if (hp_regen > 0) {
        hp_regen += abilityPoints * ability.step.hp_regen;
        tooltipAddition.push("hp regen: " + hp_regen);
      } 
      tooltip += " (" + tooltipAddition.join(", ") + ")"; 
    } 
    return tooltip;
  }

  $scope.getAbilityTooltipObject = function(member,ability) {
    var abilityPoints = $scope.getPointsSpent(member,ability);
    var tooltip = ability.description + " ("+ abilityPoints+")";
    if (abilityPoints > 0) {
      tooltip += "<br/>";
      var mp = ability.mp;
      if (typeof mp != "undefined") {
        mp += abilityPoints * ability.step.mp;
        tooltip += "cost: " + ability.mp;
      }
    } 
    var title = ability.name;
    return {title: title, content: tooltip}
  }

  $scope.dynamicPopover = "Hello, World!";
  $scope.dynamicPopoverText = "dynamic";
  $scope.dynamicPopoverTitle = "Title";
}
