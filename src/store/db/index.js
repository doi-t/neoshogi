import { db } from "@/plugins/firebase";
import Vue from "vue";

export const state = () => ({
  player: {
    profile: {
      name: null
    },
    action: {
      selected: false,
      selectedCell: { row: null, col: null },
      marked: false,
      markedCell: { row: null, col: null }
    }
  },
  gameStatus: {
    scale: 0,
    cells: []
  }
});

export const getters = {
  getCell: state => (row, col) => {
    return state.gameStatus.cells[row][col];
  },
  getCellColor: state => (row, col) => {
    if (state.gameStatus.cells[row][col].selected) return "red";
    if (state.gameStatus.cells[row][col].marked) return "green";
    if (state.gameStatus.cells[row][col].movable) return "yellow";
    return "blue";
  }
};

export const actions = {
  getPlayer: async ({ commit, rootState }) => {
    const uid = rootState.users.user.uid;
    var userDocRef = db.collection("users").doc(uid);
    const player = await userDocRef.get();
    if (player.exists) {
      commit("setPlayer", player.data());
    } else {
      console.log(`Creating a new player account... ${player.data()}`);
      await userDocRef.set({ name: "test player1" });
    }
  },
  initGame: async ({ commit, state }, scale) => {
    var cells = [];
    var row, col;
    for (row = 0; row < scale; row++) {
      cells[row] = [];
      for (col = 0; col < scale; col++) {
        // Initialize data schema of each cell
        cells[row][col] = {
          position: { row: row, col: col },
          unit: {
            player: gamePresets[scale][row * scale + col].role
              ? state.player.profile.name
              : "",
            role: gamePresets[scale][row * scale + col].role,
            moves: gamePresets[scale][row * scale + col].moves
          },
          selected: false,
          marked: false,
          movable: false
        };
      }
    }
    commit("initGame", { scale, cells });
  },
  resetAction: async ({ commit }) => {
    commit("resetSelectAction");
    commit("resetMarkAction");
  },
  updateCell: async ({ commit, state }, { row, col }) => {
    if (state.gameStatus.cells[row][col].selected) {
      commit("resetSelectAction");
      commit("resetMarkAction");
    } else if (!state.player.action.selected) {
      if (!isUnitOwner(state, row, col)) return;
      commit("selectCell", { row, col });
    } else {
      if (isUnitOwner(state, row, col)) {
        commit("resetSelectAction");
        commit("resetMarkAction");
        commit("selectCell", { row, col });
      }
      if (isMovable(state, row, col) === false) return;
      commit("markNextMove", { row, col });
    }
  },
  moveUnit: async ({ commit }) => {
    commit("moveUnit");
    commit("resetSelectAction");
    commit("resetMarkAction");
  }
};

export const mutations = {
  setPlayer: (state, playerInfo) => {
    state.player.profile = playerInfo;
  },
  initGame: (state, { scale, cells }) => {
    Vue.set(state.gameStatus, "cells", cells);
    state.gameStatus.scale = scale;
    state.player.action.selected = false;
    state.player.action.selectedCell = { row: null, col: null };
    state.player.action.marked = false;
    state.player.action.markedCell = { row: null, col: null };
  },
  selectCell: (state, { row, col }) => {
    var v = state.gameStatus.cells[row].slice(0);
    v[col].selected = true;
    Vue.set(state.gameStatus.cells, row, v);

    markMovableCells(state, row, col, true);

    state.player.action.selected = true;
    state.player.action.selectedCell = { row: row, col: col };
  },
  markNextMove: (state, { row, col }) => {
    // Reset the previous marked status
    if (state.player.action.marked)
      state.gameStatus.cells[state.player.action.markedCell.row][
        state.player.action.markedCell.col
      ].marked = false;
    var v = state.gameStatus.cells[row].slice(0);
    v[col].marked = true;
    Vue.set(state.gameStatus.cells, row, v);
    state.player.action.marked = true;
    state.player.action.markedCell = { row: row, col: col };
  },
  resetSelectAction: state => {
    if (!state.player.action.selected) return;
    const row = state.player.action.selectedCell.row;
    const col = state.player.action.selectedCell.col;
    markMovableCells(state, row, col, false);
    state.gameStatus.cells[row][col].selected = false;
    state.player.action.selected = false;
    state.player.action.selectedcell = { row: null, col: null };
  },
  resetMarkAction: state => {
    if (!state.player.action.marked) return;
    const row = state.player.action.markedCell.row;
    const col = state.player.action.markedCell.col;
    state.gameStatus.cells[row][col].marked = false;
    state.player.action.marked = false;
    state.player.action.markedCell = { row: null, col: null };
  },
  moveUnit: state => {
    const selectedRow = state.player.action.selectedCell.row;
    const selectedCol = state.player.action.selectedCell.col;
    const markedRow = state.player.action.markedCell.row;
    const markedCol = state.player.action.markedCell.col;

    // Reset movable marks before moving a selected unit
    markMovableCells(state, selectedRow, selectedCol, false);

    state.gameStatus.cells[markedRow][markedCol].unit =
      state.gameStatus.cells[selectedRow][selectedCol].unit;
    state.gameStatus.cells[selectedRow][selectedCol].unit = {
      player: "",
      role: "",
      moves: []
    };
  }
};

const isUnitOwner = (state, row, col) => {
  const unitOwner = state.gameStatus.cells[row][col].unit.player;
  if (unitOwner != state.player.profile.name) {
    return false;
  } else {
    return true;
  }
};

const isMovable = (state, row, col) => {
  const x = row - state.player.action.selectedCell.row;
  const y = col - state.player.action.selectedCell.col;
  var distance = Math.round(Math.sqrt(x * x + y * y));

  // A cell other than 9 directions is out of scope.
  if (Math.abs(x) !== Math.abs(y) && x !== 0 && y !== 0) return false;

  if (Math.abs(x) === Math.abs(y)) distance = Math.abs(x);
  const sRow = state.player.action.selectedCell.row;
  const sCol = state.player.action.selectedCell.col;
  const moves = state.gameStatus.cells[sRow][sCol].unit.moves;
  if (x < 0 && y < 0) {
    if (distance > moves[UPLEFT]) return false;
  } else if (x < 0 && y === 0) {
    if (distance > moves[UP]) return false;
  } else if (x < 0 && 0 < y) {
    if (distance > moves[UPRIGHT]) return false;
  } else if (x === 0 && y < 0) {
    if (distance > moves[LEFT]) return false;
  } else if (x === 0 && y === 0) {
    if (distance > moves[CENTER]) return false;
  } else if (x === 0 && 0 < y) {
    if (distance > moves[RIGHT]) return false;
  } else if (0 < x && y < 0) {
    if (distance > moves[DOWNLEFT]) return false;
  } else if (0 < x && y === 0) {
    if (distance > moves[DOWN]) return false;
  } else if (0 < x && 0 < y) {
    if (distance > moves[DOWNRIGHT]) return false;
  } else {
    return true;
  }
};

const markMovableCells = (state, row, col, mark) => {
  const moves = state.gameStatus.cells[row][col].unit.moves;
  var direction, n;
  for (direction = 0; direction < moves.length; direction++) {
    if (direction === UPLEFT) {
      for (n = 1; n <= moves[direction]; n++)
        if (!markMovableCell(state, row, col, row - n, col - n, mark)) break;
    }
    if (direction === UP) {
      for (n = 1; n <= moves[direction]; n++)
        if (!markMovableCell(state, row, col, row - n, col, mark)) break;
    }
    if (direction === UPRIGHT) {
      for (n = 1; n <= moves[direction]; n++)
        if (!markMovableCell(state, row, col, row - n, col + n, mark)) break;
    }
    if (direction === LEFT) {
      for (n = 1; n <= moves[direction]; n++)
        if (!markMovableCell(state, row, col, row, col - n, mark)) break;
    }
    if (direction === RIGHT) {
      for (n = 1; n <= moves[direction]; n++)
        if (!markMovableCell(state, row, col, row, col + n, mark)) break;
    }
    if (direction === DOWNLEFT) {
      for (n = 1; n <= moves[direction]; n++)
        if (!markMovableCell(state, row, col, row + n, col - n, mark)) break;
    }
    if (direction === DOWN) {
      for (n = 1; n <= moves[direction]; n++)
        if (!markMovableCell(state, row, col, row + n, col, mark)) break;
    }
    if (direction === DOWNRIGHT) {
      for (n = 1; n <= moves[direction]; n++) {
        if (!markMovableCell(state, row, col, row + n, col + n, mark)) break;
      }
    }
  }
};

const markMovableCell = (state, fromRow, fromCol, toRow, toCol, mark) => {
  if (toRow < 0 || toCol < 0) return false;

  const scale = state.gameStatus.scale;
  if (toRow >= scale || toCol >= scale) return false;

  const fromCell = state.gameStatus.cells[fromRow][fromCol];
  const toCell = state.gameStatus.cells[toRow][toCol];
  if (toCell.unit.player === fromCell.unit.player) return false;

  var tmp = state.gameStatus.cells[toRow].slice(0);
  tmp[toCol].movable = mark;
  Vue.set(state.gameStatus.cells, toRow, tmp);
  return true;
};

// Initial unit arrangement and move powers
// role: "", "unit" or "king"
// moves: upLeft, up, upRight, left, center, right, downLeft, down, downRight
// e.g. moves: [0, 1, 0, 0, "*", 0, 0, 0, 0];
const UPLEFT = 0;
const UP = 1;
const UPRIGHT = 2;
const LEFT = 3;
const CENTER = 4;
const RIGHT = 5;
const DOWNLEFT = 6;
const DOWN = 7;
const DOWNRIGHT = 8;
export const gamePresets = {
  "3": [
    { role: "", moves: [] },
    { role: "", moves: [] },
    { role: "", moves: [] },
    { role: "", moves: [] },
    { role: "", moves: [] },
    { role: "", moves: [] },
    { role: "unit", moves: [4, 4, 4, 4, "*", 3, 3, 3, 3] },
    { role: "king", moves: [1, 1, 1, 1, "*", 1, 1, 1, 1] },
    { role: "unit", moves: [0, 1, 0, 0, "*", 0, 0, 0, 0] }
  ],
  "5": [
    { role: "", moves: [] },
    { role: "", moves: [] },
    { role: "", moves: [] },
    { role: "", moves: [] },
    { role: "", moves: [] },
    { role: "", moves: [] },
    { role: "", moves: [] },
    { role: "", moves: [] },
    { role: "", moves: [] },
    { role: "", moves: [] },
    { role: "", moves: [] },
    { role: "", moves: [] },
    { role: "", moves: [] },
    { role: "", moves: [] },
    { role: "", moves: [] },
    { role: "unit", moves: [0, 1, 0, 0, "*", 0, 0, 0, 0] },
    { role: "unit", moves: [0, 1, 0, 0, "*", 0, 0, 0, 0] },
    { role: "unit", moves: [3, 4, 2, 1, "*", 4, 2, 3, 1] },
    { role: "unit", moves: [10, 10, 10, 10, "*", 10, 10, 10, 10] },
    { role: "unit", moves: [0, 1, 0, 0, "*", 0, 0, 0, 0] },
    { role: "", moves: [] },
    { role: "unit", moves: [1, 1, 1, 1, "*", 1, 0, 1, 0] },
    { role: "king", moves: [1, 1, 1, 1, "*", 1, 1, 1, 1] },
    { role: "unit", moves: [1, 1, 1, 1, "*", 1, 0, 1, 0] },
    { role: "", moves: [] }
  ]
};
