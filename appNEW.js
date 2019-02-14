/*
GAME RULES:

- The game has 2 players, playing in rounds
- In each turn, a player rolls a dice as many times as he whishes. Each result get added to his CURRENT score
- BUT, if the player rolls a 1, all his CURRENT score gets lost. After that, it's the next player's turn
- The player can choose to 'Hold', which means that his CURRENT score gets added to his ROUND score. After that, it's the next player's turn
- The first player to reach 100 points on ROUND score wins the game


ADDITIONAL FUNCTIONALITY:
1. When rolling two 6 in a row, the player loses his ENTIRE score (and the turn changes). DONE
2. Add an input to allow the players to choose the winning score. DONE
3. Add a 2nd dice. A player loses his current score if one of the dice is a 1 (and entire score if rolling two 6 two times in a row). DONE
*/

//----- INITIAL VARIABLE DECLARATIONS ---

//State
var gameActive;

//Actions
var newGame = document.querySelector('.btn-new');
var rollDice = document.querySelector('.btn-roll');
var hold = document.querySelector('.btn-hold');

//Players
var totalScore, activePlayer, currentScore, previousScore;

//Options
var muteCheck = document.querySelector('.mute-sound');
var winningScore;

//Visuals
var dice = document.querySelector('.dice');
var dice0 = document.querySelector('#dice-0');
var dice1 = document.querySelector('#dice-1');

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
        roll();
    
});

newGame.addEventListener('click', function(){
    reset();
});

hold.addEventListener('click', function(){
    if(gameActive){
        addToTotal();    
        checkWin();
    }
});

// ----- GAME FUNCTIONS -----
function reset(){
    
    gameActive = true;
    winningScore = document.querySelector('.winning-score').value;
    
    totalScore = [0, 0];
    activePlayer = 0;
    currentScore = 0;
    previousScore = 0;
    
    document.querySelector('#score-0').textContent = '0';
    document.querySelector('#score-1').textContent = '0';
    document.querySelector('#current-0').textContent = '0';
    document.querySelector('#current-1').textContent = '0';
    
    document.querySelector('.player-0-panel').classList.remove('active');
    document.querySelector('.player-0-panel').classList.add('active');
    document.querySelector('.player-1-panel').classList.remove('active');
    
    document.querySelector('.player-0-panel').classList.remove('winner');
    document.querySelector('.player-1-panel').classList.remove('winner');
    document.querySelector('#name-0').textContent = 'Player 1';
    document.querySelector('#name-1').textContent = 'Player 2';
    
    dice0.style.display = 'none';
    dice1.style.display = 'none';

    gameActive = true;
};

function addToTotal(){
    totalScore[activePlayer] += currentScore;
    currentScore = 0;
    document.querySelector('#score-' + activePlayer).textContent = totalScore[activePlayer];
    document.querySelector('#current-' + activePlayer).textContent = '0';
};

function roll(){
    let value0 = getRandomIntInclusive(1, 6);
    let value1 = getRandomIntInclusive(1, 6);
    
    changeDice(value0, value1);
    
    if(value0 === 1 || value1 === 1){
        currentScore = 0;
        document.querySelector('#current-' + activePlayer).textContent = '0';
        changeTurn();
        return;
    }
    
    if(previousScore === 6 && value0 === 6){
        //console.log("DOUBLE SIX");
        currentScore = 0;
        totalScore[activePlayer] = 0;
        previousScore = 0;
        document.querySelector('#current-' + activePlayer).textContent = '0';
        document.querySelector('#score-' + activePlayer).textContent = '0';
        changeTurn();
        return;
    }

    previousScore = value0;
    
    currentScore += value0 + value1;
    document.querySelector('#current-' + activePlayer).textContent = currentScore;
    
};

function changeDice(value0, value1){
    rollDice.style.display = 'none';
    
    if(dice.style.display == 'none'){
        dice0.style.display = 'block';
        dice1.style.display = 'block';
    }
    
    if(!muteCheck.checked && value0 !== 1 && value1 !== 1)
        diceSound.play();
    
    if((!muteCheck.checked && (value0 === 1 || value1 === 1)) || (!muteCheck.checked && previousScore === 6 && value0 === 6))
        diceSound2.play();
    
    dice0.src = 'dice-' + value0 + '.png';
    dice1.src = 'dice-' + value1 + '.png';
    dice0.classList.add('bounce');
    dice1.classList.add('bounce');
    
    setTimeout(function(){
        rollDice.style.display = 'block';
        dice0.classList.remove('bounce');
        dice1.classList.remove('bounce');
    }, 1500);
    
}

function changeTurn(){
    if(activePlayer === 0){
        activePlayer = 1;
    }else{
        activePlayer = 0;
    }
    
    dice0.style.display = 'none';
    dice1.style.display = 'none';
    document.querySelector('.player-0-panel').classList.toggle('active');
    document.querySelector('.player-1-panel').classList.toggle('active');
}

function checkWin(){
    if(totalScore[activePlayer] >= winningScore){
        document.querySelector('.player-' + activePlayer + '-panel').classList.add('winner');
        document.querySelector('#name-' + activePlayer).textContent = 'WINNER!';
        document.querySelector('.player-' + activePlayer + '-panel').classList.remove('active');
        dice0.style.display = 'none';
        dice1.style.display = 'none';
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
