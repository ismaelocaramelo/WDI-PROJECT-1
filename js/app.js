
function Player(name){
  var _name = name;
  var _score = 2;

  this.getName = function(){
    return _name;
  };

  this.addScore = function(){
    _score++;
  };

  this.lessScore = function(){
    _score--;
  };

  this.getScore = function(){
    return _score;
  };

}

$(init);


var player1;
var player2;
var grid = [];
const WIDTH = 4;
const HEIGHT = 4;
var currentTurn = 'B';
var listPosToChangeColor = [];

function init(){
  var name1 = 'isma'; //prompt("Name of the player 1: ");
  var name2 = 'jos';  //prompt("Name of the player 2: ");

  player1 = new Player(name1);
  player2 = new Player(name2);

  for (var line = 0; line < HEIGHT; line++) {
    grid[line] = new Array();
    for (var column = 0; column < WIDTH; column++) {
      grid[line][column] = '';
    }
  }

  grid[HEIGHT/2-1][WIDTH/2-1] = 'W';
  grid[HEIGHT/2-1][WIDTH/2]   = 'B';
  grid[HEIGHT/2][WIDTH/2-1]   = 'B';
  grid[HEIGHT/2][WIDTH/2]     = 'W';
  drawGrid();
}

function changeTurn(){
  if(currentTurn === 'B'){
    currentTurn = 'W';
  }else if (currentTurn === 'W'){
    currentTurn = 'B';
  }
}

function isCellEmpty(line, column){
  return grid[line][column] === '';
}

function drawGrid(){
  var $box = $('.box');

  for (var line = 0; line < HEIGHT; line++) {
    for (var column = 0; column < WIDTH; column++) {
      var letter = grid[line][column];
      $box.append('<div id="'+line+'-'+column+'" class="square'+letter+'" onclick="insertMove(this.id)"></div>');
    }
    $box.append('</br>');
  }
}

function isValidMoved(line, column){
  var isValid = false;

  isValid += isNorthValid(line, column);
  isValid += isSouthValid(line, column);
  isValid += isEastValid(line, column);
  isValid += isOestValid(line, column);
  isValid += isNorthEast(line, column);
  isValid += isSouthEast(line, column);
  isValid += isSouthWest(line, column);
  isValid += isNorthWest(line, column);

  if(!isValid){
    listPosToChangeColor =[];
  }
  return isValid;
}

function insertMove(id){
  listPosToChangeColor = [];
  var line = id.split('-')[0];
  var column = id.split('-')[1];
  if (isCellEmpty(line,column)){
    //The cell is empty
    if(isValidMoved(line, column)){
      changeImage();
      addImage(line,column);
      showScore();
      changeTurn();
      if(!anyPossibleMoves()){
        changeTurn();
        if(!anyPossibleMoves()){
          alert('There is not possible moves');
        }
      }
    }else{
      alert('Invalid move');
    }
  }else{
    alert('Invalid move: The cell is not empty');
  }
}

function isOpositeColor(line, column){
  var opositeColor = (currentTurn==='B') ? 'W': 'B';
  return (grid[line][column]===opositeColor);
}

function changeImage(){
  for (var i = 0; i < listPosToChangeColor.length; i++) {
    var coordenadas = listPosToChangeColor[i];
    grid[coordenadas.line][coordenadas.column] = currentTurn;
    var $square = $('#'+coordenadas.line+ '-'+coordenadas.column);
    $square.attr('class', 'square'+currentTurn);
    if(currentTurn === 'B'){
      player2.addScore();
      player1.lessScore();
    }else if(currentTurn === 'W'){
      player1.addScore();
      player2.lessScore();
    }
  }
}

function addImage(line,column){
  grid[line][column] = currentTurn;
  var $square = $('#'+line+ '-'+column); //document.getElementById(line+ '-'+column)
  $square.attr('class', 'square'+currentTurn);
  if(currentTurn === 'B'){
    player2.addScore();
  }else if(currentTurn === 'W'){
    player1.addScore();
  }

}

function isNorthValid(line, column){
  var listTmpPos = [];
 //para que el movimiento sea valido
 //linea tiene que estar en el dominio:  ]1,HEIGHT[
  if(line>1 && line<HEIGHT){
  //Linea esta en el dominio ]1,HEIGHT[
  //Comprobamos que por encima haya minimo una casilla con el valor contrario;
    var cntOpositeColor=0;
    line--;

    while(line>=0 && isOpositeColor(line,column)){
      cntOpositeColor++;
      listTmpPos.push({'line': line,'column': column});
      line--;
    }

    if(cntOpositeColor>0){
   //si entramos aqui significa que hemos
   //encontrado 1 o más fichas del color opuesto

   //En caso de ser así.
   //ya que hemos ido haciendo line--
   //Comprobamos que en la posición de line actual
   //el color de la casilla sea igual al de nuestro turno.
      if(line>=0 && grid[line][column]===currentTurn){
        listPosToChangeColor = listPosToChangeColor.concat(listTmpPos);
        return true;
      }else{
        return false;
      }
    }else{
   //En caso de no haber encontrado ninguna ficha del color opuesto
   //El movimiento no es valido
      return false;
    }
  }else{
    return false;
  }
}

function isSouthValid(line, column){
  var listTmpPos = [];
  //para que el movimiento sea valido
  //linea tiene que estar en el dominio:  ]0,HEIGHT[
  if(line>=0 && line<HEIGHT-2){
   //Linea esta en el dominio ]1,HEIGHT[
   //Comprobamos que por encima haya minimo una casilla con el valor contrario;
    var cntOpositeColor=0;
    line++;

    while(line<HEIGHT && isOpositeColor(line,column)){
      cntOpositeColor++;
      listTmpPos.push({'line': line,'column': column});
      line++;
    }

    if(cntOpositeColor>0){
    //si entramos aqui significa que hemos
    //encontrado 1 o más fichas del color opuesto

    //En caso de ser así.
    //ya que hemos ido haciendo line--
    //Comprobamos que en la posición de line actual
    //el color de la casilla sea igual al de nuestro turno.
      if(line<HEIGHT && grid[line][column]===currentTurn){
        listPosToChangeColor = listPosToChangeColor.concat(listTmpPos);
        return true;
      }else{
        return false;
      }
    }else{
    //En caso de no haber encontrado ninguna ficha del color opuesto
    //El movimiento no es valido
      return false;
    }
  }else{
    return false;
  }
}

function isEastValid(line, column){
  var listTmpPos = [];
  //para que el movimiento sea valido
  //linea tiene que estar en el dominio:  ]0, WIDTH[
  if(column>=0 && column<WIDTH-2){
   //Linea esta en el dominio ]0, WIDTH[
   //Comprobamos que por encima haya minimo una casilla con el valor contrario;
    var cntOpositeColor=0;
    column++;

    while(column<WIDTH && isOpositeColor(line,column)){
      cntOpositeColor++;
      listTmpPos.push({'line': line,'column': column});
      column++;
    }

    if(cntOpositeColor>0){
    //si entramos aqui significa que hemos
    //encontrado 1 o más fichas del color opuesto

    //En caso de ser así.
    //ya que hemos ido haciendo column++
    //Comprobamos que en la posición de column actual
    //Comprobamos que nos nos pasemos chequando...
      if(column<WIDTH && grid[line][column]===currentTurn){
        listPosToChangeColor = listPosToChangeColor.concat(listTmpPos);
        return true;
      }else{
        return false;
      }
    }else{
    //En caso de no haber encontrado ninguna ficha del color opuesto
    //El movimiento no es valido
      return false;
    }
  }else{
    return false;
  }
}

function isOestValid(line, column){
  var listTmpPos = [];
  //para que el movimiento sea valido
  //linea tiene que estar en el dominio:  ]1, WIDTH[
  if(column>1 && column<WIDTH){
   //Linea esta en el dominio ]0, WIDTH[
   //Comprobamos que por encima haya minimo una casilla con el valor contrario;
    var cntOpositeColor=0;
    column--;

    while(column>=0 && isOpositeColor(line,column)){
      cntOpositeColor++;
      listTmpPos.push({'line': line,'column': column});
      column--;
    }

    if(cntOpositeColor>0){
    //si entramos aqui significa que hemos
    //encontrado 1 o más fichas del color opuesto

    //En caso de ser así.
    //ya que hemos ido haciendo column--
    //Comprobamos que en la posición de column actual
    //el color de la casilla sea igual al de nuestro turno.
      if(column>=0 && grid[line][column]===currentTurn){
        listPosToChangeColor = listPosToChangeColor.concat(listTmpPos);
        return true;
      }else{
        return false;
      }
    }else{
    //En caso de no haber encontrado ninguna ficha del color opuesto
    //El movimiento no es valido
      return false;
    }
  }else{
    return false;
  }
}

function isNorthEast(line, column){
  var listTmpPos = [];
  if((line>1) && (line<HEIGHT) && (column>=0) && (column<WIDTH-2)){

    var cntOpositeColor=0;
    line--;
    column++;

    while((line>=0) && (column <WIDTH) && isOpositeColor(line, column)){
      cntOpositeColor++;
      listTmpPos.push({'line': line,'column': column});
      line--;
      column++;
    }
    if(cntOpositeColor>0){
      if( line>=0 && column<WIDTH && grid[line][column]===currentTurn){
        listPosToChangeColor = listPosToChangeColor.concat(listTmpPos);
        return true;
      }else{
        return false;
      }
    }else{
      return false;
    }
  }else{
    return false;
  }
}

function isNorthWest(line, column){
  var listTmpPos = [];

  if((line>1) && (line<HEIGHT) && (column>1) && (column<WIDTH)){

    var cntOpositeColor=0;
    line--;
    column--;

    while( (line>=0) && (column>=0) && isOpositeColor(line, column)){
      cntOpositeColor++;
      listTmpPos.push({'line': line,'column': column});
      line--;
      column--;
    }
    if(cntOpositeColor>0){
      if( (line>=0 && column>=0) && grid[line][column]===currentTurn){
        listPosToChangeColor = listPosToChangeColor.concat(listTmpPos);
        return true;
      }else{
        return false;
      }
    }else{
      return false;
    }
  }else{
    return false;
  }
}

function isSouthWest(line, column){
  var listTmpPos = [];

  if((line>=0) && (line<HEIGHT-2) && (column>1) && (column<WIDTH)){

    var cntOpositeColor=0;
    line++;
    column--;

    while( (line<HEIGHT) && (column>=0) && isOpositeColor(line, column)){
      cntOpositeColor++;
      listTmpPos.push({'line': line,'column': column});
      line++;
      column--;
    }
    if(cntOpositeColor>0){
      if( (line<HEIGHT && column>=0) && grid[line][column]===currentTurn){
        listPosToChangeColor = listPosToChangeColor.concat(listTmpPos);
        return true;
      }else{
        return false;
      }
    }else{
      return false;
    }
  }else{
    return false;
  }
}

function isSouthEast(line, column){
  var listTmpPos = [];
  if((line>=0) && (line<HEIGHT-2) && (column>=0) && (column<WIDTH-2)){
    var cntOpositeColor=0;
    line++;
    column++;

    while((line<HEIGHT) && (column<WIDTH)  && isOpositeColor(line, column)){
      cntOpositeColor++;
      listTmpPos.push({'line': line,'column': column});
      line++;
      column++;
    }
    if(cntOpositeColor>0){
      if( (line<HEIGHT) && (column<WIDTH)  && grid[line][column]===currentTurn){
        listPosToChangeColor = listPosToChangeColor.concat(listTmpPos);
        return true;
      }else{
        return false;
      }
    }else{
      return false;
    }
  }else{
    return false;
  }
}

function showScore(){
  var $displayScore = $('.scoreBox');
  $displayScore.html(player1.getName()+': '+player1.getScore()+  '<br>'+player2.getName()+': '+player2.getScore()+ '<br><br>');
}

function anyPossibleMoves(){
  var isPossibleMove = false;
  var line = 0;
  while(line<HEIGHT && isPossibleMove === false){
    var column = 0;
    while(column<WIDTH  && isPossibleMove === false){
      if(isCellEmpty(line,column) && isValidMoved(line,column)){
        isPossibleMove = true;
      }
      column++;
    }
    line++;
  }
  return isPossibleMove;
}
