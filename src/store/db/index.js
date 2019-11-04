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
      markedCell: { row: null, col: null },
      unitConfigDialog: false
    },
    storage: {
      units: 0,
      speeds: 0
    }
  },
  game: {
    status: GAME_STATUS_INIT,
    scale: 0,
    cells: []
  }
});

export const getters = {
  getCell: state => (row, col) => {
    return state.game.cells[row][col];
  },
  getCellColor: state => (row, col) => {
    if (state.game.cells[row][col].selected) return "red";
    if (state.game.cells[row][col].marked) return "green";
    if (state.game.cells[row][col].movable) return "yellow";
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
            player: gamePresets[scale].units[row * scale + col].role
              ? state.player.profile.name
              : "",
            role: gamePresets[scale].units[row * scale + col].role,
            moves: gamePresets[scale].units[row * scale + col].moves
          },
          selected: false,
          marked: false,
          movable: false
        };
      }
    }
    commit("initGame", { scale, cells });
  },
  startGame: async ({ commit, dispatch }) => {
    dispatch("resetAction");
    commit("startGame");
  },
  deployUnit: async ({ commit }) => {
    commit("deployUnit");
  },
  resetAction: async ({ commit }) => {
    commit("resetSelectAction");
    commit("resetMarkAction");
  },
  updateCell: async ({ commit, state, dispatch }, { row, col }) => {
    if (state.game.cells[row][col].selected) {
      commit("resetSelectAction");
      commit("resetMarkAction");
      commit("setUnitConfigDialog", { toggle: true });
    } else if (state.game.cells[row][col].marked) {
      dispatch("moveUnit");
    } else if (!state.player.action.selected) {
      if (isUnitOwner(state, row, col)) {
        commit("selectCell", { row, col });
      }
    } else if (state.player.action.selected) {
      if (isUnitOwner(state, row, col)) {
        if (state.game.status === GAME_STATUS_INIT) {
          if (isMovable(state, row, col) === true) {
            commit("markNextMove", { row, col });
            dispatch("moveUnit");
          }
        } else {
          commit("resetSelectAction");
          commit("resetMarkAction");
          commit("selectCell", { row, col });
        }
      } else if (isMovable(state, row, col) === true) {
        commit("markNextMove", { row, col });
        dispatch("moveUnit");
      }
    }
  },
  setUnitConfigDialog: async ({ commit }, { toggle }) => {
    commit("setUnitConfigDialog", { toggle });
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
  setUnitConfigDialog: (state, { toggle }) => {
    console.log(toggle);
    state.player.action.unitConfigDialog = toggle;
  },
  initGame: (state, { scale, cells }) => {
    state.game.scale = scale;
    state.game.status = GAME_STATUS_INIT;
    Vue.set(state.game, "cells", cells);
    state.player.action = {
      selected: false,
      selectedCell: { row: null, col: null },
      marked: false,
      markedCell: { row: null, col: null }
    };
  },
  startGame: state => {
    state.game.status = GAME_STATUS_PLAYING;
  },
  deployUnit: state => {},
  selectCell: (state, { row, col }) => {
    var v = state.game.cells[row].slice(0);
    v[col].selected = true;
    Vue.set(state.game.cells, row, v);
    markMovableCells(state, row, col, true);
    state.player.action.selected = true;
    state.player.action.selectedCell = { row: row, col: col };
  },
  markNextMove: (state, { row, col }) => {
    // Reset the previous marked status
    if (state.player.action.marked)
      state.game.cells[state.player.action.markedCell.row][
        state.player.action.markedCell.col
      ].marked = false;
    var v = state.game.cells[row].slice(0);
    v[col].marked = true;
    Vue.set(state.game.cells, row, v);
    state.player.action.marked = true;
    state.player.action.markedCell = { row: row, col: col };
  },
  resetSelectAction: state => {
    if (!state.player.action.selected) return;
    const row = state.player.action.selectedCell.row;
    const col = state.player.action.selectedCell.col;
    markMovableCells(state, row, col, false);
    state.game.cells[row][col].selected = false;
    state.player.action.selected = false;
    state.player.action.selectedcell = { row: null, col: null };
  },
  resetMarkAction: state => {
    if (!state.player.action.marked) return;
    const row = state.player.action.markedCell.row;
    const col = state.player.action.markedCell.col;
    state.game.cells[row][col].marked = false;
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

    // Replace a marked cell to a selected cell
    // The validation should be done in advance
    const selectedTmp = state.game.cells[selectedRow][selectedCol].unit;
    const markedTmp = state.game.cells[markedRow][markedCol].unit;
    state.game.cells[markedRow][markedCol].unit = selectedTmp;
    state.game.cells[selectedRow][selectedCol].unit = markedTmp;
  }
};

const isUnitOwner = (state, row, col) => {
  const unitOwner = state.game.cells[row][col].unit.player;
  if (unitOwner != state.player.profile.name) {
    return false;
  } else {
    return true;
  }
};

const canDeployUnit = (state, row) => {
  if (state.game.status !== GAME_STATUS_PLAYING) {
    if (row < gamePresets[state.game.scale].deploymentArea) return false;
  }
  return true;
};

const isMovable = (state, row, col) => {
  if (state.game.status === GAME_STATUS_INIT) {
    if (canDeployUnit(state, row)) return true;
    else return false;
  }

  const x = row - state.player.action.selectedCell.row;
  const y = col - state.player.action.selectedCell.col;

  // A cell other than 9 directions is out of scope.
  if (Math.abs(x) !== Math.abs(y) && x !== 0 && y !== 0) return false;

  var distance = Math.round(Math.sqrt(x * x + y * y));
  if (Math.abs(x) === Math.abs(y)) distance = Math.abs(x);
  const sRow = state.player.action.selectedCell.row;
  const sCol = state.player.action.selectedCell.col;
  const moves = state.game.cells[sRow][sCol].unit.moves;
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
  }
  return true;
};

const markMovableCells = (state, row, col, mark) => {
  if (state.game.status === GAME_STATUS_INIT) {
    var area = gamePresets[state.game.scale].deploymentArea;
    var areaRow, areaCol;
    for (areaRow = area; areaRow < state.game.scale; areaRow++) {
      for (areaCol = 0; areaCol <= state.game.scale; areaCol++)
        markMovableCell(state, row, col, areaRow, areaCol, mark);
    }
    return;
  }

  const moves = state.game.cells[row][col].unit.moves;
  var direction, n;
  for (direction = 0; direction < moves.length; direction++) {
    var speed = moves[direction];
    if (direction === UPLEFT) {
      for (n = 1; n <= speed; n++)
        if (!markMovableCell(state, row, col, row - n, col - n, mark)) break;
    }
    if (direction === UP) {
      for (n = 1; n <= speed; n++)
        if (!markMovableCell(state, row, col, row - n, col, mark)) break;
    }
    if (direction === UPRIGHT) {
      for (n = 1; n <= speed; n++)
        if (!markMovableCell(state, row, col, row - n, col + n, mark)) break;
    }
    if (direction === LEFT) {
      for (n = 1; n <= speed; n++)
        if (!markMovableCell(state, row, col, row, col - n, mark)) break;
    }
    if (direction === RIGHT) {
      for (n = 1; n <= speed; n++)
        if (!markMovableCell(state, row, col, row, col + n, mark)) break;
    }
    if (direction === DOWNLEFT) {
      for (n = 1; n <= speed; n++)
        if (!markMovableCell(state, row, col, row + n, col - n, mark)) break;
    }
    if (direction === DOWN) {
      for (n = 1; n <= speed; n++)
        if (!markMovableCell(state, row, col, row + n, col, mark)) break;
    }
    if (direction === DOWNRIGHT) {
      for (n = 1; n <= speed; n++) {
        if (!markMovableCell(state, row, col, row + n, col + n, mark)) break;
      }
    }
  }
};

const markMovableCell = (state, fromRow, fromCol, toRow, toCol, mark) => {
  if (toRow < 0 || toCol < 0) return false;

  const scale = state.game.scale;
  if (toRow >= scale || toCol >= scale) return false;

  const fromCell = state.game.cells[fromRow][fromCol];
  const toCell = state.game.cells[toRow][toCol];
  if (
    state.game.status !== GAME_STATUS_INIT &&
    toCell.unit.player === fromCell.unit.player
  )
    return false;

  var tmp = state.game.cells[toRow].slice(0);
  tmp[toCol].movable = mark;
  Vue.set(state.game.cells, toRow, tmp);
  return true;
};

const GAME_STATUS_INIT = "initGame";
const GAME_STATUS_DEPLOYING = "deploying";
const GAME_STATUS_PLAYING = "playing";
const GAME_STATUS_END = "endGame";
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
  "3": {
    deploymentArea: 2,
    units: [
      { role: "", moves: [] },
      { role: "", moves: [] },
      { role: "", moves: [] },
      { role: "", moves: [] },
      { role: "", moves: [] },
      { role: "", moves: [] },
      { role: "unit", moves: [4, 4, 4, 4, "*", 3, 3, 3, 3] },
      { role: "king", moves: [1, 1, 1, 1, "*", 1, 1, 1, 1] },
      { role: "unit", moves: [0, 1, 0, 0, "*", 0, 0, 0, 0] }
    ]
  },
  "5": {
    deploymentArea: 3,
    units: [
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
  },
  "7": {
    deploymentArea: 4,
    units: [
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
      { role: "", moves: [] },
      { role: "", moves: [] },
      { role: "", moves: [] },
      { role: "", moves: [] },
      { role: "", moves: [] },
      { role: "", moves: [] },
      { role: "", moves: [] },
      { role: "", moves: [] },
      { role: "unit", moves: [3, 4, 2, 1, "*", 4, 2, 3, 1] },
      { role: "king", moves: [10, 10, 10, 10, "*", 10, 10, 10, 10] },
      { role: "king", moves: [5, 4, 3, 2, "*", 2, 4, 5, 3] },
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
      { role: "", moves: [] },
      { role: "unit", moves: [1, 0, 1, 0, "*", 0, 0, 0, 0] },
      { role: "unit", moves: [1, 1, 1, 0, "*", 0, 1, 0, 1] },
      { role: "unit", moves: [1, 1, 1, 1, "*", 1, 0, 1, 0] },
      { role: "king", moves: [1, 1, 1, 1, "*", 1, 1, 1, 1] },
      { role: "unit", moves: [1, 1, 1, 1, "*", 1, 0, 1, 0] },
      { role: "unit", moves: [1, 1, 1, 0, "*", 0, 1, 0, 1] },
      { role: "unit", moves: [1, 0, 1, 0, "*", 0, 0, 0, 0] }
    ]
  },
  "9": {
    deploymentArea: 6,
    units: [
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
      { role: "unit", moves: [0, 1, 0, 0, "*", 0, 0, 0, 0] },
      { role: "unit", moves: [0, 1, 0, 0, "*", 0, 0, 0, 0] },
      { role: "unit", moves: [0, 1, 0, 0, "*", 0, 0, 0, 0] },
      { role: "unit", moves: [0, 1, 0, 0, "*", 0, 0, 0, 0] },
      { role: "unit", moves: [0, 1, 0, 0, "*", 0, 0, 0, 0] },
      { role: "unit", moves: [0, 1, 0, 0, "*", 0, 0, 0, 0] },
      { role: "unit", moves: [0, 1, 0, 0, "*", 0, 0, 0, 0] },
      { role: "", moves: [] },
      { role: "unit", moves: [10, 0, 10, 0, "*", 0, 10, 0, 10] },
      { role: "", moves: [] },
      { role: "", moves: [] },
      { role: "", moves: [] },
      { role: "", moves: [] },
      { role: "", moves: [] },
      { role: "unit", moves: [0, 10, 0, 10, "*", 10, 0, 10, 0] },
      { role: "", moves: [] },
      { role: "unit", moves: [0, 10, 0, 0, "*", 0, 0, 0, 0] },
      { role: "unit", moves: [1, 0, 1, 0, "*", 0, 0, 0, 0] },
      { role: "unit", moves: [1, 1, 1, 0, "*", 0, 1, 0, 1] },
      { role: "unit", moves: [1, 1, 1, 1, "*", 1, 0, 1, 0] },
      { role: "king", moves: [1, 1, 1, 1, "*", 1, 1, 1, 1] },
      { role: "unit", moves: [1, 1, 1, 1, "*", 1, 0, 1, 0] },
      { role: "unit", moves: [1, 1, 1, 0, "*", 0, 1, 0, 1] },
      { role: "unit", moves: [1, 0, 1, 0, "*", 0, 0, 0, 0] },
      { role: "unit", moves: [0, 10, 0, 0, "*", 0, 0, 0, 0] }
    ]
  }
};
