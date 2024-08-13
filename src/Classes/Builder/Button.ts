import { ButtonType } from "../../Common/Types";

export class ButtonBuilder {
    id: string | null;
    displayText: string | null
    type: ButtonType;
    merhcant_url: string | null;
    url: string | null;
    copy_code: string | null;

    constructor(opts?: {
        id: null,
        displayText: null,
        type: 'quick_reply',
        merhcant_url: null,
        url: null,
        copy_code: null;
    }) {
        this.id = opts?.id || null;
        this.displayText = opts?.displayText || null;
        this.type = opts?.type || 'quick_reply';
        this.merhcant_url = opts?.merhcant_url || null; 
        this.url = opts?.url || null; 
        this.copy_code = opts?.copy_code || null;
    }

    setId(id: string) {
        this.id = id;
        return this
    }

    setDisplayText(text: string) {
        this.displayText = text;
        return this
    }

    setType(type: ButtonType = 'quick_reply') {
        this.type = type;
        return this
    }

    setMerchantURL(url: string) {
        this.merhcant_url = url;
        return this
    }

    setURL(url: string) {
        this.url = url;
        return this
    }

    setCopyCode(content: string) {
        this.copy_code = content;
        return this
    }

    build() {
        return {
            name: this.type,
            buttonParamsJson: JSON.stringify({ display_text: this.displayText, id: this.id, copy_code: this.copy_code, merhcant_url: this.merhcant_url, url: this.url })
        }
    }
}
