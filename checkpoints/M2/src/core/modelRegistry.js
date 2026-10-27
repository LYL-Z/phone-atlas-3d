const devices=new Map();
export function registerDevice(def){if(devices.has(def.id))throw Error('Duplicate device');const ids=new Set();for(const p of def.parts){if(ids.has(p.id))throw Error('Duplicate part');ids.add(p.id);}devices.set(def.id,def);}
export const listDevices=()=>[...devices.values()];
export const getDevice=id=>{if(!devices.has(id))throw Error('Unknown device');return devices.get(id);};
