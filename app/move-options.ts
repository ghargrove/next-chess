
/** Determines which postitions a pawn can move to */
export function movePawn(color: 'wh' | 'blk', currentPosition: number): number[] {
  if (color === 'blk') {
    return [currentPosition - 8]
  }

  if (color === 'wh') {
    return [currentPosition + 8]
  }

  throw new Error('Invalid color provided');
}