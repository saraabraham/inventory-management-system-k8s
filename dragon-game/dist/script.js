//Declared all variables used in this game
let xp=0;
let health=100;
let gold=50;
let currentWeapon=0;
let fighting;
let monsterHealth;
let inventory=["Stick"];

//Declared all constants which are used as query selectors for different elements
const button1=document.querySelector("#button1");
const button2=document.querySelector("#button2");
const button3=document.querySelector("#button3");
const text=document.querySelector("#text");
const xpText=document.querySelector("#xp");
const healthText=document.querySelector("#health");
const goldText=document.querySelector("#gold");
const monsterStats=document.querySelector("#monsterStats");
const monsterNameText=document.querySelector("#monsterName");
const monsterHealthText=document.querySelector("#monsterHealth");

//This helps us in shifting actions from one button to another
const locations = [
  {
    name:"Town Square",
    "button text":["Go to Store","Go to Cave","Fight Dragon"],
    "button functions":[goStore,goCave,fightDragon],
    text:"You are in Town Square! You see the sign \"Store\"."
  },
  
  {
    name:"Store",
    "button text":["Buy 10 Health for 10 Gold","Buy weapon for 30 Gold","Return to town square"],
    "button functions":[buyHealth,buyWeapon,goTown],
    text:"You have entered the Store!"
  },
  {
    name:"Cave",
    "button text":["Fight Slime","Fight fanged beast","Return to town square"],
    "button functions":[fightSlime,fightBeast,goTown],
    text:"You have entered the cave and you see monsters"
  },
  {
    name:"Fight",
    "button text":["Attack","Dodge","Run"],
    "button functions":[attack,dodge,goTown],
    text:"You are fighting the monster"
  },
  {
    name:"Kill Monster",
    "button text":["Go to Town Square","Go to Town Square","Go to Town Square"],
    "button functions":[goTown,goTown,easterEgg],
    text:'The monster screams "Arggggghhhhhh!" as it dies. You gain experience points and find gold'
  },
  {
    name:"Lose",
    "button text":["REPLAY","REPLAY","REPLAY"],
    "button functions":[restart,restart,restart],
    text:"You are dead!"
  },
  {
    name:"Win Game",
    "button text":["REPLAY","REPLAY","REPLAY"],
    "button functions":[restart,restart,restart],
    text:"You defeated the Dragon!!! You have won the game!!"
  },
  {
    name:"Easter Egg",
    "button text":["2","8","Return to Town Square"],
    "button functions":[pickTwo,pickEight,goTown],
    text:"You have entered a secret game. You pick a number from above and if it matches a number randomly choosen by us, you get 20 Gold. However if you don't, you loose 10 Health"
  }
];
//Details of different weapons
const weapons = [
  {
  name:"Stick",
  power:5
},
  {
  name:"Dagger",
  power:30
},
{
  name:"Claw hammer",
  power:50
},
  {
  name:"Sword",
  power:100
}];

//Details of different monsters
const monsters = [
  {
  name:"Slime",
  level:2,
  health:15
},
{
  name:"Fanged Beast",
  level:8,
  health:60
},
{
  name:"Dragon",
  level:20,
  health:300
}
];

//initialize buttons
button1.onclick = goStore;
button2.onclick = goCave;
button3.onclick = fightDragon;

//Method that helps in switching from one function to another
function update(location){
  monsterStats.style.display = "none";
  button1.innerText= location["button text"][0];
  button2.innerText= location["button text"][1];
  button3.innerText= location["button text"][2];
  button1.onclick = location["button functions"][0];
  button2.onclick = location["button functions"][1];
  button3.onclick = location["button functions"][2];
  text.innerText= location.text;
}
 
//Intial screen
function goTown(){
  update(locations[0]);
}

//Has 3 options : Buy health, Buy weapon, return to town
function goStore(){
  update(locations[1]);
}

//Lets you buy health for 10 gold 10 health
function buyHealth(){
  if(gold >= 10){
    gold -= 10;
    health += 10;
    goldText.innerText=gold;
    healthText.innerText=health;
    
    
  }
  else{
    text.innerText= "You don't have enough gold to buy Health!";
  }
}

//Lets you buy weapons for 30 Gold
//If we have the sword as weapon , then we cant buy more weapons, we can sell it however and earn 15 gold
function buyWeapon(){
  
  if (currentWeapon < weapons.length-1){
    if(gold >= 30){
      gold -= 30;
      currentWeapon++;
      goldText.innerText = gold;
      let newWeapon = weapons[currentWeapon].name;
      text.innerText = "You have a "+ newWeapon + ".";
      inventory.push(newWeapon);
      text.innerText += "In your inventory you have " + inventory + ".";
    }
    else{
       text.innerText = "You don't have enough gold to buy new Weapon!";
    }
  }
  else{
    text.innerText = "You already have the most powerful weapon.";
    button2.innerText = "Sell weapon for 15 Gold";
    button2.onclick = sellWeapon;
    
  }
}
//Helps in selling the weapon for 15 Gold provided u only have more than one weapon in inventory
function sellWeapon(){
  if(inventory.length > 1){
    gold +=15;
    goldText.innerText = gold;
    let currentWeaponSold = inventory.shift();
    currentWeapon--;
    text.innertext = "You have sold the" + currentWeaponSold+".";
    text.innertext += " Your inventory has the following weapons" + inventory + "."; 
  }
  else{
    text.innerText = "Don't sell your only weapon";
  }
}
//Go Cave Button: Has 3 functions Fight Slime,Fight Fanged Beast and return to town square
function goCave(){
  update(locations[2]);
}
//Dispalys the monster's stats by enabling the dispay attribute in CSS and sets the mosterstats as per the monster being fought
function goFight(){
  update(locations[3]);
  monsterHealth = monsters[fighting].health;
  monsterStats.style.display = "block";
  monsterNameText.innerText = monsters[fighting].name;
  monsterHealthText.innerText = monsters[fighting].health;
}

function fightSlime(){
  fighting = 0;
  goFight();
}

function fightBeast(){
  fighting = 1;
  goFight();
}

function fightDragon(){
  fighting = 2;
  goFight();
}
//Each fight has : attack and dodge options. In the attack option, we modify health and monster's health as per the weapon used and momnster's power
function attack(){
  text.innerText = "The " + monsters[fighting].name + " is attacking you!";
  text.innerText += " You are attacking him with your " + weapons[currentWeapon].name+ ".";
  if(isMonsterHit()){
  health -= getMonsterAttackValue(monsters[fighting].level);}
  else{
    text.innerText = "You miss!"
  }
  monsterHealth -= weapons[currentWeapon].power + Math.floor(Math.random()*xp) + 1;
  healthText.innerText = health;
  monsterHealth.innerText = monsterHealth;
  
  if(health <= 0){
    lose();
  }
  else if (monsterHealth <= 0){
    fighting === 2 ? winGame(): defeatMonster();
  }
  //We also have a probabilty of the weapon breaking
  if(Math.random <= 0.1 && inventory.length !== 1){
    text.innerText += "Your " + inventory.pop() + " breaks!!"
    currentWeapon--;
  }
}
//helps to calculate how our health is affected on fighting with a monster
function getMonsterAttackValue(level){
  let hit = (level*5) - (Math.floor(Math.random() * xp));
  return hit;
}
//A function that involves an element of probabilty to check if the monster is hit or not
function isMonsterHit(){
  return Math.random() > 0.2 || health < 20;
}
//Dodge function
function dodge(){
  text.innerText = "You have dodged attack from " + monsters[fighting].name + ".";
}
//Incase of defeating monster, thois function updates stats
function defeatMonster(){
  gold += Math.floor(monsters[fighting].level * 6.7);
  xp += Math.floor(monsters[fighting].level * 6.7);
  goldText.innerText = gold;
  xpText.innerText = xp;
  update(locations[4]);
}


function lose(){
  update(locations[5]);
}

//resets the whole program
function restart(){
xp=0;
health=100;
gold=50;
currentWeapon=0;
inventory=["Stick"];
goldText.innerText = gold;
xpText.innerText = xp;
healthText.innerText = health;
goTown();
}

function winGame(){
  update(locations[6]);
}
//Hidden feature
function easterEgg(){
  update(locations[7]);
}

function pickTwo(){
  pick(2);
}

function pickEight(){
  pick(8);
}

function pick(guess){
  let nums = [];
  
  for ( let i=0; i<10;i++){
    nums.push(Math.floor(Math.random() * 11));
  }
  text.innerText = "You picked the number " + guess + ". Here are the random numbers selected by us:\n";
  
  for ( let j=0; j<10;j++){
    text.innerText += nums[j] + "\n";
  }
  
  if (nums.indexOf(guess) !== -1){
    gold += 20;
    goldText.innerText = gold;
    text.innerText += "Amazing!! You win 20 Gold!"
  }
  else{
    health -= 10;
    healthText.innerText = health;
    text.innerText += "Better luck next time!! You loose 10 health!"
  }
  if (health <= 0){
    lose();
  }
}