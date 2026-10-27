import * as body from './bodyFactory.js';import * as camera from './cameraFactory.js';
import * as board from './boardFactory.js';import * as parts from './partsFactory.js';
export const factories={frame:body.frameFactory,back:body.backFactory,oled:body.oledFactory,frontGlass:body.frontGlassFactory,buttons:body.buttonsFactory,ports:body.portsFactory,sim:body.simFactory,island:camera.islandFactory,lens:camera.lensFactory,flash:camera.flashFactory,lensCover:camera.lensCoverFactory};
Object.assign(factories,{board:board.boardFactory,shields:board.shieldsFactory,package:board.packageFactory,battery:parts.batteryFactory,coil:parts.coilFactory,slab:parts.slabFactory,peripheral:parts.peripheralsFactory,flex:parts.flexFactory,screws:parts.screwFactory});
