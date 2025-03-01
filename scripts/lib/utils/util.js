import { Entity, Vector3 } from "@minecraft/server"

/**
 * 爆発を起こす関数
 * @param {number} power
 * @param {Entity} entity
 * @param {Vector3} location
 */
export function create_explosion(power, entity, location) {
    entity.addEffect(`resistance`,2,{showParticles: false,amplifier: 250});
    entity.dimension.createExplosion(location,power,{allowUnderwater: true});
};

/**
 * 
 * @param {number} min 
 * @param {number} max 
 * @returns 
 */
export function getRandom(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}