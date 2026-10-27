import * as body from './bodyFactory.js';import * as camera from './cameraFactory.js';
export const factories={frame:body.frameFactory,back:body.backFactory,oled:body.oledFactory,frontGlass:body.frontGlassFactory,buttons:body.buttonsFactory,ports:body.portsFactory,sim:body.simFactory,island:camera.islandFactory,lens:camera.lensFactory,flash:camera.flashFactory,lensCover:camera.lensCoverFactory};
