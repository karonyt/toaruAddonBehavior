import { world } from "@minecraft/server";
import { PowerManager } from "../lib/utils/base";
import { getRandom } from "../lib/utils/util";

world.afterEvents.playerSpawn.subscribe((ev) => {
    const { initialSpawn , player} = ev;
    if(!initialSpawn) return;
    if(player.hasTag('toaruJoined')) return;
    const manager = new PowerManager(player);
    const underStamina = Number(world.getDynamicProperty('underRandomStaminaValue') ?? '1000');
    const overStamina = Number(world.getDynamicProperty('overRandomStaminaValue') ?? '3000');
    const stamina = getRandom(underStamina,overStamina);
    const underOperationPower = Number(world.getDynamicProperty('underRandomOperationPowerValue') ?? '100');
    const overOperationPower = Number(world.getDynamicProperty('overRandomOperationPowerValue') ?? '200');
    const operationPower = getRandom(underStamina,overStamina);
})