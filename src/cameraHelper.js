import * as THREE from 'three';

export class cameraHelper{
    constructor(camera, cameraFolder){
        this.camera = camera
        const fov = 50;
        const aspect = 2;
        const near = 0.1;
        const far = 1000;
        this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        this.camera.position.set(7.26, 11.5, 10);
        
	    cameraFolder.add( this.camera, 'fov', 1, 180 ).onChange(value => {
            this.camera.fov = value;
            this._updateCamera();
            });
	    const minMaxGUIHelper = new MinMaxGUIHelper( this.camera, 'near', 'far', 0.1 );
        cameraFolder.add( minMaxGUIHelper, 'min', 0.1, 50, 0.1 ).name( 'near' ).onChange(value => {
            this.camera.near = value;
            this._updateCamera();
        });
        cameraFolder.add( minMaxGUIHelper, 'max', 0.1, 50, 0.1 ).name( 'far' ).onChange( value => {
            this.camera.far = value;
            this._updateCamera();
        });
        cameraFolder.add( this.camera.position, 'x', - 100, 10 ).onChange( () => this._updateCamera() );
        cameraFolder.add( this.camera.position, 'y', 0, 100 ).onChange( () => this._updateCamera() );
        cameraFolder.add( this.camera.position, 'z', - 100, 10 ).onChange( () => this._updateCamera() );
    }

    _updateCamera() {
        this.camera.updateProjectionMatrix();
    }

    getFolder() {
        return this.camera;
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


