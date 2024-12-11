

import Image from 'next/image'

import pawnBlack from "../../public/images/pawn-black.svg";
import rookBlack from '../../public/images/rook-black.svg';
import knightBlack from '../../public/images/knight-black.svg';
import bishopBlack from '../../public/images/bishop-black.svg';
import queenBlack from '../../public/images/queen-black.svg';
import kingBlack from '../../public/images/king-black.svg';
import pawnWhite from "../../public/images/pawn-white.svg";
import rookWhite from '../../public/images/rook-white.svg';
import knightWhite from '../../public/images/knight-white.svg';
import bishopWhite from '../../public/images/bishop-white.svg';
import queenWhite from '../../public/images/queen-white.svg';
import kingWhite from '../../public/images/king-white.svg';

/** Identifies game pieces */
export type PieceId =
  | "blk-p1"
  | "blk-p2"
  | "blk-p3"
  | "blk-p4"
  | "blk-p5"
  | "blk-p6"
  | "blk-p7"
  | "blk-p8"
  | "blk-r1"
  | "blk-r2"
  | "blk-kn1"
  | "blk-kn2"
  | "blk-b1"
  | "blk-b2"
  | "blk-q"
  | "blk-k"
  | "wh-p1"
  | "wh-p2"
  | "wh-p3"
  | "wh-p4"
  | "wh-p5"
  | "wh-p6"
  | "wh-p7"
  | "wh-p8"
  | "wh-r1"
  | "wh-r2"
  | "wh-kn1"
  | "wh-kn2"
  | "wh-b1"
  | "wh-b2"
  | "wh-q"
  | "wh-k";

interface GamePieceProps {
  pieceId: PieceId
}

/**
 * Presents an game piece represented by the given `pieceId`
 */
export const GamePiece: React.FC<GamePieceProps> = (props) => {
  const {pieceId} = props

  if (/^blk-p[1-8]$/.test(pieceId)) {
    return <Image priority alt="black pawn" src={pawnBlack} />
  }

  if (/^wh-p[1-8]$/.test(pieceId)) {
    return <Image priority alt="white pawn" src={pawnWhite} />
  }

  if (/^blk-r[1-2]$/.test(pieceId)) {
    return <Image priority alt="black rook" src={rookBlack} />
  }

  if (/^wh-r[1-2]$/.test(pieceId)) {
    return <Image priority alt="white rook" src={rookWhite} />
  }

  if (/^blk-kn[1-2]$/.test(pieceId)) {
    return <Image priority alt="black knight" src={knightBlack} />
  }

  if (/^wh-kn[1-2]$/.test(pieceId)) {
    return <Image priority alt="white knight" src={knightWhite} />
  }

  if (/^blk-b[1-2]$/.test(pieceId)) {
    return <Image priority alt="black bishop" src={bishopBlack} />
  }

  if (/^wh-b[1-2]$/.test(pieceId)) {
    return <Image priority alt="white bishop" src={bishopWhite} />
  }

  if (pieceId === 'blk-q') {
    return <Image priority alt="black queen" src={queenBlack} />
  }

  if (pieceId === 'wh-q') {
    return <Image priority alt="white queen" src={queenWhite} />
  }

  if (pieceId === 'blk-k') {
    return <Image priority alt="black king" src={kingBlack} />
  }

  if (pieceId === 'wh-k') {
    return <Image priority alt="white king" src={kingWhite} />
  }

  return null
}
