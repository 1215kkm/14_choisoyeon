$(document).ready(function() {
  $('.title p').click(function() {
    $('.title').fadeOut()
    $('.cloud_box').css('background-image','url(../img/light2.png')
   
    $('#container').show()
  });

  $('.reset').click(function() {
    $('.cloud_box').css('background-image','url(../img/light1.png')
    $('.title').fadeIn()
   });

  });



  $(document).ready(function() {
      let character = $('#move');
      let position = 50;
      let isJumping = false;
      let movementInterval;
      let direction = 0; // -1: 왼쪽, 0: 정지, 1: 오른쪽

      $(document).keydown(function(e) {
          switch(e.which) {
              case 37: // 왼쪽 화살표
                  direction = -1;
                  startMoving();
                  break;
              case 39: // 오른쪽 화살표
                  direction = 1;
                  startMoving();
                  break;
              case 32: // 스페이스바
                  if (!isJumping) {
                      isJumping = true;
                      jump();
                  }
                  break;
          }
      });

      $(document).keyup(function(e) {
          if (e.which === 37 || e.which === 39) {
              direction = 0;
              stopMoving();
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
          position += direction * 10;
          position = Math.max(0, Math.min($('body').width() - 50, position));
          character.css('left', position);
      }

      function jump() {
          let jumpHeight = 100;
          let jumpDuration = 500;

          character.animate({bottom: jumpHeight}, jumpDuration, function() {
              character.animate({bottom: 0}, jumpDuration, function() {
                  isJumping = false;
              });
          });
      }
  });