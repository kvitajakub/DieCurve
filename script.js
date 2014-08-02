
//globalni promenne
var canvas;    //objekt canvasu
var context;   // kontext ^^
var pressedKeys={};  //pole pro stisknute znaky - indexuje se podle kodu znaku
                  // jak ho vraci event.which - pressedKeys["M".charCodeAt(0)]

var settingsPlayers=[];
                  
var players=[];
var playersAlive;
var maxPoints;

var speed={   //pole pro promenne pracujici s rychlosti vykreslovani hry
   START:35,         //pocatecni rychlost v milisekundach
   koef:4/10,         //pomer koncove a pocatecni rychlosti
   now:function(players,alive){  //funkce pro vypocet soucasne rychlosti
      return this.START-((this.START-this.koef*this.START)/(players-1))*(players-alive);
   }
}


$(document).ready(function() {
	// vykonani kodu po nacteni kompletnim nacteni stranky
   canvas=document.getElementById("herniPlocha");
   context=canvas.getContext("2d");
   
   //naveseni funkce pro zapamatovani si stisknuti klavesy
   $("body").keydown(function(event){
      pressedKeys[event.which] = true;
   });
   //funkce pro pusteni klavesy
   $("body").keyup(function(event){
      pressedKeys[event.which] = false;
   });
   //co udela stlaceni tlacitek menu
   $("#buttonLokHra").click(function(){changePage('nastaveni');});
   $("#buttonSitHra").click(function(){changePage('sitoveNastaveni');});
   $("#buttonTutor").click(function(){changePage('tutorial');});
   $("#buttonAutor").click(function(){changePage('credits');});
   //tlacitka zpet a dopredu
   $("#nastaveni .imgBack").click(function(){changePage('main');});
   $("#nastaveni .imgForw").click(function(){changePage('hra');});
   $("#sitoveNastaveni .imgBack").click(function(){changePage('main');});
   $("#credits .imgBack").click(function(){changePage('main');});
   $("#tutorial .imgBack").click(function(){changePage('main');});
   $("#tutorial .imgForw").click(function(){changePage('tutorial2');});
   $("#tutorial2 .imgBack").click(function(){changePage('tutorial');});
   $("#tutorial2 .imgForw").click(function(){changePage('tutorial3');});
   $("#tutorial3 .imgBack").click(function(){changePage('tutorial2');});
   $("#tutorial3 .imgForw").click(function(){changePage('main');});
   $("#hra .imgForw").click(function(){changePage('endGame');});
   $("#endGame .imgForw").click(function(){changePage('main');});
   //tlacitka se pri stisknuti meni
   $(".imgForw").mouseover(function(){$(this).attr("src","img/forwardInverted.png")});
   $(".imgForw").mouseleave(function(){$(this).attr("src","img/forward.png")});
   $(".imgForw").mousedown(function(){$(this).attr("src","img/forwardInverted.png").css("margin-top","3px");});
   $(".imgForw").mouseup(function(){$(this).attr("src","img/forward.png").css("margin-top","0px");});
   
   $(".imgBack").mouseover(function(){$(this).attr("src","img/backInverted.png")});
   $(".imgBack").mouseleave(function(){$(this).attr("src","img/back.png")});
   $(".imgBack").mousedown(function(){$(this).attr("src","img/backInverted.png").css("margin-top","3px");});
   $(".imgBack").mouseup(function(){$(this).attr("src","img/back.png").css("margin-top","0px");});
   
   //aktivuju tlacitko na pridavani hracu - plus
   $("#nastaveni .add_player_img").click(function(event){settingsAddPlayer(event);});
   $("#nastaveni .add_player_img").mousedown(function(event){$(this).css("margin-top","1px");});
   $("#nastaveni .add_player_img").mouseup(function(event){$(this).css("margin-top","0px");});
   
   //pridam prvni dva hrace
   settingsAddPlayer(jQuery.Event("click"));
   settingsAddPlayer(jQuery.Event("click"));
   
});

function settingsAddPlayer(event){

   event.stopImmediatePropagation();  //zabranuje opakovanemu volani
                                    //bez toho to vzdycky jelo dvakrat na jedno kliknuti

//html nastaveni jednoho hrace
   var playerNode='<tr>\
             <div class="add_player1">\
               <td>\
               <div class="colourPicker">\
                  <p>\
                     <select>\
                        <option value="ffffff">#ffffff</option>\
                        <option value="ffccc9">#ffccc9</option>\
                        <option value="ffce93">#ffce93</option>\
                        <option value="fffc9e">#fffc9e</option>\
                        <option value="ffffc7">#ffffc7</option>\
                        <option value="9aff99">#9aff99</option>\
                        <option value="96fffb">#96fffb</option>\
                        <option value="cdffff">#cdffff</option>\
                        <option value="cbcefb">#cbcefb</option>\
                        <option value="cfcfcf">#cfcfcf</option>\
                        <option value="fd6864">#fd6864</option>\
                        <option value="fe996b">#fe996b</option>\
                        <option value="fffe65">#fffe65</option>\
                        <option value="fcff2f">#fcff2f</option>\
                        <option value="67fd9a" selected="selected">#67fd9a</option>\
                        <option value="38fff8">#38fff8</option>\
                        <option value="68fdff">#68fdff</option>\
                        <option value="9698ed">#9698ed</option>\
                        <option value="c0c0c0">#c0c0c0</option>\
                        <option value="fe0000">#fe0000</option>\
                        <option value="f8a102">#f8a102</option>\
                        <option value="ffcc67">#ffcc67</option>\
                        <option value="f8ff00">#f8ff00</option>\
                        <option value="34ff34">#34ff34</option>\
                        <option value="68cbd0">#68cbd0</option>\
                        <option value="34cdf9">#34cdf9</option>\
                        <option value="6665cd">#6665cd</option>\
                        <option value="9b9b9b">#9b9b9b</option>\
                        <option value="cb0000">#cb0000</option>\
                        <option value="f56b00">#f56b00</option>\
                        <option value="ffcb2f">#ffcb2f</option>\
                        <option value="ffc702">#ffc702</option>\
                        <option value="32cb00">#32cb00</option>\
                        <option value="00d2cb">#00d2cb</option>\
                        <option value="3166ff">#3166ff</option>\
                        <option value="6434fc">#6434fc</option>\
                        <option value="656565">#656565</option>\
                        <option value="9a0000">#9a0000</option>\
                        <option value="ce6301">#ce6301</option>\
                        <option value="cd9934">#cd9934</option>\
                        <option value="999903">#999903</option>\
                        <option value="009901">#009901</option>\
                        <option value="329a9d">#329a9d</option>\
                        <option value="3531ff">#3531ff</option>\
                        <option value="6200c9">#6200c9</option>\
                        <option value="343434">#343434</option>\
                        <option value="680100">#680100</option>\
                        <option value="963400">#963400</option>\
                        <option value="986536">#986536</option>\
                        <option value="646809">#646809</option>\
                        <option value="036400">#036400</option>\
                        <option value="34696d">#34696d</option>\
                        <option value="00009b">#00009b</option>\
                        <option value="303498">#303498</option>\
                        <option value="000000">#000000</option>\
                        <option value="330001">#330001</option>\
                        <option value="643403">#643403</option>\
                        <option value="663234">#663234</option>\
                        <option value="343300">#343300</option>\
                        <option value="013300">#013300</option>\
                        <option value="003532">#003532</option>\
                        <option value="010066">#010066</option>\
                        <option value="340096">#340096</option>\
                     </select>\
               </p>\
               </div>\
             </td>\
             <td>\
                 <span class="player_name">\
                     <input size="18" maxlength="13"/>\
                 </span>\
             </td>\
             <td>\
                 <span class="player_control">\
                     <select>\
                         <option>Q W</option>\
                         <option>A S</option>\
                         <option>X C</option>\
                         <option>E R</option>\
                         <option>D F</option>\
                         <option>V B</option>\
                         <option>G H</option>\
                         <option>N M</option>\
                         <option>U I</option>\
                         <option>J K</option>\
                         <option>O P</option>\
                     </select>\
                 </span>\
             </td>\
             <td>\
                 <span class="player_delete">\
                     <img class="player_delete_img" src="img/minus.png" width="30px" height="30px" alt="delete">\
                 </span>\
             </td>\
             </div>\
      </tr>';
   
   $("#hraci table").append(playerNode);
   
   //nastavi random barvu
   $(".colourPicker:last option")[Math.floor(Math.random() * $(".colourPicker:last option").length)].selected = true;
   //nastavi random ovladani
   $(".player_control:last option")[Math.floor(Math.random() * $(".player_control:last option").length)].selected = true;
   
   $('.colourPicker select:last').colourPicker({
    ico:    'img/jquery.colourPicker.png', 
    title:    false
   });
   
   
   $(".player_delete_img").css("margin-bottom","1px");
   
   $(".player_delete_img").click(function(event){settingsRemovePlayer(event);});
   $(".player_delete_img").mousedown(function(event){$(this).css("margin-top","1px").css("margin-bottom","0px");});
   $(".player_delete_img").mouseup(function(event){$(this).css("margin-top","0px").css("margin-bottom","1px");});
   
   $("#hraci").animate({ scrollTop: $("#hraci table").height() }, "fast");
}

function settingsRemovePlayer(event){
   
  // event.stopImmediatePropagation();  
   $(event.currentTarget).parents("tr").remove(); 
}

//konstruktor cerva hrace
var Player = function (Name,Color,LeftKeyCode,RightKeyCode){

   //uhel hrace je v canvasu kvuli smeru os nasmerovan takto:
   //[0,0] x->
   // y             270?
   // |       180?        0?
   // V             90?         

   this.x = 0;   //X-souradnice
   this.y = 0;   //Y-souradnice
   this.angle = 0; //uhel
   this.color = Color;  //barva
   this.name = Name;  //jmeno hrace
   
   this.points=0; //body hrace
   
   this.turningSpeed = 8; // rychlost zataceni(pocet stupnu)-nemusi se menit
   this.speed=3; //rychlost posunu-nasobi se tim konstantni delta
   
   this.leftKeyCode = LeftKeyCode;    //klavesa pro zataceni doleva
   this.rightKeyCode = RightKeyCode;  //klavesa pro zataceni doprava
   
   this.alive = true;       //genericky ukazatel stavu hrace
   this.justKilled = false; //priznak ktery se nastavi kdyz hrac umre - neni nutny ale pomuze
   
   this.step = function(){ //metoda co popojde hadem o jeden krok
      
      //pokud je nazivu tak neco delam
      if(this.alive){
         //zapnu si malovani a presunu se na zacatek
         context.strokeStyle = this.color;
         context.beginPath();
         context.moveTo(this.x,this.y);
         
         //zmenim uhel podle zataceni
         if(pressedKeys[this.rightKeyCode]){
            this.angle=(this.angle+this.turningSpeed)%360;
         }   
         if(pressedKeys[this.leftKeyCode]){
            this.angle=(this.angle-this.turningSpeed);
            if(this.angle<0)
               this.angle+=360;
         }
         
         //posunu se na dalsi pozici
         this.x+=this.speed*delta.x[this.angle];
         this.y+=this.speed*delta.y[this.angle];
         
         var lookAheadX = this.x+(context.lineWidth/2)*delta.x[this.angle];
         var lookAheadY = this.y+(context.lineWidth/2)*delta.y[this.angle];
         
         //zjistim jestli nejsem mimo canvas
         if(lookAheadX<=0 || lookAheadX>=canvas.width ||
            lookAheadY<=0 || lookAheadY>=canvas.height){
            
            this.alive = false;
            this.justKilled = true;
         }
         else{ 
            var pixel = context.getImageData(lookAheadX,lookAheadY,1,1);
            //zjistim jestli to je neco jineho nez pozadi
            //pixel na pozadi ma hodnoty[0,0,0,0]
            if(pixel.data[0]!=0 || 
               pixel.data[1]!=0 || 
               pixel.data[2]!=0 || 
               pixel.data[3]!=0){

               this.alive = false;
               this.justKilled = true;
            }
               
            //i kdybych do neceho narazil tak maluju
            context.lineTo(this.x,this.y);
            context.stroke();

         } //else srazka  
      }// if alive
  
   };// metoda step();
   
   this.printStartPosition = function(){//vytiskne bod ve kterem prave je
      
      //pocatecni bod
      context.fillStyle = this.color;
      context.beginPath();
      context.arc(this.x, this.y, context.lineWidth/2, 0, Math.PI*2, true);
      context.fill();
      
      //sipka kam pojede
      //pouzivaji se transformace a ukladani stavu kontextu na zasobnik
      context.save();
         
         context.translate(this.x+5*delta.x[this.angle],this.y+5*delta.y[this.angle]);
         context.rotate((this.angle)*Math.PI/180);
               
         context.strokeStyle = "rgba(240,240,0,255)";
         context.lineWidth = 1;  
         context.beginPath();
         context.moveTo(0,0);
         context.lineTo(25,0);
         context.closePath();
         context.stroke();       
         
         context.lineWidth = 5;  
         
         context.beginPath();
         context.moveTo(25,0);
         context.lineTo(20,-5);
         context.moveTo(25,0);
         context.lineTo(20,5);
         
         context.stroke();
      
      context.restore();
   
   }
   
   this.clearStartDirection = function(){ //smaze to pocatecni caru-sipku smeru
      
      context.save();
         
         context.lineWidth = 6;  
         
         context.globalCompositeOperation = "destination-out";
         
         context.translate(this.x+5*delta.x[this.angle],this.y+5*delta.y[this.angle]);
         context.rotate((this.angle)*Math.PI/180);
         
         context.beginPath();
         context.moveTo(0,0);
         context.lineTo(25,0);
         context.lineTo(20,-5);
         context.moveTo(25,0);
         context.lineTo(20,5);
         context.stroke();
      
      context.restore();
      
   }
   
};//konstruktor Player();

function changePage(kam){

   if(kam=="hra"){
      if($("#hraci tr").length<=1){
         alert("Hra je urcena pro dva a vice hracu.");
         return;
      }
      else
         startGame();
   }


   $("#main").removeClass().addClass("hide");
   $("#nastaveni").removeClass().addClass("hide");
   $("#sitoveNastaveni").removeClass().addClass("hide");
   $("#credits").removeClass().addClass("hide");
   $("#hra").removeClass().addClass("hide");
   $("#tutorial").removeClass().addClass("hide");
   $("#tutorial2").removeClass().addClass("hide");
   $("#tutorial3").removeClass().addClass("hide");
   $("#endGame").removeClass().addClass("hide");
   
   $("#"+kam).removeClass().addClass("show");
   
   endGame=true;
   
   if(kam=="endGame"){
      playersAlive=0;
      printStats();
   }
   
}

function startGame(){

   //vycistim pole hracu
   players=[];
   
   //projdu radky tabulky a pro kazdy pridam hrace
   $("#hraci tr").each(function(index){      
      //jednotlive promenne co jsou oznacene u hrace
      var color = $(this).find(".colourPicker input").css("background-color");
      var name = $(this).find(".player_name input").val();
      var control1 = $(this).find(".player_control select option:selected").text();
      var control2;
      
      control2 = control1.charCodeAt(2);
      control1 = control1.charCodeAt(0);
      
      players.push(new Player(name,color,control1,control2));
      
   });
   
   maxPoints=$("#pocetBodu").val();
   
   startRound();
}

//funce vycisti canvas a zacne novou hru
function startRound(){
   
   //nastavim parametry canvasu
   context.clearRect(0,0,canvas.width,canvas.height);
   context.lineWidth = 4;
   context.lineCap = "round";
   
   //nastavim pocet zivych hracu
   playersAlive=players.length;
  
   //inicializuju hrace
   for(var i=0;i<players.length;i++){
      
      players[i].alive=true;
      
      players[i].x= Math.floor(Math.random()*(canvas.width-100)+50);
      players[i].y= Math.floor(Math.random()*(canvas.height-100)+50);
      players[i].angle= Math.floor(Math.random()*360);
      
      players[i].printStartPosition();
   }
   
   printPoints();
  
   // aktivace mainu
   setTimeout(function(){
   
      // smaze pocatecni sipku
      for(var i=0;i<players.length;i++)
         players[i].clearStartDirection();
      // zavola loop ktery se uz pak vola sam
     roundLoop();
   },2000);
}

//vsechno co se ma delat v realnem case ve hre
function roundLoop(){
   
  // konstanty posunu  - pristupuje se k ni takto> delta.x[0]; 

  for(var i=0;i<players.length;i++){
   
      //udelam krok jednoho cerva
      players[i].step();
      //pokud ho to zabilo tak to zpracuju
      if(players[i].justKilled){
         players[i].justKilled=false;
         
         players[i].points+=players.length-playersAlive;    //obodujeme ho podle vykonu
         
         playersAlive--; //snizime pocet hracu  
         
         printPoints();
      }
  }
  
  if($("#hra").hasClass("show")){
      //pokud mam zobrazeno tak neco delam
      if(playersAlive>1){
         //jeste ma kdo soutezit tak je necham
         setTimeout("roundLoop()",speed.now(players.length,playersAlive));
      }
      else{
         //uz tam je jen jeden nebo nikdo takze skocim
         for(var i=0;i<players.length;i++){  
            //najdu survivora a oboduju ho
            if(players[i].alive){
               // players[i].alive=false;
               players[i].points+=players.length-playersAlive;    //obodujeme ho podle vykonu
               
               playersAlive--; //snizime pocet hracu  
            
               printPoints();
            }
         }
         
         //pokud uz nekdo dosahl maxima bodu tak koncim uplne
         if(players[0].points>=maxPoints){
            setTimeout(function(){changePage('endGame');},800);
         }
         else{
            //zacnu nove kolo
            setTimeout("startRound()",1500);
         }
      }
  }
}

//vezme hrace a seradi je podle poctu bodu a vytiskne na okraj planu
function printPoints(){

   players.sort(function(a,b){
      return(b.points - a.points);
   });
      
   var text="";   
      
   $("#res").html("Cil: "+maxPoints+" bodu<br/><br/>");
   
      for(var i=0;i<players.length;i++){
        text='<div>';
        //zive hrace oznacim hvezdickou
        if(players[i].alive)
            text+="<img class='srdce' src='img/heart1.png' alt='zijes'> ";
        else
            text+="<img class='kriz' src='img/kriz1.png' alt='zijes'> ";
        //jmeno a pocet bodu hrace
        text+=players[i].name+" "+players[i].points;
        
        text+="</div>";
        //odradkovani
        
         $("#res").append(text);
         
         $("#res div:last").css({"color":players[i].color});
      }
   
     // $("#res").append("<br/>Rychlost: "+speed.now(players.length,playersAlive));

}

//vypise statistiky na konci hry
function printStats(){

   players.sort(function(a,b){
      return(b.points - a.points);
   });
   
   $("#vysledky").html("");
   var text="";
   for(var i=0;i<players.length;i++){
      
   text="<tr><td>";
      text+=players[i].name;
   text+="</td><td>"
      text+= players[i].points;
   text+="</td></tr>";
   $("#vysledky").append(text);
   $("#vysledky tr:last td:first").css({"color":players[i].color});     
      
   }
   
}

//EOF