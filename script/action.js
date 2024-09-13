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

    $('.reset').click(function () {
        $('#section1').css('background-image', 'url(img/scene1.png)');
        $('.title').fadeIn();
        $('#container').hide();
        $('#section2').hide();
    });

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

    // 마리오의 초기 위치 설정
    character.css({ left: position + 'px' });

    $(document).keydown(function (e) {
        switch (e.which) {
            case 37:
                direction = -1;
                character.css('transform', 'scaleX(-1)');
                startMoving();
                break;
            case 39:
                direction = 1;
                character.css('transform', 'scaleX(1)');
                startMoving();
                break;
            case 32:
                if (!isJumping && !isDucking) {
                    isJumping = true;
                    jump();
                    jumpSound.play();
                }
                break;
            case 40:
                if (onObstacle && !isDucking) {
                    showSection2();
                    pipeSound.play()
                } else if (!onObstacle && !isDucking) {
                    duck();
                }
                break;
        }
    });

    $(document).keyup(function (e) {
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
        position += direction * 10;

        if (!isJumping && !isDucking) {
            if (direction === 1 && position + characterWidth > obstaclePosition && position < obstaclePosition + obstacleWidth) {
                position = Math.min(position, obstaclePosition - characterWidth);
            } else if (direction === -1 && position < obstaclePosition + obstacleWidth && position + characterWidth > obstaclePosition) {
                position = Math.max(position, obstaclePosition + obstacleWidth);
            }
        }

        if (onObstacle && (position + characterWidth < obstaclePosition || position > obstaclePosition + obstacleWidth)) {
            character.animate({ bottom: '0px' }, 200, function () {
                onObstacle = false;
                isJumping = false;
            });
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
            checkCollisionWithObstacle22();
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
            $('#section1').hide(); // 섹션1 숨기기
            $('#section2').show(); // 섹션2 보이기
            $('#container2').show(); // 섹션2 보이기
            $('#section2').css('background-image', 'url(img/scene2.png)'); // 화면 배경 변경

            // 섹션2의 마리오 캐릭터와 장애물 다시 설정
            character = $('#section2 #move');
            container = $('#container2');
            obstacle = $('#container2 .obstacle21');
            containerWidth = container.width();
            characterWidth = character.width();
            obstacleWidth = obstacle.width();
            position = (containerWidth - characterWidth) / 2; // 섹션2에서도 화면 중앙에서 시작
            character.css({ left: position + 'px' }); // 마리오 초기 위치 설정
        }, 1000); // 1초 대기
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

        // 충돌 감지
        if (marioBottom >= targetTop && marioTop <= targetBottom && marioRight >= targetLeft && marioLeft <= targetRight) {
            coinSound.play();
            collisionCount++;

            // 장애물 애니메이션
            target.animate({ top: '-=10px' }, 100).animate({ top: '+=10px' }, 100);

            if (collisionCount === 3) {
                alert('마리오가 3번 장애물에 3번 닿았습니다!');
                collisionCount = 0; // 카운트 초기화
            }
        }
    }
});
