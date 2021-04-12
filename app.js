/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 * The value is no lower than min (or the next integer greater than min
 * if min isn't an integer) and no greater than max (or the next integer
 * lower than max if max isn't an integer).
 * Using Math.round() will give you a non-uniform distribution!
 * Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random#getting_a_random_integer_between_two_values
 */
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//
// Boilerplate setup
//

// Create an empty scene
var scene = new THREE.Scene();

// Create a basic perspective camera
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.z = 4;

// Create a renderer with Antialiasing
var renderer = new THREE.WebGLRenderer({antialias:true});

// Configure renderer clear color
renderer.setClearColor("#000000");

// Configure renderer size
renderer.setSize(window.innerWidth, window.innerHeight);

// Append Renderer to DOM
document.body.appendChild(renderer.domElement);

//
// Fun starts here!
//

var geometry = new THREE.SphereGeometry(2, 5, 5);
var material = new THREE.MeshBasicMaterial({color: "#433F81", vertexColors: THREE.FaceColors});
var sphere = new THREE.Mesh(geometry, material);

scene.add(sphere);

var render = function () {
  requestAnimationFrame(render);

  sphere.rotation.x += 0.01;
  sphere.rotation.y += 0.01;

  var face_to_change = getRandomInt(0, geometry.faces.length);
  geometry.faces[face_to_change].color.setRGB(Math.random(), Math.random(), Math.random());
  geometry.colorsNeedUpdate = true;

  renderer.render(scene, camera);
};

render();
