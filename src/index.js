const THREE = require("three");

async function believeIt() {
    console.log("Believe It!");
}

export class Fizzle {
    constructor(el) {

        believeIt().then(() => {
            console.log("x_x 420");
        });

        this.ctx = el.getContext("webgl");
        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer({
            canvas: el,
            antialias: true,
        });
        this.renderer.setClearColor("#000000");
        this.camera = new THREE.PerspectiveCamera(
            75,
            el.width/el.height,
            0.1,
            1000,
        );

        // Create the Geometry passing the size
        let geometry = new THREE.BoxGeometry(1, 1, 1);// Create the Material passing the color
        let material = new THREE.MeshBasicMaterial({ color: "#433F81" });// Create the Mesh
        let cube = new THREE.Mesh(geometry, material);// Add the mesh to the scene

        this.scene.add(cube);
    }

    setup() {
    }

    update() {
        this.camera.position.x =  1.0;
        this.camera.position.y =  1.0;
        this.camera.position.z =  1.0;
        this.camera.lookAt(0, 0, 0);
    }

    draw() {
        this.renderer.render(this.scene, this.camera);
    }
};