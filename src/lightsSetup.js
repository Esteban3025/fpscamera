import * as THREE from 'three';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

export class lightsSetup {
    constructor(scene) {
        this.scene = scene;
        this.color = 0xFFFFFF;
        this.intensity = 150;
        this.light = new THREE.PointLight(this.color, this.intensity);
        this.light.position.set(0, 10, 0);
        this.scene.add(this.light);

        this.helper = new THREE.PointLightHelper(this.light);
        this.scene.add(this.helper);

        this.gui = new GUI();
        this.gui.addColor(new ColorGUIHelper(this.light, 'color'), 'value').name('color');
        this.gui.add(this.light, 'intensity', 0, 250, 1);
        this.gui.add(this.light, 'distance', 0, 40).onChange(() => this.helper.update());

        this._makeXYZGUI(this.gui, this.light.position, 'position');
    }

    _makeXYZGUI( gui, vector3, name, onChangeFn ) {

		const folder = gui.addFolder( name );
		folder.add( vector3, 'x', - 100, 10 ).onChange( onChangeFn );
		folder.add( vector3, 'y', 0, 100 ).onChange( onChangeFn );
		folder.add( vector3, 'z', - 100, 10 ).onChange( onChangeFn );
		folder.open();

	}

}

class ColorGUIHelper {

    constructor( object, prop ) {

        this.object = object;
        this.prop = prop;

    }
    get value() {

        return `#${this.object[ this.prop ].getHexString()}`;

    }
    set value( hexString ) {

        this.object[ this.prop ].set( hexString );

    }

}
