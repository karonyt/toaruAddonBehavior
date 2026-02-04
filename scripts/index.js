import { Player, system, world } from "@minecraft/server";
import { Lightning_circle, Lightning_straight, Railgun } from "./data/science/power/railgun";
import "./data/science/science";
import { AerohandParameterForm, Knockback_straight } from "./data/science/power/aerohand";
import { Meltdowner, MeltdownerStandby } from "./data/science/power/meltdowner";
import { ModalFormData } from "@minecraft/server-ui";
import "./entities/index";
import "./system/system";

world.afterEvents.itemUse.subscribe((ev) => {
     const { source: player, itemStack } = ev;
     if (!itemStack) return
     switch (itemStack.typeId) {
          case `mc:railgun_power_item`: {
               Railgun(player, 40);
               break;
          };
          case `円盤雷撃`: {
               Lightning_circle(ev.source);
               break;
          };
          case `直線雷撃`: {
               Lightning_straight(ev.source);
               break;
          };
          case `mc:aerohand_power_item`: {
               player.isSneaking ? AerohandParameterForm(player) : Knockback_straight(ev.source);
               break;
          };
          case `mc:meltdowner_power_item`: {
               Meltdowner(ev.source, 20);
               break;
          };
          case `minecraft:stick`: {
               testForm(ev.source);
               break;
          };
     };
});

system.runInterval(() => {
     world.getAllPlayers().forEach(player => {
          const selectedItem = player.getComponent(`inventory`).container.getItem(player.selectedSlotIndex);
          if (!selectedItem) return;
          switch (selectedItem.typeId) {
               case `mc:meltdowner_power_item`: {
                    MeltdownerStandby(player);
                    break;
               };
          };
     });
});

/**
 * 
 * @param {Player} player 
 */
function testForm(player) {
     const form = new ModalFormData();
     form.title(`§t§e§s§t`)
     form.textField(`testLabel`, `PleaseInputValue`, { defaultValue: `DefaultValue` });
     form.show(player);
};