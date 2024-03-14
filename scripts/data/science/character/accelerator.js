import { world } from "@minecraft/server";

world.afterEvents.entitySpawn.subscribe((ev)=>{
    const { entity } = ev;
    if(entity.typeId === `karo:accelerator`) entity.addTag(`ippou_tuukou`)
});