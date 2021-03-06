//
// Useful functions
//

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
// Stats monitor
//

function createStats() {
    var stats = new Stats();
    stats.setMode(0);

    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0';
    stats.domElement.style.top = '0';

    return stats;
}

var stats = createStats();
document.body.appendChild(stats.domElement);

//
// Boilerplate three.js setup
//

var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight);
camera.position.z = 4;

var renderer = new THREE.WebGLRenderer({antialias: true});

renderer.setClearColor(0x000000);

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

//
// Create sphere
//

var geometry = new THREE.SphereGeometry(2, 50, 50);
var material = new THREE.MeshBasicMaterial({vertexColors: true});
var sphere = new THREE.Mesh(geometry, material);

scene.add(sphere);

//
// Function that updates the color of the vertices
//

const n_vertices = geometry.attributes.position.count;

const positionAttribute = geometry.getAttribute('position');

const vertexColorsBuffer = new THREE.Float32BufferAttribute(new Float32Array(3 * n_vertices), 3);

function updateVertexColors(time) {
    for (let n = 0; n < n_vertices; n++) {
        const vertex = new THREE.Vector3();
        vertex.fromBufferAttribute(positionAttribute, n);

        const vertexSpherical = new THREE.Spherical();
        vertexSpherical.setFromVector3(vertex);

        const phi = vertexSpherical.phi;
        const theta = vertexSpherical.theta;

        // Function we want to plot. Should be between 0 and 1 for colormap to work out of the box.
        const functionValue = (1 + Math.sin(phi)**2 * Math.cos(2*theta - time)) / 2;

        // console.log(`vertex ${n} = (??=${phi}, ??=${theta}) -> f = ${functionValue}`);

        const vertexColor =  getColor(functionValue, seismic);

        vertexColorsBuffer.array[3*n]   = vertexColor[0] // R
        vertexColorsBuffer.array[3*n+1] = vertexColor[1] // G
        vertexColorsBuffer.array[3*n+2] = vertexColor[2] // B
    }

    geometry.setAttribute('color', vertexColorsBuffer);
    geometry.attributes.color.needsUpdate = true

    return
}

updateVertexColors(0)

//
// dat.gui controls
//

// Options to be added to the GUI

var options = {
    omegax: 0.0,
    omegay: 0.0,
    stop: function() {
        this.omegax = 0.0;
        this.omegay = 0.0;
    }
};

var gui = new dat.GUI();

var omega = gui.addFolder('Rotation speed');
omega.add(options, 'omegax', -0.2, 0.2).step(0.01).name('X').listen();
omega.add(options, 'omegay', -0.2, 0.2).step(0.01).name('Y').listen();
omega.open();

gui.add(options, 'stop');

//
// Rendering loop
//

const startTime = new Date();

var render = function () {
    requestAnimationFrame(render);

    var endTime = new Date();
    var timeDiff = endTime - startTime; // in ms
    timeDiff /= 1000;

    updateVertexColors(timeDiff)

    sphere.rotation.x += options.omegax;
    sphere.rotation.y += options.omegay;

    renderer.render(scene, camera);

    stats.update();
};

render();

//
// Controls and automatic window resizing
//

controls = new THREE.OrbitControls(camera, renderer.domElement);

function resizeWindow() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', resizeWindow);
