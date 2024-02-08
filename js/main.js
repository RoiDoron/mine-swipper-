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
var gMineCount 

function onInit() {

    gMineCount = gLevel.mines
    const elModal = document.querySelector('div.modal')
    elModal.classList.add('hide')

    document.querySelector('span.time').innerText = '00'

    document.querySelector('span.mines').innerText = gMineCount

    gLife = 3
    gFirstClick = 0
    gGame.isOn = true
    gBoard = buildBoard()
    renderBoard(gBoard)
    console.log('gLevel:', gLevel)


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

            strHTML += `<td data-i="${i}" data-j="${j}" onclick="onCellClicked(this,${i},${j})" oncontextmenu="onCellMarked(this,${i},${j})" class="${className}"></td>`
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
    }
    return neighbors

}

function onCellClicked(cell, i, j) {
    if (gBoard[i][j].cellFlag) return

    gBoard[i][j].push = true

    cell.classList.add('pushed')

    if (gFirstClick === 0) {

        randomMines(gBoard, gLevel.mines, gLevel.size, i, j)
        boardNegsAdd()
        startTimer()
        gFirstClick++
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

    expandShown(gBoard, i, j)

    var value = gBoard[i][j].cellStatus
    var push = pushCells()

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

    var mineOptions = minesOptions()
    console.log('mineOptions:', mineOptions)
    for (var k = 0; k < minesNum; k++) {

        const num = drawNum(mineOptions)
        
        
        if (num.i === celli && num.j === cellj) {
            board[num.i][num.j].cellStatus = EMPTY
            k--
        } else board[num.i][num.j].cellStatus = MINE

    }

}

function checkIfGameOver(cell, i, j) {
    if (gLife) return
    const elModal = document.querySelector('div.modal')
    if (gBoard[i][j].cellStatus === MINE) {
        gGame.isOn = false

        clearInterval(gTimerInterval)

        elModal.querySelector('.user-msg').innerText = 'GAME-OVER'
        elModal.classList.remove('hide')

        cell.classList.add('lose')
    } else return
}

function checkIfVictory(push) {
    const elModal = document.querySelector('div.modal')

    if (gFlagCount === gLevel.mines && push === 2 ** (gLevel.size) - gLevel.mines) {
        gGame.isOn = false

        clearInterval(gTimerInterval)

        elModal.querySelector('.user-msg').innerText = 'YOU-WON'
        elModal.classList.remove('hide')

    }

}

function onCellMarked(cell, i, j) {
    if (gBoard[i][j].cellFlag === true) {
        gFlagCount--
        gMineCount--
        gBoard[i][j].cellFlag = false
        cell.innerHTML = ''
        document.querySelector('span.mines').innerText = gMineCount
    } else {
        gFlagCount++
        gBoard[i][j].cellFlag = true
        cell.innerHTML = FLAG_IMG
        gMineCount--
        document.querySelector('span.mines').innerText = gMineCount

    }
}

function pushCells() {
    var pushNum = 0
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (gBoard[i][j].push) pushNum++
        }
    } return pushNum
}

function expandShown(board, cellI, cellJ) {
    if (board[cellI][cellJ].cellStatus === EMPTY) {
        for (var i = cellI - 1; i <= cellI + 1; i++) {
            if (i < 0 || i >= board.length) continue
            for (var j = cellJ - 1; j <= cellJ + 1; j++) {
                if (i === cellI && j === cellJ) continue
                if (j < 0 || j >= board[i].length) continue
                var currValue = board[i][j].cellStatus
                board[i][j].push = true
                const elCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`)

                elCell.classList.add('pushed')
                elCell.innerText = currValue
            }
        }
    }
}

function boardNegsAdd() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (gBoard[i][j].cellStatus !== MINE) {
                const num = setMinesNegsCount(i, j, gBoard)
                if (num !== 0) gBoard[i][j].cellStatus = num
                else gBoard[i][j].cellStatus = EMPTY
            }
        }
    }
}

window.oncontextmenu = (e) => {
    e.preventDefault()

}


function minesOptions() {
    var mineOptions = []
    for (var i = 0; i < gLevel.size; i++) {
        
        for (var j = 0; j < gLevel.size; j++) {
            mineOptions.push( {
                i,
                j
            })
        }
    } return mineOptions
}

function onLevel(btn) {
    const data = +btn.dataset.num
    gLevel.size = data
    if (data === 4) gLevel.mines = 2
    if (data === 8) gLevel.mines = 14
    if (data === 12) gLevel.mines = 32
    console.log('gLevel:', gLevel)
    onInit()

}