/* TP2 - CyberCycles
 * Par Félix Adam, matricule 20065738
 * et Alexis Gervais-Chapleau, matricule 20034967
 * Dans le cadre du cours IFT 1015 - Programmation 1
 * Remis le 19 décembre 2016
*/
var ai;
var width;
var height;
var cells = [];
var player1;
var player2;

// Crée la matrice de base
var creerMatrice = function(nbColonnes, nbRangees) {
    for (var i = 0; i < nbColonnes; i++) {
        cells[i] = Array(nbRangees);
    }
    return cells;
};

// Fonction qui associe la valeur de la matrice à sa couleur
// correspondante afin de colorier la grille.
var color = function(val) {
    switch (val) {
        case " ":
            return "transparent";
        case "#":
            return "green";
        case "1":
            return "blue";
        case "2":
            return "red";
    }
};

// Cette fonction sert a colorier la grille et à mettre
// à jour la matrice. Elle a aussi pour fonction de s'assurer
// que les obstacles ne sortent pas de la grille, causant un bug.
var setGrid = function(x, y, val) {
    x = Math.min(Math.max(x,0), width-1);
    y = Math.min(Math.max(y,0), height-1);
    Grid.colorCell(x, y, color(val));
    cells[x][y] = val;
};

// Crée la grille qui s'affiche sur la page HTML avec les positions de base
// des joueurs et les obstacles, en prenant comme argument les configurations
// déterminés par l'API
var createGrid = function(config) {
    width = config.w;
    height = config.h;
    player1 = config.players[0];
    player2 = config.players[1];
    switch (config.me) {
        case 1:
            ai = player1;
            break;
        case 2:
            ai = player2;
            break;
    }
    Grid.create(height,width);
    cells = creerMatrice(width,height);
    for (var q = 0; q < width; q++) {
        for (var w = 0; w < height; w++) {
            setGrid(q, w, " ");
        }
    }
    for (var i = 0; i < config.obstacles.length; i++) {
        for (var j = 0; j < config.obstacles[i].w; j++) {
            for (var k = 0; k < config.obstacles[i].h; k++) {
                setGrid(config.obstacles[i].x+j, config.obstacles[i].y+k, "#");
            }
        }
    }
    setGrid(player1.x,player1.y, "1");
    setGrid(player2.x,player2.y, "2");
};

// Fonction appelée à chaque tour qui appelle la fonction newPosition
// afin de mettre a jour la position des joueurs l'un après l'autre
// et qui appelle la fonction chooseDirection qui décidera la nouvelle
// direction a prendre de l'AI s'il y a lieu.
var nextMove = function(previousMoves) {
    if (previousMoves.length == 2) {
         newPosition(player2, previousMoves[1]);
         newPosition(player1, previousMoves[0]);
    }
    findPath();
    return direction;
};

// La fonction findPath regarde à chaque tour les possibilités
// de direction que l'AI peut prendre et choisit le chemin
// dans lequel se trouve le plus de cases libres jusq'au prochain
// obstacle.
var findPath = function () {
    var upCounter = 0;
    var downCounter = 0;
    var rightCounter = 0;
    var leftCounter = 0;
    for (var j = ai.y; j > 0; j--) { // UP
        if (cells[ai.x][j-1] === " ") {
            upCounter++;
        }
        else {
            break;
        }
    }
    for (var k = ai.y; k<cells[0].length-1; k++) { // DOWN
        if (cells[ai.x][k+1] === " ") {
            downCounter++;
        }
        else {
            break;
        }
    }
    for (var m = ai.x; m > 0 ; m--) { // LEFT
        if (cells[m-1][ai.y] === " ") {
            leftCounter++;
        }
        else {
            break;
        }
    }
    for (var i = ai.x; i < cells.length-1; i++) { // RIGHT
        if (cells[i+1][ai.y] === " ") {
            rightCounter++;
        }
        else {
            break;
        }
    }
    var meilleurChemin = Math.max(upCounter,downCounter,leftCounter,rightCounter);
    switch (meilleurChemin) {
        case upCounter:
            direction = "u";
            return direction;
        case downCounter:
            direction = "d";
            return direction;
        case leftCounter:
            direction = "l";
            return direction;
        case rightCounter:
            direction = "r";
            return direction;
    }
};

// Fonction qui pour chaque joueur regarde l'enregistrement previousMoves
// et met à jour la position du joueur sur la grille en appelant la fonction setGrid.
var newPosition = function(player, previousMove) {
    x = player.x;
    y = player.y;
    switch (previousMove.direction) {
        case "u":
            y--;
            break;
        case "d":
            y++;
            break;
        case "l":
            x--;
            break;
        case "r":
            x++;
            break;
    }
    player.x = x;
    player.y = y;
    setGrid(player.x, player.y, ""+player.id);
};

// Fonction qui colorie les cases parcourues par le joueur gagnant
// en mauve ou en orange. Si le match est nul, les cases parcourues
// seront coloriées en gris.
var victory = function(winner) {
    switch (winner) {
        case 1:
            for (var i = 0; i < cells.length; i++) {
                for (var j = 0; j < cells[0].length; j++) {
                    if (cells[i][j] == "2") {
                        Grid.colorCell(i, j, "purple");
                    }
                }
            }
            break;
        case 2:
            for (var k = 0; k < cells.length; k++) {
                for (var l = 0; l < cells[0].length; l++) {
                    if (cells[k][l] == "1") {
                        Grid.colorCell(k, l, "orange");
                    }
                }
            }
            break;
        case false:
            for (var q = 0; q < cells.length; q++) {
                for (var w = 0; w < cells[0].length; w++) {
                    if (cells[q][w] == "1" || cells[q][w] == "2") {
                        Grid.colorCell(q, w, "grey");
                    }
                }
            }
            break;
    }
};