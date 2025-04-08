import * as THREE from 'three';
import { lightsSetup } from './lightsSetup';
import { cameraHelper } from './cameraHelper';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUIHelper } from './GUIHelper';

class Basic3dWorld {
    constructor() {
        this._inizialize();
    }

    _inizialize() {
        const clock = new THREE.Clock();
        const gui = new GUIHelper();

        // Renderer
        this._renderer = new THREE.WebGLRenderer();
        this._renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this._renderer.domElement);

        // Scene 1
        this._scene = new THREE.Scene();
        this._scene.background = new THREE.Color(0x000040);
    
        this._camera = new cameraHelper(this._camera, gui.getFolder('Camera')).camera;
        new lightsSetup(this._scene, gui.getFolder('Lights'));

        //Controls
        this.control = new OrbitControls(this._camera, this._renderer.domElement);
        this.control.update();

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
        this._playerbody.add(this._camera);

        this._scene.add( this._playerbody );
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

        this._renderer.render(this._scene, this._camera);

    }
}

new Basic3dWorld();