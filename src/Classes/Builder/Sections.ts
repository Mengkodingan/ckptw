import { ISectionsOptions, ISectionsRows } from "../../Common/Types";

export class SectionsBuilder {
    displayText: string | null
    sections: { title: string; rows: ISectionsRows[] }[]

    constructor(opts?: ISectionsOptions) {
        this.displayText = opts?.displayText || null;
        this.sections = opts?.sections || [];
    }

    setDisplayText(text: string) {
        this.displayText = text;
        return this
    }

    addSection(content: { title: string; rows: ISectionsRows[] }) {
        this.sections.push(content);
        return this;
    }

    build() {
        return {
            name: 'single_select',
            buttonParamsJson: JSON.stringify({ title: this.displayText, sections: this.sections })
        }
    }
}