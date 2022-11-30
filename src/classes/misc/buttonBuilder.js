module.exports = class ButtonBuilder {
    constructor(d = {}) {
        this.buttonId = d.buttonId || null;
        this.buttonText = { displayText: d.displayText || null };
        this.type = d.type || 1;
    }

    setId(id) {
        if(!id) throw new Error('[ckptw] button builder need id')
        this.buttonId = id;
        return this
    }

    setDisplayText(text) {
        if(!text) throw new Error("[ckptw] button builder need display text");
        this.buttonText.displayText = text;
        return this
    }

    setType(n = 1) {
        this.type = 1;
        return this
    }
}