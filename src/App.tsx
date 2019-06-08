import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';

const App: React.FC = () => {
  const [sizeX, setSizeX] = useState(0);
  const [sizeY, setSizeY] = useState(0);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const handleChange = (set: any) => (e: any) => set(e.target.value || 0);
  const handleClick = (i: number, j: number) => () => {
    // (1,1) => (1,2) - (1,1+1)
    // (1,2) => (5,9) - (1+2,1) - (3,2) - (5,5+1)
    let xGoing = x, yGoing = y;
    if(xGoing <= i && xGoing + yGoing <= j) xGoing += yGoing;
    else if(yGoing <= j && yGoing + xGoing <= i) xGoing += yGoing;
    setX(i);
    setY(j);
  };
  const mountMatrix = (): any => {
    const mountCols = (i: number): any => {
      const cols = [];
      for (let j = 0; j < sizeX; j++) {
        const className = (i % 2 === 0 ? (j % 2 === 0 ? `c-white` : `c-black`) : (j % 2 !== 0 ? `c-white` : `c-black`));
        cols.push(<div key={`c_${i}_${j}`} id={`c_${i}_${j}`} className={`c ${className}`} onClick={handleClick(i, j)}>
          {i === x && j === y &&
            (<img src={logo} className="App-logo" alt="logo" />)
          }
        </div>);
      }
      return cols;
    }
    const draw = [];
    for (let i = 0; i < sizeY; i++) {
      draw.push(<div id={`line_${i}`} key={`line_${i}`} className='line'>
        {mountCols(i)}
      </div>);
    }
    return draw;
  }

  return (
    <div className='App'>
      Defina o tamanho da matrix: (<input onChange={handleChange(setSizeX)} />, <input onChange={handleChange(setSizeY)} />)
      {sizeX > 0 && sizeY > 0 && (<div id='matrix'>
        {mountMatrix()}
      </div >)}
    </div >
  );
}

export default App;
