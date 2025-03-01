import { world, Player, system } from "@minecraft/server"

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
        this.maxLevel = Number(world.getDynamicProperty('maxLevel') || '10000')
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
    getStaminaMaxValue() {
        return Number(this.player.getDynamicProperty('staminaMaxValue') || '0');
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
    setStaminaMaxValue(value) {
        this.staminaValue = Math.floor(value);
        this.player.setDynamicProperty('staminaMaxValue', `${Math.floor(value)}`);
        return;
    }
    /**
     * 
     * @param {Number} value 
     * @returns 
     */
    setOperationalPowerValue(value) {
        this.operationalPowerValue = Math.floor(value);
        system.runTimeout(() => {
            this.player.setDynamicProperty('operationalPowerValue', `${Math.floor(value)}`);
        });
        return;
    }
    getOPXp() {
        return Math.floor(Number(this.player.getDynamicProperty(`operationalPowerXP`) ?? "0") * 100) / 100 || 0;
    }

    setOPXp(xp) {
        system.runTimeout(() => {
            this.player.setDynamicProperty(`operationalPowerXP`, `${xp}`);
        });
    }

    getXpRequired(level) {
        return (4 * level ^ 2) + (10 * level); // 計算結果を返す
    }

    addXp(amount) {
        let xp = this.getOPXp() + amount;
        let level = this.getOperationalPowerValue();

        while (level < this.maxLevel && xp >= this.getXpRequired(level)) {
            xp -= this.getXpRequired(level);
            level++;
            //this.player.onScreenDisplay.setTitle({ rawtext: [{ text: "§2" }, { translate: this.key }] });
            //this.player.onScreenDisplay.updateSubtitle(`§e${level - 1}Lv --> ${level}Lv`);
            this.player.playSound(`random.levelup`);
        }
        this.setOPXp(xp);
        this.setOperationalPowerValue(level);
    }

    removeXp(amount) {
        let xp = this.getXp() - amount;
        if (xp < 0) xp = 0;
        this.setOPXp(xp);
    }

    reset() {
        this.setOperationalPowerValue(1);
        this.setOPXp(0);
    }

    get() {
        return {
            level: this.getOperationalPowerValue(),
            xp: this.getOPXp(),
            xpRequired: this.getXpRequired(this.getOperationalPowerValue())
        };
    }
}