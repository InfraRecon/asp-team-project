var gameDataArray = [];

//0
var maze_times = [];
var maze_level = [];
var maze_tab = [];

//1
var block_times = [];
var block_tab = [];

//2
var bubble_times = [];
var bubble_level = [];
var bubble_right = [];
var bubble_wrong = [];

//3
var word_times = [];
var words_right = [];
var words_wrong = [];

//4
var grid_times = []; 
var grid_slides = [];

function setupGameStorage()
{
    gameDataArray = [[maze_times,maze_level,maze_tab],                                                      [block_times,block_tab],
                     [bubble_times,bubble_level,bubble_right,bubble_wrong],
                     [word_times,words_right,words_wrong],
                     [grid_times,grid_slides]];
}

function compileGameData(p,storageName,storageNumber,inputData,dataReady,gameNumber)
{   
    if(gameDataArray.length <= 0)
    {
        setupGameStorage();
    }
    
    if (dataReady == true)
    {
            gameDataArray[gameNumber][storageNumber] = JSON.parse(localStorage.getItem(storageName));
            console.log(gameDataArray[gameNumber][storageNumber]);
            return gameDataArray[gameNumber][storageNumber];
    }
    else if (dataReady == false)
    {

        localStorage.setItem(storageName, inputData);

        var newInput = localStorage.getItem(storageName);
        gameDataArray[gameNumber][storageNumber].push(newInput);

        console.log(gameDataArray[gameNumber][storageNumber]);
        localStorage.setItem(storageName,JSON.stringify(gameDataArray[gameNumber][storageNumber]));
    }
}

function setDataOnGraph(p,storageName,storageNumber,gameNumber)
{
    var graphData = compileGameData(p,storageName,storageNumber,"NaN",true,gameNumber);
    return graphData;
}