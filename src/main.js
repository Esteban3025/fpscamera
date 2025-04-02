import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import { lightsSetup } from './lightsSetup';

class Basic3dWorld {
    constructor() {
        this._inizialize();
    }

    _inizialize() {

        // Renderer
        this._renderer = new THREE.WebGLRenderer();
        this._renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this._renderer.domElement);

        // Scene
        this._scene = new THREE.Scene();
        this._scene.background = new THREE.Color(0x000000);
        new lightsSetup(this._scene);
    
        // Camera
        const fov = 45;
        const aspect = 2
        const near = 0.1;
        const far = 100;
        this._camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        this._camera.position.set(0, 10, 20);
        

        // Controls
        const controls = new OrbitControls(this._camera, this._renderer.domElement);
        controls.update();

        const planeSize = 45;
        // Texture ground loader
        const loader = new THREE.TextureLoader();
        const texture = loader.load('./public/groundTexture.png');
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
        this._scene.add(ground);

        {

            const cubeSize = 8;
            const cubeGeo = new THREE.BoxGeometry( cubeSize, cubeSize, cubeSize );
            const cubeMat = new THREE.MeshPhongMaterial( { color: '#ff0000' } );
            const mesh = new THREE.Mesh( cubeGeo, cubeMat );
            mesh.position.set( 0, cubeSize / 2, 0);
            this._scene.add( mesh );
    
        }

        this._animate();
    }

    _OnWindowResize() {
        this._camera.aspect = window.innerWidth / window.innerHeight;
        this._camera.updateProjectionMatrix();
        this._renderer.setSize(window.innerWidth, window.innerHeight);
    }

    _animate() {
        requestAnimationFrame(() => this._animate());

        // Renderizar la escena
        this._renderer.render(this._scene, this._camera);
    }

   
}

new Basic3dWorld();