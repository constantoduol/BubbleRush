function BubbleGame(model){
   this.bubbleArea = $("#bubble-table");
   this.bubbleNumber = 4; //number of bubbles across the screen
   var width = this.getDim()[0];
   var height = this.getDim()[1];
   var factor = width > height ? 2/3 : 1; 
   if( (width/height) > 0.7 && (width/height) <= 1 ){
       factor = 2/3;
   }
   var gameWidth = width > height ? height : width;
   this.bubbleMargin = 5; // 5px
   this.bubbleDiameter = parseInt( ((gameWidth*factor) / (this.bubbleNumber + 0.5)) - this.bubbleMargin); //diameter in pixels
   this.bubbleAreaSpacing = (width - (this.bubbleDiameter * this.bubbleNumber))/(this.bubbleNumber+1);
   this.bubbleDensity = this.bubbleNumber*3; //this is the number of bubbles in the bubble area
   this.bubbleVerticalVelocity = model.bubbleVerticalVelocity; //this is in pixels/second
   this.bubbleHorizontalVelocity = model.bubbleHorizontalVelocity;
   this.activeBubbles = [];
   this.bubbleIds = [];
   this.numberOne = 0;
   this.numberTwo = 10;
   this.animationDelay = model.animationDelay; //in milliseconds
   this.moveFactor = 1; //this is the movement factor upwards
   this.processAnimation = true;
   this.gameModel = model;
   this.bubbleArea.css("border-spacing",this.bubbleAreaSpacing+"px");
   this.bubbleArea.css("border-collapse","separate");
}


BubbleGame.prototype.nextRandom = function (len){
   return Math.floor(Math.random()*len); 
};

BubbleGame.prototype.getDim = function(){
    var body = window.document.body;
    var screenHeight;
    var screenWidth;
    if (window.innerHeight) {
        screenHeight = window.innerHeight;
        screenWidth = window.innerWidth;
    }
    else if (body.parentElement.clientHeight) {
        screenHeight = body.parentElement.clientHeight;
        screenWidth = body.parentElement.clientWidth;
    }
    else if (body && body.clientHeight) {
        screenHeight = body.clientHeight;
        screenWidth = body.clientWidth;
    }
    return [screenWidth, screenHeight];  
};

BubbleGame.prototype.init = function(){
    this.gameModel.initAllBubbles();
    this.runLater(game.animationDelay,this.animate);
    this.runLater(this.gameModel.gameDelay*0.95,this.disappear);
    this.runLater(this.gameModel.gameDelay,this.gameModel.initAllBubbles);
};


BubbleGame.prototype.disappear = function(){
  for(var x = 0; x < game.bubbleIds.length; x++){
     var id = game.bubbleIds[x];
     $("#"+id).addClass("old-bubble");
  }
};

BubbleGame.prototype.addInitBubble = function (newBubble,row,col){
    var currentRow;
    var rowId = "row_"+row;
    if( (col + game.bubbleNumber) % game.bubbleNumber === 0){
       currentRow = $("<tr id="+rowId+">");
       this.bubbleArea.append(currentRow);
     }
     else{
        currentRow = $("#"+rowId); 
     }
    var width = this.bubbleDiameter+"px";
    var radius = this.bubbleDiameter/2 + "px";
    var fontSize = parseInt(this.bubbleDiameter/3) + "px";
    var str = newBubble.firstNum + newBubble.sign + newBubble.secondNum + "";
    var td_id = "td_"+row+"_"+col;
    var currentItem = $("<td id="+td_id+" style='padding-bottom : 15px;'>");
    var bubbleDiv = $("<div class='circle' style='width : "+width+";height : \n\
                      "+width+";line-height:"+width+";border-radius:"+radius+";\n\
                      font-size:"+fontSize+";'>"+str+"</div>");
    currentItem.append(bubbleDiv);
    var bubbleDivId = "bubble_"+row+"_"+col;
    bubbleDiv.attr("id",bubbleDivId);
    bubbleDiv.addClass("new-bubble");
    newBubble.id = bubbleDivId; 
    currentRow.append(currentItem); 
    this.activeBubbles.push(newBubble);
    this.bubbleIds.push(newBubble.id);
};

//here we add a bubble to replace one that has already gone beyond the view scope
BubbleGame.prototype.addSubsequentBubbles = function(bubbles){
    var row = game.moveFactor + 1;
    var newRowId = "row_"+row;
    var newRow = $("<tr id = "+newRowId+">");
    var width = this.bubbleDiameter + "px";
    var radius = this.bubbleDiameter/2 + "px";
    var fontSize = parseInt(this.bubbleDiameter/3) + "px";
    for(var x = 0; x < bubbles.length; x++){
        var col = x;
        var td_id = "td_"+row+"_"+col;
        var currentItem = $("<td id="+td_id+">");
        var str = bubbles[x].firstNum + bubbles[x].sign + bubbles[x].secondNum + "";
        var bubbleDiv = $("<div class='circle' style='width : "+width+";height : \n\
                     "+width+";line-height:"+width+";border-radius:"+radius+";\n\
                      font-size:"+fontSize+";'>"+str+"</div>");
        var bubbleDivId = "bubble_"+row+"_"+col;
        bubbleDiv.attr("id",bubbleDivId);
        bubbleDiv.addClass("new-bubble");
        bubbles[x].id = bubbleDivId;
        currentItem.html(bubbleDiv);
        newRow.append(currentItem);
        this.activeBubbles.push(bubbles[x]);
        this.bubbleIds.push(bubbles[x].id);
        
    }
    this.bubbleArea.append(newRow);
    
};

BubbleGame.prototype.animate = function(){
  //the strategy is to destroy bubbles once they cross the bubbleAreaTop
  //and recreate them at the bottom of the bubble area 
 
  function runAnimation(){
      for(var x = 0; x < game.activeBubbles.length; x++){
          var bubbleDiv = $("#"+game.activeBubbles[x].id);
          var left = Math.floor(Math.random()*game.bubbleHorizontalVelocity)+"px";
          bubbleDiv.addClass("motion");
          bubbleDiv.css("left",left);   
          var top = Math.floor(Math.random()*game.bubbleVerticalVelocity)+"px";
          bubbleDiv.css("top",top);
        
       }
         game.moveFactor++;
         //generate new bubbles here
        // var bubbles = game.gameModel.generateNewBubbles();
       
         //game.addSubsequentBubbles(bubbles);
         //depending on the game move factor, we destroy higher bubbles and remove them from the refresh cycle
      
     
        
    
    game.runLater(game.animationDelay,game.animate); 
  }
  
 
  
  if(window.requestAnimationFrame){
     window.requestAnimationFrame(function(){
        runAnimation();
     }); 
  }
  else {
     runAnimation(); 
  }

};

BubbleGame.prototype.runLater = function (limit, func) {
    return setTimeout(func, limit);
};