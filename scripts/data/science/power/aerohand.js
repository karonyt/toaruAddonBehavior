import { Entity, Player, system } from "@minecraft/server";
import { Vec3 } from "../../../lib/utils/vec3";
import { ModalFormData } from "@minecraft/server-ui";

/**
 * @param {Entity} entity 
 */
export function Knockback_straight(entity) {
    let shouldStop = false;
    try {
        const { x, y, z } = entity.location;
        const location = new Vec3(x, y, z);
        const direction = entity.getViewDirection();

        const horizontalX = entity.getDynamicProperty('aerohand.horizontal.x') || 1;
        const horizontalZ = entity.getDynamicProperty('aerohand.horizontal.z') || 1;
        const vertical = entity.getDynamicProperty('aerohand.vertical') || 0.5;
        const maxlength = entity.getDynamicProperty('aerohand.maxlength') || 20;
        for (let i = 1; i < (maxlength / 2); i++) {

            if (!entity.dimension.getBlock(location.offsetDirct(0, 1, i * 2, direction)).isAir) return;
            system.runTimeout(() => {
                if (shouldStop) return;
                const entities = entity.dimension.getEntities({ location: location.offsetDirct(0, 1, i * 2, direction), maxDistance: 3 });
                for (const mob of entities) {
                    if (mob.hasTag(`imagine_breaker`)) {
                        shouldStop = true;
                        return;
                    };
                    if (mob.id !== entity.id) {
                        if (mob.hasTag(`ippou_tuukou`)) {
                            mob.dimension.getPlayers({ location: mob.location, maxDistance: 30 }).forEach(
                                p => p.playSound(`reflection`, { location: mob.location })
                            );
                            Knockback_straight(mob);
                            shouldStop = true;
                            return;
                        } else {
                            try {
                                mob.applyKnockback({ x: direction.x * horizontalX, z: direction.z * horizontalZ }, vertical / 10);
                            } catch (error) {
                                mob.applyImpulse(location.offsetDirct(0, 0.5, i * 5, direction).offset(-location.x, -location.y, -location.z));
                            };
                        };
                    };
                };
                if (!shouldStop) entity.dimension.spawnParticle(`minecraft:dragon_destroy_block`, location.offsetDirct(0, 1, i * 3, direction));
            }, i);
            if (shouldStop) return;
        }
    } catch (error) {
        console.error(error);
    }
}

/**
 * 
 * @param {Player} player 
 */
export function AerohandParameterForm(player) {
    const form = new ModalFormData();

    form.title({ translate: 'form.aerohand.setting.title' });
    form.slider({ translate: 'form.aerohand.setting.button.horizontal.x' }, 1, 20, { defaultValue: player.getDynamicProperty('aerohand.horizontal.x') ?? 1, valueStep: 1 });
    form.slider({ translate: 'form.aerohand.setting.button.horizontal.z' }, 1, 20, { defaultValue: player.getDynamicProperty('aerohand.horizontal.z') ?? 1, valueStep: 1 });
    form.slider({ translate: 'form.aerohand.setting.button.vertical' }, 1, 30, { defaultValue: player.getDynamicProperty('aerohand.vertical') ?? 1, valueStep: 1 });
    form.slider({ translate: 'form.aerohand.setting.button.maxlength' }, 2, 20, { defaultValue: player.getDynamicProperty('aerohand.maxlength') ?? 1, valueStep: 1 });

    form.show(player).then((rs) => {
        if (rs.canceled) {
            return;
        };
        player.setDynamicProperty('aerohand.horizontal.x', rs.formValues[0]);
        player.setDynamicProperty('aerohand.horizontal.z', rs.formValues[1]);
        player.setDynamicProperty('aerohand.vertical', rs.formValues[2]);
        player.setDynamicProperty('aerohand.maxlength', rs.formValues[3]);

        player.sendMessage({ translate: 'updated' });
    });
};