class Storage {
    constructor() {
        this.reset();
    }

    reset() {
//0
        this.maze_times = [];
        this.maze_level = [];
        this.maze_tab = [];

//1
        this.block_times = [];
        this.block_tab = [];

//2
        this.bubble_times = [];
        this.bubble_level = [];
        this.bubble_right = [];
        this.bubble_wrong = [];

//3
        this.word_times = [];
        this.words_right = [];
        this.words_wrong = [];

//4
        this.grid_times = [];
        this.grid_slides = [];

        this.gameDataArray = [
            [this.maze_times, this.maze_level, this.maze_tab],
            [this.block_times, this.block_tab],
            [this.bubble_times, this.bubble_level, this.bubble_right, this.bubble_wrong],
            [this.word_times, this.words_right, this.words_wrong],
            [this.grid_times, this.grid_slides]
        ];
    }

    read(storageName, storageNumber, gameNumber) {
        this.gameDataArray[gameNumber][storageNumber] = JSON.parse(localStorage.getItem(storageName));
        return this.gameDataArray[gameNumber][storageNumber];
    }

    write(storageName, storageNumber, gameNumber, inputData) {
        localStorage.setItem(storageName, inputData);

        var newInput = localStorage.getItem(storageName);
        this.gameDataArray[gameNumber][storageNumber].push(newInput);

        localStorage.setItem(storageName, JSON.stringify(this.gameDataArray[gameNumber][storageNumber]));
    }

    get() {
        return this.gameDataArray;
    }
}

const appStorage = new Storage();

// todo drop these from the code and replace them with appStorage instance:

export function compileGameData(p, storageName, storageNumber, inputData, dataReady, gameNumber) {
    if (dataReady === true) {
        return appStorage.read(storageName, storageNumber, gameNumber);
    }
    appStorage.write(storageName, storageNumber, gameNumber, inputData);
}

export function getGameStorage() {
    return appStorage.get();
}

export function setupGameStorage() {
    return appStorage.reset();
}

export function setDataOnGraph(p, storageName, storageNumber, gameNumber) {
    return compileGameData(p, storageName, storageNumber, "NaN", true, gameNumber);
}
