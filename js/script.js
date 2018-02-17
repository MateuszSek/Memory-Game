
var howMany=40;             //variable to count how many attempts user still has
var openedCards = 0;        //variable used in a function that compares 2 clicked cards
var chosenColor = 1;        //1=black, 2=blue, 3=red. Variable is used when user choose the color of cards
var cardComparison=[];      //table to store names of already clicked cards
var indexComparison=[];     //table to store indexes of already clicked cards
let clickedIndex;           //storing 'index' of currently clicked card
let clickedCardName;        //storing 'name' of currently clicked card
let clickingDisabled=false; //disable clicking when 2 cards are already clicked and user has time to remember their position
let MatchedPairs =0;        // if var=26, user wins the game
let cardsInGame;            //user chooses wether ha wants to play with 26 or 52 cards.

var families=[];

var ranks = [2,3,4,5,6,7,8,9,10,11,12,13,14]    //14=As, 13=King, 12=Queen, 11=Jopek
var all_carts=[];                               //creating empty table where carts will be stored

function createDivsAndCards(){//adding div's with cards into HTML
    $("#allCards").html('');
    console.log(cardsInGame);
    for (let i=0;i<cardsInGame;i++){ 
        $("#allCards").append("<div><img class='singleCard' name="+i.toString()+" src='img/cards/tyl"+chosenColor.toString()+".jpg'></div>");
    }

    if (cardsInGame==52) families=["pik", "kier"];                   //2 families x 13 cards each x 2copies 
    else families=["kier"];

    all_carts.splice(0,all_carts.length);
    console.log(all_carts);
    for(let k=0;k<2;k++){   //creating 52/26 card objects and storing all into table 'all_carts'
        for (let i=0;i<families.length;i++){
            for (let j=0;j<ranks.length;j++){
                var newCart ={ name: ranks[j].toString()+'_'+families[i].toString() }
                all_carts.push(newCart);
            }
        }
    }
    console.log(all_carts);
}


function shuffle (array) {//Fisher-Yates's shuffle alghoritm.
    var i = 0, j = 0, temp = null
    for (i = array.length - 1; i > 0; i -= 1) {
      j = Math.floor(Math.random() * (i + 1));
      temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
}


function setHardshipLevel(){ //assigning number of attempts depending on hardship level
    setCardAmount();
    var selector = $('input[name="lvl"]:checked').val();
    switch(selector){
        case 'easy':
            if (cardsInGame==26) howMany = 30;
            else howMany = 60;
            break;
        case 'hard':
            if (cardsInGame==26) howMany = 23;
            else howMany = 45;
            break;
        case 'hardcore':
            if (cardsInGame==26) howMany = 20;
            else howMany = 40;
            break;
        case 'unlimited':
            howMany = 99999;
            break;
    }
    $("#gamePanel").html("Attempts left: "+howMany+'<br>Matched pairs: '+MatchedPairs);   
}

function setCardAmount(){
    var selector =  $('input[name="cardsInGame"]:checked').val();
    cardsInGame = parseInt(selector);
}

function hideCards(){
    for (let i=0;i<all_carts.length;i++){
        $('.noClass[name="'+i.toString()+'"]').attr('class','singleCard');
        $('.singleCard[name="'+i.toString()+'"]').attr('src','img/cards/tyl'+chosenColor.toString()+'.jpg');
    }
}


function displayCard(cardClickedByUser){  //function that displays the card clicked by user
    $(cardClickedByUser).attr('src','img/cards/'+clickedCardName.toString()+'.jpg'); //showing the card to user
    cardComparison.push(clickedCardName); //storing data of clicked card into tables (name and index)
    indexComparison.push(clickedIndex);
    openedCards+=1;   
}

function compareTheCards(){

    if (cardComparison[0]==cardComparison[1]){
        for (i=0;i<2;i++){
           $('.singleCard[name="'+indexComparison[i].toString()+'"]').attr('src','img/cards/blank.jpg');
           $('.singleCard[name="'+indexComparison[i].toString()+'"]').attr('class','noClass');
        }
        MatchedPairs+=1;
    }
    else{
        clickingDisabled=true;
        card1=indexComparison[0];
        card2=indexComparison[1];
        setTimeout(function(){ 
                $('.singleCard[name="'+card1.toString()+'"]').attr('src','img/cards/tyl'+chosenColor.toString()+'.jpg');
                $('.singleCard[name="'+card2.toString()+'"]').attr('src','img/cards/tyl'+chosenColor.toString()+'.jpg');
                clickingDisabled=false;
        },1000); 
    }
    cardComparison.splice(0,2);
    indexComparison.splice(0,2);
    openedCards=0;
    howMany-=1;  
    $("#gamePanel").html("Attempts left: "+howMany+'<br>Matched pairs: '+MatchedPairs);   

}

function changeColor(){ //1=black, 2=blue, 3=red
    $(".singleCard").attr('src','img/cards/tyl'+chosenColor.toString()+'.jpg');
}


function clickOnCard(card){
    if (!clickingDisabled){

        clickedIndex= parseInt($(card).attr("name")); //getting 'index' of clicked card
        clickedCardName = $(all_carts[clickedIndex]).attr('name'); //getting 'name' of clicked cart 

        switch (openedCards){ //function will act differently depending on how many cards are already clicked   
            case 0:       
                displayCard(card);
                break;    
            case 1:
                if(indexComparison[0]==clickedIndex) alert('You clicked 2 times the same card!');
                else displayCard(card);
                break;
        }
        if (openedCards==2) compareTheCards();
    }
    if (MatchedPairs==(all_carts.length/2)) {
        $("#allCards").html('You won, congratz!');
        $("#allCards").attr("style","font-weight: bold; font-size:30px; text-align:center; line-height:200px;");     
    }
    if (howMany==0 && MatchedPairs!=(all_carts.length/2)) {
        $("#allCards").html('You lost, try again!');
        $("#allCards").attr("style","font-weight: bold; font-size:30px; text-align:center; line-height:200px;");   
        setHardshipLevel();
        hideCards();
        shuffle(all_carts);
        clearAllActions();
        $("#gamePanel").html("Attempts left: "+howMany+'<br>Matched pairs: '+MatchedPairs); 
    }
}

function clearAllActions(){
    MatchedPairs=0;
    openedCards=0;
    cardComparison=[];
    indexComparison=[]; 
}

function adjustFieldForCards(){
    setCardAmount();
    if (cardsInGame==26) $('#allCards').attr('class',"allCards26");
    else $('#allCards').attr('class',"allCards52");
}

function main(){
    $(window).resize(function(){
        var width = $(window).width();
        $("#currentWidth").html('Szerokość okna:'+width.toString())
    });

    $('#black').on('click', function() {
        chosenColor=1;
        $(this).css("border", "white 4px solid");
        $('#blue').css("border", "none");
        $('#red').css("border", "none");
    });

    $('#blue').on('click', function() {
        chosenColor=2;
        $(this).css("border", "white 4px solid");
        $('#black').css("border", "none");
        $('#red').css("border", "none");
    });

    $('#red').on('click', function() {
        chosenColor=3;
        $(this).css("border", "white 4px solid");
        $('#blue').css("border", "none");
        $('#black').css("border", "none");
    });


    $("#allContent").on('click',"#startGame",function(){
        clearAllActions();
        setHardshipLevel();
        setCardAmount();
        adjustFieldForCards()
        createDivsAndCards();
        changeColor();
        hideCards();
        shuffle(all_carts);
        $('html,body').animate({
            scrollTop: $("#allCards").offset().top},
            'slow');
    });

    $('#allCards').on('click','.singleCard', function(){
        clickOnCard(this);
    });
}


$(document).ready(main);