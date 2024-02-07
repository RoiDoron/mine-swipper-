'use strict'

const EMPTY = ' '
const MINE = '💣'

const MINE_IMG = '<img src="image/images.png"></img>'



var gBoard

const gLevel = {
    size: 4,
    mines: 2
}

const gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}


function onInit() {
    gGame.isOn = true
    gBoard = buildBoard()
    renderBoard(gBoard)
    randomMines(gBoard, gLevel.mines, gLevel.size)

}

function buildBoard() {
    const board = []
    const size = gLevel.size

    for (var i = 0; i < size; i++) {
        board.push([])

        for (var j = 0; j < size; j++) {
            board[i][j] = EMPTY
        }

    }

    // board[2][2] = MINE
    // board[2][3] = MINE
    return board
}

function renderBoard(board) {
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'

        for (var j = 0; j < board[0].length; j++) {


            const cell = board[i][j]
            const className = `cell`

            strHTML += `<td onclick="onCellClicked(this,${i},${j})" class="${className}"></td>`
        }

        strHTML += '</tr>'
    }
    const elContainer = document.querySelector('.board')
    elContainer.innerHTML = strHTML
}



function setMinesNegsCount(cellI, cellJ, mat) {
    var neighbors = 0
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue
            if (j < 0 || j >= mat[i].length) continue
            if (mat[i][j] === MINE) neighbors++
        }
    }
    return neighbors

}

function onCellClicked(cell, i, j) {
//    var innerHTML = ''
    if (gBoard[i][j] !== MINE) (
        gBoard[i][j] = setMinesNegsCount(i, j, gBoard)
    )
    // if (gBoard[i][j] === MINE) {
    //     innerHTML += `<td onclick="onCellClicked(this,${i},${j})" class="cell" ></td>`
    // }
   const value = gBoard[i][j]

    renderCell(cell, value)
}

function renderCell(cell, value) {
    if(value === MINE){
    cell.innerHTML = MINE_IMG
    }else cell.innerText = value
}

function randomMines(board, minesNum, level) {
    for (var i = 0; i < minesNum; i++) {
        const i = getRandomInt(0, level)
        const j = getRandomInt(0, level)
        board[i][j] = MINE
    }

}




// function renderBoard(board) {
//     var strHTML = ''
//     for (var i = 0; i < board.length; i++) {
//         strHTML += '<tr>'

//         for (var j = 0; j < board[0].length; j++) {

//             if (board[i][j] !== MINE) (
//                 board[i][j] = setMinesNegsCount(i,j,board)
//                 )
//                 const cell = board[i][j]
//             const className = `cell`

//             strHTML += `<td onclick="onCellClicked(this,${i},${j})" class="${className}">${cell}</td>`
//         }

//         strHTML += '</tr>'
//     }
//     const elContainer = document.querySelector('.board')
//     elContainer.innerHTML = strHTML
// }