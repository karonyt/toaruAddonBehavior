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