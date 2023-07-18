export class TemplateButtonsBuilder {
    array: Array<any>;
    index: number

    constructor(opts?: {
        array: Array<any>,
    }) {
        this.array = opts?.array || [];
        this.index = 0;
    }

    addURL(opts: { displayText: string, url: string }) {
        if(!opts.displayText || !opts.url) throw new Error('[ckptw] template button builder need url display text or url');
        
        let index = this.index + 1;
        this.array.push({ index, urlButton: { ...opts } });
        this.index = index;
        return this
    }

    addCall(opts: { displayText: string, phoneNumber: string }) {
        if(!opts.displayText || !opts.phoneNumber) throw new Error("[ckptw] template button builder need call display text or phone number");
        
        let index = this.index + 1;
        this.array.push({ index, callButton: { ...opts } });
        this.index = index;
        return this
    }

    addQuickReply(opts: { displayText: string, id: string }) {
        if(!opts.displayText || !opts.id) throw new Error("[ckptw] template button builder need quick reply display text or id");
        
        let index = this.index + 1;
        this.array.push({ index, quickReplyButton: { ...opts } });
        this.index = index;
        return this
    }

    build() {
        return this.array;
    }
}