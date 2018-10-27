let oriDeck = [
    ['spade','A'],['spade','2'],['spade','3'],['spade','4'],['spade','5'],['spade','6'],['spade','7'],['spade','8'],['spade','9'],['spade','10'],['spade','J'],['spade','Q'],['spade','K'],['heart','A'],['heart','2'],['heart','3'],['heart','4'],['heart','5'],['heart','6'],['heart','7'],['heart','8'],['heart','9'],['heart','10'],['heart','J'],['heart','Q'],['heart','K'],['club','A'],['club','2'],['club','3'],['club','4'],['club','5'],['club','6'],['club','7'],['club','8'],['club','9'],['club','10'],['club','J'],['club','Q'],['club','K'],['diamond','A'],['diamond','2'],['diamond','3'],['diamond','4'],['diamond','5'],['diamond','6'],['diamond','7'],['diamond','8'],['diamond','9'],['diamond','10'],['diamond','J'],['diamond','Q'],['diamond','K']]

let deck = oriDeck;
let playerRound = 0;
let computerRound = 0;
let card = [];
let finish = 1;
let computerScore = [0,0,0]; 
// arr[0] for storing score, 
// arr[1] for storing no. of A, 
// arr[2] for storing score from non A number
let playerScore = [0,0,0];
let gameOver = 0;
let initCard = [0,1,2,3,4,5,6,7,8,9]
let stood = 0;

$(function(){
    
    $('div.card').fadeToggle();

    // hit card function
    $('button#hit').click(function(e){
        if (!gameOver) {
            if (playerRound<5){
                // Player's move
                $(`#player div.card:eq(${playerRound})`).fadeToggle();
                card = getRandomCard(deck);
                $(`#player div.card:eq(${playerRound})`).append(`<img src="./images/${card[0]}.png"></img>`);
                $(`#player div.card:eq(${playerRound})`).append(`<p>${card[1]}</p>`);
                getNumber(playerScore,card[1]);
                $('#player h2').html(`Player Score: ${playerScore[0]} with ${playerScore[1]} A`)
                checkResult();
                playerRound ++;
            } else {
                $('footer h2#note').html('Sorry you can only have 5 cards on hand. Let me press stand for you')
                $('button#stand').trigger('click')
            }
        }
    })

    // Initial draw
    function initDraw(){
        setTimeout(function(){
            $('button#hit').trigger('click')
            setTimeout(function(){
                computerDrawCard()
                setTimeout(function(){
                    $('button#hit').trigger('click')
                    setTimeout(function(){
                        computerDrawCard()
                    },(500));
                },(500));
            },(500));
        },(500));
    }
    initDraw();

    $('button#stand').click(function(e){
        stood = 1;
        setInterval(function(){
            computerDrawCard()
            setInterval(function(){
                computerDrawCard()
                setInterval(function(){
                    computerDrawCard()
                },500)
            },500)
        },500)
    })
})

function computerDrawCard(){
    if (!gameOver){
        $(`#computer div.card:eq(${computerRound})`).fadeToggle();
        card = getRandomCard(deck);
        $(`#computer div.card:eq(${computerRound})`).append(`<img src="./images/${card[0]}.png"></img>`);
        $(`#computer div.card:eq(${computerRound})`).append(`<p>${card[1]}</p>`);
        getNumber(computerScore,card[1]);
        $('#computer h2').html(`Computer Score: ${computerScore[0]} with ${computerScore[1]} A`)
        checkResult();
        computerRound ++;
        if (stood) {
            if ((computerScore[0] >= playerScore[0])&&(computerScore[0]<=21)){
                gameOver = 1;
                $('footer h2#note').html('Computer won!')
            }
        }
    }
}

function getRandomCard(deck){
    let i = Math.floor(Math.random() * deck.length);
    let chosenCard = deck[i];
    deck.splice(i ,1)
    return chosenCard;
}

function getIcon(pattern){
    if (pattern == 'spade') {
        return `<img src="${spade}.png"></img>`;
    }
}

function getNumber(user,cardno){
    if (cardno == 'A') {
        user[1] += 1;
    } else if ((cardno == 'J') || (cardno == 'Q') || (cardno == 'K')) {
        user[2] += 10;
    } else {
        user[2] += parseInt(cardno);
    }

    //Calculate final score with A
    user[0] = user[2];
    for (let i = user[1]; i > 0; i--){
        if (user[0] + 11 > 21){
            user[0] += 1
        } else {
            user[0] += 11
        }
    }
}

function checkResult(){
    if (computerScore[0] > 21){
        gameOver = 1;
        $('footer h2#note').html('Computer busted! You won!')
    } else if (playerScore[0] > 21){
        gameOver = 1;
        $('footer h2#note').html('You busted! Computer won!')
    } else if (computerRound > 3) {
        // Need to consider playerRound as well
        gameOver = 1;
        if (computerScore[0] >= playerScore[0]) {
            $('footer h2#note').html('Computer won!')
        } else {
            $('footer h2#note').html('Player won!')
        }
    }
}

function shuffle(arr) {
    var j, x, i;
    for (i = arr.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = arr[i];
        arr[i] = arr[j];
        arr[j] = x;
    }
    return arr;
}