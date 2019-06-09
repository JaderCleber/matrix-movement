import React, { useState, useEffect, useRef } from 'react';
import logo from './logo.svg';
import './App.css';

interface IPosition {
  left: number | undefined;
  top: number | undefined;
}

interface IDirection {
  left: boolean;
  top: boolean;
}

const App: React.FC = () => {
  const [sizeX, setSizeX] = useState(10);
  const [sizeY, setSizeY] = useState(10);
  const [direction, setDirection] = useState<IDirection>({ left: true, top: true });
  const [currentPosition, setCurrentPosition] = useState<IPosition>({ left: 0, top: 0 });
  const [targetPosition, setTargetPosition] = useState<IPosition>({ left: undefined, top: undefined });
  const img: any = useRef(null);
  useEffect(() => {
    const { current } = img;
    if (current) {
      const top = current.offsetTop;
      const left = current.offsetLeft;
      const screenHeight = (window as any).visualViewport.pageTop;
      const screenLeft = (window as any).visualViewport.pageLeft;

      let scrollX;
      let scrollY;
      const topVisible = top >= screenHeight && top <= (screenHeight + window.innerHeight);
      const leftVisible = left >= screenLeft && left <= (screenLeft + window.innerWidth);
      if (topVisible) {
        if (direction.top) {
          scrollY = top > screenHeight + window.innerHeight * 0.9 ?
            top + window.innerHeight / 2 : screenHeight;
        } else {
          scrollY = top < screenHeight * 1.1 ?
            top - window.innerHeight / 2 : screenHeight;
        }
      } else {
        scrollY = top;
      }
      if (leftVisible) {
        if (direction.left) {
          scrollX = left > screenLeft + window.innerWidth * 0.9 ?
            left + window.innerWidth / 2 : screenLeft;
        } else {
          scrollX = left < screenLeft * 1.1 ?
            left - window.innerWidth / 2 : screenLeft;
        }
      } else {
        scrollX = left;
      }

      (window as any).scrollTo(scrollX, scrollY, true);
    }
  });
  useEffect(() => {
    const { left: x, top: y } = targetPosition;
    if (x !== undefined || y !== undefined) {
      const timerMove = setTimeout(() => {
        move(targetPosition);
        return () => clearTimeout(timerMove);
      }, 100);
    }
  }, [targetPosition]);

  const handleChange = (set: any) => (e: any) => set(e.target.value || 0);
  const handleClick = (target: IPosition) => () => move(target);
  const move = ({ left: xDest = 0, top: yDest = 0 }: IPosition) => {
    let { left: xGoing = 0, top: yGoing = 0 } = currentPosition;
    const directionX = xGoing < xDest;
    const directionY = yGoing < yDest;
    const distanceX = directionX ? xDest - xGoing : xGoing - xDest;
    const distanceY = directionY ? yDest - yGoing : yGoing - yDest;
    if (xGoing !== xDest || yGoing !== yDest) {
      setTargetPosition({ left: xDest, top: yDest });
      setDirection({ left: directionX, top: directionY });
      const nextX = distanceX ? (directionX ? xGoing + 1 : xGoing - 1) : xGoing;
      const nextY = distanceY ? (directionY ? yGoing + 1 : yGoing - 1) : yGoing;
      if (distanceX > distanceY) {
        setCurrentPosition({ left: nextX, top: yGoing });
      } else {
        setCurrentPosition({ top: nextY, left: xGoing });
      }

      // if (xGoing <= xDest && xGoing + yGoing <= yDest) xGoing += yGoing;
      // else if (yGoing <= yDest && yGoing + xGoing <= xDest) xGoing += yGoing;
      // setX(i);
      // setY(j);
    }
  }
  const mountMatrix = (): any => {
    const mountCols = (line: number): any => {
      const cols = [];
      for (let column = 0; column < sizeX; column++) {
        const className = (line % 2 === 0 ? (column % 2 === 0 ? `c-white` : `c-black`) : (column % 2 !== 0 ? `c-white` : `c-black`));
        cols.push(<div key={`c_${line}_${column}`} id={`c_${line}_${column}`} className={`c ${className}`} onClick={handleClick({ left: column, top: line })}>
          {line === currentPosition.top && column === currentPosition.left &&
            (<img ref={img} src={logo} className="App-logo" alt="logo" />)
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
