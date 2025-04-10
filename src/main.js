import * as THREE from 'three';
import { lightsSetup } from './lightsSetup';
import { cameraHelper } from './cameraHelper';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import { GUIHelper } from './GUIHelper';

class Basic3dWorld {
    constructor() {
        this.renderer = new THREE.WebGLRenderer();
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		document.body.appendChild(this.renderer.domElement);
        this._inizialize();
        this.raycaster = new THREE.Raycaster();
		this.velocity = new THREE.Vector3();
		this.direction = new THREE.Vector3();
		this.moveForward = false;
		this.moveBackward = false;
		this.moveLeft = false;
		this.moveRight = false;
		this.canJump = false;
		this.prevTime = performance.now();

        this.controls = new PointerLockControls(this._camera, document.body);

        this._onKeyDown = this._onKeyDown.bind(this);
		this._onKeyUp = this._onKeyUp.bind(this);
		document.addEventListener('keydown', this._onKeyDown);
		document.addEventListener('keyup', this._onKeyUp);

        const blocker = document.getElementById('blocker');
		const instructions = document.getElementById('instructions');

		instructions.addEventListener('click', () => {
			this.controls.lock();
		});

		this.controls.addEventListener('lock', () => {
			blocker.style.display = 'none';
			instructions.style.display = 'none';
		});

		this.controls.addEventListener('unlock', () => {
			blocker.style.display = 'block';
			instructions.style.display = '';
		});
    }

    _inizialize() {
        const gui = new GUIHelper();

        // Scene
        this._scene = new THREE.Scene();
        this._scene.background = new THREE.Color(0x000040);
        this._scene.fog = new THREE.Fog( 0x000000, 0, 750 );
    
        // Lights setup
        this._camera = new cameraHelper(this._camera, gui.getFolder('Camera')).camera;
        new lightsSetup(this._scene, gui.getFolder('Lights'));

        // Ground plane size
        const planeSize = 1000;

        // Texture ground loader
        const loader = new THREE.TextureLoader();
        const texture = loader.load('/textures/wood_floor_diff_4k.jpg');
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.magFilter = THREE.NearestFilter;
        texture.colorSpace = THREE.SRGBColorSpace;
        const repeats = planeSize / 2;
        texture.repeat.set(repeats, repeats);

         // Ground
        let groundGeo = new THREE.PlaneGeometry(planeSize, planeSize, 10, 100);
        const groundMat = new THREE.MeshStandardMaterial({
            map: texture,
            side: THREE.DoubleSide,
        });
        const ground = new THREE.Mesh(groundGeo, groundMat);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = 0;
        ground.receiveShadows = true;
        this._scene.add(ground);

        // Cylinder
        const cylinderSize = 4;
        const radiusTop = 1.50;
        const radiumBottom = 2.34;
        const height = 8;
        const cylinderGeo = new THREE.CylinderGeometry( radiusTop, radiumBottom, height );
        const cylinderMat = new THREE.MeshPhongMaterial( { color: '#FF0000' } );
        this._playerbody = new THREE.Mesh( cylinderGeo, cylinderMat );
        this._playerbody.position.y = 1;

        this._scene.add(this._playerbody);
        this._camera.add(this._playerbody);
        this.renderer.setAnimationLoop(this._animate.bind(this));
    }

    // Resize the windows
    _OnWindowResize() {
        this._camera.aspect = window.innerWidth / window.innerHeight;
        this._camera.updateProjectionMatrix();
        this._renderer.setSize(window.innerWidth, window.innerHeight);
    }
    // Keyboard events
    _onKeyDown(event) {
		switch (event.code) {
			case 'ArrowUp':
			case 'KeyW':
				this.moveForward = true;
				break;
			case 'ArrowLeft':
			case 'KeyA':
				this.moveLeft = true;
				break;
			case 'ArrowDown':
			case 'KeyS':
				this.moveBackward = true;
				break;
			case 'ArrowRight':
			case 'KeyD':
				this.moveRight = true;
				break;
			case 'Space':
				if (this.canJump) {
					this.velocity.y += 350;
					this.canJump = false;
				}
				break;
		}
	}

	_onKeyUp(event) {
		switch (event.code) {
			case 'ArrowUp':
			case 'KeyW':
				this.moveForward = false;
				break;
			case 'ArrowLeft':
			case 'KeyA':
				this.moveLeft = false;
				break;
			case 'ArrowDown':
			case 'KeyS':
				this.moveBackward = false;
				break;
			case 'ArrowRight':
			case 'KeyD':
				this.moveRight = false;
				break;
		}
	}

    // Animate method
    _animate() {
        const time = performance.now();
		const delta = (time - this.prevTime) / 1000;

		if (this.controls.isLocked === true) {
			this.velocity.x -= this.velocity.x * 10.0 * delta;
			this.velocity.z -= this.velocity.z * 10.0 * delta;
			this.velocity.y -= 9.8 * 100.0 * delta;

			this.direction.z = Number(this.moveForward) - Number(this.moveBackward);
			this.direction.x = Number(this.moveRight) - Number(this.moveLeft);
			this.direction.normalize();

			if (this.moveForward || this.moveBackward)
				this.velocity.z -= this.direction.z * 400.0 * delta;
			if (this.moveLeft || this.moveRight)
				this.velocity.x -= this.direction.x * 400.0 * delta;

			this.controls.moveRight(-this.velocity.x * delta);
			this.controls.moveForward(-this.velocity.z * delta);

			this._camera.position.y += this.velocity.y * delta;

			if (this._camera.position.y < 10) {
				this.velocity.y = 0;
				this._camera.position.y = 10;
				this.canJump = true;
			}
		}

		this.prevTime = time;
		this.renderer.render(this._scene, this._camera);
	}   
}

new Basic3dWorld();