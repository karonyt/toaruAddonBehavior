import { Entity, system } from "@minecraft/server";
import { Vec3 } from "../../../lib/utils/vec3";

/**
 * @param {Entity} entity 
 */
export function Lightning_straight(entity) {
    try {
        const { x, y, z } = entity.location;
        const location = new Vec3(x, y, z);
        const direction = entity.getViewDirection()
        for (let i = 1; i < 10; i++) {
            system.runTimeout(() => {
                try {
                    entity.dimension.spawnEntity("lightning_bolt", location.offsetDirct(0, 0, 3 + i * 2, direction));

                } catch (error) {

                }
            }, 3 * i);
        }
    } catch (error) {

    }
}

export function Lightning_circle(entity) {
    try {
        const { x, y, z } = entity.location;
        const location = new Vec3(x, y, z);
        const direction = entity.getViewDirection()
        for (let i = 1; i < 10; i++) {
            system.runTimeout(() => {
                try {
                    entity.dimension.spawnEntity("lightning_bolt", location.offsetDirct(0, 0, 3 + i * 2, direction));

                } catch (error) {

                }
            }, 3 * i);
        }
    } catch (error) {

    }

}