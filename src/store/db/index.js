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
          marked: false
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
    const unitOwner = state.gameStatus.cells[row][col].unit.player;
    if (state.gameStatus.cells[row][col].selected) {
      commit("resetSelectAction");
      commit("resetMarkAction");
    } else if (!state.player.action.selected) {
      if (unitOwner != state.player.profile.name) {
        return;
      }
      commit("selectCell", { row, col });
    } else {
      if (unitOwner == state.player.profile.name) {
        return;
      }
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
    state.player.action.selected = true;
    state.player.action.selectedCell = { row: row, col: col };
  },
  markNextMove: (state, { row, col }) => {
    var v = state.gameStatus.cells[row].slice(0);
    // Reset the previous marked status
    if (state.player.action.marked)
      state.gameStatus.cells[state.player.action.markedCell.row][
        state.player.action.markedCell.col
      ].marked = false;
    v[col].marked = true;
    Vue.set(state.gameStatus.cells, row, v);
    state.player.action.marked = true;
    state.player.action.markedCell = { row: row, col: col };
  },
  resetSelectAction: state => {
    if (!state.player.action.selected) return;
    const row = state.player.action.selectedCell.row;
    const col = state.player.action.selectedCell.col;
    state.gameStatus.cells[row][col].selected = false;
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
    state.gameStatus.cells[markedRow][markedCol].unit =
      state.gameStatus.cells[selectedRow][selectedCol].unit;
    state.gameStatus.cells[selectedRow][selectedCol].unit = {
      player: "",
      role: "",
      moves: []
    };
  }
};

// Initial unit arrangement and move powers
// role: "", "unit" or "king"
// moves: upLeft, up, upRight, left, right, downLeft, down, downRigh
moves: [0, 1, 0, 0, "*", 0, 0, 0, 0];
export const gamePresets = {
  "3": [
    { role: "", moves: [] },
    { role: "", moves: [] },
    { role: "", moves: [] },
    { role: "", moves: [] },
    { role: "", moves: [] },
    { role: "", moves: [] },
    { role: "unit", moves: [0, 1, 0, 0, "*", 0, 0, 0, 0] },
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
    { role: "unit", moves: [0, 1, 0, 0, "*", 0, 0, 0, 0] },
    { role: "unit", moves: [0, 1, 0, 0, "*", 0, 0, 0, 0] },
    { role: "unit", moves: [0, 1, 0, 0, "*", 0, 0, 0, 0] },
    { role: "", moves: [] },
    { role: "unit", moves: [1, 1, 1, 1, "*", 1, 0, 1, 0] },
    { role: "king", moves: [1, 1, 1, 1, "*", 1, 1, 1, 1] },
    { role: "unit", moves: [1, 1, 1, 1, "*", 1, 0, 1, 0] },
    { role: "", moves: [] }
  ]
};
