import { Entity, EntityDamageCause, Player, system } from "@minecraft/server";
import { Vec3 } from "../../../lib/utils/vec3";

/**
 * @param {Entity} entity 
 */
export function Lightning_straight(entity) {
    let shouldStop = false
    try {
        const { x, y, z } = entity.location;
        const location = new Vec3(x, y, z);
        const direction = entity.getViewDirection()
        for (let i = 1; i < 10; i++) {
            if (shouldStop) return;
            system.runTimeout(() => {
                try {
                    entity.dimension.getEntities({ location: location.offsetDirct(0, 2, i * 4, direction), maxDistance: 3 }).forEach(
                        mob => {
                            if (mob.hasTag(`imagine_breaker`)) {
                                shouldStop = true;
                                return;
                            }
                            if (mob.id !== entity.id) {
                                if (mob.hasTag(`ippou_tuukou`)) {
                                    mob.dimension.getPlayers({ location: mob.location, maxDistance: 30 }).forEach(
                                        p => p.playSound(`reflection`,{location: mob.location})
                                    )
                                    Lightning_straight(mob);
                                    shouldStop = true;
                                    return;
                                }
                            }
                        }
                    )
                    if (!shouldStop) {
                        entity.dimension.spawnEntity("lightning_bolt", location.offsetDirct(0, 0, 3 + i * 2, direction));
                    }
                } catch (error) {

                }
            }, 3 * i);
        }
    } catch (error) {

    }
}

/**
 * @param {Entity} entity 
 */
export function Lightning_circle(entity) {
    let shouldStop = false
    try {
        const { x, y, z } = entity.location;
        const location = new Vec3(x, y, z);
        const direction = entity.getViewDirection()
        for (let i = 1; i < 10; i++) {
            if (shouldStop) return;
            entity.dimension.getEntities({ location: location.offsetDirct(0, 2, i * 4, direction), maxDistance: 3 }).forEach(
                mob => {
                    if (mob.hasTag(`imagine_breaker`)) {
                        shouldStop = true;
                        return;
                    }
                    if (mob.id !== entity.id) {
                        if (mob.hasTag(`ippou_tuukou`)) {
                            mob.dimension.getPlayers({ location: mob.location, maxDistance: 30 }).forEach(
                                p => p.playSound(`reflection`,{location: mob.location})
                            );
                            Lightning_straight(mob);
                            shouldStop = true;
                            return;
                        };
                    };
                }
            );
            if (!shouldStop) {
                try {
                    entity.dimension.spawnEntity("lightning_bolt", Vec3.circle(location, 5, i * 40));
                    entity.dimension.spawnEntity("lightning_bolt", Vec3.circle(location, 10, i * 40));
                } catch (error) { };
            };
        }
    } catch (error) {

    };
};

/**
 * @param {Entity} entity 
 * @param {number} time
 */
/**
 * @param {Entity} entity 
 * @param {number} time
 */
export function Railgun(entity, time) {
    let shouldStop = false;
    try {
        if ((entity instanceof Player)) {
            entity.runCommand(`inputpermission set @s camera disabled`);
            entity.runCommand(`inputpermission set @s movement disabled`);
        }
        system.runTimeout(() => {
            const { x, y, z } = entity.location;
            const location = new Vec3(x, y, z);
            const direction = entity.getViewDirection();
            for (let i = 2; i < 13; i++) {
                if (shouldStop) return;
                if (!entity.dimension.getBlock(location.offsetDirct(0, 2, i * 4, direction)).isAir) return;
                system.runTimeout(() => {
                    try {
                        for(let i2 = 0;i2 < 17;i2++) {
                            entity.dimension.spawnParticle(`karo:railgun_orbit`,location.offsetDirct(0, 2, i * 4 + (i2 / 4), direction));
                        };
                        entity.dimension.getEntities({ location: location.offsetDirct(0, 2, i * 4, direction), maxDistance: 3 }).forEach(
                            mob => {
                                if (mob.hasTag(`imagine_breaker`)) {
                                    shouldStop = true;
                                    return;
                                };
                                if (mob.id !== entity.id) {
                                    if (mob.hasTag(`ippou_tuukou`)) {
                                        mob.dimension.getPlayers({ location: mob.location, maxDistance: 30 }).forEach(
                                            p => p.playSound(``)
                                        );
                                        Railgun(mob, 0);
                                        shouldStop = true;
                                        return;
                                    } else {
                                        mob.applyDamage(50, { cause: EntityDamageCause.suicide, damagingEntity: entity });
                                    };
                                };
                            }
                        );
                        if (!shouldStop) {
                            entity.dimension.createExplosion(location.offsetDirct(0, 2, i * 4, direction), 1, { allowUnderwater: true, breaksBlocks: false });
                        };

                    } catch (error) { };
                }, Math.ceil(i / 5));
            };
        }, time)
        system.runTimeout(() => {
            if ((entity instanceof Player)) {
                entity.runCommand(`inputpermission set @s camera enabled`);
                entity.runCommand(`inputpermission set @s movement enabled`);
            }
        }, time + 20);
    } catch (error) { };
};