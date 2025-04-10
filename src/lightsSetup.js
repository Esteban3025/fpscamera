import * as THREE from 'three';

export class lightsSetup {
    constructor(scene, luzFolder) {
        this.scene = scene;
        this.color = 0xFFFFFF;
        this.intensity = 1;
        this.light = new THREE.AmbientLight(this.color, this.intensity);
        this.light.position.set(-0.77, 11.5, 5.94);
        this.scene.add(this.light);

        // this.helper = new THREE.AmbientLightHelper(this.light);
        // this.scene.add(this.helper);

        luzFolder.addColor(new ColorGUIHelper(this.light, 'color'), 'value').name('color');
        // luzFolder.add(this.light, 'intensity', 0, 250, 1);
        // luzFolder.add(this.light, 'distance', 0, 40).onChange(() => this.helper.update());
        luzFolder.add( this.light.position, 'x', - 100, 10 ).onChange(() => this.helper.update());
		luzFolder.add( this.light.position, 'y', 0, 100 ).onChange(() => this.helper.update());
		luzFolder.add( this.light.position, 'z', - 100, 10 ).onChange(() => this.helper.update());
    }

    getFolder() {
        return this.light;
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
