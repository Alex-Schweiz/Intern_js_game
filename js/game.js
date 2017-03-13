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

        setTimeout(this.checkLines, 100);
    };

    this.dragOption = function() {
        // Experiment Drag option
        var dragSrcEl;

        function handleDragStart(e) {
            this.style.opacity = '0.9';
            dragSrcEl = this;

            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/html', this.className);
            e.dataTransfer.setData('level', this.level);
            e.dataTransfer.setData('dataID', this.getAttribute('data-id'));
        }

        function handleDragOver(e) {
            if (e.preventDefault) {
                e.preventDefault();
            }
            e.dataTransfer.dropEffect = 'move';

            return false;
        }
        function handleDragEnter(e) {
            this.classList.add('over');
        }

        function handleDragLeave(e) {
            this.classList.remove('over');
        }

        function handleDrop(e) {

            if (e.stopPropagation) {
                e.stopPropagation();
            }

            if (dragSrcEl != this) {
                // Set the source column's HTML to the HTML of the columnwe dropped on.
                dragSrcEl.className = this.className;
                var draggableOrderNumber = dragSrcEl.getAttribute('data-id');
                var droppableOrderNumber = this.getAttribute('data-id');
                var draggableValue = these.level[draggableOrderNumber];
                var droppableValue = these.level[droppableOrderNumber];

                these.level[draggableOrderNumber] = droppableValue;
                these.level[droppableOrderNumber] = draggableValue;

                dragSrcEl.setAttribute('data-id', this.getAttribute('data-id'));
                dragSrcEl.level = this.level;
                this.className = e.dataTransfer.getData('text/html');
                this.setAttribute('data-id', e.dataTransfer.getData('dataId'));
                this.level = e.dataTransfer.getData('level');
                these.checkLines();
            }
            return false;
        }

        function handleDragEnd(e) {
            [].forEach.call(cols, function (col) {
                col.classList.remove('over');
            });
            setTimeout(these.checkLines, 300);
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
        }
    };

    this.drawNewLevel = function () {
        var row = document.createElement('div');
        var lines = -1;
        var i = 0,
            size = this.size;

        for(;i < size; i++ ) {

            if( i % this.originalSize === 0 ){
                lines++;
            }

            row.style.top = lines * this.caseHeight + 'px';
            row.style.left = i % this.originalSize * this.caseHeight + 'px';
            row.style.width = row.style.height = this.caseHeight + 'px';

            row.setAttribute("class", 'type-' + this.level[i] + ' row');
            row.setAttribute("data-id", i);
            //row.setAttribute("draggable", true);

            this.gameField.appendChild(row.cloneNode(true));
        }

        this.lines = lines + 1;
        this.itemByLine = this.size / this.lines;
    };

    this.checkLines = function (size) {
        var k = 0,
            counter = 0,
            size = this.size;

        (function () {
            var reset = document.getElementsByClassName("row");
            for (var i=0 ; i < reset.length ; i++){
                reset[i].classList.remove("glow");
            }
        })();

        for (; k < size; k++){
             counter = counter + this.checkGemAround(this.level[k], k);
        }
    };

    this.checkGemAround = function (gemType, position) {
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
        var i = 0,
            length = gemsToRemove.length;

        for(;i < length; i++){
            this.level[gemsToRemove[i]] = 0;
            this.animateRemoveGems(gemsToRemove[i]);
        }
    };

    this.animateRemoveGems = function (position) {

        var that = this,
            difference = this.caseHeight / 2,
            targetGem = this.gameField.querySelectorAll(".row[data-id=" + "\'" + position + "\'" + "]");

            for (var i=0; i < targetGem.length;i++){
                targetGem[i].setAttribute("data-id", false);

                var gem =  targetGem[i];
                /*var start = Date.now();
                var timer = setInterval(function() {

                    var timePassed = Date.now() - start;

                    if (timePassed >= 400) {
                        clearInterval(timer);
                        return;
                    }

                    gem.style.marginTop = gem.style.marginLeft = timePassed/20 * difference/25 + 'px';
                    gem.style.height = 125 - timePassed/20 * 5 + 'px';
                    gem.style.width = 125 - timePassed/20 * 5 + 'px' ;

                }, 20);*/

                //Timeout to remove a gem
                /*setTimeout(function () {
                    gem.parentNode.removeChild(gem);
                }, 200);*/

                targetGem[i].style.display = 'none';
                gem.parentNode.removeChild(gem);
            }
            that.scoreUpdate(10);
        if (that.fillEnd) {
            that.fillHoles();
        }
    };

    this.fillHoles = function(){
        var i,
            counter = 0;
        this.releaseGameControl(false);
        this.fillEnd = false;

        for(i = 0; i < this.level.length; i++){
            var under = +i + +this.originalSize;
            var linePosition = Math.floor(under / this.originalSize);
            var colPosition = under - Math.floor(linePosition * this.originalSize);

            if (this.level[under] === 0 && this.level[i] !== 0 ){

                if (this.level[under] === 0 && this.level[under] !== undefined){
                    setTimeout((this.moveGems(i, linePosition, colPosition, under)), 50);
                    //this.moveGems(i, linePosition, colPosition, under);
                }
                break;
            } else if (this.level[i] === 0){
                this.createNewRandomGem(colPosition);
            } else if (this.level[i] !== 0){
                counter++;
            }
        }

        if (this.level.length === counter){
            this.fillEnd = true;
            this.checkLines();
        } else {
            this.fillHoles();
        }
    };

    this.moveGems = function (position, line, colPosition, destination) {
        var that = this;
        var currentGem = this.gameField.querySelector(".row[data-id=" + "\'" + position + "\'" + "]");
        //Working gems appear
        currentGem.style.top = Math.abs(line * that.caseHeight) + 'px';

        /*setTimeout( function(){
            return currentGem.style.top = Math.abs(line * that.caseHeight) - 125 + 'px';
        }, 50);

        setTimeout( function(){
            return currentGem.style.top = Math.abs(line * that.caseHeight) - 100 + 'px';
        }, 120);

        setTimeout( function(){
            return currentGem.style.top = Math.abs(line * that.caseHeight) - 70 + 'px';
        }, 180);

        setTimeout( function(){
            return currentGem.style.top = Math.abs(line * that.caseHeight) + 'px';
        }, 200);*/

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
        currentGem.setAttribute("data-id", destination);

        this.level[destination] = this.level[position];
        this.level[position] = 0;

        if (line === 1){
            this.createNewRandomGem(colPosition);
        }
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
        gem.setAttribute("draggable", true);
        gem.setAttribute("data-id", colPosition);

        this.gameField.appendChild(gem);
        gem.style.top = 0 + 'px';
        gem.style.opacity = 1;

    };

    this.scoreUpdate = function (score) {
        scoreElement = document.getElementById('scoreElement');
        this.score = Math.floor(this.score + score, 10);
        scoreElement.innerHTML = this.score;
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