const THREE = require("three");

const COL_GROUP_PLANE = 1;
const COL_GROUP_RED_BALL = 2;
const COL_GROUP_GREEN_BALL = 4;

export class Fizzle {

    start(ammo) {
        let collisionConfiguration  = new Ammo.btDefaultCollisionConfiguration();
        let dispatcher              = new Ammo.btCollisionDispatcher(collisionConfiguration);
        let overlappingPairCache    = new Ammo.btDbvtBroadphase();
        let solver                  = new Ammo.btSequentialImpulseConstraintSolver();
        this.physicsWorld           = new Ammo.btDiscreteDynamicsWorld(dispatcher, overlappingPairCache, solver, collisionConfiguration);
        this.physicsWorld.setGravity(new Ammo.btVector3(0, -10, 0));

        this.setup();
    }

    constructor(el) {

        this.started = false;

        this.bodies = [];

        this.clock = new THREE.Clock();

        Ammo().then(this.start.bind(this));

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
    }

    addPlane() {

        // SHARED

        let pos = {x: 0, y: 0, z: 0};
        let scale = {x: 50, y: 2, z: 50};
        let quat = {x: 0, y: 0, z: 0.4, w: 1};
        let mass = 0;

        // THREE

        let plane = new THREE.Mesh(
            new THREE.BoxBufferGeometry(),
            new THREE.MeshBasicMaterial({color: 0xa0afa4}),
        );

        plane.position.set(pos.x, pos.y, pos.z);
        plane.scale.set(scale.x, scale.y, scale.z);

        this.scene.add(plane);

        // AMMO

        let transform = new Ammo.btTransform();
        transform.setIdentity();
        transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z));
        transform.setRotation(new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w));

        let motionState = new Ammo.btDefaultMotionState(transform);
        let colShape = new Ammo.btBoxShape(new Ammo.btVector3(scale.x/2, scale.y/2, scale.z/2));
        colShape.setMargin(0.05);

        let localInertia = new Ammo.btVector3(0, 0, 0);
        colShape.calculateLocalInertia(mass, localInertia);

        let rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, colShape, localInertia);
        let body = new Ammo.btRigidBody(rbInfo);

        this.physicsWorld.addRigidBody(body);
        plane.userData.physicsBody = body;
        this.bodies.push(plane);
    }

    addBall() {

        // SHARED

        let pos = { x: 0, y: 20, z: 0 };
        let radius = 2;
        let quat = { x: 0, y: 0, z: 0, w: 1 };
        let mass = 1;

        // THREE

        let ball = new THREE.Mesh(
            new THREE.SphereBufferGeometry(radius),
            new THREE.MeshBasicMaterial({color: "#433F81"}),
        );

        ball.position.set(pos.x, pos.y, pos.z);

        this.scene.add(ball);

        // AMMO

        let transform = new Ammo.btTransform();
        transform.setIdentity();
        transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z));
        transform.setRotation(new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w));
        let motionState = new Ammo.btDefaultMotionState(transform);

        let colShape = new Ammo.btSphereShape(radius);
        colShape.setMargin(0.05);

        let localInertia = new Ammo.btVector3(0, 0, 0);
        colShape.calculateLocalInertia(mass, localInertia);

        let rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, colShape, localInertia);
        let body = new Ammo.btRigidBody(rbInfo);

        this.physicsWorld.addRigidBody(body);
        ball.userData.physicsBody = body;
        this.bodies.push(ball);
    }

    setup() {
        this.addPlane();
        this.addBall();

        this.started = true;
    }

    updatePhysics() {
        if (!this.started) return;

        let delta = this.clock.getDelta();
        this.physicsWorld.stepSimulation(delta, 10);

        let tmpTrans = new Ammo.btTransform();

        for (let i=0; i < this.bodies.length; i++) {
            let objThree = this.bodies[i];
            let objAmmo = objThree.userData.physicsBody;
            
            let motionState = objAmmo.getMotionState();

            if (motionState) {
                motionState.getWorldTransform(tmpTrans);
                let p = tmpTrans.getOrigin();
                let q = tmpTrans.getRotation();
                objThree.position.set(p.x(), p.y(), p.z());
                objThree.quaternion.set(q.x(), q.y(), q.z(), q.w());
            }
        }
    }

    update() {
        this.camera.position.x = 0.0;
        this.camera.position.y = 10.0;
        this.camera.position.z = 30.0;
        this.camera.lookAt(0, 10, 0);

        this.updatePhysics();
    }

    draw() {
        this.renderer.render(this.scene, this.camera);
    }
};