import { db } from "@/plugins/firebase";
import Vue from "vue";
export const state = () => ({
  player: {
    name: null,
    action: {
      selected: false,
      marked: false
    }
  },
  gameStatus: {
    scale: 0,
    cells: []
  }
});

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
  initGame: async ({ commit }, scale) => {
    var cells = [];
    var row, col;
    for (row = 0; row < scale; row++) {
      cells[row] = [];
      for (col = 0; col < scale; col++) {
        cells[row][col] = {
          position: `row:${row}, col:${col}`,
          selected: false,
          marked: false
        };
      }
    }
    commit("initGame", { scale, cells });
  },
  updateCell: async ({ commit, state }, { row, col }) => {
    if (state.player.action.selected && state.player.action.marked) {
      commit("resetAction");
    }

    if (!state.player.action.selected) {
      commit("selectCell", { row, col });
    } else if (!state.player.action.marked) {
      commit("markNextMove", { row, col });
    }
  }
};

export const mutations = {
  setPlayer: (state, playerInfo) => {
    state.player.name = playerInfo;
  },
  initGame: (state, { scale, cells }) => {
    Vue.set(state.gameStatus, "cells", cells);
    state.gameStatus.scale = scale;
  },
  selectCell: (state, { row, col }) => {
    var v = state.gameStatus.cells[row].slice(0);
    v[col].selected = true;
    Vue.set(state.gameStatus.cells, row, v);
    state.player.action.selected = true;
  },
  markNextMove: (state, { row, col }) => {
    var v = state.gameStatus.cells[row].slice(0);
    v[col].marked = true;
    Vue.set(state.gameStatus.cells, row, v);
    state.player.action.marked = true;
  },
  resetAction: state => {
    state.player.action.selected = false;
    state.player.action.marked = false;
  }
};
