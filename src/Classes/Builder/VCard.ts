export class VCardBuilder {
    fullName: string|null;
    org: string|null;
    number: string|null;

    constructor(opts?: {
        fullName: null,
        org: null,
        number: null,
    }) {
        this.fullName = opts?.fullName || null;
        this.org = opts?.org || null;
        this.number = opts?.number || null;
    }

    setFullName(fullName: string) {
        if(!fullName) throw new Error('[ckptw] vcard builder need full name')
        this.fullName = fullName;
        return this
    }

    setOrg(organizationName: string) {
        if(!organizationName) throw new Error("[ckptw] vcard builder need organization name");
        this.org = organizationName;
        return this
    }

    setNumber(number: string) {
        if(!number) throw new Error('[ckptw] vcard builder need number')
        this.number = number;
        return this
    }

    build() {
        return 'BEGIN:VCARD\n'
        + 'VERSION:3.0\n' 
        + `FN:${this.fullName}\n` 
        + `ORG:${this.org};\n`
        + `TEL;type=CELL;type=VOICE;waid=${(this.number as unknown as string)?.replace(/\s/g, '')}:+${this.number}\n`
        + 'END:VCARD'
    }
}