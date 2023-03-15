export class ButtonBuilder {
    buttonId: string|null;
    buttonText: { displayText: string|null };
    type: number;

    constructor(opts?: {
        buttonId: null,
        displayText: null,
        type: 1
    }) {
        this.buttonId = opts?.buttonId || null;
        this.buttonText = { displayText: opts?.displayText || null };
        this.type = opts?.type || 1;
    }

    setId(id: string) {
        if(!id) throw new Error('[ckptw] button builder need id')
        this.buttonId = id;
        return this
    }

    setDisplayText(text: string) {
        if(!text) throw new Error("[ckptw] button builder need display text");
        this.buttonText.displayText = text;
        return this
    }

    setType(type: number = 1) {
        this.type = type;
        return this
    }
}