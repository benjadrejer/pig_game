/*
GAME RULES:

- The game has 2 players, playing in rounds
- In each turn, a player rolls a dice as many times as he whishes. Each result get added to his CURRENT score
- BUT, if the player rolls a 1, all his CURRENT score gets lost. After that, it's the next player's turn
- The player can choose to 'Hold', which means that his CURRENT score gets added to his ROUND score. After that, it's the next player's turn
- The first player to reach 100 points on ROUND score wins the game


ADDITIONAL FUNCTIONALITY:
1. When rolling two 6 in a row, the player loses his ENTIRE score (and the turn changes).
2. Add an input to allow the players to choose the winning score.
3. Add a 2nd dice. A player loses his current score if one of the dice is a 1 (and entire score if rolling two 6 two times in a row).
*/

//----- INITIAL VARIABLE DECLARATIONS ---

//State
var gameActive = true;

//Actions
var newGame = document.querySelector('.btn-new');
var rollDice = document.querySelector('.btn-roll');
var hold = document.querySelector('.btn-hold');

//Players
var player1 = {
  name: 'Player 1',
  isActive: true,
  roundScore: {value: 0, element: document.querySelector('#score-0')},
  currentScore: {value: 0, element: document.querySelector('#current-0')},
  panel: document.querySelector('.player-0-panel'),
  nameLabel: document.querySelector('#name-0')    
};

var player2 = {
  name: 'Player 2',
  isActive: false,
  roundScore: {value: 0, element: document.querySelector('#score-1')},
  currentScore: {value: 0, element: document.querySelector('#current-1')},
  panel: document.querySelector('.player-1-panel'),
  nameLabel: document.querySelector('#name-1') 
};

//Options
var muteCheck = document.querySelector('.mute-sound');

//Visuals
var dice = document.querySelector('.dice');

//Sounds
var diceSound = new Howl({
   src: ['rolldice.mp3'],
    volume: 0.5
});
var diceSound2 = new Howl({
   src: ['click.mp3'],
    volume: 0.5
});

// ----- INITIALIZE -----

reset();

// ----- SET UP LISTENERS -----
rollDice.addEventListener('click', function(){
    if(gameActive)
        roll(player1.isActive ? player1 : player2);
    
});

newGame.addEventListener('click', function(){
    reset();
});

hold.addEventListener('click', function(){
    if(gameActive){
        addToTotal(player1.isActive ? player1 : player2);    
        checkWin(player1.isActive ? player1 : player2);
    }
});

// ----- GAME FUNCTIONS -----
function reset(){
    player1.currentScore.value = 0;
    player1.currentScore.element.textContent = '0';
    player1.roundScore.value = 0;
    player1.roundScore.element.textContent = '0';
    player2.currentScore.value = 0;
    player2.currentScore.element.textContent = '0';
    player2.roundScore.value = 0;
    player2.roundScore.element.textContent = '0';
    
    player1.isActive = true;
    player2.isActive = false;
    
    player1.panel.classList.remove('active');
    player1.panel.classList.add('active');
    player2.panel.classList.remove('active');
    
    player1.panel.classList.remove('winner');
    player2.panel.classList.remove('winner');
    player1.nameLabel.textContent = 'Player 1';
    player2.nameLabel.textContent = 'Player 2';
    
    dice.style.display = 'none';

    gameActive = true;
};

function addToTotal(player){
    player.roundScore.value += player.currentScore.value;
    player.currentScore.value = 0;
    player.roundScore.element.textContent = player.roundScore.value;
    player.currentScore.element.textContent = '0';
};

function roll(player){
    let value = getRandomIntInclusive(1, 6);
    
    changeDice(value);
    
    if(value === 1){
        player.currentScore.value = 0;
        player.currentScore.element.textContent = '0';
        changeTurn();
        return;
    }
    
    player.currentScore.value += value;
    player.currentScore.element.textContent = player.currentScore.value;
    
};

function changeDice(value){
    rollDice.style.display = 'none';
    
    if(dice.style.display == 'none')
        dice.style.display = 'block';
    
    if(!muteCheck.checked && value !== 1)
        diceSound.play();
    
    if(!muteCheck.checked && value === 1)
        diceSound2.play();
    
    dice.src = 'dice-' + value + '.png';
    dice.classList.add('bounce');
    
    setTimeout(function(){
        rollDice.style.display = 'block';
        dice.classList.remove('bounce');
    }, 1500);
    
}

function changeTurn(){
    if(player1.isActive){
        player1.isActive = false;
        player2.isActive = true;
    }else{
        player2.isActive = false;
        player1.isActive = true;
    }
    
    dice.style.display = 'none';
    player1.panel.classList.toggle('active');
    player2.panel.classList.toggle('active');
}

function checkWin(player){
    if(player.roundScore.value >= 20){
        player.panel.classList.add('winner');
        player.nameLabel.textContent = 'WINNER!';
        player.panel.classList.remove('active');
        dice.style.display = 'none';
        gameActive = false;

    }else{
        changeTurn();
    }
}

// ----- ASSISTANCE FUNCTIONS -----

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
