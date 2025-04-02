import * as THREE from 'three';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

export class cameraHelper{
    constructor() {
        const fov = 50;
        const aspect = 2;
        const near = 0.1;
        const far = 100;
        this._camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        this._camera.position.set(0, 20, 30);

        this.gui = new GUI();
	    this.gui.add( this._camera, 'fov', 1, 180 ).onChange(value => {
            this._camera.fov = value;
            this._updateCamera();
        });
	    const minMaxGUIHelper = new MinMaxGUIHelper( this._camera, 'near', 'far', 0.1 );
        this.gui.add( minMaxGUIHelper, 'min', 0.1, 50, 0.1 ).name( 'near' ).onChange(value => {
            this._camera.near = value;
            this._updateCamera();
        });
        this.gui.add( minMaxGUIHelper, 'max', 0.1, 50, 0.1 ).name( 'far' ).onChange( value => {
            this._camera.far = value;
            this._updateCamera();
        });
    }

    _updateCamera() {
        this._camera.updateProjectionMatrix();
    }
}    

class MinMaxGUIHelper {

    constructor( obj, minProp, maxProp, minDif ) {

        this.obj = obj;
        this.minProp = minProp;
        this.maxProp = maxProp;
        this.minDif = minDif;

    }
    get min() {

        return this.obj[ this.minProp ];

    }
    set min( v ) {

        this.obj[ this.minProp ] = v;
        this.obj[ this.maxProp ] = Math.max( this.obj[ this.maxProp ], v + this.minDif );

    }
    get max() {

        return this.obj[ this.maxProp ];

    }
    set max( v ) {

        this.obj[ this.maxProp ] = v;
        this.min = this.min; // this will call the min setter

    }

}

export default cameraHelper;


