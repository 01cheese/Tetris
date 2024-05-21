// Constants
const canvas = document.getElementById('board');
const context = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const ROW = 20;
const COL = COLUMN = 10;
const SQ = squareSize = 30;
const VACANT = "BLACK"; // vacant cell color

// Tetromino shapes
const I = [
    [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ],
    [
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0]
    ],
    [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ],
    [
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0]
    ]
];

const J = [
    [
        [1, 0, 0],
        [1, 1, 1],
        [0, 0, 0]
    ],
    [
        [0, 1, 1],
        [0, 1, 0],
        [0, 1, 0]
    ],
    [
        [0, 0, 0],
        [1, 1, 1],
        [0, 0, 1]
    ],
    [
        [0, 1, 0],
        [0, 1, 0],
        [1, 1, 0]
    ]
];

const L = [
    [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0]
    ],
    [
        [0, 1, 0],
        [0, 1, 0],
        [0, 1, 1]
    ],
    [
        [0, 0, 0],
        [1, 1, 1],
        [1, 0, 0]
    ],
    [
        [1, 1, 0],
        [0, 1, 0],
        [0, 1, 0]
    ]
];

const O = [
    [
        [0, 1, 1],
        [0, 1, 1],
        [0, 0, 0]
    ],
    [
        [0, 1, 1],
        [0, 1, 1],
        [0, 0, 0]
    ],
    [
        [0, 1, 1],
        [0, 1, 1],
        [0, 0, 0]
    ],
    [
        [0, 1, 1],
        [0, 1, 1],
        [0, 0, 0]
    ]
];

const S = [
    [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0]
    ],
    [
        [0, 1, 0],
        [0, 1, 1],
        [0, 0, 1]
    ],
    [
        [0, 0, 0],
        [0, 1, 1],
        [1, 1, 0]
    ],
    [
        [1, 0, 0],
        [1, 1, 0],
        [0, 1, 0]
    ]
];

const T = [
    [
        [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0]
    ],
    [
        [0, 1, 0],
        [0, 1, 1],
        [0, 1, 0]
    ],
    [
        [0, 0, 0],
        [1, 1, 1],
        [0, 1, 0]
    ],
    [
        [0, 1, 0],
        [1, 1, 0],
        [0, 1, 0]
    ]
];

const Z = [
    [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0]
    ],
    [
        [0, 0, 1],
        [0, 1, 1],
        [0, 1, 0]
    ],
    [
        [0, 0, 0],
        [1, 1, 0],
        [0, 1, 1]
    ],
    [
        [0, 1, 0],
        [1, 1, 0],
        [1, 0, 0]
    ]
];

// Piece Object
function Piece(tetromino, color) {
    this.tetromino = tetromino;
    this.color = color;

    this.tetrominoN = 0; // initial rotation
    this.activeTetromino = this.tetromino[this.tetrominoN];

    // initial position
    this.x = 3;
    this.y = -2;
}

// Draw square function
Piece.prototype.fill = function(color) {
    for (let r = 0; r < this.activeTetromino.length;
        r++) {
            for (let c = 0; c < this.activeTetromino.length; c++) {
                if (this.activeTetromino[r][c]) {
                    drawSquare(this.x + c, this.y + r, color);
                }
            }
        }
    };
    
    // Draw piece on the board
    Piece.prototype.draw = function() {
        this.fill(this.color);
    };
    
    // Clear piece from the board
    Piece.prototype.unDraw = function() {
        this.fill(VACANT);
    };
    
    // Move piece down
    Piece.prototype.moveDown = function() {
        if (!this.collision(0, 1, this.activeTetromino)) {
            this.unDraw();
            this.y++;
            this.draw();
        } else {
            this.lock();
            p = randomPiece();
        }
    };
    
    // Move piece right
    Piece.prototype.moveRight = function() {
        if (!this.collision(1, 0, this.activeTetromino)) {
            this.unDraw();
            this.x++;
            this.draw();
        }
    };
    
    // Move piece left
    Piece.prototype.moveLeft = function() {
        if (!this.collision(-1, 0, this.activeTetromino)) {
            this.unDraw();
            this.x--;
            this.draw();
        }
    };
    
    // Rotate piece
    Piece.prototype.rotate = function() {
        let nextPattern = this.tetromino[(this.tetrominoN + 1) % this.tetromino.length];
        let kick = 0;
    
        if (this.collision(0, 0, nextPattern)) {
            if (this.x > COL / 2) {
                kick = -1;
            } else {
                kick = 1;
            }
        }
    
        if (!this.collision(kick, 0, nextPattern)) {
            this.unDraw();
            this.x += kick;
            this.tetrominoN = (this.tetrominoN + 1) % this.tetromino.length;
            this.activeTetromino = nextPattern;
            this.draw();
        }
    };
    
    // Lock piece
    Piece.prototype.lock = function() {
        for (let r = 0; r < this.activeTetromino.length; r++) {
            for (let c = 0; c < this.activeTetromino.length; c++) {
                if (!this.activeTetromino[r][c]) {
                    continue;
                }
                if (this.y + r < 0) {
                    // Game over
                    alert("Game Over");
                    document.location.reload();
                    break;
                }
                board[this.y + r][this.x + c] = this.color;
            }
        }
    
        // Clear filled rows
        for (let r = 0; r < ROW; r++) {
            let isRowFull = true;
            for (let c = 0; c < COL; c++) {
                if (board[r][c] == VACANT) {
                    isRowFull = false;
                    break;
                }
            }
            if (isRowFull) {
                for (let y = r; y > 1; y--) {
                    for (let c = 0; c < COL; c++) {
                        board[y][c] = board[y - 1][c];
                    }
                }
                for (let c = 0; c < COL; c++) {
                    board[0][c] = VACANT;
                }
                score += 10;
            }
        }
    
        // Redraw board and update score
        drawBoard();
        scoreElement.innerHTML = score;
    };
    
    // Check for collision
    Piece.prototype.collision = function(x, y, piece) {
        for (let r = 0; r < piece.length; r++) {
            for (let c = 0; c < piece.length; c++) {
                if (!piece[r][c]) {
                    continue;
                }
                let newX = this.x + c + x;
                let newY = this.y + r + y;
                if (newX < 0 || newX >= COL || newY >= ROW) {
                    return true;
                }
                if (newY < 0) {
                    continue;
                }
                if (board[newY][newX] != VACANT) {
                    return true;
                }
            }
        }
        return false;
    };
    
    // Draw square on the board
    function drawSquare(x, y, color) {
        context.fillStyle = color;
        context.fillRect(x * SQ, y * SQ, SQ, SQ);
        context.strokeStyle = "WHITE";
        context.strokeRect(x * SQ, y * SQ, SQ, SQ);
    }
    
    // Draw board
    function drawBoard() {
        for (let r = 0; r < ROW; r++) {
            for (let c = 0; c < COL; c++) {
                drawSquare(c, r, board[r][c]);
            }
        }
    }
    
    // Generate random piece
    function randomPiece() {
        let r = Math.floor(Math.random() * PIECES.length);
        return new Piece(PIECES[r][0], PIECES[r][1]);
    }
    
    // Start the game
    function startGame() {
        // Initialize board
        for (let r = 0; r < ROW; r++) {
            board[r] = [];
            for (let c = 0; c < COL; c++) {
                board[r][c] = VACANT;
            }
        }
        drawBoard();
    
        // Initialize score
        score = 0;
        scoreElement.innerHTML = score;
    
        // Generate first piece
        p = randomPiece();
        p.draw();
    
        // Start main game loop
        drop();
    }
    
    // Controls
    document.addEventListener("keydown", CONTROL);
    
    function CONTROL(event) {
        if (event.keyCode == 37) {
            p.moveLeft();
        } else if (event.keyCode == 38) {
            p.rotate();
        } else if (event.keyCode == 39) {
            p.moveRight();
        } else if (event.keyCode == 40) {
            p.moveDown();
        }
    }
    
    // Main game loop
    let dropStart = Date.now();
    let gameOver = false;
    
    function drop() {
        let now = Date.now();
        let delta = now - dropStart;
        if (delta > 1000) {
            p.moveDown();
            dropStart = Date.now();
        }
        if (!gameOver) {
            requestAnimationFrame(drop);
        }
    }
    
    // Tetromino pieces
    const PIECES = [
        [I, "red"],
        [J, "green"],
        [L, "yellow"],
        [O, "blue"],
        [S, "purple"],
        [T, "cyan"],
        [Z, "orange"]
    ];
    
    // Initialize game
    startGame();
    