// We always need a scene.
var scene = new THREE.Scene();

// We always need a renderer

var renderer = new THREE.WebGLRenderer();

TW.mainInit(renderer,scene);

/* We always need a camera; here we'll use a default orbiting camera.  The
third argument are the ranges for the coordinates, to help with setting up
the placement of the camera. They need not be perfectly accurate, but if
they are way off, your camera might not see anything, and you'll get a
blank canvas. */

TW.cameraSetup(renderer,
               scene,
               {minx: 120, maxx: 120,
                miny: 0, maxy: 200,
                minz: -120, maxz: 45});

//////////////////////// lighting ///////////////////////////////

// ambient light for scene
var ambLight = new THREE.AmbientLight( 0x999999 ); // soft white light 
scene.add(ambLight);
ambLight.visible = true;

// directional light for scene
var dirLight = new THREE.DirectionalLight( 0xfc753d);
scene.add(dirLight);
dirLight.position.set(120,130,-50);
var targetObject = new THREE.Object3D(); 
targetObject.position.set(120, 70, 30);
dirLight.target = targetObject;
scene.add( targetObject );
//const helper = new THREE.DirectionalLightHelper( dirLight, 5 );
//scene.add( helper );

// spotlight from lamp
var spotlight = new THREE.SpotLight( 0xeea782, 0.5, 0, Math.PI/4, 0.05);
spotlight.position.set(120,140,30); 
spotlight.target = targetObject;
scene.add( spotlight );
//const spotLightHelper = new THREE.SpotLightHelper( spotlight );
//scene.add( spotLightHelper );


//////////////////////////// music /////////////////////////////

const audioListener = new THREE.AudioListener();
const sound = new THREE.Audio(audioListener);
const audioLoader = new THREE.AudioLoader();
var songUrls = ["music1.mp3", "music2.mp3", "music3.mp3"];
var currentSongIndex = 0;
var currentSong;

function playSong() {

	if (currentSong) {
		currentSong.stop();
	  }

	audioLoader.load(songUrls[currentSongIndex], (buffer) => {
	  console.log("music loaded");
	  sound.setBuffer(buffer);
	  sound.setLoop(true);
	  sound.setVolume(0.5);
	  sound.play(); // Play the sound directly after loading
  	currentSong = sound;
	  // Increment the current song index, and loop back to the first song if reaching the end
	  currentSongIndex = (currentSongIndex + 1) % songUrls.length;
	});
  }

  function toggleMusic() {
	if (currentSong) {
	  if (currentSong.isPlaying) {
		currentSong.pause();
	  } else {
		currentSong.play();
	  }
	}
  }
	
	document.addEventListener("keydown", (event) => {
	  if (event.key === "n") {
		audioListener.context.resume().then(() => {
			playSong();
		  });
		} else if (event.key === " ") {
			toggleMusic();
		  }		
	  });

/////////////////////////// Shapes /////////////////////////////

// window

function room() {

	var textureLoader = new THREE.TextureLoader();
    var texture = textureLoader.load('wood.jpg');
	var wallTexture = textureLoader.load('wall3.jpg');

	wallTexture.repeat.set(2,3);
	wallTexture.wrapS = THREE.MirrorRepeatWrapping;
    wallTexture.wrapT = THREE.MirrorRepeatWrapping;
    wallTexture.needsUpdate = true;

	// floor
	var floor = new THREE.PlaneGeometry(240,100);
	var floorMat = new THREE.MeshPhongMaterial({color: 0x898989,
												specular: new THREE.Color("white"),
												shininess: 0,
												map: texture});
	var floorMesh = new THREE.Mesh(floor, floorMat);
	floorMesh.rotation.x = Math.PI*3/2;
	floorMesh.position.set(120,0,50)
	scene.add(floorMesh);

	//ceiling
	var ceil = new THREE.PlaneGeometry(240,100);
	var ceilMat = new THREE.MeshPhongMaterial({color: 0xc4b1a2,
		specular: new THREE.Color("white"),
		shininess: 0});
	var ceilMesh = new THREE.Mesh(ceil, ceilMat);
	ceilMesh.rotation.x = Math.PI/2;
	ceilMesh.position.set(120,180,50)
	scene.add(ceilMesh);

	//left wall
	var left = new THREE.PlaneGeometry(100,180);
	var leftMat = new THREE.MeshPhongMaterial({color: 0x777777,
		specular: new THREE.Color("white"),
		shininess: 0,
		map: wallTexture});
	var leftMesh = new THREE.Mesh(left, leftMat);
	leftMesh.rotation.y = Math.PI/2;
	leftMesh.position.set(0,90,50)
	scene.add(leftMesh);

	//right wall
	var right = new THREE.PlaneGeometry(100,180);
	var rightMat = new THREE.MeshPhongMaterial({color: 0x777777,
		specular: new THREE.Color("white"),
		shininess: 0,
		map: wallTexture});
		var rightMesh = new THREE.Mesh(right, rightMat);
	rightMesh.rotation.y = Math.PI*3/2;
	rightMesh.position.set(240,90,50)
	scene.add(rightMesh);

}

function wall(width, height) {

	var wallGeom = new THREE.Geometry();

    // Add vertices
	// Wall corners
    wallGeom.vertices.push(new THREE.Vector3(0,0,0));
    wallGeom.vertices.push(new THREE.Vector3(width*3,0,0));
	wallGeom.vertices.push(new THREE.Vector3(width*3,height*3,0));
	wallGeom.vertices.push(new THREE.Vector3(0,height*3,0));
	// Window corners
	wallGeom.vertices.push(new THREE.Vector3(width-width*1/3,height,0));
	wallGeom.vertices.push(new THREE.Vector3(width*2+width*1/3,height,0));
	wallGeom.vertices.push(new THREE.Vector3(width*2+width*1/3,height*2.5,0));
	wallGeom.vertices.push(new THREE.Vector3(width-width*1/3,height*2.5,0));

	// Push faces

	wallGeom.faces.push(new THREE.Face3(0,5,4));
	wallGeom.faces.push(new THREE.Face3(0,1,5));
	wallGeom.faces.push(new THREE.Face3(5,1,2));
	wallGeom.faces.push(new THREE.Face3(5,2,6));
	wallGeom.faces.push(new THREE.Face3(6,2,3));
	wallGeom.faces.push(new THREE.Face3(7,6,3));
	wallGeom.faces.push(new THREE.Face3(7,3,4));
	wallGeom.faces.push(new THREE.Face3(0,4,3));

	var wallMat = new THREE.MeshPhongMaterial({color: 0x55504c,
		specular: new THREE.Color("white"),
		shininess: 0});
	var wallMesh = new THREE.Mesh(wallGeom, wallMat);
	scene.add(wallMesh);
}

function windows() {

	// window frame 
	var windowFrame = new THREE.Group();

	var textureLoader = new THREE.TextureLoader();
    var texture = textureLoader.load('wood.jpg');

	var windowFrameMat = new THREE.MeshPhongMaterial({color: 0xadadad,
													  map: texture});

	var topframe = new THREE.BoxGeometry(130, 5,5);
	var topframeMesh = new THREE.Mesh(topframe, windowFrameMat);
	topframeMesh.position.set(120, 150,0);
	scene.add(topframeMesh);

	var bottomframe = new THREE.BoxGeometry(130, 5,5);
	var bottomframeMesh = new THREE.Mesh(bottomframe, windowFrameMat);
	bottomframeMesh.position.set(120, 60,0);
	scene.add(bottomframeMesh);

	// horizontal frames
	var windowFrameH1 = new THREE.BoxGeometry(65,5,5);
	var windowFrameH1Mesh = new THREE.Mesh(windowFrameH1, windowFrameMat);
	windowFrame.add(windowFrameH1Mesh);

	var windowFrameH2 = new THREE.BoxGeometry(65,5,5);
	var windowFrameH2Mesh = new THREE.Mesh(windowFrameH2, windowFrameMat);
	windowFrameH2Mesh.position.set(0,45,0);
	windowFrame.add(windowFrameH2Mesh);

	var windowFrameH3 = new THREE.BoxGeometry(65,5,5);
	var windowFrameH3Mesh = new THREE.Mesh(windowFrameH3, windowFrameMat);
	windowFrameH3Mesh.position.set(0,-45,0);
	windowFrame.add(windowFrameH3Mesh);

	// vertical frames
	var windowFrameV1 = new THREE.BoxGeometry(5,90,5);
	var windowFrameV1Mesh = new THREE.Mesh(windowFrameV1, windowFrameMat);
	windowFrameV1Mesh.position.set(30,0,0);
	windowFrame.add(windowFrameV1Mesh);

	var windowFrameV2 = new THREE.BoxGeometry(5,90,5);
	var windowFrameV2Mesh = new THREE.Mesh(windowFrameV2, windowFrameMat);
	windowFrameV2Mesh.position.set(-30,0,0);
	windowFrame.add(windowFrameV2Mesh);

	windowFrame.position.set(85,105,0);

	var pane = new THREE.PlaneGeometry(60, 90);
	var planeMaterial = new THREE.MeshPhongMaterial({
			color: 0xefefef, // Set the base color
			side: THREE.DoubleSide, // Render on both sides of the plane
			transparent: true, // Make the material transparent
			opacity: 0.4,
			specular: new THREE.Color("white"),
			shininess: 1
		});
	var paneMesh = new THREE.Mesh(pane, planeMaterial);
	windowFrame.add(paneMesh);

	return windowFrame;
}

// add table

function table () {

	var textureLoader = new THREE.TextureLoader();
    var texture = textureLoader.load('wood.jpg');

	var tableMat = new THREE.MeshPhongMaterial({color: 0xc4b1a2, map: texture});
    var tabletop = new THREE.BoxGeometry(120,50,10);
	var tabletopMesh = new THREE.Mesh(tabletop, tableMat);
	tabletopMesh.position.set(120, 50,30);
	tabletopMesh.rotation.x = Math.PI/2;
	scene.add(tabletopMesh);

    var tableleg1 = new THREE.CylinderGeometry(5,5,50,32);
	tableleg1Mesh = new THREE.Mesh(tableleg1, tableMat);
	tableleg1Mesh.position.set(70, 20,20);
	scene.add(tableleg1Mesh);

	var tableleg2 = new THREE.CylinderGeometry(5,5,50,32);
	tableleg2Mesh = new THREE.Mesh(tableleg2, tableMat);
	tableleg2Mesh.position.set(170, 20,20);
	scene.add(tableleg2Mesh);
}

// add cup

function cup() {
	// Create a group to hold cup and handle
	var cupGroup = new THREE.Group();

	var cupMat = new THREE.MeshPhongMaterial({ color: 0xadadad });

	var cupGeometry = new THREE.CylinderGeometry(5, 5, 10, 32);
	var cup = new THREE.Mesh(cupGeometry, cupMat);

	// Create handle geometry and material
	var handleGeometry = new THREE.TorusGeometry(3.5, 1, 16, 50, Math.PI);
	var handle = new THREE.Mesh(handleGeometry, cupMat);

	// Position the handle relative to the cup
	handle.position.set(-5, 0, 0);
	handle.rotation.z = Math.PI/2;

	// Add cup and handle to the group
	cupGroup.add(cup, handle);
	cupGroup.position.set(90,60,20);

	scene.add(cupGroup);
  }

  function laptop() {
	// Create a group to hold the laptop and keys
	var laptopGroup = new THREE.Group();

	// Create laptop body geometry and material
	var laptopBodyGeometry = new THREE.BoxGeometry(40, 20, 2);
	var laptopBodyMaterial = new THREE.MeshPhongMaterial({ color: 0x333333 });
	var laptopBody = new THREE.Mesh(laptopBodyGeometry, laptopBodyMaterial);

	// Create keyboard geometry and material
	var keyboardGeometry = new THREE.BoxGeometry(40, 1, 15);
	var keyboardMaterial = new THREE.MeshPhongMaterial({ color: 0x808080 });
	var keyboard = new THREE.Mesh(keyboardGeometry, keyboardMaterial);

	// Position the keyboard on top of the laptop body
	laptopBody.position.set(0,5,-5);
	laptopBody.rotation.x = -0.4;
	keyboard.position.set(0, -4, 8);

	// Add the laptop body and keyboard to the group
	laptopGroup.add(laptopBody, keyboard);

	// Create individual keys on the keyboard
	var keyGeometry = new THREE.BoxGeometry(2, 0.5, 2);
	var keyMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });

	// Define the layout of keys
	var keyLayout = [
	  'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P',
	  'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';',
	  'Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/'
	];

	var keyGroup = new THREE.Group();

	// Create keys and position them on the keyboard
	for (let i = 0; i < keyLayout.length; i++) {
		var key = new THREE.Mesh(keyGeometry, keyMaterial);
		//key.position.set((i % 10) * 3, Math.floor(i / 3),1);
		key.position.set((i % 10) * 3, Math.floor(i / 10) * 3,1);
		key.rotation.x = Math.PI/2;
		keyGroup.add(key);
	  }

	keyGroup.rotation.x = Math.PI/2;
	//keyGroup.rotation.z = -0.1
	keyGroup.position.set(-13.5,-2,5);

	laptopGroup.add(keyGroup);

	laptopGroup.position.set(120,60,20);
	scene.add(laptopGroup);
  }


  function lamp() {
	const points = [];
	for ( let i = 0; i < 10; i ++ ) {
		points.push( new THREE.Vector2( Math.sin( i * 0.2 ) * 10 + 2, -( i - 5 ) * 2 ) );
	}
	const lampGeom = new THREE.LatheGeometry( points );
	const lampMat = new THREE.MeshPhongMaterial( {
		color: 0xF5F5DC, 
		side: THREE.DoubleSide, 
		specular: new THREE.Color("white"),
		shininess: 1
	} );
	const lampMesh = new THREE.Mesh( lampGeom, lampMat );
	scene.add( lampMesh );
	lampMesh.position.set(120,130,30);

	var wire = new THREE.CylinderGeometry(1,1,60,32);
	var wireMat = new THREE.MeshPhongMaterial({
		color: 0xB87333,
		side: THREE.DoubleSide,
		specular: new THREE.Color("white"),
		shininess: 1
	})
	var wireMesh = new THREE.Mesh(wire, wireMat);
	scene.add(wireMesh);
	wireMesh.position.set(120,160,30);

	var lightbulb = new THREE.SphereGeometry(4,32,16);
	var lightbulbMat = new THREE.MeshBasicMaterial({ color: 0xeea782	})
	var lightbulbMesh = new THREE.Mesh(lightbulb, lightbulbMat);
	scene.add(lightbulbMesh);
	lightbulbMesh.position.set(120,125,30);
  }

var lamp = new lamp();

var room = new room();
var wall = new wall(80,60);

var window1 = new windows();
var window2 = new windows();
scene.add(window1);
window1.rotation.y = Math.PI/3;
window1.position.set(70,105,-20);
scene.add(window2);
window2.rotation.y = -Math.PI/3;
window2.position.set(170,105,-20);

var table = new table();
var cup = new cup();
var laptop = new laptop();

///////////////////////// swap backgrounds //////////////////////////////

var loader = new THREE.TextureLoader();
loader.load("galaxy1.jpg",
            function (texture) {
               startingBackground(texture);
            } );

function startingBackground(texture) {
	var background = new THREE.PlaneGeometry(500, 500);
	var backgroundMat = new THREE.MeshPhongMaterial({ color: 0xffffff, map: texture });
	backgroundMesh = new THREE.Mesh(background, backgroundMat);
	scene.add(backgroundMesh);
	backgroundMesh.position.set(150, 150, -300);
}

// Textures
var textures = [
	new THREE.TextureLoader().load('galaxy1.jpg'),
	new THREE.TextureLoader().load('city1.jpg'),
	new THREE.TextureLoader().load('beach1.jpg')
  ];
var outsideMesh; 
var i = 0;

function swapBackground(textures) {

  // Create a new outsideMesh with the next texture
  var outside = new THREE.PlaneGeometry(500, 500);
  var outsideMat = new THREE.MeshPhongMaterial({ color: 0xffffff });
  
  // Check if textures[i] is defined before assigning it to the map
  if (textures[i]) {
    outsideMat.map = textures[i];
    outsideMat.needsUpdate = true;

    outsideMesh = new THREE.Mesh(outside, outsideMat);
    outsideMesh.position.set(150, 150, -300);
    
    scene.add(outsideMesh);
  }

  i++;

  // Check if i is greater than or equal to the number of textures, reset to 0
  if (i >= textures.length) {
    i = 0;
  }

  // Render the scene
  TW.render();
}

TW.setKeyboardCallback('n', function() { swapBackground(textures); }, "change background");


///////////////// animated digital clock /////////////////////

var loader = new THREE.FontLoader();
loader.load("Hedvig.json", 
	function (font) {
		console.log('Font loaded successfully:', font);
		createDigitalClock(font);
	});

function createDigitalClock(font) {
  // Create a text geometry
  var textGeometry = new THREE.TextGeometry('8:30:00', {
    font: font,
    size: 5,
    height: 1,
    curveSegments: 12,
    bevelEnabled: false,
    bevelThickness: 1,
    bevelSize: 0.5,
    bevelSegments: 3,
  });

  // Create a material
  var textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });

  // Create a mesh
  var textMesh = new THREE.Mesh(textGeometry, textMaterial);

  // Position the text
  textMesh.position.set(108, 62, 18);
  textMesh.rotation.x = -0.4;

  // Add the text to the scene
  scene.add(textMesh);

  // Function to update the digital clock
  function updateDigitalClock() {
    // Get the current time
    var currentTime = new Date();
    var hours = currentTime.getHours();
    var minutes = currentTime.getMinutes();
    var seconds = currentTime.getSeconds();

    // Format the time as HH:MM:SS
    var formattedTime = padNumber(hours) + ':' + padNumber(minutes) + ':' + padNumber(seconds);

    var newTextGeometry = new THREE.TextBufferGeometry(formattedTime, {
		font: font,
		size: 5,
		height: 1,
		curveSegments: 12,
		bevelEnabled: false,
		bevelThickness: 1,
		bevelSize: 0.5,
		bevelSegments: 3,
	  });

	textMesh.geometry.dispose();  // Dispose the old geometry to free up memory
  	textMesh.geometry = newTextGeometry;
    
	// Render the scene
    TW.render();

    // Request the next animation frame to keep the clock updating in real-time
    requestAnimationFrame(updateDigitalClock);
  }

  // Start the clock
  updateDigitalClock();
}

// Helper function to pad numbers with leading zeros
function padNumber(number) {
  return number < 10 ? '0' + number : '' + number;
}


//////////////////// animated smoke ////////////////////////

function animatedSmoke(height) {
	// Create tube geometry
	const path = new THREE.CatmullRomCurve3([
        new THREE.Vector3(1, 8, 0),
        new THREE.Vector3(-1, 6, 0),
        new THREE.Vector3(0, 4, 0),
        new THREE.Vector3(2, 2, 0),
        new THREE.Vector3(0, 0, 0),
      ]);
      const geometry = new THREE.TubeGeometry(path, 20, 0.2, 8, false);
      const material = new THREE.MeshLambertMaterial({
        color: 0xcdcdcd,
        wireframe: true,
		transparent: true,
		opacity: 1
      });
      const tube = new THREE.Mesh(geometry, material);
      scene.add(tube);

      // Animation
      const clock = new THREE.Clock();
	  let distanceTraveled = 0; 

	  function animate() {
        requestAnimationFrame(animate);

        const delta = clock.getDelta();
        const speed = 2; // Adjust the speed by changing this value
        tube.position.y += delta * speed;
        distanceTraveled += delta * speed;
		tube.material.opacity -= delta * 0.5;

        // Check if the tube has moved 5 units, then reset
        if (distanceTraveled >= 5) {
          tube.position.y = height;
          distanceTraveled = 0;
		  tube.material.opacity = 1;
        }
	}

      // Start animation
      animate();

	  return tube;
	}
  
  // Call the function to start the animation
  var smoke1 = new animatedSmoke(60);
  smoke1.position.set(90,60,20);
  var smoke2 = new animatedSmoke(65);
  smoke2.position.set(92,65,20);
  var smoke3 = new animatedSmoke(70);
  smoke3.position.set(89,70,20);
  smoke3.rotation.y = Math.PI;
