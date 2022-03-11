class LocalStorageMock {
    constructor() {
        this.store = {};
    }

    clear() {
        this.store = {};
    }

    getItem(key) {
        return this.store[key] || null;
    }

    setItem(key, value) {
        this.store[key] = String(value);
    }

    removeItem(key) {
        delete this.store[key];
    }
}

global.localStorage = new LocalStorageMock;

import * as storage from "./storage";

afterEach(() => {
    global.localStorage.clear();
    storage.setupGameStorage();
});

test('can write single game data', () => {
    storage.compileGameData(null, "STORAGENAME", 0, 31415, false, 0);

    const expected = {
        "STORAGENAME": '["31415"]'
    };

    expect(global.localStorage.store).toEqual(expected);
});

test('can write multiple game data', () => {
    storage.compileGameData(null, "STORAGENAME1", 0, 31415, false, 0);
    storage.compileGameData(null, "STORAGENAME2", 1, 92653, false, 1);

    const expected = {
        "STORAGENAME1": '["31415"]',
        "STORAGENAME2": '["92653"]'
    };

    expect(global.localStorage.store).toEqual(expected);
});

test('can write game data multiple times', () => {
    storage.compileGameData(null, "STORAGENAME1", 0, 31415, false, 0);
    storage.compileGameData(null, "STORAGENAME1", 0, 92653, false, 0);

    const expected = {
        "STORAGENAME1": '["31415","92653"]'
    };

    expect(global.localStorage.store).toEqual(expected);
});


test('can read game data', () => {
    storage.compileGameData(null, "STORAGENAME1", 0, 31415, false, 0);
    storage.compileGameData(null, "STORAGENAME1", 0, 92653, false, 0);

    const actual = storage.compileGameData(null, "STORAGENAME1", 0, 92653, true, 0);
    const expected = ["31415", "92653"];

    expect(actual).toEqual(expected);
});

test('can reset game data', () => {
    storage.compileGameData(null, "STORAGENAME1", 0, 31415, false, 0);
    storage.compileGameData(null, "STORAGENAME1", 0, 92653, false, 0);

    storage.setupGameStorage();

    expect(storage.getGameStorage()).toEqual([
        [[], [], []],
        [[], []],
        [[], [], [], []],
        [[], [], []],
        [[], []]
    ]);
});

test('can reload game data after reset ', () => {
    storage.compileGameData(null, "STORAGENAME1", 0, 31415, false, 0);
    storage.compileGameData(null, "STORAGENAME1", 0, 92653, false, 0);

    // this is the equivalent of reloading the app... we want to make sure what we wrote is persisted

    storage.setupGameStorage();

    const actual = storage.compileGameData(null, "STORAGENAME1", 0, 92653, true, 0);
    const expected = ["31415", "92653"];

    expect(actual).toEqual(expected);
});

test('can get data ready for graphs', () => {
    storage.compileGameData(null, "STORAGENAME1", 0, 31415, false, 0);
    storage.compileGameData(null, "STORAGENAME1", 0, 92653, false, 0);

    const actual = storage.setDataOnGraph(null, "STORAGENAME1", 0, 0);
    const expected = ["31415", "92653"];

    expect(actual).toEqual(expected);
})
