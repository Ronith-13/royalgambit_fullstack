// Animation utilities for chess pieces

export const ANIMATION_DURATION = {
  MOVE: 400,
  CAPTURE: 600,
  SELECT: 300,
  HOVER: 200
}

export const EASING = {
  SMOOTH: 'cubic-bezier(0.4, 0, 0.2, 1)',
  BOUNCE: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  EASE_OUT: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
}

// Create a smooth transition between squares
export function createMoveAnimation(fromSquare, toSquare) {
  return {
    from: fromSquare,
    to: toSquare,
    duration: ANIMATION_DURATION.MOVE,
    easing: EASING.SMOOTH
  }
}

// Add visual feedback for piece selection
export function addSelectionFeedback(element) {
  if (!element) return
  
  element.style.transform = 'scale(1.1)'
  element.style.transition = `transform ${ANIMATION_DURATION.SELECT}ms ${EASING.BOUNCE}`
  
  setTimeout(() => {
    element.style.transform = 'scale(1)'
  }, ANIMATION_DURATION.SELECT)
}

// Add hover effects with smooth transitions
export function addHoverEffect(element, pieceType) {
  if (!element) return
  
  const hoverTransforms = {
    king: 'scale(1.2)',
    queen: 'scale(1.15) rotate(-3deg)',
    rook: 'scale(1.1)',
    bishop: 'scale(1.12) rotate(8deg)',
    knight: 'scale(1.15) rotate(-8deg)',
    pawn: 'scale(1.1) translateY(-2px)'
  }
  
  element.style.transform = hoverTransforms[pieceType] || 'scale(1.1)'
  element.style.transition = `all ${ANIMATION_DURATION.HOVER}ms ${EASING.SMOOTH}`
}

// Remove hover effects
export function removeHoverEffect(element) {
  if (!element) return
  
  element.style.transform = 'scale(1)'
}

// Animate piece capture
export function animateCapture(element) {
  if (!element) return
  
  element.style.animation = `pieceCapture ${ANIMATION_DURATION.CAPTURE}ms ${EASING.EASE_OUT} forwards`
  
  return new Promise(resolve => {
    setTimeout(resolve, ANIMATION_DURATION.CAPTURE)
  })
}

// Animate legal move indicators
export function animateLegalMoves(elements) {
  elements.forEach((element, index) => {
    if (element) {
      element.style.animationDelay = `${index * 50}ms`
      element.style.animation = `legalMovePulse 2s ${EASING.SMOOTH} infinite`
    }
  })
}