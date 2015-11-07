var rowsRed = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
var rowsBlack = ['H', 'G', 'F', 'E', 'D', 'C', 'B', 'A'];
var rows = rowsRed;
var cells = ['A1', 'A3', 'A5', 'A7', 'B2', 'B4', 'B6', 'B8', 'C1', 'C3', 'C5', 'C7', 'D2', 'D4', 'D6', 'D8', 'E1', 'E3', 'E5', 'E7', 'F2', 'F4', 'F6', 'F8', 'G1', 'G3', 'G5', 'G7', 'H2', 'H4', 'H6', 'H8'];
var activeCell, lastPlayed, target;
var selected = false;
var checkerImg = 'red.png';
var kingImg = 'redKing.png';
var currentPlayer = 'red';
var waitingPlayer = 'black';
var locked = false;
var haveToSteal = [];
var doublePossibility = false;
var redScore = 0;
var blackScore = 0;
var moveableCheckers = ['C1', 'C3', 'C5', 'C7'];

// Changing parameters at the end of each turns 
var playerSwitch = function() {
  doublePossibility = false;
  if (currentPlayer === 'red') {
    rows = rowsBlack;
    currentPlayer = 'black';
    waitingPlayer = 'red';
    checkerImg = 'black.png';
    kingImg = 'blackKing.png';
  } else {
    rows = rowsRed;
    currentPlayer = 'red';
    waitingPlayer = 'black';
    checkerImg = 'red.png';
    kingImg = 'redKing.png';
  }
  moveable();
  forceCheck();
};
// Creating a new array of all the checkers tha are eligible to move this turn
var moveable = function() {
    moveableCheckers = [];
     cells.forEach(function(el) {
      if ($('#' + el).hasClass(currentPlayer)) {
        var cell = el.split('');
        var movePoint1 = rows[rows.indexOf(cell[0]) + 1] + (cell[1] - 1);
        var jumpPoint1 = rows[rows.indexOf(cell[0]) + 2] + (cell[1] - 2);
        var movePoint2 = rows[rows.indexOf(cell[0]) + 1] + (cell[1] * 1 + 1);
        var jumpPoint2 = rows[rows.indexOf(cell[0]) + 2] + (cell[1] * 1 + 2);
        if ($('#' + el).hasClass('king')) {
          var movePoint3 = rows[rows.indexOf(cell[0]) - 1] + (cell[1] - 1);
          var jumpPoint3 = rows[rows.indexOf(cell[0]) - 2] + (cell[1] - 2);
          var movePoint4 = rows[rows.indexOf(cell[0]) - 1] + (cell[1] * 1 + 1);
          var jumpPoint4 = rows[rows.indexOf(cell[0]) - 2] + (cell[1] * 1 + 2);
        }
          var movePairs = [[movePoint1,jumpPoint1],[movePoint2,jumpPoint2],[movePoint3,jumpPoint3],[movePoint4,jumpPoint4]];
        movePairs.forEach(function(array){
          if (cells.indexOf(array[0]) > -1 && $('#' + array[0]).contents().length == 0) {
            moveableCheckers.push(el);
          }
          else if(cells.indexOf(array[1]) > -1 && $('#' + array[0]).hasClass(waitingPlayer) && $('#' + array[1]).contents().length == 0){
            moveableCheckers.push(el);
          }
          })
        }
      })
    };
// Checking for steal oportunities and limiting eligible moves
var forceCheck = function() {
  haveToSteal = [];
  locked = false;
  var targetCheck = function(el) {
      var cell = el.split('');
      var potentialTarget1 = rows[rows.indexOf(cell[0]) + 1] + (cell[1] - 1);
      var landingPoint1 = rows[rows.indexOf(cell[0]) + 2] + (cell[1] - 2);
      var potentialTarget2 = rows[rows.indexOf(cell[0]) + 1] + (cell[1] * 1 + 1);
      var landingPoint2 = rows[rows.indexOf(cell[0]) + 2] + (cell[1] * 1 + 2);
      if ($('#' + el).hasClass('king')) {
        var potentialTarget3 = rows[rows.indexOf(cell[0]) - 1] + (cell[1] - 1);
        var landingPoint3 = rows[rows.indexOf(cell[0]) - 2] + (cell[1] - 2);
        var potentialTarget4 = rows[rows.indexOf(cell[0]) - 1] + (cell[1] * 1 + 1);
        var landingPoint4 = rows[rows.indexOf(cell[0]) - 2] + (cell[1] * 1 + 2);
        if ($('#' + potentialTarget3).hasClass(waitingPlayer) && ($('#' + landingPoint3).contents().length == 0) && cells.indexOf(landingPoint3) > -1) {
          locked = true;
          haveToSteal.push(el);
        }
        if ($('#' + potentialTarget4).hasClass(waitingPlayer) && ($('#' + landingPoint4).contents().length == 0) && cells.indexOf(landingPoint4) > -1) {
          locked = true;
          haveToSteal.push(el);
        }
      }
      if ($('#' + potentialTarget1).hasClass(waitingPlayer) && ($('#' + landingPoint1).contents().length == 0) && cells.indexOf(landingPoint1) > -1) {
        locked = true;
        haveToSteal.push(el);
      }
      if ($('#' + potentialTarget2).hasClass(waitingPlayer) && ($('#' + landingPoint2).contents().length == 0) && cells.indexOf(landingPoint2) > -1) {
        locked = true;
        haveToSteal.push(el);
      }
  }
  doublePossibility ? targetCheck(lastPlayed) : moveableCheckers.forEach(targetCheck);
  if (haveToSteal.length === 0) {
    locked = false;
    doublePossibility = false;
  }
}
// Moving checker from one cell to another
var moveChecker = function(e) {
  var row = e.getAttribute('id').split('')[0];
  $(activeCell).empty();
  $(activeCell).removeClass('selected');
  $(activeCell).removeClass(currentPlayer);
  if (rows.indexOf(row) === rows.length - 1) {
    $(e).append("<img src=" + kingImg + ">");
    $(e).addClass('king');
  } else if ($(activeCell).hasClass('king')) {
    $(e).append("<img src=" + kingImg + ">");
    $(e).addClass('king');
    $(activeCell).removeClass('king');
  } else {
    $(e).append("<img src=" + checkerImg + ">");
  }
  $(e).addClass(currentPlayer);
  $("#actionList ul").prepend("<li>"+currentPlayer.toUpperCase()+" moved from "+$(activeCell).attr('id')+" to "+$(e).attr('id')+"</li>")
  lastPlayed = $(e).attr('id');
  selected = false;
  moveable();
  forceCheck();
  if (!doublePossibility) {
    playerSwitch();
  }
};
// Stealing opponent's checker and calling move function
var stealChecker = function(e) {
  $(target).empty();
  $(target).removeClass(waitingPlayer);
  $(target).removeClass('king');
  doublePossibility = true;
  scoreBoard();
  moveChecker(e);
  scoreCheck();
}
// Updating score on screen
var scoreBoard = function() {
  currentPlayer === 'red' ? redScore++ : blackScore++
    $("#redscore").text(redScore);
  $("#blackscore").text(blackScore);
}
// Checking the score to determine if the game is over
var scoreCheck = function() {
  if (redScore === 12) {
    alert("Red Player Won!");
    $('#restart').click();
  } else if (blackScore === 12) {
    alert("Black player Won!");
    $('#restart').click();
  }
}
// Selecting checkers and calling steal or move base on conditions
var selectingAndMoving = function(element) {
  var curPosition, newPosition, cellDif, rowDif;
  var parameters = function(curCell, newCell) {
    curPosition = $(curCell).attr('id').split('');
    newPosition = $(newCell).attr('id').split('');
    cellDif = newPosition[1] - curPosition[1];
    rowDif = rows.indexOf(newPosition[0]) - rows.indexOf(curPosition[0]);
  }
  var cellSelection = function(actCell, newCell) {
    $(actCell).removeClass('selected');
    $(newCell).addClass('selected');
    activeCell = newCell;
    selected = true;
  }
  var stealPattern = function(e) {
    if (rowDif == 2) {
      if (cellDif == -2) {
        var potentialTarget = rows[rows.indexOf(curPosition[0]) + 1] + (curPosition[1] - 1);
        if ($("#" + potentialTarget).hasClass(waitingPlayer)) {
          target = $('#' + potentialTarget);
          stealChecker(e);
        }
      } else if (cellDif == 2) {
        var potentialTarget = rows[rows.indexOf(curPosition[0]) + 1] + (curPosition[1] * 1 + 1);
        if ($("#" + potentialTarget).hasClass(waitingPlayer)) {
          target = $('#' + potentialTarget);
          stealChecker(e);
        }
      }
    } else if (rowDif == -2 && $(activeCell).hasClass('king')) {
      if (cellDif == -2) {
        var potentialTarget = rows[rows.indexOf(curPosition[0]) - 1] + (curPosition[1] - 1);
        if ($("#" + potentialTarget).hasClass(waitingPlayer)) {
          target = $('#' + potentialTarget);
          stealChecker(e);
        }
      } else if (cellDif == 2) {
        var potentialTarget = rows[rows.indexOf(curPosition[0]) - 1] + (curPosition[1] * 1 + 1);
        if ($("#" + potentialTarget).hasClass(waitingPlayer)) {
          target = $('#' + potentialTarget);
          stealChecker(e);
        }
      }
    }
  }
  if (locked) {
    if (haveToSteal.indexOf($(element).attr('id')) > -1) {
      cellSelection(activeCell, element);
    } else if (selected && $(element).contents().length == 0) {
      parameters(activeCell, element, rows);
      stealPattern(element);
    }
  } else {
    if ($(element).hasClass(currentPlayer) && moveableCheckers.indexOf($(element).attr('id')) > -1) {
      cellSelection(activeCell, element);
    } else if (selected && $(element).contents().length == 0) {
      parameters(activeCell, element, rows);
      if (rowDif == 1 && (cellDif == -1 || cellDif == 1)) {
        moveChecker(element);
      } else if (rowDif == -1 && (cellDif == -1 || cellDif == 1) && $(activeCell).hasClass('king')) {
        moveChecker(element);
      } else {
        stealPattern(element);
      }
    }
  }
}

$(".col").click(function() {
  if (!($(this).hasClass("invalid"))) {
    selectingAndMoving(this);
  }
});
$("#restart").on('click', function() {
  window.location.replace("index.html");
})


$("#forfeit").click(function() {
  alert(currentPlayer.toUpperCase() + " gave up! " + waitingPlayer.toUpperCase() + " is the winner of the game!");
  $('#restart').click();
})