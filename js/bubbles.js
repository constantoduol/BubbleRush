function BubbleGame(model){
   this.bubbleArea =  $("#bubble-table");
   this.progressBar = $("#progressbar");
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
   this.bubbleAreaSpacing = (width - (this.bubbleDiameter * this.bubbleNumber))/(this.bubbleNumber + 1.6);
   this.bubbleDensity = this.bubbleNumber*3; //this is the number of bubbles in the bubble area
   this.bubbleVerticalVelocity = model.bubbleVerticalVelocity; //this is in pixels/second
   this.bubbleHorizontalVelocity = model.bubbleHorizontalVelocity;
   this.activeBubbles = [];
   this.bubbleIds = [];
   this.numberOne = 0;
   this.numberTwo = 10;
   this.animationDelay = model.animationDelay; //in milliseconds
   this.moveFactor = 0; 
   this.progressAnimationDelay = 100;
   this.timeoutData = {};
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
    game.clearAllTimers();
    game.moveFactor = 0;
    this.gameModel.initAllBubbles();
    var progressTimer = this.runLater(this.progressAnimationDelay,this.animateProgress);
    game.timeoutData.progress_timer = progressTimer;

};

BubbleGame.prototype.animateProgress = function(){
     game.progressBar.progressbar({
         value : (100 -  game.moveFactor)
      });
     var progressTimer = game.runLater(game.progressAnimationDelay,game.animateProgress);
     game.timeoutData.progress_timer = progressTimer;
     game.moveFactor++;
     game.moveFactor = game.moveFactor === 100 ? 0 : game.moveFactor;
     if(game.moveFactor > 70){
       game.progressBar.css("border-color","red");
       game.progressBar.children().css("border-color","red");
       game.progressBar.children().css("background","red");
      
     }
     else {
       game.progressBar.css("border-color","#51CBEE");
       game.progressBar.children().css("border-color","#51CBEE");
       game.progressBar.children().css("background","#51CBEE");  
     }
};

BubbleGame.prototype.disappear = function(){
  for(var x = 0; x < game.bubbleIds.length; x++){
     var id = game.bubbleIds[x];
     var bubble =  $("#"+id);
     bubble.addClass("old-bubble");
     game.runLater(100,function(){
       bubble.removeClass("old-bubble"); 
    });
  }
};

BubbleGame.prototype.clickBubble = function(bubbleId){
   var bubble = $("#"+bubbleId);
   bubble.addClass("explode");
   //remove the bubble as an active bubble
   var index = game.bubbleIds.indexOf(bubbleId);
   game.bubbleIds.splice(index);
   game.activeBubbles.splice(index);
   game.runLater(1000,function(){
      //bubble.remove(); 
      game.disappear();
      game.init();
   });
   
   
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
     var bubbleDivId = "bubble_"+row+"_"+col;
    var bubbleDiv = $("<div onclick='game.clickBubble(\""+bubbleDivId+"\")' class='circle' style='width : "+width+";height : \n\
                      "+width+";line-height:"+width+";border-radius:"+radius+";\n\
                      font-size:"+fontSize+";'>"+str+"</div>");
    currentItem.append(bubbleDiv);
    bubbleDiv.attr("id",bubbleDivId);
    bubbleDiv.addClass("new-bubble");
    game.runLater(100,function(){
       bubbleDiv.removeClass("new-bubble"); 
    });
    newBubble.id = bubbleDivId; 
    currentRow.append(currentItem); 
    this.activeBubbles.push(newBubble);
    this.bubbleIds.push(newBubble.id);
};
/*
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
*/

/*
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
        // game.runLater(game.gameModel.gameDelay,game.animateProgress);
         game.runLater(game.animationDelay,game.animate); 
      }
      if(window.requestAnimationFrame){
          window.requestAnimationFrame(function(){
              //runAnimation();
              game.animateProgress();
          }); 
      }
      else {
          //runAnimation(); 
          game.animateProgress();
      }
};
*/
BubbleGame.prototype.runLater = function (limit, func) {
    return setTimeout(func, limit);
};

BubbleGame.prototype.clearAllTimers = function(){
   for(var timer in game.timeoutData){
       var timeout = game.timeoutData[timer];
       clearTimeout(timeout);
   } 
   game.timeoutData = {};
};