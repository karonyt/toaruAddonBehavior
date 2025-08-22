import { CommandPermissionLevel, Player, PlayerPermissionLevel, system, world } from "@minecraft/server";
import { ModalFormData } from "@minecraft/server-ui";

world.afterEvents.itemUse.subscribe((ev) => {
    const { source: player, itemStack } = ev;

    if (itemStack.typeId != 'mc:setting') return;

    if (player.playerPermissionLevel != PlayerPermissionLevel.Operator) return;

    settingForm(player);
});

system.beforeEvents.startup.subscribe((ev) => {
    ev.customCommandRegistry.registerCommand({
        name: 'toaru:setting',
        description: '設定画面を開きます',
        permissionLevel: CommandPermissionLevel.Admin,
    }, (origin, ...args) => {
        system.run(() => {
            if (!origin?.sourceEntity) return;

            const player = origin.sourceEntity;

            settingForm(player);
        });
    });
});

/**
 * 
 * @param {Player} player 
 */
function settingForm(player) {
    const form = new ModalFormData();

    form.title("設定 / Setting");
    form.toggle({ translate: "form.setting.toggle.label.isbreak" }, { defaultValue: world.getDynamicProperty("isBlockBreakBySkill") });
    form.show(player).then((rs) => {
        if (rs.canceled) {
            return;
        };

        world.setDynamicProperty("isBlockBreakBySkill", rs.formValues[0]);
        player.sendMessage({ translate: "updated" });
    });
}