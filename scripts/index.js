import { world } from "@minecraft/server"
import { Lightning_straight } from "./data/science/power/railgun"
import "./data/science/science"

world.afterEvents.itemUse.subscribe((ev)=>{
     Lightning_straight(ev.source)
})