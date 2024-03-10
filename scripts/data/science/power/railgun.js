import { Entity, EntityDamageCause, Player, system } from "@minecraft/server";
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

/**
 * @param {Entity} entity 
 */
export function Lightning_circle(entity) {
    try {
        const { x, y, z } = entity.location;
        const location = new Vec3(x, y, z);
        const direction = entity.getViewDirection()
        for (let i = 1; i < 10; i++) {
            try {
                entity.dimension.spawnEntity("lightning_bolt", Vec3.circle(location, 5, i * 40));
                entity.dimension.spawnEntity("lightning_bolt", Vec3.circle(location, 10, i * 40));
            } catch (error) { }
        }
    } catch (error) {

    }
}

/**
 * @param {Entity} entity 
 */
export function Railgun(entity) {
    try {
        if (entity instanceof Player) {
            entity.runCommand(`inputpermission set @s camera disabled`)
            entity.runCommand(`inputpermission set @s movement disabled`)
        }
        system.runTimeout(() => {
            const { x, y, z } = entity.location;
            const location = new Vec3(x, y, z);
            const direction = entity.getViewDirection()
            for (let i = 2; i < 13; i++) {
                if (!entity.dimension.getBlock(location.offsetDirct(0, 2, i * 4, direction)).isAir) return;
                system.runTimeout(() => {
                    try {
                        entity.dimension.createExplosion(location.offsetDirct(0, 2, i * 4, direction), 2, { allowUnderwater: true, breaksBlocks: false });
                        entity.dimension.getEntities({ location: location.offsetDirct(0, 2, i * 3, direction), maxDistance: 3 }).forEach(
                            mob => mob.applyDamage(50, { cause: EntityDamageCause.suicide, damagingEntity: entity })
                        )
                    } catch (error) { }
                }, Math.ceil(i / 5))
            }
        }, 80)
        system.runTimeout(() => {
            if (entity instanceof Player) {
                entity.runCommand(`inputpermission set @s camera enabled`)
                entity.runCommand(`inputpermission set @s movement enabled`)
            }
        }, 100)
    } catch (error) { }
}