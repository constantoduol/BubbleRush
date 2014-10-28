
function Model (){
    
}


function Bubble(firstNum, secondNum,sign){
    this.firstNum = firstNum;
    this.secondNum = secondNum;
    this.sign = sign;
    this.id = "";
}

//this is the simplest game model
//it defines the horizontal and vertical velocity of bubbles
//the difficulty of the game, the simple model uses "+" sign only
//the difficulty of the game as the user plays more
//so as the game progresses the model should make the game more difficult
//the model can also specify a different movement pattern for the bubbles
function ModelOne(){
   this.bubbleVerticalVelocity = 20; //this is in pixels
   this.bubbleHorizontalVelocity = 10; //this is in pixels
   this.animationDelay = 1000; //in milliseconds
   this.gameDelay = 10000; //five seconds game delay
}


ModelOne.prototype.initAllBubbles = function(){
  game.bubbleArea.html("");
  var smodel = new Model();
  var diff = game.numberTwo - game.numberOne;
  for(var x = 0; x < game.bubbleDensity; x++){
      var firstNum =  game.nextRandom(diff);  
      var secondNum = game.nextRandom(diff);
      var bubble = new Bubble(firstNum, secondNum,"+");
      var data = smodel.getRowAndCol(x);
      game.addInitBubble(bubble,data[0],data[1]);
    }
   game.runLater(game.gameModel.gameDelay*0.95,game.disappear);
   game.runLater(game.gameModel.gameDelay,game.gameModel.initAllBubbles);
};

ModelOne.prototype.generateNewBubbles = function(){
  var bubbles = [];
  for(var x = 0; x < game.bubbleNumber; x++){
     var diff = game.numberTwo - game.numberOne;
     var firstNum =  game.nextRandom(diff);  
     var secondNum = game.nextRandom(diff);
     var bubble = new Bubble(firstNum, secondNum,"+");
     bubbles.push(bubble);
  }
  return bubbles;
};





Model.prototype.getRowAndCol = function(x){
    var col = Math.round(Math.abs((Math.floor( (x+1)/game.bubbleNumber)- (x+1)/game.bubbleNumber)/(1/game.bubbleNumber)));
    col = col === 0 ? game.bubbleNumber : col;
    var row = Math.ceil((x+1)/game.bubbleNumber);
    col--;
    row--;
    return [row,col];
};



Model.prototype.modelTwo = function(){
   for(var x = 0; x < game.bubbleDensity; x++){
      var sign = Math.random() > 0.5 ? "+" : "-";
      var firstNum = sign === "-" ?  Math.floor(Math.random()*20) : Math.floor(Math.random()*10);   
      var secondNum = Math.floor(Math.random()*10); 
      firstNum = firstNum < secondNum  ? secondNum : firstNum; //firstNum is always greater than secondnum incase sign is "-"
      sign = firstNum === secondNum ? "+" : "-";
      var bubble = new Bubble(firstNum, secondNum,sign);
      game.addBubble(bubble);
    } 
};