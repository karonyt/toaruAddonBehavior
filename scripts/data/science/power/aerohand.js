import { Entity, Player, system } from "@minecraft/server";
import { Vec3 } from "../../../lib/utils/vec3";

/**
 * @param {Entity} entity 
 */
export function Knockback_straight(entity) {
    try {
        const { x, y, z } = entity.location;
        const location = new Vec3(x, y, z);
        const direction = entity.getViewDirection()
        for (let i = 1; i < 10; i++) {
            system.runTimeout(() => {
                try {
                    entity.dimension.getEntities({ location: location.offsetDirct(0, 1, i * 2, direction), maxDistance: 3 }).forEach(mob => {
                        if (mob.id !== entity.id) {
                            try {
                                mob.applyKnockback(direction.x, direction.z, 4, 0.5)
                            } catch (error) {
                                mob.applyImpulse(location.offsetDirct(0, 0.5, i * 5, direction).offset(-l.x, -l.y, -l.z))
                            }
                        }

                    });
                    const l = location;
                    entity.dimension.spawnParticle(`minecraft:dragon_destroy_block`, location.offsetDirct(0, 1, i * 5, direction));

                } catch (error) {

                }
            }, 3 * i);
        }
    } catch (error) {

    }
}