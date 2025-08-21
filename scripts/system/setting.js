import { world } from "@minecraft/server";
import { ModalFormData } from "@minecraft/server-ui";

world.afterEvents.itemUse.subscribe((ev) => {
    const { source: player, itemStack } = ev;

    if(itemStack.typeId != 'mc:setting') return;

    const form = new ModalFormData();

    form.title("設定 / Setting");
    form.toggle({ translate: "form.setting.toggle.label.isbreak" }, { defaultValue: world.getDynamicProperty("isBlockBreakBySkill") });
    form.show(player).then((rs) => {
        if (rs.canceled) {
            return;
        };

        world.setDynamicProperty("isBlockBreakBySkill", rs.formValues[0]);
        player.sendMessage({translate: "updated"});
    });
});