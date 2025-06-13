# Snake Game v1.00

A highly customizable browser-based Snake game with dynamic gameplay mechanics, multiple visual themes, and adaptive difficulty scaling. Built with vanilla JavaScript and Canvas API.

**[Play Live Demo](https://definitelyavi.github.io/snake-game-v1.00)**

## Features

- **Dynamic Customization**: Adjustable speed settings, grid sizes, and visual themes
- **Adaptive Difficulty**: Progressive speed increases based on snake length
- **Multiple Themes**: Classic, Neon, and Ice visual styles with distinct aesthetics
- **Obstacle System**: Optional wall mode with randomly generated barriers
- **Audio Integration**: Howler.js implementation for cross-browser sound effects
- **Persistent Storage**: localStorage integration for high score tracking
- **Game State Management**: Comprehensive restart and configuration options

## Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Graphics**: Canvas API for 2D rendering and collision detection
- **Audio**: Howler.js for audio management and sound effects
- **Storage**: localStorage for persistent data
- **Deployment**: GitHub Pages

## Game Mechanics

The game implements classic Snake mechanics with modern enhancements including collision detection with walls and obstacles, dynamic speed scaling based on growth, and theme-based visual rendering. The Canvas API enables smooth 60fps gameplay with efficient redraw cycles.

## Architecture

Core game loop handles rendering, input processing, and state management while maintaining separation of concerns between game logic, audio systems, and visual themes. The modular design allows for easy extension of features and themes.

## Quick Start

```bash
git clone https://github.com/definitelyavi/snake-game-v1.00.git
cd snake-game-v1.00
# Open index.html in your browser
```

## Author

**Jashandeep Singh** [@definitelyavi](https://github.com/definitelyavi)

---

*Classic arcade gaming with modern web technologies*
