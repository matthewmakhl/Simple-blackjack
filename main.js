let oriDeck = [
    ['spade','A'],['spade','2'],['spade','3'],['spade','4'],['spade','5'],['spade','6'],['spade','7'],['spade','8'],['spade','9'],['spade','10'],['spade','J'],['spade','Q'],['spade','K'],['heart','A'],['heart','2'],['heart','3'],['heart','4'],['heart','5'],['heart','6'],['heart','7'],['heart','8'],['heart','9'],['heart','10'],['heart','J'],['heart','Q'],['heart','K'],['club','A'],['club','2'],['club','3'],['club','4'],['club','5'],['club','6'],['club','7'],['club','8'],['club','9'],['club','10'],['club','J'],['club','Q'],['club','K'],['diamond','A'],['diamond','2'],['diamond','3'],['diamond','4'],['diamond','5'],['diamond','6'],['diamond','7'],['diamond','8'],['diamond','9'],['diamond','10'],['diamond','J'],['diamond','Q'],['diamond','K']]

let deck = oriDeck.slice(); // Need the .slice() to copy the deck instead of point to
let playerRound = 0;
let computerRound = 0;
let card = [];
let firstComCard = [];
let finish = 1;
let computerScore = [0,0,0]; 
// arr[0] for storing score, 
// arr[1] for storing no. of A, 
// arr[2] for storing score from non A number
let playerScore = [0,0,0];
let gameOver = 1;
let initCard = [0,1,2,3,4,5,6,7,8,9]
let stood = 0;
let playerMoney = 2000;
let tableMoney = 0;

// Pending feature: Split, Insurance
// Testing feature: Push, Blackjack, Bet money of choice
// Added feature Bet, Start, Hit, Stand, Next Round, Double Down, Surrender, 

$(function(){
    
    $('div.card').fadeToggle();
    $('button#hit').addClass('inactive');
    $('button#stand').addClass('inactive');
    $('button#again').addClass('inactive');
    $('button#split').addClass('inactive');
    $('button#dd').addClass('inactive');
    $('button#surrender').addClass('inactive');

    // Hit button
    $('button#hit').click(function(e){
        if (!gameOver) {
            // $('button#bet').addClass('inactive');
            $('button#start').addClass('inactive');
            if (playerRound<5){
                $(`#player div.card:eq(${playerRound})`).fadeToggle();
                card = getRandomCard(deck);
                $(`#player div.card:eq(${playerRound})`).append(`<img src="./images/${card[0]}.png"></img>`);
                $(`#player div.card:eq(${playerRound})`).append(`<p>${card[1]}</p>`);
                getNumber(playerScore,card[1]);
                $('#player h2').html(`Player Score: ${playerScore[0]}`)
                checkResult();
                playerRound ++;
                $('button#dd').addClass('inactive');
                $('button#surrender').addClass('inactive');
            } else {
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
                firstComCard = card;
                setTimeout(function(){
                    $('button#hit').trigger('click')
                    setTimeout(function(){
                        computerDrawCard()
                        if (!gameOver){
                            $('button#dd').removeClass('inactive');
                            if ((firstComCard[1]=='10')||
                                (firstComCard[1]=='J')||
                                (firstComCard[1]=='Q')||
                                (firstComCard[1]=='K')||
                                (firstComCard[1]=='A')){
                                $('button#surrender').removeClass('inactive');
                            }
                            if ($(`#player div.card:eq(0) p`).html() == $(`#player div.card:eq(1) p`).html()) {
                                $('button#split').removeClass('inactive');
                            }
                        }
                    },(500));
                },(500));
            },(500));
        },(500));
    }

    // All-In button
    $('button#allin').click(function(){
        if ($('button#allin').hasClass('inactive')){return};
        if (playerMoney>=0) {
            tableMoney = playerMoney;
            playerMoney = 0;
            $('#hand p').html(0);
            $('button#start').trigger('click');
        }
    })

    // Start button
    $('button#start').click(function(){
        if ($('button#start').hasClass('inactive')){return};
        $('#table').html(`<i class="fas fa-coins"></i><p>${tableMoney}</p>`);
        gameOver = 0;
        initDraw();
        $('button#hit').removeClass('inactive');
        $('button#stand').removeClass('inactive');
        $('button#allin').addClass('inactive');
    })

    // Stand button
    $('button#stand').click(function(e){
        stood = 1;
        checkResult();
        if ((computerScore[0] > playerScore[0])&&(computerScore[0]<=21)&&(computerScore[0]>16)){
            gameOver = 1;
            $('#computer .overlay').html(`Dealer won(${computerScore[0]} pts)`);
            $('#player .overlay').html(`You lose( with )${playerScore[0]} pts)`);
            showResult('computer');
            payout('computer');
        }
        setTimeout(function(){
            computerDrawCard()
            setTimeout(function(){
                computerDrawCard()
                setTimeout(function(){
                    computerDrawCard()
                },500)
            },500)
        },500)
    })

    // Next round button
    $('button#again').click(function(){
        $('div.card').html('');
        $('.overlay').removeClass('win');
        $('.overlay').removeClass('lose');
        $('.overlay').removeClass('push');
        $('#table').html(`<i class="fas fa-coins"></i>
        <div class="bet thousand">
            <i class="fas fa-arrow-circle-up"></i>
            <p>0</p>
            <i class="fas fa-arrow-circle-down"></i>
        </div>
        <div class="bet hundred">
            <i class="fas fa-arrow-circle-up"></i>
            <p>0</p>
            <i class="fas fa-arrow-circle-down"></i>
        </div>
        <div class="bet ten">
            <i class="fas fa-arrow-circle-up"></i>
            <p>0</p>
            <i class="fas fa-arrow-circle-down"></i>
        </div>
        <div class="bet one">
            <i class="fas fa-arrow-circle-up"></i>
            <p>0</p>
            <i class="fas fa-arrow-circle-down"></i>
        </div>`);
        initBet();
        for (;playerRound<6;playerRound++){
            $(`#player div.card:eq(${playerRound})`).fadeToggle();
        }
        for (;computerRound<6;computerRound++){
            $(`#computer div.card:eq(${computerRound})`).fadeToggle();
        }
        $('div.card').fadeToggle();
        $('button#hit').addClass('inactive');
        $('button#stand').addClass('inactive');
        $('button#again').addClass('inactive');
        $('button#split').addClass('inactive');
        $('button#dd').addClass('inactive');
        $('button#surrender').addClass('inactive');
        $('button#start').removeClass('inactive');
        $('button#allin').removeClass('inactive');
        // $('button#bet').removeClass('inactive');
        $('#player h2').html(`Player Score: 0`)
        $('#computer h2').html(`Dealer Score: 0`)
        deck = oriDeck.slice();
        playerRound = 0;
        computerRound = 0;
        card = [];
        finish = 1;
        computerScore = [0,0,0];
        playerScore = [0,0,0];
        gameOver = 1;
        initCard = [0,1,2,3,4,5,6,7,8,9]
        stood = 0;
    })

    // Bet 100 button
    // $('button#bet').click(function(e){
    //     e.preventDefault();
    //     // prevent iphone user double tab here and zoom in

    //     if ($('button#bet').hasClass('inactive')){return};
    //     playerMoney -= 100;
    //     tableMoney += 100;
    //     $('#hand p').html(playerMoney);
    //     $('#table p').html(tableMoney);

        // $(this).click();
    // })

    // Double Down button
    $('button#dd').click(function(){
        if ($('button#dd').hasClass('inactive')){return};
        setTimeout(function(){
            playerMoney -= tableMoney;
            tableMoney = tableMoney*2;
            $('#hand p').html(playerMoney);
            $('#table p').html(tableMoney);
            setTimeout(function(){
                $('button#hit').trigger('click')
                setTimeout(function(){
                    $('button#stand').trigger('click')
                },500)
            },500)
        },500)
        
        $('button#hit').addClass('inactive');
        $('button#stand').addClass('inactive');
    })
    
    // Surrrender button
    $('button#surrender').click(function(){
        if ($('button#surrender').hasClass('inactive')){return};
        playerMoney += tableMoney/2;
        tableMoney = 0;
        $('#hand p').html(playerMoney);
        $('#table p').html(tableMoney);

        gameOver = 1;
        $('#computer .overlay').html(`Dealer won`);
        $('#player .overlay').html(`You surrendered`);
        showResult('computer');

    })

    // Split button
    $('button#split').click(function(){
        //Not ready
        // $(`#player div.card:eq(${playerRound})`).fadeToggle();
        // card = getRandomCard(deck);
        // $(`#player div.card:eq(${playerRound})`).append(`<img src="./images/${card[0]}.png"></img>`);
        // $(`#player div.card:eq(${playerRound})`).append(`<p>${card[1]}</p>`);
        // getNumber(playerScore,card[1]);
        // $('#player h2').html(`Player Score: ${playerScore[0]}`)
        // checkResult();

    })

    // bet up and down button
    function initBet(){
        for (let i = 0; i<4;i++){
            $(`#table div:eq(${i}) i.fa-arrow-circle-up`).click(function(){
                if ($(`#table div:eq(${i}) p`).html()=='9'){
                    $(`#table div:eq(${i}) p`).html('0');
                    playerMoney += (9*(Math.pow(10,(3-i))));
                    tableMoney -= (9*(Math.pow(10,(3-i))));
                } else {
                    $(`#table div:eq(${i}) p`).html(parseInt($(`#table div:eq(${i}) p`).html())+1);
                    playerMoney -= (1*(Math.pow(10,(3-i))));
                    tableMoney += (1*(Math.pow(10,(3-i))));
                }
                $('#hand p').html(playerMoney);
            })
            $(`#table div:eq(${i}) i.fa-arrow-circle-down`).click(function(){
                if ($(`#table div:eq(${i}) p`).html()=='0'){
                    $(`#table div:eq(${i}) p`).html('9');
                    playerMoney -= (9*(Math.pow(10,(3-i))));
                    tableMoney += (9*(Math.pow(10,(3-i))));
                } else {
                    $(`#table div:eq(${i}) p`).html(parseInt($(`#table div:eq(${i}) p`).html())-1);
                    playerMoney += (1*(Math.pow(10,(3-i))));
                    tableMoney -= (1*(Math.pow(10,(3-i))));
                }
                $('#hand p').html(playerMoney);
            })
        } 
    }
    initBet();

})

function computerDrawCard(){
    if (!gameOver){
        $(`#computer div.card:eq(${computerRound})`).fadeToggle();
        card = getRandomCard(deck);
        $(`#computer div.card:eq(${computerRound})`).append(`<img src="./images/${card[0]}.png"></img>`);
        $(`#computer div.card:eq(${computerRound})`).append(`<p>${card[1]}</p>`);
        getNumber(computerScore,card[1]);
        $('#computer h2').html(`Dealer Score: ${computerScore[0]}`)
        checkResult();
        computerRound ++;
        if (stood) {
            if ((computerScore[0] > playerScore[0])&&(computerScore[0]<=21)){
                gameOver = 1;
                $('#computer .overlay').html(`Dealer won(${computerScore[0]} pts)`);
                $('#player .overlay').html(`You lose(${playerScore[0]} pts)`);
                showResult('computer');
                payout('computer');
            } else if (computerScore[0] == playerScore[0]) {
                gameOver = 1;
                $('#computer .overlay').html(`Push`);
                $('#player .overlay').html(`Push`);
                showResult('push');
                playerMoney += tableMoney;
                tableMoney = 0;
                $('#hand p').html(playerMoney);
                $('#table p').html(tableMoney);
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

    if ((playerScore[0] != 21)&&(playerRound == 2)&&(computerRound == 1)&&(computerScore[0] == 21)) {
        gameOver = 1;
        $('#player .overlay').html(`Lose`);
        $('#computer .overlay').html(`Blackjack`);
        showResult('computer');
        payout('computer');
    } else if ((playerScore[0] == 21)&&(playerRound == 2)&&(computerRound == 1)&&(computerScore[0] != 21)) {
        gameOver = 1;
        tableMoney = tableMoney * 1.25;
        $('#player .overlay').html(`Blackjack`);
        $('#computer .overlay').html(`Lose`);
        showResult('player');
        payout('player');
    } else if (computerScore[0] > 21){
        gameOver = 1;
        $('#player .overlay').html(`You won(${playerScore[0]} pts)`);
        $('#computer .overlay').html(`Dealer busted(${computerScore[0]} pts)`);
        showResult('player');
        payout('player');
    } else if (playerScore[0] > 21){
        gameOver = 1;
        $('#computer .overlay').html(`Dealer won(${computerScore[0]} pts)`);
        $('#player .overlay').html(`You busted(${playerScore[0]} pts)`);
        showResult('computer');
        payout('computer');
    } else if (computerRound > 3) {
        gameOver = 1;
        if (computerScore[0] > playerScore[0]) {
            $('#computer .overlay').html(`Dealer won(${computerScore[0]} pts)`);
            $('#player .overlay').html(`You lose(${playerScore[0]} pts)`);
            showResult('computer');
            payout('computer');
        } else {
            $('#player .overlay').html(`You won(${playerScore[0]} pts)`);
            $('#computer .overlay').html(`Dealer lose(${computerScore[0]} pts)`);
            showResult('player');
            payout('player');
        }
    }
}

function payout(winner){
    if (winner == 'computer') {
        tableMoney = 0
        $('#table p').html(tableMoney);
    } else {
        playerMoney += tableMoney*2;
        tableMoney = 0
        $('#hand p').html(playerMoney);
        $('#table p').html(tableMoney);
    }
}

function showResult(winner){
    $('button#again').removeClass('inactive');
    $('button#hit').addClass('inactive');
    $('button#stand').addClass('inactive');
    $('button#dd').addClass('inactive');
    $('button#surrender').addClass('inactive');
    if (winner == 'player') {
        $('#player .overlay').addClass('win');
        $('#computer .overlay').addClass('lose');
    } else if (winner == 'computer') {
        $('#computer .overlay').addClass('win');
        $('#player .overlay').addClass('lose');
    } else if (winner == 'push') {
        $('#computer .overlay').addClass('push');
        $('#player .overlay').addClass('push');
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