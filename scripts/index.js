import { world } from "@minecraft/server"
import { Lightning_circle, Lightning_straight, Railgun } from "./data/science/power/railgun"
import "./data/science/science"
import { Knockback_straight } from "./data/science/power/aerohand"

world.afterEvents.itemUse.subscribe((ev)=>{
     if(!ev.itemStack.nameTag) return
     switch(ev.itemStack.nameTag) {
          case `超電磁砲`: {
               Railgun(ev.source,40);
               break;
          }
          case `円盤雷撃`: {
               Lightning_circle(ev.source);
               break;
          }
          case `直線雷撃`: {
               Lightning_straight(ev.source);
               break;
          }
          case `正面風力`: {
               Knockback_straight(ev.source);
               break;
          }
     }
     
})