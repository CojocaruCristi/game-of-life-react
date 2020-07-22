import React, {useCallback, useRef, useState} from 'react';
import logo from './logo.svg';
import './App.css';
import produce from "immer";


const numRows = 30;
const numCols = 30;

const operations = [
    [0, 1],
    [0, -1],
    [1, -1],
    [-1, 1],
    [1, 1],
    [-1, -1],
    [1, 0],
    [-1, 0]
];

const genarateNewGrid = () => {  //clear and generate new grid
    const rows = [];
    for (let i = 0; i < numRows; i++) {
        rows.push(Array.from(Array(numCols), () => 0));
    }
    return rows;
}

function App() {

    const [grid, setGrid] = useState(() => {
        return genarateNewGrid()
    });

    const [gameMode, setGameMode] = useState(false)

    const gameModeRef = useRef(gameMode);
    gameModeRef.current = gameMode;


    const runSimulation = useCallback(() => { // something fun will be after this function
        if (!gameModeRef.current) {
            return;
        }
        //simulate
        setGrid((g) => {
            return produce(g, gridCopy => {
                for (let i = 0; i < numRows; i++) {
                    for (let k = 0; k < numCols; k++) {
                        let neighbors = 0;
                        operations.forEach(([x, y]) => {
                            const newI = i + x;
                            const newK = k + y;
                            if (newI >= 0 && newI < numRows && newK >= 0 && newK < numCols) {
                                neighbors += g[newI][newK]
                            }
                        })
                        if (neighbors < 2 || neighbors > 3) {
                            gridCopy[i][k] = 0;
                        } else if (g[i][k] === 0 && neighbors === 3) {
                            gridCopy[i][k] = 1;
                        }
                    }
                }
            })
        })

        setTimeout(runSimulation, 500);
    }, [])



    return (
        <>

            <ButtonsPanel setGrid={setGrid}
                          setGameMode={setGameMode}
                          gameMode={gameMode}
                          gameModeRef={gameModeRef}
                          runSimulation={runSimulation}/>

            <div className={'mainGrid'} style={{
                display: "grid",
                gridTemplateColumns: `repeat(${numCols}, 20px)`
            }}>
                {grid.map((rows, i) =>
                    rows.map((col, k) =>
                        <div className={'box'} key={`${i}-${k}`} onClick={() => {
                            const newGrid = produce(grid, gridCopy => {
                                gridCopy[i][k] = grid[i][k] ? 0 : 1;
                            })
                            setGrid(newGrid);
                        }
                        }
                             style={{
                                 backgroundColor: grid[i][k] ? 'black' : undefined,
                             }}> </div>))
                }


            </div>
        </>
    );
}


const ButtonsPanel = (props) => {
    return (
        <div className={'buttonsPanel'}>
            <button onClick={() => {
                {
                    props.setGameMode(!props.gameMode);
                    if (!props.gameMode) {
                        props.gameModeRef.current = true;
                        props.runSimulation();
                    }
                }
            }}>{props.gameMode ? 'stop' : 'start'}</button>
            <button onClick={() => {
                props.setGrid(genarateNewGrid());
            }}>new model
            </button>
        </div>
    )
}


export default App;
