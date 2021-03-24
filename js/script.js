

document.addEventListener("DOMContentLoaded", function (event) {
    var fieldWidth = 500;
    var fieldHeight = 500;
    var fieldOne = 25;
    var score = 0;
    var count = 0;

    window.addEventListener('resize', orientFun, false);
    function orientFun(EO) {
        EO = EO || window.event;
        var boxContent = document.getElementById('box-content');
        var canvas = document.getElementById('canvas1');
        var screenHeight = window.innerHeight;
        boxContent.style.width = screenHeight - 20 + 'px';
        boxContent.style.height = canvas.offsetWidth + 'px';
        boxContent.style.margin = 10 + 'px';
    }
    setInterval(function () {
        orientFun();
    }, 100);


    var canvas = document.getElementById('canvas1');
    canvas.setAttribute('width', fieldWidth);
    canvas.setAttribute('height', fieldHeight);
    var context = canvas.getContext('2d');

    var snakeHead = new Image();
    snakeHead.src = 'image/snakeHead.svg';

    var snakeTail = new Image();
    snakeTail.src = 'image/snakeTail.svg';

    var smallerTail = new Image();
    smallerTail.src = 'image/smallerTail.svg';

    var smallTail = new Image();
    smallTail.src = 'image/smallTail.svg';

    var smallxTail = new Image();
    smallxTail.src = 'image/smallxTail.svg';

    var heart = new Image();
    heart.src = 'image/heart.png';

    var emptyheart = new Image();
    emptyheart.src = 'image/emptyheart.png';

    var redHeartImg = new Image();
    redHeartImg.src = 'image/redheart.png';

    var redheart = {
        posX: fieldOne * 10,//out of field
        posY: fieldOne
    };

    var foodImg = new Image();
    function randomDiap(n, m) {
        return Math.floor(Math.random() * (m - n + 1)) + n;
    }

    var eatAudio = new Audio();
    eatAudio.src = "audio/eatAudio.mp3";

    var eatTailAudio = new Audio();
    eatTailAudio.src = "audio/eatTailAudio.mp3";

    var slowHeart = new Audio();
    slowHeart.src = 'audio/slowheart.wav';

    var click = new Audio();
    click.src = 'audio/click.wav';

    function vibro(longFlag) {
        if (navigator.vibrate) { // есть поддержка Vibration API?
            if (!longFlag)
                window.navigator.vibrate(100); // вибрация 100мс
            else
                window.navigator.vibrate([100, 50, 100, 50, 100]); // вибрация 3 раза по 100мс с паузами 50мс
        }
    }

    var buttonAudio = document.getElementById('button-audio');
    buttonAudio.addEventListener('click', funAudio);

    function funAudio(EO) {
        EO = EO || window.event;
        if (!(document.getElementById('audio-off').classList.contains('done'))) {
            click.play();
        }
        var audioOn = document.getElementById('audio-on');
        var audioOff = document.getElementById('audio-off');

        if (audioOn.classList.contains('done')) {
            audioOn.classList.remove('done');
            audioOff.classList.remove('done');
            console.log('on');
            eatAudio.src = "audio/eatAudio.mp3";
            eatTailAudio.src = "audio/eatTailAudio.mp3";
            slowHeart.src = 'audio/slowheart.wav';

        } else {
            audioOn.classList.add('done');
            audioOff.classList.add('done');
            console.log('off');
            eatAudio.src = "";
            eatTailAudio.src = "";
            slowHeart.src = "";

        }

    }







    function foodSrc() {
        var links = ['', 'image/pizza.png', 'image/burger.png', 'image/hot-dog.png', 'image/frees.png', 'image/bigPizza.png'];
        n = randomDiap(1, 5);
        src = links[n];
        return src;
    }
    foodImg.src = foodSrc();
    var food = {
        posX: Math.floor((Math.random() * ((fieldWidth - fieldOne) / fieldOne))) * fieldOne,
        posY: Math.floor((Math.random() * ((fieldHeight - fieldOne * 3) / fieldOne) + 3)) * fieldOne

    };


    var snake = [];
    snake[0] = {
        posX: fieldWidth / 2,
        posY: fieldHeight / 2,
    };

    var buttonRestart = document.getElementById('button-restart');
    buttonRestart.addEventListener('click', funClickRestart);
    buttonRestart.addEventListener('touchend', funClickRestart);
    var gameOver = document.getElementById('game-over');

    function funClickRestart(EO) {
        EO = EO || window.event;
        if (!(document.getElementById('audio-off').classList.contains('done'))) {
            click.play();
        }
        gameOver.classList.remove('done');
        score = 0;
        count = 0;
        locCount = 0;
        milsec = 50;
        snake = [];
        snake[0] = {
            posX: fieldWidth / 2,
            posY: fieldHeight / 2,

        };
        redheart = {
            posX: fieldOne * 10,//out of field
            posY: fieldOne
        };
        move = '';
        draw();
    }

    var buttonExit = document.getElementById('button-exit');
    buttonExit.addEventListener('click', funClose);
    buttonExit.addEventListener('touchend', funClose);
    function funClose(EO) {

        EO = EO || window.event;
        if (!(document.getElementById('audio-off').classList.contains('done'))) {
            click.play();
        }
        var gameOver = document.getElementById('game-over');

        gameOver.classList.remove('done');
        document.getElementById('loader').classList.remove('done');
        document.getElementById('cntue').classList.remove('done');
        funClickRestart();
    }

    document.addEventListener('keydown', snakeMove, false);

    var move;
    function snakeMove(EO) {
        EO = EO || window.event;

        if (EO.keyCode == 37 && move != 'right') {
            move = 'left';
            snakeHead.src = 'image/snakeHeadLeft.svg';
        }
        else if (EO.keyCode == 38 && move != 'down') {
            move = 'up';
            snakeHead.src = 'image/snakeHead.svg';
        }
        else if (EO.keyCode == 39 && move != 'left') {
            move = 'right';
            snakeHead.src = 'image/snakeHeadRight.svg';
        }
        else if (EO.keyCode == 40 && move != 'up') {
            move = 'down';
            snakeHead.src = 'image/snakeHeadDown.svg';
        }

    }

    // swipe--------------------------------

    var box = document.getElementById('box');
    box.addEventListener('touchstart', funTouchStart, false);

    function funTouchStart(EO) {
        EO = EO || window.event;
        EO.preventDefault();
        var touchInfoStart = EO.targetTouches[0];
        var touchXs = touchInfoStart.pageX;
        var touchYs = touchInfoStart.pageY;

        box.addEventListener('touchmove', funTouchMove, false);

        function funTouchMove(EO) {
            EO = EO || window.event;
            EO.preventDefault();
            box.addEventListener('touchend', funTouchEnd, false);
            var touchInfoMove = EO.targetTouches[0];
            var touchX1 = touchInfoMove.pageX;
            var touchY1 = touchInfoMove.pageY;
            function funTouchEnd(EO) {
                EO = EO || window.event;
                EO.preventDefault();
                var touchXm = touchX1;
                var touchYm = touchY1;

                var minSwipe = 20;

                if (touchXs > touchXm && touchXs - touchXm >= minSwipe) {
                    if (Math.abs(touchXs - touchXm) > Math.abs(touchYs - touchYm) &&
                        move != 'right') {
                        move = 'left';
                        snakeHead.src = 'image/snakeHeadLeft.svg';
                    }
                }
                else if (touchYs > touchYm && touchYs - touchYm >= minSwipe) {
                    if (Math.abs(touchYs - touchYm) > Math.abs(touchXs - touchXm) &&
                        move != 'down') {
                        move = 'up';
                        snakeHead.src = 'image/snakeHead.svg';
                    }
                }
                else if (touchXs < touchXm && touchXm - touchXs >= minSwipe) {
                    if (Math.abs(touchXs - touchXm) > Math.abs(touchYs - touchYm) &&
                        move != 'left') {
                        move = 'right';
                        snakeHead.src = 'image/snakeHeadRight.svg';
                    }
                }
                else if (touchYs < touchYm && touchYm - touchYs >= minSwipe) {
                    if (Math.abs(touchYm - touchYs) > Math.abs(touchXm - touchXs) &&
                        move != 'up') {
                        move = 'down';
                        snakeHead.src = 'image/snakeHeadDown.svg';
                    }
                }
                box.removeEventListener('touchmove', funTouchMove, false);
                box.removeEventListener('touchend', funTouchEnd, false);

            }

        }

    }



    // setTimeout(function(){
    //     var stopGame = setInterval(draw, 120);
    //     move='left';
    // },3000);

    var milsec = 50;
    locCount = 0;


    draw();
    var nik;
    function draw() {

        var stopGame = setTimeout(draw, 120);
        orientFun();

        for (let i = 0; i < fieldWidth; i = i + fieldOne) {
            for (let k = 0; k < fieldHeight; k = k + fieldOne) {
                context.fillStyle = 'rgb(37, 109, 37)';
                context.fillRect(i, k, fieldOne, fieldOne);
            }
        }
        for (let i = fieldOne; i < fieldWidth; i = i + fieldOne * 2) {
            for (let k = fieldOne; k < fieldHeight; k = k + fieldOne * 2) {
                context.fillStyle = 'rgb(15, 97, 15)';
                context.fillRect(i, k, fieldOne, fieldOne);
            }
        }
        for (let i = 0; i < fieldWidth; i = i + fieldOne * 2) {
            for (let k = 0; k < fieldHeight; k = k + fieldOne * 2) {
                context.fillStyle = 'rgb(15, 97, 15)';
                context.fillRect(i, k, fieldOne, fieldOne);
            }
        }

        context.fillStyle = 'rgb(37, 109, 37)';
        context.fillRect(0, 0, fieldWidth, fieldOne * 3);

        context.beginPath();
        context.moveTo(2, fieldOne * 3);
        context.lineTo(fieldWidth - 2, fieldOne * 3);
        context.lineTo(fieldWidth - 2, fieldHeight - 2);
        context.lineTo(2, fieldHeight - 2);
        context.closePath();
        context.lineWidth = 2;
        context.stroke();

        context.fillStyle = 'black';
        context.font = 'italic bold 40px Arial';
        context.fillText('Score: ' + score, 25, fieldOne + fieldOne / 2);
        context.textAlign = 'left';
        context.textBaseline = 'middle';

        if (count == 3) {
            // clearInterval(stopGame);
            clearTimeout(stopGame);
            setTimeout(function () {
                gameOver.classList.add('done');
            }, 500);

            var fieldNik = document.getElementById('field-nik');
            fieldNik.addEventListener('touchend', funFocusInput);
            fieldNik.addEventListener('click', funFocusInput);
            function funFocusInput(EO) {
                if (!(document.getElementById('audio-off').classList.contains('done'))) {
                    click.play();
                }
                fieldNik.focus();
                fieldNik.placeholder='your name..';
            }


            var buttonSave = document.getElementById('button-save');
            buttonSave.addEventListener('click', storeInfo, false);
            buttonSave.addEventListener('touchend', storeInfo, false);

            var ajaxHandlerScript = "https://fe.it-academy.by/AjaxStringStorage2.php";
            var updatePassword;
            var stringName = 'Grushevskiy_SnakeGame_tableRecords';

            function storeInfo(EO) {
                EO = EO || window.event;
                fieldNik.blur();
                if (!(document.getElementById('audio-off').classList.contains('done'))) {
                    click.play();
                }
                updatePassword = Math.random();
                $.ajax({
                    url: ajaxHandlerScript, type: 'POST', cache: false, dataType: 'json',
                    data: { f: 'LOCKGET', n: stringName, p: updatePassword },
                    success: lockGetReady, error: errorHandler
                }
                );
            }


            function lockGetReady(callresult) {
                
                if (callresult.error != undefined)
                    alert(callresult.error);
                else {
                    var info = JSON.parse(callresult.result);
                    infoRepeat={};
                    var nik = fieldNik.value;
                    for(let i=0;i<info.length;i++){
                        var key=info[i].nik;
                       infoRepeat[key]=info[i].score;
                    }
                    if(nik in infoRepeat && infoRepeat[nik]>=score)
                           nik='';
                    
                    
                    if (nik.length>2) {
                        if (Array.isArray(info)) {
                            if(nik in infoRepeat && infoRepeat[nik]<score){
                                for(i=0;i<info.length;i++){
                                    if(info[i].nik==nik)
                                    info[i].score=score;
                                }
                            }else{
                                info.push(
                                    {
                                        nik: nik,
                                        score: score
                                    }
                                );
                            }
                        } else {
                            info = [{
                                nik: nik,
                                score: score
                            }];
                        }

                        $.ajax({
                            url: ajaxHandlerScript, type: 'POST', cache: false, dataType: 'json',
                            data: { f: 'UPDATE', n: stringName, v: JSON.stringify(info), p: updatePassword },
                            success: updateReady, error: errorHandler
                        }
                        );
                        fieldNik.value='';
                        fieldNik.placeholder='record save';
                    }else{
                        fieldNik.value='';
                        fieldNik.placeholder='your name..';
                    }
                }
            }

            function updateReady(callresult) {
                if (callresult.error != undefined)
                    alert(callresult.error);
            }
            function errorHandler(jqXHR, statusStr, errorStr) {
                alert(statusStr + ' ' + errorStr);
            }

        }



        context.drawImage(foodImg, food.posX, food.posY);

        if ((score > 10 && count == 1) || (score > 20 && count == 2)) {
            locCount++;
            if (locCount == 1) {
                redheart = {
                    posX: Math.floor((Math.random() * ((fieldWidth - fieldOne) / fieldOne))) * fieldOne,
                    posY: Math.floor((Math.random() * ((fieldHeight - fieldOne * 3) / fieldOne) + 3)) * fieldOne
                };
            }

            if (milsec > 0) {
                milsec--;
                context.fillStyle = 'black';
                context.font = 'italic bold 40px Arial';
                context.fillText(milsec, fieldOne * 10, fieldOne + fieldOne / 2);
                context.textAlign = 'left';
                context.textBaseline = 'middle';
            } else {
                redheart.posX = fieldOne * 10;
                redheart.posY = fieldOne;
                locCount = 0;
            }
        }
        context.drawImage(redHeartImg, redheart.posX, redheart.posY);


        for (let i = 0; i < snake.length; i++) {
            if (i == 0) {
                context.drawImage(snakeHead, snake[i].posX, snake[i].posY);
            }
            else if (i == snake.length - 1) {
                context.drawImage(smallxTail, snake[i].posX + 7.5, snake[i].posY + 7.5);
            } else if (i == snake.length - 2) {
                context.drawImage(smallTail, snake[i].posX + 5, snake[i].posY + 5);
            }
            else if (i == snake.length - 3) {
                context.drawImage(smallerTail, snake[i].posX + 2.5, snake[i].posY + 2.5);
            }
            else if (i > 0 && i < snake.length - 1) {
                context.drawImage(snakeTail, snake[i].posX + 1.5, snake[i].posY + 1.5);
            }

        }


        var snakeX = snake[0].posX;
        var snakeY = snake[0].posY;


        snake.pop();

        if (move == 'left') {
            snakeX -= fieldOne;
        }
        if (move == 'right') {
            snakeX += fieldOne;
        }
        if (move == 'up') {
            snakeY -= fieldOne;
        }
        if (move == 'down') {
            snakeY += fieldOne;
        }

        if (snakeX < 0) {
            snakeX = (fieldWidth - fieldOne);
        }
        if (snakeX > (fieldWidth - fieldOne)) {
            snakeX = 0;
        }
        if (snakeY < fieldOne * 3) {
            snakeY = fieldHeight - fieldOne;
        }
        if (snakeY > fieldHeight - fieldOne) {
            snakeY = fieldOne * 3;
        }

        var newHead = {
            posX: snakeX,
            posY: snakeY
        };

        count = eatTail(newHead, snake);
        if (count <= 0) {
            context.drawImage(heart, fieldWidth - fieldOne * 7, fieldOne);
            context.drawImage(heart, fieldWidth - fieldOne * 5, fieldOne);
            context.drawImage(heart, fieldWidth - fieldOne * 3, fieldOne);

        } else if (count == 1) {
            context.drawImage(heart, fieldWidth - fieldOne * 7, fieldOne);
            context.drawImage(heart, fieldWidth - fieldOne * 5, fieldOne);
            context.drawImage(emptyheart, fieldWidth - fieldOne * 3, fieldOne);

        } else if (count == 2) {
            context.drawImage(heart, fieldWidth - fieldOne * 7, fieldOne);
            context.drawImage(emptyheart, fieldWidth - fieldOne * 5, fieldOne);
            context.drawImage(emptyheart, fieldWidth - fieldOne * 3, fieldOne);
        } else if (count == 3) {
            context.drawImage(emptyheart, fieldWidth - fieldOne * 7, fieldOne);
            context.drawImage(emptyheart, fieldWidth - fieldOne * 5, fieldOne);
            context.drawImage(emptyheart, fieldWidth - fieldOne * 3, fieldOne);
        } else if (count > 3) {
            context.drawImage(emptyheart, fieldWidth - fieldOne * 7, fieldOne);
            context.drawImage(emptyheart, fieldWidth - fieldOne * 5, fieldOne);
            context.drawImage(emptyheart, fieldWidth - fieldOne * 3, fieldOne);
        }
        if (count == 2 || count >= 3) {
            context.strokeStyle = 'red';
            context.beginPath();
            context.moveTo(2, fieldOne * 3);
            context.lineTo(fieldWidth - 2, fieldOne * 3);
            context.lineTo(fieldWidth - 2, fieldHeight - 2);
            context.lineTo(2, fieldHeight - 2);
            context.closePath();
            context.lineWidth = 2;
            context.stroke();
        }
        if (count < 2) {
            context.strokeStyle = 'black';
            context.beginPath();
            context.moveTo(2, fieldOne * 3);
            context.lineTo(fieldWidth - 2, fieldOne * 3);
            context.lineTo(fieldWidth - 2, fieldHeight - 2);
            context.lineTo(2, fieldHeight - 2);
            context.closePath();
            context.lineWidth = 2;
            context.stroke();
        }
        snake.unshift(newHead);
        if (snakeX == food.posX && snakeY == food.posY) {
            eatAudio.play();
            score++;
            foodImg.src = foodSrc();
            food = {
                posX: Math.floor((Math.random() * ((fieldWidth - fieldOne) / fieldOne))) * fieldOne,
                posY: Math.floor((Math.random() * ((fieldHeight - fieldOne * 3) / fieldOne) + 3)) * fieldOne
            };
            snake.unshift(newHead);
        }
        if (snakeX == redheart.posX && snakeY == redheart.posY) {
            slowHeart.play();
            locCount = 0;
            milsec = 50;
            redheart = {
                posX: fieldOne * 10,
                posY: fieldOne
            };
            count--;
        }
        function eatTail(head, mas) {
            for (var i = 0; i < mas.length; i++) {
                if (head.posX == mas[i].posX && head.posY == mas[i].posY) {
                    count++;
                    eatTailAudio.play();
                    if (!(document.getElementById('audio-off').classList.contains('done'))) {
                        vibro(true);
                    }
                    if (count < 3) {
                        snake.splice(mas.length - 1, 1);
                    }

                    score = score - 1;
                    if (score < 0)
                        score = 0;


                }


            }
            return count;
        }
    }




});

