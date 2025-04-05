import * as THREE from 'three';
import { FirstPersonControls } from 'three/addons/controls/FirstPersonControls.js';
import { lightsSetup } from './lightsSetup';
import { cameraHelper } from './cameraHelper';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

class Basic3dWorld {
    constructor() {
        this._inizialize();
    }

    _inizialize() {
        const clock = new THREE.Clock();

        // Renderer
        this._renderer = new THREE.WebGLRenderer();
        this._renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this._renderer.domElement);

        // Camera2 perspective
        const fov = 50;
        const aspect = 2
        const near = 0.1;
        const far = 100;
        this._camera2 = new THREE.PerspectiveCamera(fov, aspect, near, far);
        this._camera2.position.set(0, 5, 30);
        
    
        // this._camera = new cameraHelper();

        // Scene 1
        this._scene = new THREE.Scene();
        this._scene.background = new THREE.Color(0x000040);
        new lightsSetup(this._scene);

        // Camera first person
        this._camera = new cameraHelper()._camera;

        // Controls 2 firts person
        // this.controls = new FirstPersonControls(this._camera, this._renderer.domElement);
        // this.controls.movementSpeed = 5;
		// this.controls.lookSpeed = 0.05;
        // this.controls.verticalMax = 0;
        // this.controls.verticalmin = 0;

        // Controls 1 perspective camera
        this.controls2 = new OrbitControls(this._camera, this._renderer.domElement);
        //this.controls2.target.set(0, 5, 0);
        this.controls2.update();

        // Controls 2 perspective camera 2
        this.controls2 = new OrbitControls(this._camera2, this._renderer.domElement);
        this.controls2.target.set(0, 1, 0);
        this.controls2.update();


        const planeSize = 45;

        // Texture ground loader
        const loader = new THREE.TextureLoader();
        const texture = loader.load('/groundTexture.png');
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.magFilter = THREE.NearestFilter;
        texture.colorSpace = THREE.SRGBColorSpace;
        const repeats = planeSize / 2;
        texture.repeat.set(repeats, repeats);

         // Ground
        const groundGeo = new THREE.PlaneGeometry(planeSize, planeSize);
        const groundMat = new THREE.MeshStandardMaterial({
            map: texture,
            side: THREE.DoubleSide,
        });
        const ground = new THREE.Mesh(groundGeo, groundMat);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadows = true;
        this._scene.add(ground);


        // Cylinder
        const cylinderSize = 2;
        const radiusTop = 1.50;
        const radiumBottom = 2.34;
        const height = 18.669;
        const cylinderGeo = new THREE.CylinderGeometry( radiusTop, radiumBottom, height );
        const cylinderMat = new THREE.MeshPhongMaterial( { color: '#FF0000' } );
        this._playerbody = new THREE.Mesh( cylinderGeo, cylinderMat );
        this._playerbody.position.set( 0, cylinderSize / 2, 0);
        this._playerbody.add(this._camera_camera);

        this._scene.add( this._playerbody );
    
        this._renderer.setScissorTest(true);
        this._animate(this._cube, clock);
    }

    _OnWindowResize() {
        this._camera.aspect = window.innerWidth / window.innerHeight;
        this._camera.updateProjectionMatrix();
        this._renderer.setSize(window.innerWidth, window.innerHeight);
        this.controls2.handleResize();
    }

    _animate(cube, clock) {
        requestAnimationFrame(() => this._animate(cube, clock));

        // cube.rotation.x += 0.01;
        // cube.rotation.y += 0.01; 
        
        // Renderizar la escena
        // this.controls.update( clock.getDelta() );
        // this._camera2.updateProjectionMatrix();
        this._renderer.render(this._scene, this._camera2);

        const width = window.innerWidth;
        const height = window.innerHeight;
        const halfWidth = width / 2;

        // 🔹 Vista izquierda (cámara 1)
        this._renderer.setViewport(0, 0, halfWidth, height);
        this._renderer.setScissor(0, 0, halfWidth, height);
        this._renderer.render(this._scene, this._camera);

        // 🔹 Vista derecha (cámara 2)
        this._renderer.setViewport(halfWidth, 0, halfWidth, height);
        this._renderer.setScissor(halfWidth, 0, halfWidth, height);
        his._renderer.render(this._scene, this._camera2);  
    }
}

new Basic3dWorld();