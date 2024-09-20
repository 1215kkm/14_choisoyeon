$(document).ready(function () {
    // 오디오 객체 생성
    const coinSound = new Audio('audio/coin.mp3');
    const jumpSound = new Audio('audio/jump.mp3');
    const marioSound = new Audio('audio/mario_theme.mp3');
    const pipeSound = new Audio('audio/pipe.mp3');

    $('.title p').click(function () {
        $('.title').fadeOut();
        $('#section1').css('background-image', 'url(img/scene1.png)');
        $('#container').show();
        coinSound.play();
        marioSound.play();
    });
    $(document).keydown(function (e) {
        if (e.which === 13) { // Shift key
            
        $('.title').fadeOut();
        $('#section1').css('background-image', 'url(img/scene1.png)');
        $('#container').show();
        coinSound.play();
        marioSound.play();
        }
    })

    $('.reset').click(function () {
        showSection1();
    });

    function showSection1() {
        $('#section1').show();
        $('#section2, #section3').hide();
        $('#container').hide();
        $('.title').fadeIn();
        $('#section1').css('background-image', 'url(img/scene1.png)');
        resetCharacterState();
    }

    let character = $('#move');
    let container = $('#container');
    let obstacle = $('#container .obstacle');
    let containerWidth = container.width();
    let characterWidth = character.width();
    let obstacleWidth = obstacle.width();
    let position = (containerWidth - characterWidth) / 2; // 화면 중앙에서 시작
    let isJumping = false;
    let onObstacle = false;
    let isDucking = false;
    let movementInterval;
    let direction = 1;
    let collisionCount = 0; // 충돌 횟수 추적
    let speed = 10; // 기본 속도
    let shiftPressed = false; // Shift 키 상태 추적

    // 마리오의 초기 위치 설정
    character.css({ left: position + 'px' });

    $(document).keydown(function (e) {
        if (e.which === 16) { // Shift key
            shiftPressed = true;
            speed = 30; // Shift 키를 누르면 더 빠르게 이동
        }

        switch (e.which) {
            case 37: // Left arrow key
                direction = -1;
                character.css('transform', 'scaleX(-1)');
                startMoving();
                break;
            case 39: // Right arrow key
                direction = 1;
                character.css('transform', 'scaleX(1)');
                startMoving();
                break;
            case 32: // Space bar
                if (!isJumping && !isDucking) {
                    isJumping = true;
                    jump();
                    jumpSound.play();
                }
                break;
            case 40: // Down arrow key
                if (onObstacle && !isDucking) {
                    if ($('#section1').is(':visible')) {
                        showSection2();
                    } else if ($('#section2').is(':visible')) {
                        showSection3();
                    }
                    pipeSound.play();
                } else if (!onObstacle && !isDucking) {
                    duck();
                }
                break;
        }
    });

    $(document).keyup(function (e) {
        if (e.which === 16) { // Shift key
            shiftPressed = false;
            speed = 10; // Shift 키를 떼면 속도를 원래대로
        }
        if (e.which === 37 || e.which === 39) {
            stopMoving();
        }
        if (e.which === 40) {
            if (isDucking) {
                standUp();
            }
        }
    });

    function startMoving() {
        if (!movementInterval) {
            movementInterval = setInterval(moveCharacter, 50);
        }
    }

    function stopMoving() {
        clearInterval(movementInterval);
        movementInterval = null;
    }

    function moveCharacter() {
        let obstaclePosition = obstacle.position().left;
        position += direction * speed; // 이동 속도 조정

        if (!isJumping && !isDucking) {
            if (direction === 1 && position + characterWidth > obstaclePosition && position < obstaclePosition + obstacleWidth) {
                position = Math.min(position, obstaclePosition - characterWidth);
            } else if (direction === -1 && position < obstaclePosition + obstacleWidth && position + characterWidth > obstaclePosition) {
                position = Math.max(position, obstaclePosition + obstacleWidth);
            }
        }

        if ($('#section3').is(':visible')) {
            checkCollisionWithStairs(); // 계단과의 충돌을 지속적으로 감지
        }

        if (onObstacle) {
            character.css('bottom', '+=0px'); // 계단 위에 있을 때 위치를 고정
        }

        position = Math.max(0, Math.min(containerWidth - characterWidth, position));
        character.css('left', position + 'px');
    }

    function jump() {
        let jumpHeight = 200;
        let jumpDuration = 800;

        let obstaclePosition = obstacle.position().left;
        let obstacleTop = obstacle.offset().top;
        let obstacleHeight = obstacle.height();

        character.animate({ bottom: jumpHeight }, jumpDuration / 2, function () {
            if ($('#section2').is(':visible')) {
                checkCollisionWithObstacle22();
            } else if ($('#section3').is(':visible')) {
                checkCollisionWithStairs();
            }
            if (position + characterWidth > obstaclePosition && position < obstaclePosition + obstacleWidth) {
                character.css('bottom', obstacleHeight + 'px');
                onObstacle = true;
            } else {
                character.animate({ bottom: 0 }, jumpDuration / 2, function () {
                    isJumping = false;
                });
            }
        });
    }

    function duck() {
        isDucking = true;
        character.attr('src', 'img/mario_down.png');
        let characterHeight = character.height();
        character.css({
            height: characterHeight / 2 + 'px',
            bottom: '0px'
        });
    }

    function standUp() {
        isDucking = false;
        character.attr('src', 'img/mario.png');
        let characterHeight = character.height();
        character.css('height', characterHeight * 2 + 'px');
        character.animate({ bottom: '0px' }, 500);
    }

    function showSection2() {
        $('#loading-screen').fadeIn();
        setTimeout(function () {
            $('#loading-screen').fadeOut();
            $('#section1').hide();
            $('#section2').show();
            $('#container2').show();
            $('#section2').css('background-image', 'url(img/scene2.png)');

            character = $('#section2 #move');
            container = $('#container2');
            obstacle = $('#container2 .obstacle21');
            containerWidth = container.width();
            characterWidth = character.width();
            obstacleWidth = obstacle.width();
            position = (containerWidth - characterWidth) / 2;
            character.css({ left: position + 'px' });
            resetCharacterState();
        }, 1000);
    }

    function showSection3() {
        $('#loading-screen').fadeIn();
        setTimeout(function () {
            $('#loading-screen').fadeOut();
            $('#section2').hide();
            $('#section3').show();
            $('#container3').show();
            $('#section3').css('background-image', 'url(img/scene3.png)');

            character = $('#section3 #move');
            container = $('#container3');
            obstacle = $('#container3 .obstacle31');
            containerWidth = container.width();
            characterWidth = character.width();
            obstacleWidth = obstacle.width();
            position = 0; // 섹션 3에서는 화면 맨 좌측에서 시작
            character.css({ left: position + 'px' });
            resetCharacterState();
        }, 1000);
    }

    function checkCollisionWithObstacle22() {
        let marioTop = character.offset().top;
        let marioBottom = marioTop + character.height();
        let marioLeft = character.offset().left;
        let marioRight = marioLeft + character.width();

        let target = $('#section2 .obstacle22 p:nth-child(3)');
        let targetTop = target.offset().top;
        let targetBottom = targetTop + target.height();
        let targetLeft = target.offset().left;
        let targetRight = targetLeft + target.width();

        if (marioBottom >= targetTop && marioTop <= targetBottom && marioRight >= targetLeft && marioLeft <= targetRight) {
            coinSound.play();
            collisionCount++;

            target.animate({ top: '-=10px' }, 100).animate({ top: '+=10px' }, 100);

            if (collisionCount === 3) {
                alert('마리오가 3번 장애물에 3번 닿았습니다!');
                collisionCount = 0;
            }
        }
    }

    function checkCollisionWithStairs() {
        let marioTop = character.offset().top;
        let marioBottom = marioTop + character.height();
        let marioLeft = character.offset().left;
        let marioRight = marioLeft + character.width();

        onObstacle = false; // 매번 충돌 검사 전에 초기화

        $('#section3 .stairs .stair').each(function () {
            let stairTop = $(this).offset().top;
            let stairBottom = stairTop + $(this).height();
            let stairLeft = $(this).offset().left;
            let stairRight = stairLeft + $(this).width();

            if (marioBottom >= stairTop && marioTop <= stairBottom && marioRight >= stairLeft && marioLeft <= stairRight) {
                character.css('bottom', stairBottom + 'px'); // 계단의 상단에 마리오 위치
                onObstacle = true;
                isJumping = false;
                return false; // 충돌이 감지되면 더 이상 검사하지 않음
            }
        });

        if (!onObstacle && marioBottom <= $('#section3').height()) {
            // 계단 위에 없으면 아래로 떨어지지 않도록 처리
            character.css('bottom', '0px');
        }
    }

    function resetCharacterState() {
        isJumping = false;
        isDucking = false;
        onObstacle = false;
        direction = 1;
        collisionCount = 0;
    }
});
