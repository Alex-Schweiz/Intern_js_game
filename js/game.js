var newGame;
var Game = function () {

    this.init = function (size, gameField, scoreField) {
        console.log('Inside a Game');

        this.gameField = gameField;
        this.level = [];
        this.typesOfGems = 5;
        this.playerCanControl = false;
        this.originalSize = size;
        this.caseHeight = this.gameField.clientHeight / this.originalSize;
        this.size = size * size;
        this.score = 0;
        this.populateLevel();
        this.drawNewLevel();

        this.checkLines();

        //setTimeout(this.checkLines, 100);
    };

    this.releaseGameControl = function(play) {
        if (play) {
             this.playerCanControl = true;
        } else {
            this.playerCanControl = false;
        }
    };

    this.populateLevel = function () {
        console.log('Inside populate level');
        var i = 0,
            fieldSize = this.size;
        for (; i < fieldSize; i++) {
            this.level[i] = Math.round(Math.random() * this.typesOfGems +1);
            //console.log('Current gem style' + this.level[i]);
        }
    };

    this.drawNewLevel = function () {
        /*console.log('Hallo from draw new level');
        console.log('This game field height ' + this.gameField.clientHeight);
        console.log('This original size ' + this.originalSize);*/

        var row = document.createElement('div');
        var lines = -1;

        var i = 0,
            size = this.size;

        console.log('DRAW NEW LEVEL | This Size' + size);

        for(;i < size; i++ ) {

            if( i % this.originalSize === 0 ){
                lines++;
            }

            //console.log('Current line ' + lines);
            row.style.top = lines * this.caseHeight + 'px';
            row.style.left = i % this.originalSize * this.caseHeight + 'px';
            row.style.width = row.style.height = this.caseHeight + 'px';

            row.setAttribute("class", 'type-' + this.level[i] + ' row');
            row.setAttribute("data-id", i);

            this.gameField.appendChild(row.cloneNode(true));


            /*console.log('Row style top ' + row.style.top + '|' + 'Row style left ' + row.style.left);
            console.log('Row style width ' + row.style.width);
            console.log('data-id ' + row.getAttribute("data-id"));
            console.log('Class of element ' + row.getAttribute("class"));
            console.log('ADDDDED Element ' + this.gameField.appendChild(row.cloneNode(true)));*/
        }

        this.lines = lines + 1;
        this.itemByLine = this.size / this.lines;
    };

    this.checkLines = function (size) {

        console.log('Hallo from CHECK Lines');

        var k = 0,
            counter = 0,
            size = this.size;

        console.log('Hallo from CHECK Lines | This Size' + size);

        (function () {
            var reset = document.getElementsByClassName("row");
            for (var i=0 ; i < reset.length ; i++){
                reset[i].classList.remove("glow");
            }
            console.log('Hallo from Class Glow removed');
        })();



        for (; k < size; k++){
            counter = counter + this.checkGemAround(this.level[k], k);
        }

        /*if (counter === this.size){
            this.releaseGameControl(true);
            return true;
        } else {
            this.releaseGameControl(false);
            return false;
        }*/

    };

    this.checkGemAround = function (gemType, position) {

        console.log('Hallo from check GEM AROUND');
        var flag = false;

        if (this.level[position - 1] === gemType && this.level[position + 1] === gemType
            && (position + 1) % this.lines !== 0 && position % this.lines )
        {
            this.removeClearedGemToLevel([position, position - 1, position + 1]);
        } else {
            flag = true;
        }

        if ( this.level[position - this.itemByLine] === gemType && this.level[position + this.itemByLine] === gemType) {
            this.removeClearedGemToLevel([position - this.itemByLine, position, position + this.itemByLine]);
        } else {
            flag = true;
        }

        if (flag){
            return 1;
        } else {
            return 0;
        }
    };

    this.removeClearedGemToLevel = function (gemsToRemove) {

        //console.log('Hallo from REMOVE CLEARED GEM TO LEVEL');

        var i = 0,
            length = gemsToRemove.length;

        for(;i < length; i++){
            this.level[gemsToRemove[i]] = 0;
            this.animateRemoveGems(gemsToRemove[i]);
        }
    };

    this.animateRemoveGems = function (position) {

        var that = this,
            difference = this.caseHeight / 2;

        console.log('Hallo from ANIMATE REMOVED GEMS');
        console.log('Hallo from ANIMATE REMOVED GEMS | THIS difference' + difference);

        document.getElementById('game').style.WebkitAnimationDuration = "4s";

        targetGem = this.gameField.querySelectorAll(".row[data-id=" + "\'" + position + "\'" + "]");

        (function () {

            for (var i=0; i < targetGem.length;i++){
                targetGem[i].setAttribute("data-id", false);
                targetGem[i].style.WebkitAnimationDuration = "4s";
                targetGem[i].style.marginTop = targetGem[i].style.marginLeft = difference;
                targetGem[i].style.height = 0;
                targetGem[i].style.width = 0;
                targetGem[i].parentNode.removeChild(targetGem[i]);

                that.scoreUpdate(10);
                //targetGem[i].style.display = 'none';
            }

        })();

        /*console.log('TARGET GEM' + targetGem);
        targetGem.removeAttribute('data-id');
        targetGem.style.display = 'none';
        targetGem.style.animationDelay = "1s";*/

    }

    this.scoreUpdate = function (score) {
        scoreElement = document.getElementById('scoreElement');
        this.score = Math.floor(this.score + score, 10);
        console.log('CURRENT SCORE' + this.score);

        scoreElement.innerHTML = this.score;
    }

};

(function() {
    console.log('document loaded');

    //Select active game field
    var gameField = document.getElementById("game");
    console.log('var game: ' + gameField);

    //Select score field
    var scoreField = document.getElementById("ui");
    console.log('var score: ' + scoreField);

    buttons = document.getElementsByTagName('button');

    console.log('Buttons selected ' + buttons);

    (function () {
        var buttons = document.getElementsByTagName("button");
        for (var i=0; i < buttons.length;i++){
            buttons[i].addEventListener("click", initGame);
        }

    })();

    function initGame() {
        //Init game field size
        var size = this.value;
        console.log('value ' + size);

        //Hide a message
        document.getElementById("start").style.display = 'none';
        console.log('Starter screen hidden');

        newGame = new Game();
        newGame.init(size, gameField, scoreField);
    }

})();