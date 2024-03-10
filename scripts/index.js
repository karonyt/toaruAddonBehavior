import { world } from "@minecraft/server"
import { Railgun } from "./data/science/power/railgun"
import "./data/science/science"

world.afterEvents.itemUse.subscribe((ev)=>{
     Railgun(ev.source)
})