import { Entity, Player, system } from "@minecraft/server";
import { Vec3 } from "../../../lib/utils/vec3";

/**
 * @param {Entity} entity 
 */
export function Knockback_straight(entity) {
    let shouldStop = false;
    try {
        const { x, y, z } = entity.location;
        const location = new Vec3(x, y, z);
        const direction = entity.getViewDirection();
        for (let i = 1; i < 10; i++) {

            if (!entity.dimension.getBlock(location.offsetDirct(0, 1, i * 2, direction)).isAir) return;
            system.runTimeout(() => {
                if (shouldStop) return;
                const entities = entity.dimension.getEntities({ location: location.offsetDirct(0, 1, i * 2, direction), maxDistance: 3 })
                for (const mob of entities) {
                    if (mob.hasTag(`imagine_breaker`)) {
                        shouldStop = true;
                        return;
                    }
                    if (mob.id !== entity.id) {
                        if (mob.hasTag(`ippou_tuukou`)) {
                            mob.dimension.getPlayers({location: mob.location,maxDistance: 30}).forEach(
                                p => p.playSound(`reflection`)
                            );
                            Knockback_straight(mob);
                            shouldStop = true;
                            return;
                        } else {
                            try {
                                mob.applyKnockback(direction.x, direction.z, 4, 0.5)
                            } catch (error) {
                                mob.applyImpulse(location.offsetDirct(0, 0.5, i * 5, direction).offset(-location.x, -location.y, -location.z))
                            }
                        }
                    }
                };
                if (!shouldStop) entity.dimension.spawnParticle(`minecraft:dragon_destroy_block`, location.offsetDirct(0, 1, i * 3, direction));
            }, i);
            if (shouldStop) return;
        }
    } catch (error) {
        console.error(error);
    }
}


