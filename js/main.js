'use strict'

const EMPTY = ' '
const MINE = 'MINE'
const FLAG = 'FLAG'
const FLAG_IMG = '<img src="image/image1.png"></img>'
const MINE_IMG = '<img src="image/images.png"></img>'



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

var gLife = 3
var gFlagCount = 0
var gBoard
var gFirstClick = 0
var gMineCount = gLevel.mines

function onInit() {
    const elModal = document.querySelector('div.modal')
    elModal.classList.add('hide')
    
    gLife = 3
    gFirstClick = 0
    gGame.isOn = true
    gBoard = buildBoard()
    renderBoard(gBoard)


}

function buildBoard() {
    const board = []
    const size = gLevel.size

    for (var i = 0; i < size; i++) {
        board.push([])

        for (var j = 0; j < size; j++) {
            board[i][j] = {
                cellStatus: EMPTY,
                cellFlag: false,
                push: false
            }
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


            const cell = board[i][j].cellStatus
            const className = `cell`

            strHTML += `<td onclick="onCellClicked(this,${i},${j})" oncontextmenu="onCellMarked(this,${i},${j})" class="${className}"></td>`
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
            if (mat[i][j].cellStatus === MINE) neighbors++
        }
    } console.log('mat:', mat)
    return neighbors

}

function onCellClicked(cell, i, j) {
    if (gBoard[i][j].cellFlag) return

    gBoard[i][j].push = true

    cell.classList.add('pushed')

    if (gFirstClick === 0) {
        randomMines(gBoard, gLevel.mines, gLevel.size, i, j)
        gFirstClick++
    }

    const num = setMinesNegsCount(i, j, gBoard)


    if (gBoard[i][j].cellStatus !== MINE) {
        if (num !== 0) gBoard[i][j].cellStatus = num
        else gBoard[i][j].cellStatus = ''
    }

    if (gLife !== 0 && gBoard[i][j].cellStatus === MINE) {
        gLife--
       
        renderCell(cell, value)
        setTimeout(renderCell, 500, cell, '')
        setTimeout(() => cell.classList.remove('pushed'), 500)
        var elLife = document.querySelector('.life')
        elLife.innerText = `${gLife}`
        gBoard[i][j].push = false
    }
    

    var value = gBoard[i][j].cellStatus
    var push = pushCells()
    console.log('push:', push)
    renderCell(cell, value)

    checkIfGameOver(cell, i, j)
    checkIfVictory(push)
}

function renderCell(cell, value) {

    if (value === MINE) {
        cell.innerHTML = MINE_IMG
    } else cell.innerText = value
}

function randomMines(board, minesNum, level, celli, cellj) {
    for (var k = 0; k < minesNum; k++) {

        const i = getRandomInt(0, level)
        const j = getRandomInt(0, level)
        console.log('i:', i)
        console.log('j:', j)
        if (i === celli && j === cellj) {
            board[i][j].cellStatus = gBoard[i][j].cellStatus
            k--
        }
        board[i][j].cellStatus = MINE
        console.log(board[i][j])
    }

}

function checkIfGameOver(cell, i, j) {
    if (gLife) return
    const elModal = document.querySelector('div.modal')
    if (gBoard[i][j].cellStatus === MINE) {
        gGame.isOn = false

        elModal.querySelector('.user-msg').innerText = 'GAME-OVER'
        elModal.classList.remove('hide')

        cell.classList.add('lose')
    } else return
}

function checkIfVictory(push) {
    const elModal = document.querySelector('div.modal')
    
    if (gFlagCount === gLevel.mines && push === 2 ** (gLevel.size) - gLevel.mines) {
        gGame.isOn = false

        elModal.querySelector('.user-msg').innerText = 'YOU-WON'
        elModal.classList.remove('hide')

    }

}

function onCellMarked(cell, i, j) {
    if (gBoard[i][j].cellFlag === true) {
        gFlagCount--
        gBoard[i][j].cellFlag = false
        cell.innerHTML = ''
    } else {
        gFlagCount++
        gBoard[i][j].cellFlag = true
        cell.innerHTML = FLAG_IMG
        gMineCount--
    }
}

window.oncontextmenu = (e) => {
    e.preventDefault()

}


function pushCells() {
    var pushNum = 0
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (gBoard[i][j].push) pushNum++
        }
    } return pushNum
}
