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

  $http.get('data/objects.json').success(function(data) {
    $scope.objects = data;
  });

  $http.get('data/buffs.json').success(function(data) {
    $scope.buffs = data;
  });

  $scope.validateParty = function(partyJson) {
    var party;
    try {
      $scope.party = angular.fromJson(partyJson);
      if ($scope.party.permanentObjects["Crown"] < 0) {
        throw exception;
      }
    } catch (e) {
      $http.get('data/party.json').success(function(data) {
         $scope.party = data;
         $scope.updateUrl 
      });
    }
  }

  $scope.validateParty($location.search()['party']);

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

    angular.forEach(job.abilities,function(ability) {

      var indexOfAbility = job.abilities.indexOf(ability);
      var abilityPoints = member.abilityPoints[indexOfAbility] - 1;
      if (ability.type == "Passive") {
            var passiveAtk = ability.atk;
            if (passiveAtk > 0) {
              passiveAtk += abilityPoints * ability.step.atk;
              atk+= passiveAtk;
            } 
      }
    });

    angular.forEach(_.keys($scope.party.buffs), function(buffKey) {
      var buff = $scope.buffs[buffKey];
      var buffValue = $scope.party.buffs[buffKey];
      var buffOption = buff.options[buffValue];
      if (typeof buffOption != "undefined")
        if (buffOption.hasOwnProperty("effect"))
          if(buffOption.effect.hasOwnProperty("atk"))
            atk += buffOption.effect.atk;
    });
    angular.forEach(_.keys($scope.party.permanentObjects), function(objectKey) {
      var objectValue = $scope.party.permanentObjects[objectKey];
      if (objectValue > 0) {
        var object = $scope.objects[objectKey];
        if (typeof object != "undefined")
          if (object.hasOwnProperty("effect"))
            if(object.effect.hasOwnProperty("atk"))
              atk += object.effect.atk;
      }
    });
    angular.forEach(_.keys($scope.party.temporaryObjects), function(objectKey) {
      var objectValue = $scope.party.temporaryObjects[objectKey];
      if (objectValue > 0) {
        var object = $scope.objects[objectKey];
        if (typeof object != "undefined")
          if (object.hasOwnProperty("effect"))
            if(object.effect.hasOwnProperty("atk"))
              atk += object.effect.atk;
      }
    });
    return atk;
  }

  $scope.computeXpPct = function(member) {
    var xp_pct = 100;
    var character = $scope.getCharacter(member)
    if (typeof character != "undefined")
      if (character.hasOwnProperty("bonus"))
        if(character.bonus.hasOwnProperty("xp_pct"))
          xp_pct += $scope.getCharacter(member).bonus.xp_pct;

    angular.forEach(_.keys($scope.party.buffs), function(buffKey) {
      var buff = $scope.buffs[buffKey];
      var buffValue = $scope.party.buffs[buffKey];
      var buffOption = buff.options[buffValue];
      if (typeof buffOption != "undefined")
        if (buffOption.hasOwnProperty("effect"))
          if(buffOption.effect.hasOwnProperty("xp_pct"))
            xp_pct += buffOption.effect.xp_pct;
    });
    angular.forEach(_.keys($scope.party.permanentObjects), function(objectKey) {
      var objectValue = $scope.party.permanentObjects[objectKey];
      if (objectValue > 0) {
        var object = $scope.objects[objectKey];
        if (typeof object != "undefined")
          if (object.hasOwnProperty("effect"))
            if(object.effect.hasOwnProperty("xp_pct"))
              xp_pct += object.effect.xp_pct;
      }
    });
    angular.forEach(_.keys($scope.party.temporaryObjects), function(objectKey) {
      var objectValue = $scope.party.temporaryObjects[objectKey];
      if (objectValue > 0) {
        var object = $scope.objects[objectKey];
        if (typeof object != "undefined")
          if (object.hasOwnProperty("effect"))
            if(object.effect.hasOwnProperty("xp_pct"))
              xp_pct += object.effect.xp_pct;
      }
    });

    return xp_pct;
  }

  $scope.computeHpPct = function(member) {
    var hp_pct = 0;    var character = $scope.getCharacter(member)
    var character = $scope.getCharacter(member)
    if (typeof character != "undefined")
      if (character.hasOwnProperty("bonus"))
        if(character.bonus.hasOwnProperty("hp_pct"))
          hp_pct += $scope.getCharacter(member).bonus.hp_pct;


    angular.forEach(_.keys($scope.party.buffs), function(buffKey) {
      var buff = $scope.buffs[buffKey];
      var buffValue = $scope.party.buffs[buffKey];
      var buffOption = buff.options[buffValue];
      if (typeof buffOption != "undefined")
        if (buffOption.hasOwnProperty("effect"))
          if(buffOption.effect.hasOwnProperty("hp_pct"))
            hp_pct += buffOption.effect.hp_pct;
    });
    angular.forEach(_.keys($scope.party.permanentObjects), function(objectKey) {
      var objectValue = $scope.party.permanentObjects[objectKey];
      if (objectValue > 0) {
        var object = $scope.objects[objectKey];
        if (typeof object != "undefined")
          if (object.hasOwnProperty("effect"))
            if(object.effect.hasOwnProperty("hp_pct"))
              hp_pct += object.effect.hp_pct;
      }
    });
    angular.forEach(_.keys($scope.party.temporaryObjects), function(objectKey) {
      var objectValue = $scope.party.temporaryObjects[objectKey];
      if (objectValue > 0) {
        var object = $scope.objects[objectKey];
        if (typeof object != "undefined")
          if (object.hasOwnProperty("effect"))
            if(object.effect.hasOwnProperty("hp_pct"))
              hp_pct += object.effect.hp_pct;
      }
    });

    return hp_pct;
  }

  $scope.computeMpPct = function(member) {
    var mp_pct = 0;
    var character = $scope.getCharacter(member)
    if (typeof character != "undefined")
      if (character.hasOwnProperty("bonus"))
        if(character.bonus.hasOwnProperty("mp_pct"))
         mp_pct += $scope.getCharacter(member).bonus.mp_pct;

    angular.forEach(_.keys($scope.party.buffs), function(buffKey) {
      var buff = $scope.buffs[buffKey];
      var buffValue = $scope.party.buffs[buffKey];
      var buffOption = buff.options[buffValue];
      if (typeof buffOption != "undefined")
        if (buffOption.hasOwnProperty("effect"))
          if(buffOption.effect.hasOwnProperty("mp_pct"))
            mp_pct += buffOption.effect.mp_pct;
    });
    angular.forEach(_.keys($scope.party.permanentObjects), function(objectKey) {
      var objectValue = $scope.party.permanentObjects[objectKey];
      if (objectValue > 0) {
        var object = $scope.objects[objectKey];
        if (typeof object != "undefined")
          if (object.hasOwnProperty("effect"))
            if(object.effect.hasOwnProperty("mp_pct"))
              mp_pct += object.effect.mp_pct;
      }
    });
    angular.forEach(_.keys($scope.party.temporaryObjects), function(objectKey) {
      var objectValue = $scope.party.temporaryObjects[objectKey];
      if (objectValue > 0) {
        var object = $scope.objects[objectKey];
        if (typeof object != "undefined")
          if (object.hasOwnProperty("effect"))
            if(object.effect.hasOwnProperty("mp_pct"))
              mp_pct += object.effect.mp_pct;
      }
    });
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

    angular.forEach(job.abilities,function(ability) {
      var indexOfAbility = job.abilities.indexOf(ability);
      var abilityPoints = member.abilityPoints[indexOfAbility] - 1;
      if (ability.type == "Passive") {
            var passiveHp = ability.hp;
            if (passiveHp > 0) {
              passiveHp += abilityPoints * ability.step.hp;
              hp+= passiveHp;
            } 
      }
    });

    angular.forEach(_.keys($scope.party.buffs), function(buffKey) {
      var buff = $scope.buffs[buffKey];
      var buffValue = $scope.party.buffs[buffKey];
      var buffOption = buff.options[buffValue];
      if (typeof buffOption != "undefined")
        if (buffOption.hasOwnProperty("effect"))
          if(buffOption.effect.hasOwnProperty("hp"))
            hp += buffOption.effect.hp;
    });
    angular.forEach(_.keys($scope.party.permanentObjects), function(objectKey) {
      var objectValue = $scope.party.permanentObjects[objectKey];
      if (objectValue > 0) {
        var object = $scope.objects[objectKey];
        if (typeof object != "undefined")
          if (object.hasOwnProperty("effect"))
            if(object.effect.hasOwnProperty("hp"))
              hp += object.effect.hp;
      }
    });
    angular.forEach(_.keys($scope.party.temporaryObjects), function(objectKey) {
      var objectValue = $scope.party.temporaryObjects[objectKey];
      if (objectValue > 0) {
        var object = $scope.objects[objectKey];
        if (typeof object != "undefined")
          if (object.hasOwnProperty("effect"))
            if(object.effect.hasOwnProperty("hp"))
              hp += object.effect.hp;
      }
    });

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

    var job = $scope.getJob(member);
    angular.forEach(job.abilities,function(ability) {
      var indexOfAbility = job.abilities.indexOf(ability);
      var abilityPoints = member.abilityPoints[indexOfAbility] - 1;
      if (ability.type == "Passive") {
            var passiveThreat = ability.threat;
            if (passiveThreat > 0) {
              passiveThreat += abilityPoints * ability.step.threat;
              threat+= passiveThreat;
            } 
      }
    });
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

    angular.forEach(job.abilities,function(ability) {
      var indexOfAbility = job.abilities.indexOf(ability);
      var abilityPoints = member.abilityPoints[indexOfAbility] - 1;
      if (ability.type == "Passive") {
            var passiveMp = ability.magic;
            if (passiveMp > 0) {
              passiveMp += abilityPoints * ability.step.magic;
              mp+= passiveMp;
            } 
      }
    });

    angular.forEach(_.keys($scope.party.buffs), function(buffKey) {
      var buff = $scope.buffs[buffKey];
      var buffValue = $scope.party.buffs[buffKey];
      var buffOption = buff.options[buffValue];
      if (typeof buffOption != "undefined")
        if (buffOption.hasOwnProperty("effect"))
          if(buffOption.effect.hasOwnProperty("mp"))
            mp += buffOption.effect.mp;
    });
    angular.forEach(_.keys($scope.party.permanentObjects), function(objectKey) {
      var objectValue = $scope.party.permanentObjects[objectKey];
      if (objectValue > 0) {
        var object = $scope.objects[objectKey];
        if (typeof object != "undefined")
          if (object.hasOwnProperty("effect"))
            if(object.effect.hasOwnProperty("mp"))
              mp += object.effect.mp;
      }
    });
    angular.forEach(_.keys($scope.party.temporaryObjects), function(objectKey) {
      var objectValue = $scope.party.temporaryObjects[objectKey];
      if (objectValue > 0) {
        var object = $scope.objects[objectKey];
        if (typeof object != "undefined")
          if (object.hasOwnProperty("effect"))
            if(object.effect.hasOwnProperty("mp"))
              mp += object.effect.mp;
      }
    });
    var bonus = .01 * $scope.computeMpPct(member) * mp;
    mp += bonus;
    return mp;
  }

  $scope.computeInitiative = function(member) {
    var job = $scope.getJob(member);
    var initiative = $scope.getJob(member).initiative;
    var character = $scope.getCharacter(member)
    if (typeof character != "undefined")
      if (character.hasOwnProperty("bonus"))
        if(character.bonus.hasOwnProperty("initiative"))
          initiative += $scope.getCharacter(member).bonus.initiative;

    var job = $scope.getJob(member);
    angular.forEach(job.abilities,function(ability) {
      var indexOfAbility = job.abilities.indexOf(ability);
      var abilityPoints = member.abilityPoints[indexOfAbility] - 1;
      if (ability.type == "Passive") {
            var passiveInitiative = ability.initiative;
            if ((passiveInitiative > 0)||(passiveInitiative < 0)) {
              passiveInitiative += abilityPoints * ability.step.initiative;
              initiative+= passiveInitiative;
            } 
      }
    });

    return initiative;
  }

  $scope.computeCriticalPct = function(member) {
    var critical_pct = $scope.getJob(member).critical_pct;
    var character = $scope.getCharacter(member)
    if (typeof character != "undefined")
      if (character.hasOwnProperty("bonus"))
        if(character.bonus.hasOwnProperty("critical_pct"))
        critical_pct += character.bonus.critical_pct;

    var job = $scope.getJob(member);
    angular.forEach(job.abilities,function(ability) {
      var indexOfAbility = job.abilities.indexOf(ability);
      var abilityPoints = member.abilityPoints[indexOfAbility] - 1;
      if (ability.type == "Passive") {
            var passiveCriticalPct = ability.critical_pct;
            if (passiveCriticalPct > 0) {
              passiveCriticalPct += abilityPoints * ability.step.critical_pct;
              critical_pct+= passiveCriticalPct;
            } 
      }
    });


    angular.forEach(_.keys($scope.party.buffs), function(buffKey) {
      var buff = $scope.buffs[buffKey];
      var buffValue = $scope.party.buffs[buffKey];
      var buffOption = buff.options[buffValue];
      if (typeof buffOption != "undefined")
        if (buffOption.hasOwnProperty("effect"))
          if(buffOption.effect.hasOwnProperty("critical_pct"))
            critical_pct += buffOption.effect.critical_pct;
    });
    angular.forEach(_.keys($scope.party.permanentObjects), function(objectKey) {
      var objectValue = $scope.party.permanentObjects[objectKey];
      if (objectValue > 0) {
        var object = $scope.objects[objectKey];
        if (typeof object != "undefined")
          if (object.hasOwnProperty("effect"))
            if(object.effect.hasOwnProperty("critical_pct"))
              critical_pct += object.effect.critical_pct;
      }
    });
    angular.forEach(_.keys($scope.party.temporaryObjects), function(objectKey) {
      var objectValue = $scope.party.temporaryObjects[objectKey];
      if (objectValue > 0) {
        var object = $scope.objects[objectKey];
        if (typeof object != "undefined")
          if (object.hasOwnProperty("effect"))
            if(object.effect.hasOwnProperty("critical_pct"))
              critical_pct += object.effect.critical_pct;
      }
    });

    return critical_pct;
  }

  $scope.computeDurationBonus = function(member) {
    var durationBonus = 0;
    var character = $scope.getCharacter(member)
    if (typeof character != "undefined")
      if (character.hasOwnProperty("bonus"))
        if(character.bonus.hasOwnProperty("duration"))
        durationBonus += character.bonus.duration;

    angular.forEach(_.keys($scope.party.buffs), function(buffKey) {
      var buff = $scope.buffs[buffKey];
      var buffValue = $scope.party.buffs[buffKey];
      var buffOption = buff.options[buffValue];
      if (typeof buffOption != "undefined")
        if (buffOption.hasOwnProperty("effect"))
          if(buffOption.effect.hasOwnProperty("duration"))
            duration += buffOption.effect.duration;
    });
    angular.forEach(_.keys($scope.party.permanentObjects), function(objectKey) {
      var objectValue = $scope.party.permanentObjects[objectKey];
      if (objectValue > 0) {
        var object = $scope.objects[objectKey];
        if (typeof object != "undefined")
          if (object.hasOwnProperty("effect"))
            if(object.effect.hasOwnProperty("duration"))
              duration += object.effect.duration;
      }
    });
    angular.forEach(_.keys($scope.party.temporaryObjects), function(objectKey) {
      var objectValue = $scope.party.temporaryObjects[objectKey];
      if (objectValue > 0) {
        var object = $scope.objects[objectKey];
        if (typeof object != "undefined")
          if (object.hasOwnProperty("effect"))
            if(object.effect.hasOwnProperty("duration"))
              duration += object.effect.duration;
      }
    });
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
    var abilityPoints = $scope.getPointsSpent(member,ability) - 1;
    var tooltip = ability.type;
    if (abilityPoints >= 0) {
      var tooltipAddition = [];

      var mp = ability.mp;
      if (mp > 0) {
        mp += abilityPoints * ability.step.mp;
        tooltipAddition.push("cost: " + mp);
      } 

      var damage = ability.damage;
      if (damage > 0) {
        damage += abilityPoints * ability.step.damage;
        tooltipAddition.push("damage: " + damage);
      } 

      var heal = ability.heal;
      if (heal > 0) {
        heal += abilityPoints * ability.step.heal;
        tooltipAddition.push("heal: " + heal);
      } 

      var hp = ability.hp;
      if (hp > 0) {
        hp += abilityPoints * ability.step.hp;
        tooltipAddition.push("hp: " + hp);
      } 

      var damage_reduction_pct = ability.damage_reduction_pct;
      if (damage_reduction_pct > 0) {
        damage_reduction_pct += abilityPoints * ability.step.damage_reduction_pct;
        tooltipAddition.push("dmg reduction %: " + damage_reduction_pct);
      } 

      var duration = ability.duration;
      if (duration > 0) {
        duration += $scope.computeDurationBonus(member);
        duration += abilityPoints * ability.step.duration;
        tooltipAddition.push("duration: " + duration);
      } 

      var atk = ability.atk;
      if ((atk > 0)||(atk < 0)) {
        atk += abilityPoints * ability.step.atk;
        tooltipAddition.push("atk: " + atk);
      } 

      var initiative = ability.initiative;
      if ((initiative > 0)||(initiative < 0)) {
        initiative += abilityPoints * ability.step.initiative;
        tooltipAddition.push("initiative: " + initiative);
      } 

      var threat = ability.threat;
      if ((threat > 0)||(threat < 0)) {
        threat += abilityPoints * ability.step.threat;
        tooltipAddition.push("threat: " + threat);
      } 

      var crit_pct = ability.critical_pct;
      if (crit_pct > 0) {
        crit_pct += abilityPoints * ability.step.critical_pct;
        tooltipAddition.push("crit %: " + crit_pct);
      }

      var hp_steal_pct = ability.hp_steal_pct;
      if (hp_steal_pct > 0) {
        hp_steal_pct += abilityPoints * ability.step.hp_steal_pct;
        tooltipAddition.push("hp steal %: " + hp_steal_pct);
      } 

      var mp_steal_pct = ability.mp_steal_pct;
      if (mp_steal_pct > 0) {
        hp_steal_pct += abilityPoints * ability.step.mp_steal_pct;
        tooltipAddition.push("mp steal %: " + mp_steal_pct);
      } 

      var bonus_dmg_pct = ability.bonus_dmg_pct;
      if (bonus_dmg_pct > 0) {
        bonus_dmg_pct += abilityPoints * ability.step.bonus_dmg_pct;
        tooltipAddition.push("bonus dmg %: " + bonus_dmg_pct);
      } 

      var hp_regen = ability.hp_regen;
      if (hp_regen > 0) {
        hp_regen += abilityPoints * ability.step.hp_regen;
        tooltipAddition.push("hp regen: " + hp_regen);
      } 

      var mp_recover = ability.mp_recover;
      if (mp_recover > 0) {
        mp_recover += abilityPoints * ability.step.mp_recover;
        tooltipAddition.push("mp recovered: " + mp_recover);
      } 

      var damage_reduction_pct = ability.damage_reduction_pct;
      if (damage_reduction_pct > 0) {
        damage_reduction_pct += abilityPoints * ability.step.damage_reduction_pct;
        tooltipAddition.push("dmg reduction %: " + damage_reduction_pct);
      } 

      var bleed_pct = ability.bleed_pct;
      if (bleed_pct > 0) {
        bleed_pct += abilityPoints * ability.step.bleed_pct;
        tooltipAddition.push("bleed %: " + bleed_pct);
      } 

      var damage_pct = ability.damage_pct;
      if (damage_pct > 0) {
        damage_pct += abilityPoints * ability.step.damage_pct;
        tooltipAddition.push("damage %: " + damage_pct);
      } 

      var magic = ability.magic;
      if (magic > 0) {
        magic += abilityPoints * ability.step.magic;
        tooltipAddition.push("magic: " + magic);
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

  $scope.getObjectString = function(key) {
    return "party.objects."+key;
  }

  $scope.getObjectTooltip = function(objectKey) {
    //alert (angular.toJson($scope.objects[objectKey]));
    var object = $scope.objects[objectKey];
    return object.effect.description + " (" +object.type + ", " + object.cost + " gold)";
  }

  $scope.$watch('party',function() {
    if ($scope.party != null)
      $location.search({"party":angular.toJson($scope.party)});
  }, true);

  $scope.reset= function() {

  }
}
