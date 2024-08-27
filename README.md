# 8-Puzzle Solver

Welcome to the 8-Puzzle Solver! This web application provides a solution for the classic 8-puzzle (or 3x3 sliding puzzle) game. Users can interact with the puzzle grid, input values, and receive a step-by-step solution to reach the goal state.

## Live Demo

Check out the live version of the project [here](https://8puzzle.wjalal.xyz).

## Technology Stack

This project is built using a modern web development stack:

### Frontend:

- **HTML/CSS**: For structuring and styling the web interface.
- **JavaScript**: For interactivity, handling user input, and communicating with the backend.

### Backend:

- **Node.js**: A JavaScript runtime for building the server-side logic.
- **Express.js**: A lightweight framework for handling HTTP requests and routing.
- The Node.js backend calls a native n-puzzle solver written in C++, which can be found [here](https://github.com/wjalal/3-2/tree/main/18/F1).

## Features

- **Interactive Puzzle Grid**: Click on the tiles and enter values with the keyboard. Pressing 0, -, or SPACE sets a tile as empty.
- **Duplicate Detection**: Highlights tiles if duplicate values are entered.
- **Blank Tile Handling**: Warns if there are multiple blank tiles and indicates errors visually.
- **Backend Solver**: Computes the shortest sequence of moves to solve the puzzle using a custom algorithm.
- **Solution Visualization**: Displays each step of the solution, highlighting which tiles moved between steps.
