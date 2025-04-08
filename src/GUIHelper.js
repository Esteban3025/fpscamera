import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

export class GUIHelper {
    constructor() {
        this.gui = new GUI();

        this.folders = {
            Camera: this.gui.addFolder('Camera'),
            Lights: this.gui.addFolder('Lights')
        }
    }

    getFolder(name) {
        return this.folders[name];
    }
}

