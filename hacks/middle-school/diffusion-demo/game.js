
    // create an new instance of a pixi stage
    var stage = new PIXI.Stage(0xFFFFFF);

    // create a renderer instance.
    var renderer = PIXI.autoDetectRenderer($(window).width(), $(window).height());

    // add the renderer view element to the DOM
    document.body.appendChild(renderer.view);

    requestAnimFrame( animate );

    var diffuse = false;

    // create a texture from an image path
    var texture = PIXI.Texture.fromImage("bullet.png");
    // create a new Sprite using the texture
		var particles = {};

		for (var i = 0; i < 1000; i++) {
			var bunny = new PIXI.Sprite(texture);
			bunny.anchor.x = 0.5;
			bunny.anchor.y = 0.5;

			// move the sprite t the center of the screen
			bunny.position.x = $(window).width()/2;
			bunny.position.y = $(window).height()/2;

			stage.addChild(bunny);
			particles[generateRandAlphaNumStr(12)] = bunny;
		}

    // var bunny = new PIXI.Sprite(texture);

    // center the sprites anchor point


    function animate() {

        requestAnimFrame( animate );

        // just for fun, lets rotate mr rabbit a little
        if (diffuse === true) {
  				for (var key in particles) {
  					var tmp = particles[key];
            tmp.rotation += 0.4;
  					var dir = Math.random();
  					if (dir <= 0.25 && dir > 0) {
  						tmp.position.x += 15;
  					} else if (dir <= 0.5 && dir > 0.25) {
  						tmp.position.x -= 15;
  					} else if (dir <= 0.75 && dir > 0.5) {
  						tmp.position.y += 15;
  					} else if (dir <= 1 && dir > 0.75) {
  						tmp.position.y -= 15;
  					}


  				}
        }





        // render the stage
        renderer.render(stage);
    }


function generateRandAlphaNumStr(len) {
  var rdmString = "";
  for( ; rdmString.length < len; rdmString  += Math.random().toString(36).substr(2));
  return  rdmString.substr(0, len);
}


$(document).keydown(function(evt) {
  // if (evt.which == 13) {
    diffuse = true;
  // }
  // } else {
    // diffuse = false;
  // }
});

$(document).keyup(function(evt) {
  diffuse = false;
});
