import { world } from "@minecraft/server"
import { Lightning_circle, Lightning_straight, Railgun } from "./data/science/power/railgun"
import "./data/science/science"

world.afterEvents.itemUse.subscribe((ev)=>{
     if(!ev.itemStack.nameTag) return
     switch(ev.itemStack.nameTag) {
          case `超電磁砲`: {
               Railgun(ev.source);
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
     }
     
})