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
        this.fillEnd = true;
        this.populateLevel();
        this.drawNewLevel();

        setTimeout(this.checkLines(), 1000);

        setTimeout(this.checkLines, 100);
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

        //console.log('Hallo from CHECK Lines');

        var k = 0,
            counter = 0,
            size = this.size;

        //console.log('Hallo from CHECK Lines | This Size' + size);

        (function () {
            var reset = document.getElementsByClassName("row");
            for (var i=0 ; i < reset.length ; i++){
                reset[i].classList.remove("glow");
            }
            //console.log('Hallo from Class Glow removed');
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

        //document.getElementById('game').style.WebkitAnimationDuration = "4s";

        targetGem = this.gameField.querySelectorAll(".row[data-id=" + "\'" + position + "\'" + "]");



            for (var i=0; i < targetGem.length;i++){
                targetGem[i].setAttribute("data-id", false);

                console.log(' TARGET GEM |||| ' + targetGem[i]);
                console.log(' TARGET GEM || WIDTH ' + targetGem[i].style.width);

                var gem =  targetGem[i];
                var start = Date.now();
                var timer = setInterval(function() {

                    console.log(' TARGET GEM | INSIDE INTERVAL |      ========');

                    var timePassed = Date.now() - start;

                    if (timePassed >= 500) {
                        clearInterval(timer);
                        return;
                    }

                    console.log(' TIME PASSED ' + timePassed);
                    console.log(' ');
                    console.log(' TARGET GEM | INSIDE INTERVAL| WIDTH ' + gem.style.width);

                    gem.style.marginTop = gem.style.marginLeft = timePassed/20 * difference/25 + 'px';
                    gem.style.height = 125 - timePassed/20 * 5 + 'px';
                    gem.style.width = 125 - timePassed/20 * 5 + 'px' ;

                    /*console.log('==========');
                    console.log(' ');

                    console.log(' ||| GEM MARGIN TOP ' + gem.style.marginTop);
                    console.log(' ||| GEM MARGIN Left ' + gem.style.marginLeft);
                    console.log(' ||| GEM HEIGHT ' + gem.style.height);
                    console.log(' ||| GEM width ' + gem.style.width);

                    console.log('==========');*/

                }, 20);

                setTimeout(function () {
                    gem.parentNode.removeChild(gem);
                    console.log('INSIDE A CALLBACK');
                }, 505);


                //targetGem[i].style.WebkitAnimationDuration = "4s";

                /*targetGem[i].style.marginTop = targetGem[i].style.marginLeft = difference;
                */
                //


                //targetGem[i].style.display = 'none';
            }

            that.scoreUpdate(10);
            console.log('SCORE ADDED');


        if (that.fillEnd) {
            that.fillHoles();
        }
        /*console.log('TARGET GEM' + targetGem);
        targetGem.removeAttribute('data-id');
        targetGem.style.display = 'none';
        targetGem.style.animationDelay = "1s";*/

    };

    this.fillHoles = function(){
        console.log('Hallo FROM FILL HOLES | Script starts here');

        console.log('');
        console.log('');

        var i,
            counter = 0;

        this.releaseGameControl(false);

        this.fillEnd = false;

        //console.log('LEVEL LENGTH | ======= ' + this.level.length);
        for(i = 0; i < this.level.length; i++){
            var under = +i + +this.originalSize;
            var linePosition = Math.floor(under / this.originalSize);
            var colPosition = under - Math.floor(linePosition * this.originalSize);


            /*console.log('=======================');
            //console.log('Hallo FROM FILL HOLES | ORIGINAL SIZE = ' + this.originalSize);
            console.log('Hallo FROM FILL HOLES | VAR UNDER = ' + under);
            console.log('Hallo FROM FILL HOLES | LINE POSITION = ' + linePosition);
            console.log('Hallo FROM FILL HOLES | Col POSITION = ' + colPosition);
            console.log('Hallo FROM FILL HOLES | THIS LEVEL UNDER = ' + this.level[under]);

            console.log('');
            console.log('=======================');*/

            if (this.level[under] === 0 && this.level[i] !== 0 ){

                console.log('HALLO FROM FIRST IF ==================');

                if (this.level[under] === 0 && this.level[under] !== undefined){
                    this.moveGems(i, linePosition, colPosition, under);

                    console.log('');
                    console.log('');

                    console.log('CALLING MOVE GEMS');

                    console.log('');
                    console.log('');
                }

                break;
            } else if (this.level[i] === 0){
                this.createNewRandomGem(colPosition);
            } else if (this.level[i] !== 0){
                counter++;
            }
        }

        console.log('THIS FILL LEVEL LENGTH ' + this.level.length + ' == ?? ' + counter);

        if (this.level.length === counter){
            console.log('No hole left');
            this.fillEnd = true;
            this.checkLines();
        } else {
            this.fillHoles();
        }
    };

    this.moveGems = function (position, line, colPosition, destination) {
        console.log('Hallo FROM THIS MOVE GEMS');

        var that = this;

        //console.log('THIS GAME FIELD FIND ===  ' + this.gameField.querySelectorAll(".row[data-id=" + "\'" + position + "\'" + "]"));

        var currentGem = this.gameField.querySelector(".row[data-id=" + "\'" + position + "\'" + "]");

        var currentTop = currentGem.style.top;
        console.log('=== OLD STYLE TOP === ' + currentTop);

        currentGem.style.top = Math.abs(line * that.caseHeight) + 'px';

        //Try to animate falling

        /*var start = Date.now();
        var timerMove = setInterval(function() {

            console.log(' MOVE GEMS| INSIDE INTERVAL |  CURRENT TOP    ====  ' + currentTop);

            var timePassed = Date.now() - start;

            console.log(' TIME PASSED  == ' + timePassed);

            if (timePassed >= 500) {
                clearInterval(timerMove);
                return;
            }

            currentGem.style.top = Math.abs(line * that.caseHeight) + 'px';

            //currentGem.style.top = Math.abs(currentTop + timePassed/20 * that.caseHeight/25) + 'px';

            /!*console.log('==========');
             console.log(' ');

             console.log(' ||| GEM MARGIN TOP ' + gem.style.marginTop);
             console.log(' ||| GEM MARGIN Left ' + gem.style.marginLeft);
             console.log(' ||| GEM HEIGHT ' + gem.style.height);
             console.log(' ||| GEM width ' + gem.style.width);

             console.log('==========');*!/

        }, 20);*/




        //console.log('Hallo FROM THIS MOVE GEMS |||| STYLE TOP ' + currentGem.style.top);

        //console.log('=== NEW STYLE TOP === ' + currentGem.style.top);


        currentGem.setAttribute("data-id", destination);

        this.level[destination] = this.level[position];
        this.level[position] = 0;

        if (line === 1){
            this.createNewRandomGem(colPosition);
        }
    };

    this.createNewRandomGem = function (colPosition) {
        console.log('Hallo FROM CREATE NEW RANDOM GEMS');

        var that = this;
        var gem = document.createElement('div');

        //console.log('KIND OF CREATED ELEMENT' + gem);

        this.level[colPosition] = Math.round(Math.random() * this.typesOfGems +1);

        gem.className = "type-" + this.level[colPosition] + " row";

        /*console.log('ADD CLASS to ' + gem.className);
        console.log('NEW GEM ' + gem);

        console.log('NEW GEM | this.caseHeight == ' + this.caseHeight);
        console.log('NEW GEM | colPosition == ' + colPosition);*/


        gem.style.top = -this.caseHeight + 'px';
        gem.style.left = colPosition * this.caseHeight + 'px';
        gem.style.width = gem.style.height = this.caseHeight + 'px';
        gem.style.opacity = 0;
        gem.setAttribute("data-id", colPosition);

        this.gameField.appendChild(gem);

        gem.style.top = 0 + 'px';
        gem.style.opacity = 0.2;

    };

    this.scoreUpdate = function (score) {
        scoreElement = document.getElementById('scoreElement');
        this.score = Math.floor(this.score + score, 10);
        console.log('CURRENT SCORE' + this.score);

        scoreElement.innerHTML = this.score;
    };

};

//Game initialisation
(function() {
    //console.log('document loaded');

    //Select active game field
    var gameField = document.getElementById("game");
    //console.log('var game: ' + gameField);

    //Select score field
    var scoreField = document.getElementById("ui");
    //console.log('var score: ' + scoreField);

    buttons = document.getElementsByTagName('button');

   // console.log('Buttons selected ' + buttons);

    (function () {
        var buttons = document.getElementsByTagName("button");
        for (var i=0; i < buttons.length;i++){
            buttons[i].addEventListener("click", initGame);
        }

    })();

    function initGame() {
        //Init game field size
        var size = this.value;
        //console.log('value ' + size);

        //Hide a message
        document.getElementById("start").style.display = 'none';
        //console.log('Starter screen hidden');

        newGame = new Game();
        newGame.init(size, gameField, scoreField);
    }

})();












