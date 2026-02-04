import { Entity, world } from "@minecraft/server"

/**
 * 爆発を起こす関数
 * @param {number} power
 * @param {Entity} entity
 * @param {{x: number, y: number, z: number}} location
 */
export function create_explosion(power, entity, location) {
    entity.addEffect(`resistance`, 2, { showParticles: false, amplifier: 250 });
    entity.dimension.createExplosion(location, power, { allowUnderwater: true });
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

export function getDistance(a, b) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    const dz = a.z - b.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

/**
 * 
 * @param {Entity} entity 
 * @returns 
 */
export function buildContext(entity) {
    const target = entity.target;
    if (!target) return null;

    return {
        target,
        distance: getDistance(entity.location, target.location),
        isFlying: entity.getProperty("property:is_flying") || false,
        isHighSpeed: entity.getProperty("property:is_high_speed") || false,
    };
}

export function pickSkill(ctx, skills) {
    const pool = [];

    for (const s of skills) {
        if (!s.condition(ctx)) continue;
        for (let i = 0; i < s.weight; i++) {
            pool.push(s);
        }
    }

    if (pool.length === 0) return null;
    return pool[getRandom(0, pool.length - 1)];
}

/**
 * 
 * @returns {boolean}
 */
export function isBlockBreak() {
    const isBreak = world.getDynamicProperty("isBlockBreakBySkill");
    if (!isBreak) return true;
    if (isBreak) return false;
}