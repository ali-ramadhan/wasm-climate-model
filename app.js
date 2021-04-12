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
// Boilerplate setup
//

var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight);
camera.position.z = 4;

var renderer = new THREE.WebGLRenderer({antialias: true});

renderer.setClearColor(0x000000);

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

//
// Fun starts here!
//

var geometry = new THREE.SphereGeometry(2, 50, 50);
var material = new THREE.MeshBasicMaterial({vertexColors: true});
var sphere = new THREE.Mesh(geometry, material);

scene.add(sphere);

const n_vertices = geometry.attributes.position.count;

const positionAttribute = geometry.getAttribute('position');

function updateVertexColors(time) {
    const colors = [];

    for (let n = 0; n < n_vertices; n++) {
        const vertex = new THREE.Vector3();
        vertex.fromBufferAttribute(positionAttribute, n);

        const vertexSpherical = new THREE.Spherical();
        vertexSpherical.setFromVector3(vertex);

        const phi = vertexSpherical.phi;
        const theta = vertexSpherical.theta;

        const functionValue = (1 + Math.sin(phi)**2 * Math.cos(2*theta - time)) / 2;

        // console.log(`vertex ${n} = (ϕ=${phi}, θ=${theta}) -> f = ${functionValue}`);

        const vertexColor = interpolateLinearly(functionValue, seismic);

        colors.push(...vertexColor);
    }

    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
}

updateVertexColors(0)

const startTime = new Date();

var render = function () {
    requestAnimationFrame(render);

    var endTime = new Date();
    var timeDiff = endTime - startTime; // in ms
    timeDiff /= 1000;

    updateVertexColors(timeDiff)

    // sphere.rotation.x += 0.01;
    // sphere.rotation.y += 0.01;

    renderer.render(scene, camera);

    stats.update();
};

render();

controls = new THREE.OrbitControls(camera, renderer.domElement);

function resizeWindow() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', resizeWindow);
