const WSS = require('ws').Server,
  wss = new WSS({ port: 8080 })

let board = null
let clients = []
let connectionCounter = 0
let nextPlayer = 0

let sampleRow = []
for (let i = 0; i < 15; i++) {
  sampleRow.push(null)
}

let board = []
for (let i = 0; i < 15; i++) {
  board.push(sampleRow)
}

wss.on('connection', (ws) => {
  if (connectionCounter == 0)
    board = ws
  else 
    clients.push(ws)

  ws.send({
    result: 'success'
  })
})

wss.broadcast((data) => {
  wss.clients.forEach((client) => {
    client.send(data)
  })
})

function checkMove(move, ws) {
  if (move.player !== nextPlayer) {
    ws.send({
      result: 'Wrong turn'
    })

    return false
  } else {
    if (move.x < 0 || move.x > 15 || move.y < 0 || move.y > 15) {
      ws.send({
        result: 'Invalid move'
      })

      return false
    } 
 
    if (board[move.y][move.x] === null) {
      board[move.y][move.x] = move.slide

      ws.send({
        result: 'Your move is finished'
      })
    } else {
      ws.send({
        result: 'The node what you want to place is writen in past'
      })

      return false
    }

    if (isWin(move.player, move.y, move.x)) {
      wss.boardcast({
        result: 'We have winner',
        winner: move.player
      })
    }

    return true
  }  
}
