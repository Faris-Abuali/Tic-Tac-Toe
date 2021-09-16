import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
      return (
        <button className="square" onClick={props.onClick}>
          {props.value}
        </button>
      );
    // When a Square is clicked, the onClick function provided by the Board is called.
  }
  
  class Board extends React.Component {

    renderSquare(i) {
      return (
        <Square 
          value={this.props.squares[i]}
          onClick = {() => {this.props.onClick(i)}}
        />
      );
    }
    render() {
      return (
        <div>
          <div className="board-row">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
          </div>
          <div className="board-row">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
          </div>
          <div className="board-row">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
          </div>
        </div>
      );
    }
  }
  
  class Game extends React.Component {

    constructor(props) {
      super(props);

      this.state = {
        history: [{
            squares: Array(9).fill(null),
        }],
        stepNumber: 0,
        xIsNext: true,
      };
    }
    handleClick(i) {
      const history = this.state.history.slice(0, this.state.stepNumber + 1);       
      // remember: 'history' is a big array of objects
      /*
        "this.state.history.slice(0, this.state.stepNumber + 1)"
        This ensures that if we “go back in time” and then make a new move from that point, we throw away all the “future” history that would now become incorrect.
      */
      const current = history[history.length - 1]; // so, 'current' is the last added OBJECT
      const squares = current.squares.slice(); 
      // .slice() returns a new array (the same content but a different array)

      //Ignore the click if someone has won the game or if a Square is already filled
      if(calculateWinner(squares) || squares[i]){
        return;
      }
      
      squares[i] = this.state.xIsNext ? 'X' : 'O';
      this.setState({
        history: history.concat([{
          squares: squares,
        }]),
        stepNumber: history.length,
        xIsNext: !this.state.xIsNext,
      });
      /*
        Note how in handleClick, we call '.slice()' to create a copy of the squares array to modify instead of modifying the existing array.
      */
      /*
        Unlike the array push() method you might be more familiar with, the concat() method doesn’t mutate the original array, so we prefer it.
      */
    }
    jumpTo(step) {
      this.setState({
        stepNumber: step,
        xIsNext: (step % 2) === 0,
      });
    }
    render() {
      const history = this.state.history;
      // remember: 'history' is a big array of objects
      const current = history[this.state.stepNumber];
      const winner = calculateWinner(current.squares);

      const moves = history.map((step, move) => {
        // 'step' is the array's element itself (which is here an object)
        // and 'move' is the index of this step (of this element in the history array)
        const desc = move ? 
          'Go to move #' + move :
          'Go to game start';
        // move is a number - any number will always give true unless it is 0 -
        return(
          <li key={move}>
            <button onClick={() => this.jumpTo(move)}>{desc}</button>
          </li>
        );
        // The moves are never re-ordered, deleted, or inserted in the middle, so it’s safe to use the move index as a key.
      });// end map()


      let status;
      if(winner) {
        status = 'Winner: ' + winner;
      }
      else {
        status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
      }
      return (
        <div className="game">
          <div className="game-board">
            <Board 
              squares={current.squares}
              onClick= {(i) => this.handleClick(i)}
            />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <ol>{moves}</ol>
          </div>
        </div>
      );
    }
  }

  // ========================================
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
    // This is the div whose id is root which is in the '/public/index.html'
  );

  /**
   * By inspecting the code, you’ll notice that we have three React components:
       - Square
       - Board
       - Game
   *
   */

       
  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a]; // squares[a] will be either 'X' or 'O'
      }
    }
    return null;
}