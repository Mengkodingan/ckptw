module.exports = class SectionBuilder {
    constructor(d = {}) {
        this.title = d.title || null;
        this.rows = d.rows || [];
    }

    setTitle(n) {
        if(!n) throw new Error('[ckptw] section builder need title')
        this.title = n;
        return this
    }

    setRows(...d) {
        if(!d) throw new Error("[ckptw] button builder need rows");
        this.rows = d;
        return this
    }
}