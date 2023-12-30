import { ISectionsOptions, ISectionsRows } from "../../Common/Types";

/**
 * @deprecated Will not work on most devices.
 */
export class SectionsBuilder {
    title: string|null;
    rows: ISectionsRows[];

    constructor(opts?: ISectionsOptions) {
        this.title = opts?.title || null;
        this.rows = opts?.rows || [];
    }

    setTitle(title: string) {
        if(!title) throw new Error('[ckptw] section builder need title')
        this.title = title;
        return this
    }

    setRows(...row: ISectionsRows[]) {
        if(!row) throw new Error("[ckptw] button builder need rows");
        this.rows = row;
        return this
    }
}