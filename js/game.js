var newGame;
var Game = function () {

    this.init = function (size, gameField, scoreField) {
        these = this;
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
        this.dragOption();

        setTimeout(this.checkLines(), 500);

        //setTimeout(this.checkLines, 100);
    };

    this.dragOption = function() {
        // Experiment Drag option
        var dragSrcEl;

        function handleDragStart(e) {
            //this.style.opacity = '0.7';
            dragSrcEl = this;

            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('dragStartClass', this.className);
            //e.dataTransfer.setData('level', this.level);
            e.dataTransfer.setData('dragStartDataId', this.getAttribute('data-id'));
        }

        function handleDragOver(e) {
            if (e.preventDefault) {
                e.preventDefault();
            }
            e.dataTransfer.dropEffect = 'move';

            return false;
        }
        function handleDragEnter(e) {
            //this.classList.add('over');
        }

        function handleDragLeave(e) {
            //this.classList.remove('over');
        }

        function handleDrop(e) {

            if (e.stopPropagation) {
                e.stopPropagation();
            }

            if (dragSrcEl != this) {
                // Set the source column's HTML to the HTML of the columnwe dropped on.
                dragSrcEl.className = this.className;
                //dragSrcEl.level = this.level;
                var draggableOrderNumber = dragSrcEl.getAttribute('data-id');
                var droppableOrderNumber = this.getAttribute('data-id');

                var draggableValue = these.level[draggableOrderNumber];
                var droppableValue = these.level[droppableOrderNumber];

                these.level[draggableOrderNumber] = droppableValue;
                these.level[droppableOrderNumber] = draggableValue;

                dragSrcEl.setAttribute('data-id', draggableOrderNumber);
                this.setAttribute('data-id', droppableOrderNumber);
                //dragSrcEl.level = this.level;

                this.className = e.dataTransfer.getData('dragStartClass');
                //this.setAttribute('data-id', e.dataTransfer.getData('dataId'));

                //this.level = e.dataTransfer.getData('level');
                setTimeout(these.checkLines(), 300);
            }

            return false;
        }

        function handleDragEnd(e) {
            [].forEach.call(cols, function (col) {
                col.classList.remove('over');
            });
        }

        var cols = document.querySelectorAll(".row");
        [].forEach.call(cols, function(col) {
            col.addEventListener('dragstart', handleDragStart, false);
            col.addEventListener('dragenter', handleDragEnter, false);
            col.addEventListener('dragover', handleDragOver, false);
            col.addEventListener('dragleave', handleDragLeave, false);
            col.addEventListener('drop', handleDrop, false);
            col.addEventListener('dragend', handleDragEnd, false);
            col.setAttribute("draggable", true);
        });
        setTimeout(this.checkLines, 400);

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
            //row.setAttribute("draggable", true);

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
            //console.log('This level[k]  === ' + this.level[k])
            //console.log('This level K  === ' + k)
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

        //console.log('Hallo from check GEM AROUND');
        var flag = false;

        if (this.level[position - 1] === gemType && this.level[position + 1] === gemType
            && (position + 1) % this.lines !== 0 && position % this.lines )
        {
            this.removeClearedGemToLevel([position, position - 1, position + 1]);
        } else {
            //console.log('Hallo FROM ELSE ===');
            flag = true;
        }

        if ( this.level[position - this.itemByLine] === gemType && this.level[position + this.itemByLine] === gemType) {
            this.removeClearedGemToLevel([position - this.itemByLine, position, position + this.itemByLine]);
        } else {
            //console.log('Hallo FROM SECOND ELSE ===');
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

        //console.log('Hallo from ANIMATE REMOVED GEMS');
        //console.log('Hallo from ANIMATE REMOVED GEMS | THIS difference' + difference);

        //document.getElementById('game').style.WebkitAnimationDuration = "4s";

        targetGem = this.gameField.querySelectorAll(".row[data-id=" + "\'" + position + "\'" + "]");



            for (var i=0; i < targetGem.length;i++){
                targetGem[i].setAttribute("data-id", false);

                /*console.log(' TARGET GEM |||| ' + targetGem[i]);
                console.log(' TARGET GEM || WIDTH ' + targetGem[i].style.width);*/

                var gem =  targetGem[i];
                var start = Date.now();
                var timer = setInterval(function() {

                    //console.log(' TARGET GEM | INSIDE INTERVAL |      ========');

                    var timePassed = Date.now() - start;

                    if (timePassed >= 400) {
                        clearInterval(timer);
                        return;
                    }

                    /*console.log(' TIME PASSED ' + timePassed);
                    console.log(' ');
                    console.log(' TARGET GEM | INSIDE INTERVAL| WIDTH ' + gem.style.width);*/

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
                    //console.log('INSIDE A CALLBACK');
                }, 510);


                //targetGem[i].style.WebkitAnimationDuration = "4s";

                /*targetGem[i].style.marginTop = targetGem[i].style.marginLeft = difference;
                */
                //


                //targetGem[i].style.display = 'none';
            }

            that.scoreUpdate(10);
            //console.log('SCORE ADDED');


        if (that.fillEnd) {
            that.fillHoles();
        }
        /*console.log('TARGET GEM' + targetGem);
        targetGem.removeAttribute('data-id');
        targetGem.style.display = 'none';
        targetGem.style.animationDelay = "1s";*/

    };

    this.fillHoles = function(){
        //console.log('Hallo FROM FILL HOLES | Script starts here');

        //console.log('');
        //console.log('');

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

                //console.log('HALLO FROM FIRST IF ==================');

                if (this.level[under] === 0 && this.level[under] !== undefined){
                    this.moveGems(i, linePosition, colPosition, under);

                    /*console.log('');
                    console.log('');

                    console.log('CALLING MOVE GEMS');

                    console.log('');
                    console.log('');*/
                }

                break;
            } else if (this.level[i] === 0){
                this.createNewRandomGem(colPosition);
            } else if (this.level[i] !== 0){
                counter++;
            }
        }

        //console.log('THIS FILL LEVEL LENGTH ' + this.level.length + ' == ?? ' + counter);

        if (this.level.length === counter){
            //console.log('No hole left');
            this.fillEnd = true;
            this.checkLines();
        } else {
            this.fillHoles();
        }

        //Adding new event listeners for new gems
        this.dragOption();
    };

    this.moveGems = function (position, line, colPosition, destination) {
        //console.log('Hallo FROM THIS MOVE GEMS');

        var that = this;

        //console.log('THIS GAME FIELD FIND ===  ' + this.gameField.querySelectorAll(".row[data-id=" + "\'" + position + "\'" + "]"));

        var currentGem = this.gameField.querySelector(".row[data-id=" + "\'" + position + "\'" + "]");

        var currentTop = currentGem.style.top;
        //console.log('=== OLD STYLE TOP === ' + currentTop);


        //Working gems appear
        //currentGem.style.top = Math.abs(line * that.caseHeight) + 'px';

        setTimeout( function(){
            return currentGem.style.top = Math.abs(line * that.caseHeight) - 125 + 'px';
        }, 50);

        setTimeout( function(){
            return currentGem.style.top = Math.abs(line * that.caseHeight) - 100 + 'px';
        }, 120);

        setTimeout( function(){
            return currentGem.style.top = Math.abs(line * that.caseHeight) - 70 + 'px';
        }, 180);

        setTimeout( function(){
            return currentGem.style.top = Math.abs(line * that.caseHeight) - 40 + 'px';
        }, 200);

        setTimeout( function(){
            return currentGem.style.top = Math.abs(line * that.caseHeight) + 'px';
        }, 200);

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

        //Adding new event listeners for new gems
        this.dragOption();
    };

    this.createNewRandomGem = function (colPosition) {
        var that = this;
        var gem = document.createElement('div');

        this.level[colPosition] = Math.round(Math.random() * this.typesOfGems +1);

        gem.className = "type-" + this.level[colPosition] + " row";

        gem.style.top = -this.caseHeight + 'px';
        gem.style.left = colPosition * this.caseHeight + 'px';
        gem.style.width = gem.style.height = this.caseHeight + 'px';
        gem.style.opacity = 0;
        //gem.setAttribute("draggable", true);
        gem.setAttribute("data-id", colPosition);
        this.gameField.appendChild(gem);

        gem.style.top = 0 + 'px';
        gem.style.opacity = 1;

    };

    this.scoreUpdate = function (score) {
        scoreElement = document.getElementById('scoreElement');
        this.score = Math.floor(this.score + score, 10);
        //console.log('CURRENT SCORE' + this.score);
        scoreElement.innerHTML = this.score;

        if(this.score > 249){
            document.getElementById("game").innerHTML = ' ';
            document.getElementById("victory").style.visibility = 'visible';
        }
    };

};

//Game initialisation
(function() {
    var gameField = document.getElementById("game");
    var scoreField = document.getElementById("ui");
    buttons = document.getElementsByTagName('button');

    (function () {
        var buttons = document.getElementsByTagName("button");
        for (var i=0; i < buttons.length;i++){
            buttons[i].addEventListener("click", initGame);
        }

    })();

    function initGame() {
        var size = this.value;
        document.getElementById("start").style.display = 'none';
        newGame = new Game();
        newGame.init(size, gameField, scoreField);
    }

})();