"use client";

import '/app/gomoku.css';
import Image from 'next/image';
import { useState } from 'react';

function checkWin(board) {
    const size = board.length;
    const directions = [
        { x: 1, y: 0 },  // 水平
        { x: 0, y: 1 },  // 垂直
        { x: 1, y: 1 },  // 正斜
        { x: 1, y: -1 }  // 反斜
    ];

    function isInBounds(x, y) {
        return x >= 0 && x < size && y >= 0 && y < size;
    }

    function checkDirection(x, y, dx, dy, player) {
        let count = 0;
        for (let i = 0; i < 5; i++) {
            const nx = x + i * dx;
            const ny = y + i * dy;
            if (isInBounds(nx, ny) && board[nx][ny] === player) {
                count++;
            } else {
                break;
            }
        }
        return count === 5;
    }

    for (let x = 0; x < size; x++) {
        for (let y = 0; y < size; y++) {
            if (board[x][y] !== null) {
                const player = board[x][y];
                for (const { x: dx, y: dy } of directions) {
                    if (checkDirection(x, y, dx, dy, player)) {
                        return player === 100 ? 1 : -1;
                    }
                }
            }
        }
    }

    return 0;
}

function Go({ inner = null }) {
    if (inner === null) return null;
    return (
        <Image src={`/images/` + inner + `.png`} alt={inner} width={80} height={80} />
    );
}

function GoBlock({ x, y, xyBlockStatus, onBlockClick }) {
    let imageUrl = 'other.png';
    if (x === 0) {
        if (y === 0) {
            imageUrl = '0,0.png';
        } else if (y === 14) {
            imageUrl = '0,14.png';
        } else {
            imageUrl = '0,.png';
        }
    } else if ([3, 11].includes(x)) {
        if (y === 0) {
            imageUrl = ',0.png';
        } else if (y === 14) {
            imageUrl = ',14.png';
        } else if ([3, 11].includes(y)) {
            imageUrl = '3 7 11.png';
        }
    } else if (x === 7) {
        if (y === 0) {
            imageUrl = ',0.png';
        } else if (y === 14) {
            imageUrl = ',14.png';
        } else if (y === 7) {
            imageUrl = '3 7 11.png';
        }
    } else if (x === 14) {
        if (y === 0) {
            imageUrl = '14,0.png';
        } else if (y === 14) {
            imageUrl = '14,14.png';
        } else {
            imageUrl = '14,.png';
        }
    } else if (y === 0) {
        imageUrl = ',0.png';
    } else if (y === 14) {
        imageUrl = ',14.png';
    }
    return (
        <div
            className="block"
            style={{
                backgroundImage: `url('/images/${imageUrl}')`,
            }}
            onClick={onBlockClick}
        >
            <Go inner={xyBlockStatus} />
        </div>
    );
}

export default function GoBoard() {
    const initialBoard = Array.from({ length: 15 }, () => Array(15).fill(null));
    const [boardArray, setBoardArray] = useState(initialBoard);
    const [nextStone, setNextStone] = useState(0);
    const stones = [90, 10, 70, 30];
    const [observing, setObserving] = useState(false);

    function handleClick(x, y) {
        if (!observing) {
            const nextArray = boardArray.map(row => [...row]);
            if (nextArray[x][y] === null) {
                nextArray[x][y] = stones[nextStone];
                setBoardArray(nextArray);
                setNextStone((nextStone + 1) % 4);
            }
        }
    }

    function handleClickObserve() {
        setObserving(!observing);
    }

    // 更新观测模式
    const observingResult = boardArray.map(row => [...row]);
    let res = 0;
    if (observing) {
        for (let i = 0; i < 15; i++) {
            for (let j = 0; j < 15; j++) {
                if (observingResult[i][j] !== null) {
                    observingResult[i][j] = Math.random() < boardArray[i][j] / 100 ? 100 : 0;
                }
            }
        }
        // 临时展示观测结果，不更新原状态
        console.log('Observing:', observingResult);
        res = checkWin(observingResult);
    }

    const components = observingResult.map((row, rowIndex) => (
        <div key={`row-${rowIndex}`} style={{ display: 'flex', flexDirection: 'row' }}>
            {row.map((col, colIndex) => (
                <GoBlock
                    key={`${rowIndex}-${colIndex}`}
                    x={rowIndex}
                    y={colIndex}
                    xyBlockStatus={col}
                    onBlockClick={() => handleClick(rowIndex, colIndex)}
                />
            ))}
        </div>
    ));

    return (
        <>
            <div style={{ width: `${15 * 40}px` }}>
                {components}
            </div>
            <div>
                接下来的棋子是 {stones[nextStone]}
                <button style={{border: '1px solid'}} onClick={handleClickObserve}>
                    {observing ? '结束观测' : '开始观测'}
                </button>
            </div>
            <div>
                {res === 0 ? '未分胜负' : (res === 1 ? '黑胜' : '白胜')}
            </div>
        </>
    );
}
