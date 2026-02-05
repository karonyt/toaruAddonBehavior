import {
    BlockPermutation,
    EntityDamageCause,
    system,
    world
} from "@minecraft/server";
import { Vec3 } from "../../../lib/utils/vec3";
import { isBlockBreak } from "../../../lib/utils/util";

/* ===============================
   発射位置（10スロット）
================================ */
const meltdownerPosition = [
    0, 2, 0.5,
    0.3, 2, 0.5,
    -0.5, 2.5, 0,
    -0.3, 1, -0.5,
    -0.5, 1, 0.5,
    1, 1.5, -0.5,
    -0.7, 2.2, -0.3,
    0, 0.3, -1.4,
    0.2, 0.8, -1.2,
    -1, 3.4, 0,
];

/* ===============================
   スロット管理
================================ */
const meltDownerSlots = new Map(); // entityId -> boolean[10]

function getSlots(entityId) {
    let slots = meltDownerSlots.get(entityId);
    if (!slots) {
        slots = Array(10).fill(false);
        meltDownerSlots.set(entityId, slots);
    }
    return slots;
}

function acquireSlot(entityId) {
    const slots = getSlots(entityId);
    const index = slots.indexOf(false);
    if (index === -1) return null;
    slots[index] = true;
    return index;
}

function releaseSlot(entityId, index) {
    const slots = meltDownerSlots.get(entityId);
    if (!slots) return;
    slots[index] = false;
}

/* ===============================
   スタンバイ演出
================================ */
export function MeltdownerStandby(entity) {
    const base = new Vec3(
        entity.location.x,
        entity.location.y,
        entity.location.z
    );
    const dir = entity.getViewDirection();

    for (let i = 0; i < 10; i++) {
        entity.dimension.spawnParticle(
            "karo:meltdowner_standby",
            base.offsetDirct(
                meltdownerPosition[i * 3],
                meltdownerPosition[i * 3 + 1],
                meltdownerPosition[i * 3 + 2],
                dir
            )
        );
    }
}

/* ===============================
   発射本体
================================ */
export function Meltdowner(entity, chargeTime) {
    const slot = acquireSlot(entity.id);
    if (slot === null) return;

    const base = new Vec3(
        entity.location.x,
        entity.location.y,
        entity.location.z
    );
    const dir = entity.getViewDirection();

    /* --- チャージ --- */
    for (let t = 0; t < chargeTime; t++) {
        system.runTimeout(() => {
            const pos = base.offsetDirct(
                meltdownerPosition[slot * 3],
                meltdownerPosition[slot * 3 + 1],
                meltdownerPosition[slot * 3 + 2],
                dir
            );
            entity.dimension.spawnParticle(
                "karo:meltdowner_charge",
                pos
            );
        }, t);
    }

    /* --- 発射 --- */
    system.runTimeout(() => {
        const shootPos = base.offsetDirct(
            meltdownerPosition[slot * 3],
            meltdownerPosition[slot * 3 + 1],
            meltdownerPosition[slot * 3 + 2],
            dir
        );

        const bullet = entity.dimension.spawnEntity(
            "karo:meltdowner_bullet",
            shootPos
        );

        const proj = bullet.getComponent("projectile");
        proj.owner = entity;
        proj.shoot(dir);

        bullet.addTag(`meltdowner_slot_${slot}`);
        bullet.addTag(`meltdowner_owner_${entity.id}`);
    }, chargeTime);
}

/* ===============================
   弾道処理（ビーム風）
================================ */
const lastPos = new Map();
const STEP = 0.25;

world.afterEvents.entitySpawn.subscribe(ev => {
    if (ev.entity.typeId === "karo:meltdowner_bullet") {
        lastPos.set(ev.entity.id, ev.entity.location);
    }
});

world.beforeEvents.entityRemove.subscribe(ev => {
    const e = ev.removedEntity;
    if (!e || e.typeId !== "karo:meltdowner_bullet") return;

    lastPos.delete(e.id);

    const slotTag = e.getTags().find(t => t.startsWith("meltdowner_slot_"));
    const ownerTag = e.getTags().find(t => t.startsWith("meltdowner_owner_"));
    if (!slotTag || !ownerTag) return;

    const slot = Number(slotTag.replace("meltdowner_slot_", ""));
    const ownerId = ownerTag.replace("meltdowner_owner_", "");

    releaseSlot(ownerId, slot);
});

/* ===============================
   ブロック破壊・パーティクル
================================ */
const blockList = [
    "minecraft:obsidian",
    "minecraft:bedrock",
    "minecraft:crying_obsidian"
];

system.runInterval(() => {
    for (const dimId of ["overworld", "nether", "the_end"]) {
        const dim = world.getDimension(dimId);

        for (const e of dim.getEntities({ type: "karo:meltdowner_bullet" })) {
            const prev = lastPos.get(e.id);
            const cur = e.location;
            if (!prev) {
                lastPos.set(e.id, cur);
                continue;
            }

            const dx = cur.x - prev.x;
            const dy = cur.y - prev.y;
            const dz = cur.z - prev.z;
            const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
            const steps = Math.max(1, Math.floor(dist / STEP));

            let removed = false;

            for (let i = 0; i <= steps; i++) {
                const t = i / steps;
                const pos = {
                    x: prev.x + dx * t,
                    y: prev.y + dy * t,
                    z: prev.z + dz * t
                };

                try {
                    dim.spawnParticle("karo:meltdowner_orbit", pos);
                } catch {}

                try {
                    const block = dim.getBlock(pos);
                    if (!block) continue;

                    // === ここが追加点 ===
                    if (blockList.includes(block.typeId)) {
                        e.remove();
                        lastPos.delete(e.id);
                        removed = true;
                        break;
                    }

                    if (
                        block.isAir ||
                        block.isLiquid ||
                        !isBlockBreak()
                    ) continue;

                    block.setPermutation(
                        BlockPermutation.resolve("air")
                    );
                } catch {}
            }

            if (!removed) {
                lastPos.set(e.id, { ...cur });
            }
        }
    }
}, 1);
