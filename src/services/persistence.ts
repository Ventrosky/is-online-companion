import { Entry, KeyMap, KeyMapSource } from "../contracts/persistence";

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export function newEntry<T>(data: T): Entry<T> {
    const now = new Date();
    return {
        createdAt: now,
        data,
        lastModified: now,
        key: uuidv4()
    };
}

function reviveDate(name: string, value: unknown) {
    if (typeof value === "string" && /^\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d.\d\d\dZ$/.test(value)) {
        return new Date(value);
    }
    return value;
}

export class LocalStorageDataSet<T> implements KeyMapSource<T> {
    constructor(private key: string) {}

    loadAll(): KeyMap<T> {
        const rawData = localStorage.getItem(this.key);
        const values: KeyMap<T> =  rawData ? JSON.parse(rawData, reviveDate) : {};
        return values;
    }

    saveNew(data: T) {
        const entry: Entry<T> = newEntry(data);
        this.innerSave(entry);
        return entry;
    }

    save(entry: Entry<T>): Entry<T> {
        return this.innerSave({...entry, lastModified: new Date()});
    }

    innerSave(entry: Entry<T>): Entry<T> {
        const allEntries = this.loadAll();
        allEntries[entry.key] = entry;
        localStorage.setItem(this.key, JSON.stringify(allEntries));
        return entry;
    }
}
