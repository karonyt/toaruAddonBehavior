import { system, world, Entity } from "@minecraft/server";
import { buildContext, getRandom, pickSkill } from "../../lib/utils/util";
import { cooltimeMap } from "../../system/cooltime";

const SKILLS = [
    {
        id: 0,
        weight: 2,
        cooltime: 2000,
        condition: (ctx) => !ctx.isFlying && ctx.distance < 8
    },
    {
        id: 2,
        weight: 1,
        cooltime: 4000,
        condition: (ctx) => !ctx.isHighSpeed && ctx.distance >= 6
    },
    {
        id: 5,
        weight: 1,
        cooltime: 5000,
        condition: (ctx) => ctx.distance < 4
    },
    {
        id: 6,
        weight: 1,
        cooltime: 8000,
        condition: (ctx) => ctx.distance >= 10
    }
];

system.afterEvents.scriptEventReceive.subscribe((ev) => {
    if (ev.id !== "karo:accelerator_attack") return;

    const entity = ev.sourceEntity;
    if (!entity) return;

    const now = Date.now();
    const next = cooltimeMap.get(entity.id) || 0;

    if (now < next) return;

    const ctx = buildContext(entity);
    if (!ctx) return;

    if (ctx.isFlying && ctx.distance > 12) {
        entity.triggerEvent("accelerator_stop_fly");
    }

    if (ctx.isHighSpeed && ctx.distance < 3) {
        entity.triggerEvent("accelerator_stop_high_speed");
    }
    
    const skill = pickSkill(ctx, SKILLS);
    if (!skill) return;

    entity.setProperty("property:power_variant", skill.id);
    cooltimeMap.set(entity.id, now + skill.cooltime);

    world.sendMessage(`${skill.id}`)
    AcceleratorAttack(entity, skill.id);
});

/**
 * 
 * @param {Entity} entity 
 * @param {*} num 
 */
function AcceleratorAttack(entity, num) {
    switch (num) {
        case 0: { // fly start
            const until = (Date.now() + 20000) / 1000;
            entity.setProperty("property:is_flying", true);
            entity.setProperty("property:fly_until", until);
            entity.triggerEvent("accelerator_start_fly");
            break;
        }
        case 1: {
            //浮遊停止
            entity.triggerEvent('accelerator_stop_fly');
            break;
        };
        case 2: {
            //移動速度増加
            const until = (Date.now() + 5000) / 1000;
            entity.setProperty("property:speed_until", until);
            entity.setProperty("property:is_high_speed", true);
            entity.triggerEvent('accelerator_start_high_speed');
            break;
        };
        case 4: {
            //移動速度増加停止
            entity.triggerEvent('accelerator_stop_high_speed');
            break;
        };
        case 5: {
            //地面持ち上げ攻撃
            //entity.triggerEvent('accelerator_ground_upper_attack');
            break;
        };
        case 6: {
            //プラズマ
            //entity.triggerEvent('accelerator_plasma_attack');
            break;
        };
    };
};

function updateState(entity) {
    const now = Date.now();

    if (entity.getProperty("property:is_flying")) {
        const until = (entity.getProperty("property:fly_until") ?? 0) * 1000;
        if (now >= until) {
            //entity.triggerEvent("accelerator_stop_fly");
        }
    }

    if (entity.getProperty("property:is_high_speed")) {
        const until = (entity.getProperty("property:speed_until") ?? 0) * 1000;
        if (now >= until) {
            //entity.triggerEvent("accelerator_stop_high_speed");
        }
    }
}