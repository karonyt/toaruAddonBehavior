import { world, Player } from "@minecraft/server"

export class PowerManager {
    /**
     * 
     * @param {Player} player 
     */
    constructor(player) {
        this.player = player;
        this.playerPowerType = player.getDynamicProperty('powerType') || 'none';
        this.magicalPowerValue = Number(player.getDynamicProperty('magicalPowerValue') || '0');
        this.staminaValue = Number(player.getDynamicProperty('staminaValue') || '0');
        this.operationalPowerValue = Number(player.getDynamicProperty('operationalPowerValue') || '0');
    }
    getPowerType() {
        return this.player.getDynamicProperty('powerType') || 'none';
    }
    getMagicalPowerValue() {
        return Number(this.player.getDynamicProperty('magicalPowerValue') || '0');
    }
    getStaminaValue() {
        return Number(this.player.getDynamicProperty('staminaValue') || '0');
    }
    getOperationalPowerValue() {
        return Number(this.player.getDynamicProperty('operationalPowerValue') || '0');
    }
    /**
     * 
     * @param {string} value 
     * @returns 
     */
    setPowerType(value) {
        this.player.setDynamicProperty('powerType', value);
        return;
    }
    /**
     * 
     * @param {Number} value 
     * @returns 
     */
    addMagicalPowerValue(value) {
        const result = Math.floor(this.getMagicalPowerValue() + value);
        this.magicalPowerValue = result;
        this.player.setDynamicProperty('magicalPowerValue', `${result}`);
        return;
    }
    /**
     * 
     * @param {Number} value 
     * @returns 
     */
    addStaminaValue(value) {
        const result = Math.floor(this.getStaminaValue() + value);
        this.staminaValue = result;
        this.player.setDynamicProperty('staminaValue', `${result}`);
        return;
    }
    /**
     * 
     * @param {Number} value 
     * @returns 
     */
    addOperationalPowerValue(value) {
        const result = Math.floor(this.getOperationalPowerValue() + value);
        this.operationalPowerValue = result;
        this.player.setDynamicProperty('operationalPowerValue', `${result}`);
        return;
    }
    /**
     * 
     * @param {Number} value 
     * @returns 
     */
    setMagicalPowerValue(value) {
        this.magicalPowerValue = Math.floor(value);
        this.player.setDynamicProperty('magicalPowerValue', `${Math.floor(value)}`);
        return;
    }
    /**
     * 
     * @param {Number} value 
     * @returns 
     */
    setStaminaValue(value) {
        this.staminaValue = Math.floor(value);
        this.player.setDynamicProperty('staminaValue', `${Math.floor(value)}`);
        return;
    }
    /**
     * 
     * @param {Number} value 
     * @returns 
     */
    setOperationalPowerValue(value) {
        this.operationalPowerValue = Math.floor(value);
        this.player.setDynamicProperty('operationalPowerValue', `${Math.floor(value)}`);
        return;
    }
}