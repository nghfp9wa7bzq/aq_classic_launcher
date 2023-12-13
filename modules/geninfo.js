// this gets loaded in the index.html
//const { ipcRenderer, session } = require("electron");

function generateInfo(charDetails) {
  response = "";
  response += "<p><b>Name: </b>" + charDetails["name"] + "</p>";
  response += "<p><b>Class: </b>" + charDetails["class"] + "</p>";
  response += "<p><b>Subrace: </b>" + charDetails["subrace"] + "</p>";
  response += "<p><b>Clan: </b>" + charDetails["clan"] + "</p>";
  response += "<p><b>Level: </b>" + charDetails["level"] + "</p>";
  response += "<p><b>Exp: </b>" + charDetails["exp"] + "</p>";
  response += "<p><b>Gold: </b>" + charDetails["gold"] + "</p>";
  response += "<p><b>Account Type: </b>" + charDetails["type"] + "</p>";

  var charLevel = charDetails["level"];
  var goldCap =
    (Math["pow"](1.055, charLevel) +
      8 +
      Math["pow"](1.055, Math["floor"](Math["pow"](charLevel, 1.085)))) *
    450;
  if (charDetails["type"] === "X-Guardian") {
    goldCap *= 1.1;
  }
  goldCap = Math["round"](goldCap);
  var expCap = Math["round"](goldCap * 3);
  var expCapPercent =
    Math["floor"]((charDetails["dailyExp"] / expCap) * 10000) / 100;
  var goldCapPercent =
    Math["floor"]((charDetails["dailyGold"] / goldCap) * 10000) / 100;
  response +=
    "<p><b>Daily Exp: </b>" +
    charDetails["dailyExp"] +
    " (" +
    expCapPercent +
    "%)</p>";
  response +=
    "<p><b>Daily Gold: </b>" +
    charDetails["dailyGold"] +
    " (" +
    goldCapPercent +
    "%)</p>";

  var charClasses = charDetails["classes"];
  response += "<hr />";
  response += "<h2><b>Subrace Levels</b></h2>";
  var vampireLevel = parseInt(charClasses["charAt"](5), 36);
  var werewolfLevel = parseInt(charClasses["charAt"](6), 36);
  var dracopyreLevel = parseInt(charClasses["charAt"](33), 36);
  var werepyreLevel = parseInt(charClasses["charAt"](32), 36);
  var dracoType = "";
  if (dracopyreLevel >= 1 && dracopyreLevel <= 11) {
    dracoType = " (GraceFang)";
    dracopyreLevel = dracopyreLevel - 1;
  } else {
    if (dracopyreLevel >= 12 && dracopyreLevel <= 22) {
      dracoType = " (NightReign)";
      dracopyreLevel = dracopyreLevel - 12;
    }
  }
  var _0x49cfx22 = parseInt(charClasses["charAt"](36), 36);
  var nekoLevel = _0x49cfx22 % 16;
  response +=
    "<p><b>Vampire: </b>" +
    (vampireLevel > 10 ? "10 (Advanced)" : vampireLevel) +
    "</p>";
  response +=
    "<p><b>Werewolf: </b>" +
    (werewolfLevel > 10 ? "10 (Advanced)" : werewolfLevel) +
    "</p>";
  response +=
    "<p><b>Neko: </b>" +
    (nekoLevel > 10 ? "10" : nekoLevel) +
    (_0x49cfx22 > 0 ? (_0x49cfx22 >= 16 ? " (Luna)" : " (Sol)") : "") +
    (nekoLevel > 10 ? " (Advanced)" : "") +
    "</p>";
  response +=
    "<p><b>Werepyre: </b>" +
    (werepyreLevel > 10 ? "10 (Advanced)" : werepyreLevel) +
    "</p>";
  response +=
    "<p><b>Dracopyre: </b>" +
    dracopyreLevel +
    (dracopyreLevel > 0 ? dracoType : "") +
    "</p>";

  response += "<hr />";
  response += "<h2><b>Class Levels</b></h2>";
  var AQClasses = [
    ["17", "Dracomancer"],
    ["2", "Dragon Slayer"],
    ["4", "ShadowSlayer/NightHunter"],
    ["8", "Fighter"],
    ["15", "Knight"],
    ["10", "Paladin"],
    ["9", "Necromancer"],
    ["16", "Wizard"],
    ["3", "Mage"],
    ["14", "Rogue"],
    ["12", "Ninja"],
    ["30", "Assassin"],
    ["11", "Beastmaster"],
    ["19", "Berserker"],
    ["20", "Pirate"],
    ["21", "Scholar"],
    ["22", "Martial Artist"],
  ];
  for (var i = 0; i < AQClasses["length"]; i++) {
    var AQClass = AQClasses[i][0];
    if (AQClass == 4) {
      var classLevel = parseInt(charClasses["charAt"](AQClass), 36);
      var classLevelText = classLevel
        ? classLevel <= 10
          ? " (ShadowSlayer)"
          : " (NightHunter)"
        : "";
      classLevel = classLevel ? ((classLevel - 1) % 10) + 1 : 0;
      response +=
        "<p><b>" +
        AQClasses[i][1] +
        ": </b>" +
        classLevel +
        classLevelText +
        "</p>";
    } else {
      if (AQClass == 30) {
        var classLevelTwo = parseInt(charClasses["charAt"](AQClass), 36);
        classLevelTwo = classLevelTwo > 10 ? 10 : classLevelTwo;
        response +=
          "<p><b>" + AQClasses[i][1] + ": </b>" + classLevelTwo + "</p>";
      } else {
        if (AQClass == 15) {
          var classLevelThree = parseInt(charClasses["charAt"](35), 36) % 5;
          var knightFaction = [
            "Training",
            "Rennd",
            "Granemor",
            "Deren",
            "Stormfallen",
          ];
          var knightText = " (" + knightFaction[classLevelThree] + ")";
          response +=
            "<p><b>" +
            AQClasses[i][1] +
            ": </b>" +
            parseInt(charClasses["charAt"](AQClass), 36) +
            (parseInt(charClasses["charAt"](AQClass), 36) >= 6 &&
            classLevelThree > 0
              ? knightText
              : "") +
            "</p>";
        } else {
          response +=
            "<p><b>" +
            AQClasses[i][1] +
            ": </b>" +
            parseInt(charClasses["charAt"](AQClass), 36) +
            "</p>";
        }
      }
    }
  }

  if (
    charDetails["extra"] &&
    charDetails["race"] != "None" &&
    charDetails["clan"] != "AQ Team"
  ) {
    var charExtras = charDetails["extra"];
    response += "<hr />";
    response += "<h2><b>Extra</b></h2>";
    response +=
      "<p><b>No-Drop Element: </b>" + charExtras["nodropelement"] + "</p>";
    response += "<p><b>Alignment: </b>" + charExtras["alignment"] + "</p>";
    response +=
      "<p><b>Lucretia's Potions Progress: </b>" +
      charExtras["lucretia"] +
      "</p>";
    response +=
      "<p><b>Guardian Arena (Stage Completed): </b>" +
      charExtras["guardianarena"] +
      "</p>";
    response +=
      "<p><b>Trescol Reputation: </b>" + charExtras["trescol"] + "</p>";
    response +=
      "<p><b>Kairula Reputation: </b>" + charExtras["kairula"] + "</p>";
    response +=
      "<p><b>Awe Armor/Shield: </b>" + charExtras["awearmor"] + "</p>";
    response +=
      "<p><b>UltraGuardian: </b>" + charExtras["ultraguardian"] + "</p>";
    response += "<p><b>Spellcraft: </b>" + charExtras["spellcraft"] + "</p>";
    response +=
      "<p><b>Encountered Un-Trainer? </b>" +
      (charExtras["untrainer"] == 1 ? "Yes" : "No") +
      "</p>";
    response += "<h3><b>Awe Weapon: </b></h3>";
    response +=
      "<p><b>&nbsp;&nbsp;Awe Progress: </b>" +
      charExtras["aweProgress"] +
      "</p>";
    response +=
      "<p><b>&nbsp;&nbsp;Awe Special Alignment: </b>" +
      charExtras["aweSpecialAlignment"] +
      "</p>";
    response += "<h3><b>Crossroads Star Level: </b></h3>";
    response +=
      "<p><b>&nbsp;&nbsp;Smoke Mountains: </b>" +
      charExtras["smokemountain"] +
      "</p>";
    response +=
      "<p><b>&nbsp;&nbsp;Skraeling Desert: </b>" +
      charExtras["skraelingdesert"] +
      "</p>";
    response +=
      "<p><b>&nbsp;&nbsp;Northlands: </b>" + charExtras["northlands"] + "</p>";
    response +=
      "<p><b>&nbsp;&nbsp;Kristall Reef: </b>" +
      charExtras["kristallreef"] +
      "</p>";
    response +=
      "<p><b>&nbsp;&nbsp;Dwarfhold Mountains: </b>" +
      charExtras["dwarfhold"] +
      "</p>";
    response +=
      "<p><b>&nbsp;&nbsp;Greenguard Forest: </b>" +
      charExtras["greenguard"] +
      "</p>";
  }

  return response;
}

//module.exports = generateInfo

