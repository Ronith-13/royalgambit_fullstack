import React, { useState, useCallback, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { userAPI } from '../services/api'
import ChessBoard from '../components/ChessBoard'
import GameInfo from '../components/GameInfo'
import Navbar from '../components/Navbar'
import { 
  createInitialBoard, 
  isValidMove, 
  makeMove, 
  isCheck, 
  isCheckmate, 
  isStalemate, 
  getLegalMoves 
} from '../utils/chessLogic'
import { getAIMove } from '../utils/chessAI'
import './Game.css'

function Game() {
  const { mode, difficulty } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  
  const [board, setBoard] = useState(createInitialBoard())
  const [currentPlayer, setCurrentPlayer] = useState('white')
  const [selectedSquare, setSelectedSquare] = useState(null)
  const [moveHistory, setMoveHistory] = useState([])
  const [lastMove, setLastMove] = useState(null)
  const [gameStatus, setGameStatus] = useState('playing')
  const [inCheck, setInCheck] = useState({ white: false, black: false })
  const [isAITurn, setIsAITurn] = useState(false)
  const [pointsAwarded, setPointsAwarded] = useState(null)

  const isVsComputer = mode === 'vs-computer'
  const computerColor = 'black'
  const playerColor = 'white'

  // Points for each difficulty level
  const POINTS_MAP = {
    easy: 10,
    medium: 20,
    hard: 30
  }

  // Handle AI move
  useEffect(() => {
    if (isVsComputer && 
        isAITurn && 
        currentPlayer === computerColor && 
        gameStatus === 'playing') {
      const timer = setTimeout(() => {
        makeAIMove()
      }, 500) // Small delay for better UX

      return () => clearTimeout(timer)
    }
  }, [isAITurn, currentPlayer, gameStatus, isVsComputer])

  const makeAIMove = () => {
    if (gameStatus !== 'playing' || currentPlayer !== computerColor) return

    const aiMove = getAIMove(board, computerColor, difficulty || 'easy')
    
    if (aiMove) {
      const newBoard = makeMove(board, aiMove.from, aiMove.to)
      setBoard(newBoard)
      
      const move = {
        from: aiMove.from,
        to: aiMove.to,
        piece: board[aiMove.from.row][aiMove.from.col]
      }
      setMoveHistory([...moveHistory, move])
      setLastMove(move)
      
      // Check game status
      const nextPlayer = 'white'
      const checkStatus = isCheck(newBoard, nextPlayer)
      const checkmateStatus = isCheckmate(newBoard, nextPlayer)
      const stalemateStatus = isStalemate(newBoard, nextPlayer)

      setInCheck({
        white: isCheck(newBoard, 'white'),
        black: isCheck(newBoard, 'black')
      })

      if (checkmateStatus) {
        handleGameEnd('checkmate-black', 'loss')
      } else if (stalemateStatus) {
        handleGameEnd('stalemate', 'draw')
      } else {
        setCurrentPlayer(nextPlayer)
        setIsAITurn(false)
      }
    }
  }

  const handleSquareClick = useCallback((row, col) => {
    if (gameStatus !== 'playing') return
    
    // Don't allow moves during AI turn
    if (isVsComputer && isAITurn) return
    
    // In vs computer mode, only allow white (player) moves
    if (isVsComputer && currentPlayer !== playerColor) return

    const square = board[row][col]

    // If clicking on a piece of the current player
    if (square && square.color === currentPlayer) {
      setSelectedSquare({ row, col })
      return
    }

    // If a square is already selected, try to make a move
    if (selectedSquare) {
      const from = selectedSquare
      const to = { row, col }

      if (isValidMove(board, from, to, currentPlayer)) {
        const newBoard = makeMove(board, from, to)
        setBoard(newBoard)
        
        const move = {
          from,
          to,
          piece: board[from.row][from.col]
        }
        setMoveHistory([...moveHistory, move])
        setLastMove(move)
        
        // Check for check, checkmate, or stalemate
        const nextPlayer = currentPlayer === 'white' ? 'black' : 'white'
        const checkStatus = isCheck(newBoard, nextPlayer)
        const checkmateStatus = isCheckmate(newBoard, nextPlayer)
        const stalemateStatus = isStalemate(newBoard, nextPlayer)

        setInCheck({
          white: isCheck(newBoard, 'white'),
          black: isCheck(newBoard, 'black')
        })

        if (checkmateStatus) {
          if (isVsComputer && currentPlayer === playerColor) {
            handleGameEnd(`checkmate-${currentPlayer}`, 'win')
          } else {
            handleGameEnd(`checkmate-${currentPlayer}`, isVsComputer ? 'loss' : null)
          }
        } else if (stalemateStatus) {
          handleGameEnd('stalemate', 'draw')
        } else {
          setCurrentPlayer(nextPlayer)
          
          // If vs computer and it's now computer's turn, trigger AI move
          if (isVsComputer && nextPlayer === computerColor) {
            setIsAITurn(true)
          }
        }

        setSelectedSquare(null)
      } else {
        // Invalid move, select the clicked piece if it's the current player's
        if (square && square.color === currentPlayer) {
          setSelectedSquare({ row, col })
        } else {
          setSelectedSquare(null)
        }
      }
    }
  }, [board, currentPlayer, selectedSquare, gameStatus, moveHistory, isVsComputer, isAITurn, playerColor, computerColor])

  const handleGameEnd = async (status, result) => {
    setGameStatus(status)
    
    if (isVsComputer && result) {
      let points = 0
      
      if (result === 'win') {
        points = POINTS_MAP[difficulty] || 0
        setPointsAwarded(points)
        
        // Update user stats
        try {
          await userAPI.updateStats('win', points)
        } catch (error) {
          console.error('Error updating stats:', error)
        }
      } else if (result === 'loss') {
        try {
          await userAPI.updateStats('loss', 0)
        } catch (error) {
          console.error('Error updating stats:', error)
        }
      } else if (result === 'draw') {
        try {
          await userAPI.updateStats('draw', 0)
        } catch (error) {
          console.error('Error updating stats:', error)
        }
      }
    }
  }

  const resetGame = () => {
    setBoard(createInitialBoard())
    setCurrentPlayer('white')
    setSelectedSquare(null)
    setMoveHistory([])
    setLastMove(null)
    setGameStatus('playing')
    setInCheck({ white: false, black: false })
    setIsAITurn(false)
    setPointsAwarded(null)
  }

  const getLegalMovesForSelected = () => {
    if (!selectedSquare) return []
    return getLegalMoves(board, selectedSquare, currentPlayer)
  }

  const handleBackToHome = () => {
    navigate('/home')
  }

  return (
    <div className="game-page">
      <Navbar />
      <div className="game-page-content">
        <div className="game-header">
          <h2>
            {isVsComputer 
              ? `Playing vs Computer (${difficulty ? difficulty.charAt(0).toUpperCase() + difficulty.slice(1) : 'Easy'})`
              : 'Player vs Player'}
          </h2>
          <button className="back-button" onClick={handleBackToHome}>
            ← Back to Home
          </button>
        </div>

        {pointsAwarded !== null && (
          <div className="points-notification">
            🎉 You earned {pointsAwarded} points!
          </div>
        )}

        {isVsComputer && isAITurn && gameStatus === 'playing' && (
          <div className="ai-thinking">
            Computer is thinking...
          </div>
        )}

        <div className="game-container">
          <GameInfo 
            currentPlayer={currentPlayer}
            gameStatus={gameStatus}
            inCheck={inCheck}
            moveHistory={moveHistory}
            onReset={resetGame}
          />
          
          <ChessBoard
            board={board}
            onSquareClick={handleSquareClick}
            selectedSquare={selectedSquare}
            legalMoves={getLegalMovesForSelected()}
            currentPlayer={currentPlayer}
            lastMove={lastMove}
          />
        </div>
      </div>
    </div>
  )
}

export default Game
