import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import store, { State } from '../../app/store'
import { moveTiles } from './gameSlice'
import { createGameThunk, patchGameThunk } from '../../middleware/thunks'

export const Board = () => {
  const dispatch = useDispatch()
  const game = useSelector((state: State) => state.gameState.game)
  const invalidMove = useSelector((state: State) => state.gameState.invalidMove)
  
  const [clickedTiles, setClickedTiles] = useState<{ row: number, col: number }[]>([])

  const handleTileClick = (row: number, col: number) => {
    const newClickedTiles = [...clickedTiles]
    const tilePosition = { row, col }

    if (isTileClicked(tilePosition)) {
      const index = newClickedTiles.findIndex((pos) => pos.row === row && pos.col === col)

      newClickedTiles.splice(index, 1)

    } else {
      newClickedTiles.push(tilePosition)

      if (newClickedTiles.length === 2) {
        setTimeout(() => {
          dispatch(moveTiles({ board: game.board, first: newClickedTiles[0], second: newClickedTiles[1] }))
          newClickedTiles.splice(0, 2)
          store.dispatch(patchGameThunk())
        }, 200)
      }
    }

    setClickedTiles(newClickedTiles)
  }

  const isTileClicked = (position: { row: number, col: number }) => {
    return clickedTiles.some((pos) => pos.row === position.row && pos.col === position.col)

  }

  return (
    <div>
      <table>
        <tbody>
          {game?.completed ?
            (
              <div>
                <p className='Label' style={{ backgroundColor: 'green' }}>
                  Game over</p>
              </div>
            ) :
            game?.board?.tiles?.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((tile, colIndex) => (
                  <td
                    key={rowIndex + '' + colIndex}
                    className='Tile'
                    style={{
                      backgroundColor: isTileClicked({ row: rowIndex, col: colIndex })
                        ? 'yellow'
                        : '#d0f1f7',
                    }}
                    onClick={() => handleTileClick(rowIndex, colIndex)}
                  >
                    {tile}
                  </td>
                ))}
              </tr>
            ))}
        </tbody>
      </table>
      {
        game?.board?.tiles ? null : <button onClick={
          () => {
            store.dispatch(createGameThunk()).then(() => { store.dispatch(patchGameThunk()) })
          }}>New Game</button>
      }
      {
        !game?.completed && invalidMove ?
          (<p className='Label' style={{ backgroundColor: 'red' }}>Oops, invalid move!</p>)
          : null
      }
      {
        game?.board?.tiles ? (
          <div className='Row'>
            <p style={{ margin: 15 }}>Moves: {game.moves}</p>
            <p>Score: {game.score}</p>
          </div>
        ) : null
      }
    </div>
  )
} 
