import { BlockVolume, EasingType, Entity, EntityDamageCause, Player, system, world } from "@minecraft/server";
import { Vec3 } from "../../../lib/utils/vec3";
import { isBlockBreak } from "../../../lib/utils/util";

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
                                        p => p.playSound(`reflection`, { location: mob.location })
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
                                p => p.playSound(`reflection`, { location: mob.location })
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
 * @param {number} time // チャージtick
 */
export function Railgun(entity, time) {
    const base = new Vec3(
        entity.location.x,
        entity.location.y,
        entity.location.z
    );
    const dir = entity.getViewDirection();
    const rot = entity.getRotation();

    if (entity instanceof Player) {
        entity.runCommand(`inputpermission set @s camera disabled`);
        entity.runCommand(`inputpermission set @s movement disabled`);
    }

    if (entity.getDynamicProperty('isCameraOnSkill') && (entity instanceof Player)) {
        entity.camera.setCamera('minecraft:free', { location: base.offsetDirct(-2, 0, 2, dir), rotation: { x: rot.x, y: rot.y - 150 } });
        system.runTimeout(() => {
            entity.camera.setCamera('minecraft:free', { location: base.offsetDirct(-20, 3, 5, dir), rotation: { x: rot.x, y: rot.y - 45 }, easeOptions: { easeType: EasingType.Linear, easeTime: 3 } });
        }, time + 2); system.runTimeout(() => { entity.camera.clear(); }, time + 63);
    };

    system.runTimeout(() => {
        const shootPos = base.offsetDirct(0, 1, 1, dir);

        const bullet = entity.dimension.spawnEntity(
            "karo:railgun_bullet",
            shootPos
        );

        const proj = bullet.getComponent("projectile");
        proj.owner = entity;
        proj.shoot(dir);
    }, time + 43);

    system.runTimeout(() => {
        if (entity instanceof Player) {
            entity.runCommand(`inputpermission set @s camera enabled`);
            entity.runCommand(`inputpermission set @s movement enabled`);
        }
    }, time + 20);
}

const lastPos = new Map();
const STEP = 0.25;

const stopBlocks = [
    "minecraft:bedrock",
    "minecraft:obsidian",
    "minecraft:crying_obsidian"
];

world.afterEvents.entitySpawn.subscribe(ev => {
    if (ev.entity.typeId === "karo:railgun_bullet") {
        lastPos.set(ev.entity.id, ev.entity.location);
    }
});

world.beforeEvents.entityRemove.subscribe(ev => {
    if (ev.removedEntity.typeId === "karo:railgun_bullet") {
        lastPos.delete(ev.removedEntity.id);
    }
});

system.runInterval(() => {
    for (const dimId of ["overworld", "nether", "the_end"]) {
        const dim = world.getDimension(dimId);

        for (const b of dim.getEntities({ type: "karo:railgun_bullet" })) {
            const prev = lastPos.get(b.id);
            const cur = b.location;
            if (!prev) {
                lastPos.set(b.id, cur);
                continue;
            }

            const dx = cur.x - prev.x;
            const dy = cur.y - prev.y;
            const dz = cur.z - prev.z;
            const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
            const steps = Math.max(1, Math.floor(dist / STEP));

            let dead = false;

            for (let i = 0; i <= steps; i++) {
                const t = i / steps;
                const pos = {
                    x: prev.x + dx * t,
                    y: prev.y + dy * t,
                    z: prev.z + dz * t
                };

                try {
                    dim.spawnParticle("karo:railgun_orbit", pos);
                } catch (error) {

                }

                try {
                    const block = dim.getBlock(pos);
                    if (block && stopBlocks.includes(block.typeId)) {
                        b.remove();
                        lastPos.delete(b.id);
                        dead = true;
                        break;
                    }

                    try {
                        const blockLocation = new Vec3(block.x, block.y, block.z);
                        const direction = b.getViewDirection();
                        dim.createExplosion(blockLocation.offsetDirct(0, 2, i * 4, direction), 2, { allowUnderwater: true, breaksBlocks: isBlockBreak() });
                    } catch (error) { };
                } catch (error) {

                }

                try {
                    for (const mob of dim.getEntities({
                        location: pos,
                        maxDistance: 1.5
                    })) {
                        if (mob.id === b.id) continue;
                        if (mob.id === b.getComponent("projectile")?.owner?.id) continue;

                        mob.applyDamage(200, {
                            cause: EntityDamageCause.entityAttack,
                            damagingEntity: b.getComponent("projectile").owner
                        });
                    }

                    if (dead) break;
                } catch (error) {

                }
            }

            if (!dead) {
                lastPos.set(b.id, { ...cur });
            }
        }
    }
}, 1);
