import { BlockVolume, Entity, EntityDamageCause, Player, system } from "@minecraft/server";
import { Vec3 } from "../../../lib/utils/vec3";

const meltDownerCount = new Map();

const meltdownerPosition = [
    0, 1, 0.5,
    0.3, 1, 0.5,
    -0.5, 1.5, 0,
    -0.3, 0, -0.5,
    -0.5, 0, 0.5,
    1, 0.5, -0.5,
    -0.7, 1.2, -0.3,
    0, 0.3, -0.4,
    0.2, 0.8, -0.2,
    -1, 2.4, 0,
]

/**
 * @param {Entity} entity 
 */
export function MeltdownerStandby(entity) {
    let count = meltDownerCount.get(entity.id) ?? 0;
    const { x, y, z } = entity.location;
    const location = new Vec3(x, y, z);
    const direction = entity.getViewDirection();
    for (let i = count; i < 10; i++) {
        if (i === 10) return;
        entity.dimension.spawnParticle(`karo:meltdowner_standby`, location.offsetDirct(meltdownerPosition[i * 3], meltdownerPosition[i * 3 + 1], meltdownerPosition[i * 3 + 2], direction));
    };
};

/**
 * @param {Entity} entity 
 * @param {number} time
 */
export function Meltdowner(entity, time) {
    let shouldStop = false;
    let count = meltDownerCount.get(entity.id) ?? 0;
    meltDownerCount.set(entity.id, count + 1);
    if (count === 10) return;
    try {
        if ((entity instanceof Player)) {
            entity.runCommand(`inputpermission set @s camera disabled`);
            entity.runCommand(`inputpermission set @s movement disabled`);
        } else {
            entity.addEffect(`slowness`, time + 10, { amplifier: 10 + time, showParticles: false });
        };
        const { x, y, z } = entity.location;
        const location = new Vec3(x, y, z);
        const direction = entity.getViewDirection();

        for (let chargeTime = 0; chargeTime < time; chargeTime++) {
            system.runTimeout(() => {
                entity.dimension.spawnParticle(`karo:meltdowner_charge`, location.offsetDirct(meltdownerPosition[count * 3], meltdownerPosition[count * 3 + 1], meltdownerPosition[count * 3 + 2], direction));
                entity.addTag(`meltdown_charge`);
                if ((entity instanceof Player)) {
                    const selectedItem = entity.getComponent(`inventory`).container.getItem(entity.selectedSlotIndex);
                    if (!selectedItem || selectedItem?.nameTag != `原子崩し`) {
                        entity.removeTag(`cancel_meltdown`);
                        entity.removeTag(`meltdown_charge`);
                        return;
                    };
                };
                if (entity.addTag(`cancel_meltdown`)) {
                    entity.removeTag(`cancel_meltdown`);
                    entity.removeTag(`meltdown_charge`);
                    return;
                };
            }, chargeTime);
        };
        system.runTimeout(() => {
            for (let i = 0; i < 13; i++) {
                if (shouldStop) {
                    if (!entity.dimension.getBlock(location.offsetDirct(meltdownerPosition[count * 3], meltdownerPosition[count * 3 + 1], (meltdownerPosition[count * 3 + 2]) + i * 4 + (i2 / 4), direction))?.isAir) {
                        let value = meltDownerCount.get(entity.id) ?? 1;
                        meltDownerCount.set(entity.id, value - 1);
                        return;
                    } else {
                        shouldStop = false;
                    };
                };
                system.runTimeout(() => {
                    try {
                        for (let i2 = 0; i2 < 17; i2++) {
                            if (!entity.dimension.getBlock(location.offsetDirct(meltdownerPosition[count * 3], meltdownerPosition[count * 3 + 1], (meltdownerPosition[count * 3 + 2]) + i * 4 + (i2 / 4), direction))?.isAir) {
                                try {
                                    entity.dimension.createExplosion(location.offsetDirct(meltdownerPosition[count * 3], meltdownerPosition[count * 3 + 1], (meltdownerPosition[count * 3 + 2]) + i * 4 + (i2 / 4), direction), 2, { allowUnderwater: true, breaksBlocks: true });
                                } catch (error) { }
                                shouldStop = true;
                            };
                            entity.dimension.spawnParticle(`karo:meltdowner_orbit`, location.offsetDirct(meltdownerPosition[count * 3], meltdownerPosition[count * 3 + 1], (meltdownerPosition[count * 3 + 2]) + i * 4 + (i2 / 4), direction));
                            entity.dimension.getEntities({ location: location.offsetDirct(meltdownerPosition[count * 3], meltdownerPosition[count * 3 + 1], (meltdownerPosition[count * 3 + 2]) + i * 4 + (i2 / 4), direction), maxDistance: 0.5 }).forEach(
                                mob => {
                                    if (mob.hasTag(`imagine_breaker`)) {
                                        shouldStop = true;
                                        return;
                                    };
                                    if (mob.id !== entity.id) {
                                        if (mob.hasTag(`ippou_tuukou`)) {
                                            mob.dimension.getPlayers({
                                                location: mob.location, maxDistance: 30
                                            }).forEach(
                                                p => {
                                                    p.playSound(`reflection`, { location: p.location });
                                                    return;
                                                });
                                            Railgun(mob, 0);
                                            shouldStop = true;
                                            return;
                                        } else {
                                            mob.applyDamage(50, { cause: EntityDamageCause.suicide, damagingEntity: entity });
                                        };
                                    };
                                }
                            );
                        };
                    } catch (error) {
                        let value = meltDownerCount.get(entity.id) ?? 1;
                        meltDownerCount.set(entity.id, value - 1);
                    };
                }, Math.ceil(i / 5));
            };
        }, time);
        system.runTimeout(() => {
            if ((entity instanceof Player)) {
                entity.removeTag(`meltdown_charge`);
                entity.runCommand(`inputpermission set @s camera enabled`);
                entity.runCommand(`inputpermission set @s movement enabled`);
            };
        }, time + 20);
    } catch (error) { };
};