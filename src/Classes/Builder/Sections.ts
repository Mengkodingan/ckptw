import { SectionsOptions, SectionsRows } from "../../Common/Types";

/**
 * @deprecated no longer work with in devices.
 */
export class SectionsBuilder {
    title: string|null;
    rows: SectionsRows[];

    constructor(opts?: SectionsOptions) {
        this.title = opts?.title || null;
        this.rows = opts?.rows || [];
    }

    setTitle(title: string) {
        if(!title) throw new Error('[ckptw] section builder need title')
        this.title = title;
        return this
    }

    setRows(...row: SectionsRows[]) {
        if(!row) throw new Error("[ckptw] button builder need rows");
        this.rows = row;
        return this
    }
}