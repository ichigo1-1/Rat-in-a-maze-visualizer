var rows = document.getElementById('rows');
var cols = document.getElementById('cols');
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext("2d");
var rowS = 0, colS = 0;

canvas.addEventListener('mousedown', handleClick);

var placed = 0;

var arrayRef, solRef;
var startX = 0, startY = 0, endX = 0, endY = 0;

function solve() {
    if (findPath(startX, startY)) {
        colorPath();
    } else {
        alert('No Path Found');
    }
}

function findPath(x, y) {
    //if end is reached then return true
    if (x == endX && y == endY) {
        solRef[x][y] = 1;
        return true;
    }
    if (safeToGo(x, y)) {
        solRef[x][y] = 1;

        // Move in all four possible directions
        var directions = [
            [1, 0], // down
            [0, 1], // right
            [-1, 0], // up
            [0, -1] // left
        ];

        for (var i = 0; i < directions.length; i++) {
            var newX = x + directions[i][0];
            var newY = y + directions[i][1];
            if (findPath(newX, newY)) {
                return true;
            }
        }

        solRef[x][y] = 0; // Backtrack
        return false;
    }
    return false;
}

function safeToGo(x, y) {
    return (x >= 0 && y >= 0 && x < rows.value && y < cols.value && arrayRef[x][y] != 1 && solRef[x][y] == 0);
}

function colorPath() {
    for (var i = 0; i < solRef.length; i++) {
        for (var j = 0; j < solRef[i].length; j++) {
            if (solRef[i][j] == 1) {
                ctx.fillStyle = "blue";
                ctx.fillRect(j * colS, i * rowS, colS, rowS);
            }
        }
    }
}

function handleClick(e) {
    var x = Math.floor(e.offsetX / colS) * colS;
    var y = Math.floor(e.offsetY / rowS) * rowS;

    if (e.button == 0) {
        // Left button for obstacles
        ctx.fillStyle = "black";
        ctx.fillRect(x, y, colS, rowS);
        arrayRef[Math.floor(y / rowS)][Math.floor(x / colS)] = 1;
    } else if (e.button == 1) {
        // Middle button for start and end points
        if (placed == 0) {
            ctx.fillStyle = "red";
            ctx.fillRect(x, y, colS, rowS);
            placed = 1;
            startX = Math.floor(y / rowS);
            startY = Math.floor(x / colS);
            arrayRef[startX][startY] = 2;
        } else if (placed == 1) {
            ctx.fillStyle = "green";
            ctx.fillRect(x, y, colS, rowS);
            placed = 2;
            endX = Math.floor(y / rowS);
            endY = Math.floor(x / colS);
            arrayRef[endX][endY] = 3;
        }
    }
}

function genGrid() {
    ctx.clearRect(0, 0, 500, 500);
    ctx.beginPath();
    ctx.fillStyle = "#000";
    placed = 0;

    rowS = 500 / rows.value;
    colS = 500 / cols.value;

    arrayRef = new Array(parseInt(rows.value, 10));
    solRef = new Array(parseInt(rows.value, 10));
    for (var i = 0; i < rows.value; i++) {
        arrayRef[i] = new Array(parseInt(cols.value, 10));
        solRef[i] = new Array(parseInt(cols.value, 10));
        for (var j = 0; j < cols.value; j++) {
            arrayRef[i][j] = 0;
            solRef[i][j] = 0;
        }
    }

    for (var i = 0; i < 500; i += rowS) {
        ctx.moveTo(0, i);
        ctx.lineTo(500, i);
    }

    for (var i = 0; i < 500; i += colS) {
        ctx.moveTo(i, 0);
        ctx.lineTo(i, 500);
    }

    ctx.stroke();
}
