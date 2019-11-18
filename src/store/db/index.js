import { db } from "@/plugins/firebase";
import Vue from "vue";
import constants from "@/store/db/constants";

export const state = () => ({
  player: {
    turn: "",
    profile: {
      name: null
    },
    storage: {
      units: [],
      selectedUnitIndex: -1,
      speeds: 0
    }
  },
  opponent: {
    turn: "",
    profile: {
      name: null
    },
    storage: {
      units: [],
      selectedUnitIndex: -1,
      speeds: 0
    }
  },
  game: {
    status: constants.GAME_STATUS_INIT,
    scale: 0,
    cells: [],
    turn: constants.GAME_TURN_BLACK,
    playerInAction: {
      profile: {
        name: null
      },
      action: {
        turn: "", // "black" or "white"
        selected: false,
        selectedCell: { row: null, col: null },
        marked: false,
        markedCell: { row: null, col: null },
        unitConfigDialog: false,
        deploy: false,
        speedUp: { row: null, col: null, direction: null }
      },
      storage: {
        units: [],
        selectedUnitIndex: -1,
        speeds: 0
      }
    },
    playerNotInAction: {
      profile: {
        name: null
      },
      action: {
        turn: "", // "black" or "white"
        selected: false,
        selectedCell: { row: null, col: null },
        marked: false,
        markedCell: { row: null, col: null },
        unitConfigDialog: false,
        deploy: false,
        speedUp: { row: null, col: null, direction: null }
      },
      storage: {
        units: [],
        selectedUnitIndex: -1,
        speeds: 0
      }
    }
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
  },
  getUnitInStorageColor: state => index => {
    return state.game.playerInAction.storage.selectedUnitIndex === index
      ? "red"
      : "";
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
  initGame: async ({ commit }, { scale, turn }) => {
    // Decide which is "Black" and which is "White"
    // FIXME Receive opponent name
    commit("setOpponentProfile", "Player B");
    // FIXME randomize it
    commit("initGame", { scale: scale, turn: turn });
  },
  startGame: async ({ commit, state, dispatch }) => {
    dispatch("resetAction");

    var myDeployment = extractDeploymentFromMap(
      state.game.cells,
      state.game.scale
    );

    // Send my initial deployment as it is regardless of black/white
    // sendMyDeployment(myDeployment)

    // Receive opponent initial deployment
    // Always rotate the received deployment regardless of black/white
    const opponentDeployment = rotateCells(receiveOpponentDeployment(state));

    // Merge both deployments into one
    const mergedCells = mergeDeployments(
      myDeployment,
      opponentDeployment,
      state.game.scale,
      state.player.turn
    );

    commit("startGame", mergedCells);
  },
  takeTurn: async ({ commit }) => {
    commit("takeTurn");
  },
  selectUnitInStorage: async ({ commit }, index) => {
    commit("unselectUnitInStorage");
    commit("resetSelectAction");
    commit("resetMarkAction");
    commit("selectUnitInStorage", index);
  },
  resetAction: async ({ commit }) => {
    commit("resetSelectAction");
    commit("resetMarkAction");
  },
  updateCell: async ({ commit, state, dispatch }, { row, col }) => {
    if (state.game.playerInAction.action.deploy) {
      const numOfUnitsInStorage =
        state.game.playerInAction.storage.units.length;
      if (
        0 <
          state.game.playerInAction.storage.selectedUnitIndex <
          state.game.playerInAction.storage.units.length &&
        state.game.cells[row][col].movable
      ) {
        commit("dropUnit", { row, col });
        commit("takeTurn");
      }
      commit("resetSelectAction");
      commit("resetMarkAction");
      commit("unmarkDeployCells");
      commit("unselectUnitInStorage");
      if (
        state.game.playerInAction.storage.units.length !== numOfUnitsInStorage
      ) {
        return;
      }
    }

    if (state.game.cells[row][col].selected) {
      commit("resetSelectAction");
      commit("resetMarkAction");
      commit("setUnitConfigDialog", { toggle: true });
    } else if (state.game.cells[row][col].marked) {
      dispatch("moveUnit");
    } else if (!state.game.playerInAction.action.selected) {
      if (isUnitOwner(state, row, col)) {
        commit("selectCell", { row, col });
      }
    } else if (state.game.playerInAction.action.selected) {
      if (isUnitOwner(state, row, col)) {
        if (state.game.status === constants.GAME_STATUS_INIT) {
          if (isMovable(state, row, col) === true) {
            commit("markNextMove", { row, col });
            dispatch("moveUnit");
          }
        } else {
          commit("resetSelectAction");
          commit("resetMarkAction");
          commit("selectCell", { row, col });
        }
      } else {
        if (isMovable(state, row, col) === true) {
          if (state.game.cells[row][col].unit.role === constants.PIECE_KING) {
            commit("endGame");
            console.log(
              `${state.game.playerInAction.profile.name} won the game!`
            );
          }
          if (isOpponentUnit(state, row, col)) commit("takeUnit", { row, col });
          commit("markNextMove", { row, col });
          dispatch("moveUnit");
          commit("takeTurn");
        }
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
  },
  increaseSpeed: async ({ commit, state }, { row, col, direction }) => {
    if (state.game.cells[row][col].unit.role === constants.PIECE_KING) return;
    if (state.game.playerInAction.storage.speeds > 0) {
      commit("increaseSpeed", { row, col, direction });
    }
  },
  decreaseSpeed: async ({ commit, state }, { row, col, direction }) => {
    if (state.game.cells[row][col].unit.role === constants.PIECE_KING) return;
    if (state.game.cells[row][col].unit.moves[direction] > 0) {
      commit("decreaseSpeed", { row, col, direction });
    }
  },
  cancelSpeedUp: async ({ state, dispatch }, { row, col }) => {
    if (
      state.game.playerInAction.action.speedUp.row === row &&
      state.game.playerInAction.action.speedUp.col === col
    ) {
      dispatch("decreaseSpeed", {
        row: row,
        col: col,
        direction: state.game.playerInAction.action.speedUp.direction
      });
    }
  }
};

export const mutations = {
  setPlayer: (state, playerInfo) => {
    state.player.profile = playerInfo;
  },
  setOpponentProfile: (state, name) => {
    state.opponent.profile.name = name;
  },
  setUnitConfigDialog: (state, { toggle }) => {
    state.game.playerInAction.action.unitConfigDialog = toggle;
  },
  initGame: (state, { scale, turn }) => {
    state.game.turn = constants.GAME_TURN_BLACK;
    state.game.scale = scale;
    state.game.status = constants.GAME_STATUS_INIT;
    const cells = generateGameMap(scale, state.player.profile.name, turn);
    Vue.set(state.game, "cells", cells);
    // FIXME: Turn must be decided in advance
    state.player.turn = constants.GAME_TURN_BLACK;
    state.opponent.turn = constants.GAME_TURN_WHITE;
    initializePlayerActionStatus(state, turn);
    state.player.storage = {
      units: [],
      selectedUnitIndex: -1,
      speeds: 10
    };
    state.opponent.storage = {
      units: [],
      selectedUnitIndex: -1,
      speeds: 10
    };
  },
  startGame: (state, mergedCells) => {
    state.game.cells = JSON.parse(JSON.stringify(mergedCells));
    state.game.status = constants.GAME_STATUS_PLAYING;
  },
  takeTurn: state => {
    if (state.game.status === constants.GAME_STATUS_PLAYING) {
      state.game.turn =
        state.game.turn === constants.GAME_TURN_BLACK
          ? constants.GAME_TURN_WHITE
          : constants.GAME_TURN_BLACK;
      initializePlayerActionStatus(state);
    }
  },
  selectUnitInStorage: (state, index) => {
    state.game.playerInAction.action.deploy = true;
    state.game.playerInAction.storage.selectedUnitIndex = index;
    markDeployCells(state);
  },
  unselectUnitInStorage: state => {
    state.game.playerInAction.action.deploy = false;
    state.game.playerInAction.storage.selectedUnitIndex = -1;
  },
  unmarkDeployCells: state => {
    unmarkDeployCells(state);
    state.game.playerInAction.action.deploy = false;
  },
  dropUnit: (state, { row, col }) => {
    // Drop a unit in the storage to a selected cell
    // The validation should be done in advance
    const selectedUnit =
      state.game.playerInAction.storage.units[
        state.game.playerInAction.storage.selectedUnitIndex
      ];
    state.game.cells[row][col].unit = selectedUnit;
    removeUnitInStorage(state.game.playerInAction.storage.units, selectedUnit);
    state.game.cells[row][col].selected = false;
    state.game.cells[row][col].marked = false;
    state.game.cells[row][col].movable = false;

    // reset deploy action status
    unmarkDeployCells(state);
    state.game.playerInAction.storage.selectedUnitIndex = -1;
  },
  endGame: state => {
    state.game.status = constants.GAME_STATUS_END;
  },
  selectCell: (state, { row, col }) => {
    var v = state.game.cells[row].slice(0);
    v[col].selected = true;
    Vue.set(state.game.cells, row, v);
    markMovableCells(state, row, col, true);
    state.game.playerInAction.action.selected = true;
    state.game.playerInAction.action.selectedCell = { row: row, col: col };
  },
  markNextMove: (state, { row, col }) => {
    // Reset the previous marked status
    if (state.game.playerInAction.action.marked) {
      state.game.cells[state.game.playerInAction.action.markedCell.row][
        state.game.playerInAction.action.markedCell.col
      ].marked = false;
    }
    var v = state.game.cells[row].slice(0);
    v[col].marked = true;
    Vue.set(state.game.cells, row, v);
    state.game.playerInAction.action.marked = true;
    state.game.playerInAction.action.markedCell = { row: row, col: col };
  },
  resetSelectAction: state => {
    if (!state.game.playerInAction.action.selected) return;
    const row = state.game.playerInAction.action.selectedCell.row;
    const col = state.game.playerInAction.action.selectedCell.col;
    markMovableCells(state, row, col, false);
    state.game.cells[row][col].selected = false;
    state.game.playerInAction.action.selected = false;
    state.game.playerInAction.action.selectedCell = { row: null, col: null };
  },
  resetMarkAction: state => {
    if (!state.game.playerInAction.action.marked) return;
    const row = state.game.playerInAction.action.markedCell.row;
    const col = state.game.playerInAction.action.markedCell.col;
    state.game.cells[row][col].marked = false;
    state.game.playerInAction.action.marked = false;
    state.game.playerInAction.action.markedCell = { row: null, col: null };
  },
  takeUnit: (state, { row, col }) => {
    var cell = state.game.cells[row].slice(0);
    cell[col].unit.player = state.game.playerInAction.profile.name;
    state.game.playerInAction.storage.units.push(cell[col].unit);
    cell[col].unit = {
      player: "",
      role: "",
      moves: []
    };
    Vue.set(state.game.cells, row, cell);
  },
  moveUnit: state => {
    const selectedRow = state.game.playerInAction.action.selectedCell.row;
    const selectedCol = state.game.playerInAction.action.selectedCell.col;
    const markedRow = state.game.playerInAction.action.markedCell.row;
    const markedCol = state.game.playerInAction.action.markedCell.col;

    // Reset movable marks before moving a selected unit
    markMovableCells(state, selectedRow, selectedCol, false);

    // Replace a unit in the marked cell to a selected cell
    // The validation should be done in advance
    const selectedTmp = state.game.cells[selectedRow][selectedCol].unit;
    const markedTmp = state.game.cells[markedRow][markedCol].unit;
    state.game.cells[markedRow][markedCol].unit = selectedTmp;
    state.game.cells[selectedRow][selectedCol].unit = markedTmp;
  },
  increaseSpeed: (state, { row, col, direction }) => {
    if (state.game.status === constants.GAME_STATUS_PLAYING) {
      if (
        state.game.playerInAction.action.speedUp.row == null &&
        state.game.playerInAction.action.speedUp.col == null &&
        state.game.playerInAction.action.speedUp.direction == null
      ) {
        state.game.playerInAction.action.speedUp = { row, col, direction };
      } else {
        return;
      }
    }
    var cell = state.game.cells[row].slice(0);
    const speed = cell[col].unit.moves[direction];
    Vue.set(cell[col].unit.moves, direction, speed + 1);
    Vue.set(state.game.cells, row, cell);
    state.game.playerInAction.storage.speeds--;
  },
  decreaseSpeed: (state, { row, col, direction }) => {
    if (state.game.status === constants.GAME_STATUS_PLAYING) {
      if (
        state.game.playerInAction.action.speedUp.row === row &&
        state.game.playerInAction.action.speedUp.col === col &&
        state.game.playerInAction.action.speedUp.direction === direction
      ) {
        state.game.playerInAction.action.speedUp = {
          row: null,
          col: null,
          direction: null
        };
      } else {
        return;
      }
    }
    var cell = state.game.cells[row].slice(0);
    const speed = cell[col].unit.moves[direction];
    Vue.set(cell[col].unit.moves, direction, speed - 1);
    Vue.set(state.game.cells, row, cell);
    state.game.playerInAction.storage.speeds++;
  }
};

const generateGameMap = (scale, playerName, turn) => {
  var cells = [];
  var row, col;
  for (row = 0; row < scale; row++) {
    cells[row] = [];
    for (col = 0; col < scale; col++) {
      // Rotate the game board by 180 degree for "White" at data level
      if (turn === constants.GAME_TURN_BLACK) {
        var position = { row: row, col: col };
      } else if (turn === constants.GAME_TURN_WHITE) {
        var position = { row: scale - 1 - row, col: scale - 1 - col };
      }
      // Initialize data schema of each cell
      cells[row][col] = JSON.parse(
        JSON.stringify({
          position: position,
          unit: {
            player: constants.gamePresets[scale].units[row * scale + col].role
              ? playerName
              : "",
            role: constants.gamePresets[scale].units[row * scale + col].role,
            moves: constants.gamePresets[scale].units[row * scale + col].moves
          },
          selected: false,
          marked: false,
          movable: false
        })
      );
    }
  }
  return cells;
};

const initializePlayerActionStatus = state => {
  state.game.playerInAction.action = JSON.parse(
    JSON.stringify({
      turn: state.game.turn,
      selected: false,
      selectedCell: { row: null, col: null },
      marked: false,
      markedCell: { row: null, col: null },
      unitConfigDialog: false,
      deploy: false,
      speedUp: { row: null, col: null, direction: null }
    })
  );
  state.game.playerNotInAction.action = JSON.parse(
    JSON.stringify({
      turn:
        state.game.turn === constants.GAME_TURN_BLACK
          ? constants.GAME_TURN_WHITE
          : constants.GAME_TURN_BLACK,
      selected: false,
      selectedCell: { row: null, col: null },
      marked: false,
      markedCell: { row: null, col: null },
      unitConfigDialog: false,
      deploy: false,
      speedUp: { row: null, col: null, direction: null }
    })
  );
  setPlayerProfileInAction(state);
  setPlayerStorageInAction(state);
};

const setPlayerProfileInAction = state => {
  state.game.playerInAction.profile =
    state.game.turn === state.player.turn
      ? state.player.profile
      : state.opponent.profile;
  state.game.playerNotInAction.profile =
    state.game.turn === state.player.turn
      ? state.opponent.profile
      : state.player.profile;
};

const setPlayerStorageInAction = state => {
  state.game.playerInAction.storage =
    state.game.turn === state.player.turn
      ? state.player.storage
      : state.opponent.storage;
  state.game.playerNotInAction.storage =
    state.game.turn === state.player.turn
      ? state.opponent.storage
      : state.player.storage;
};

const isUnitOwner = (state, row, col) => {
  const unitOwner = state.game.cells[row][col].unit.player;
  return unitOwner === state.game.playerInAction.profile.name ? true : false;
};

const isOpponentUnit = (state, row, col) => {
  const unitOwner = state.game.cells[row][col].unit.player;
  return unitOwner === state.game.playerNotInAction.profile.name ? true : false;
};

const canDeployUnit = (state, row) => {
  if (state.game.status !== constants.GAME_STATUS_PLAYING) {
    if (row < constants.gamePresets[state.game.scale].deploymentArea)
      return false;
  }
  return true;
};

const isMovable = (state, row, col) => {
  // Trust movable flag on a cell
  if (!state.game.cells[row][col].movable) return false;

  if (state.game.status === constants.GAME_STATUS_INIT) {
    if (canDeployUnit(state, row)) return true;
    else return false;
  }

  const x = row - state.game.playerInAction.action.selectedCell.row;
  const y = col - state.game.playerInAction.action.selectedCell.col;

  // A cell other than 9 directions is out of scope.
  if (Math.abs(x) !== Math.abs(y) && x !== 0 && y !== 0) return false;

  var distance = Math.round(Math.sqrt(x * x + y * y));
  if (Math.abs(x) === Math.abs(y)) distance = Math.abs(x);
  const sRow = state.game.playerInAction.action.selectedCell.row;
  const sCol = state.game.playerInAction.action.selectedCell.col;
  const moves = state.game.cells[sRow][sCol].unit.moves;
  if (x < 0 && y < 0) {
    if (distance > moves[constants.UPLEFT]) return false;
  } else if (x < 0 && y === 0) {
    if (distance > moves[constants.UP]) return false;
  } else if (x < 0 && 0 < y) {
    if (distance > moves[constants.UPRIGHT]) return false;
  } else if (x === 0 && y < 0) {
    if (distance > moves[constants.LEFT]) return false;
  } else if (x === 0 && y === 0) {
    if (distance > moves[constants.CENTER]) return false;
  } else if (x === 0 && 0 < y) {
    if (distance > moves[constants.RIGHT]) return false;
  } else if (0 < x && y < 0) {
    if (distance > moves[constants.DOWNLEFT]) return false;
  } else if (0 < x && y === 0) {
    if (distance > moves[constants.DOWN]) return false;
  } else if (0 < x && 0 < y) {
    if (distance > moves[constants.DOWNRIGHT]) return false;
  }
  return true;
};

const markDeployCells = state => {
  for (var areaRow = 0; areaRow < state.game.scale; areaRow++) {
    for (var areaCol = 0; areaCol <= state.game.scale; areaCol++) {
      markMovableCell(state, 0, 0, areaRow, areaCol, true);
    }
  }
};

const unmarkDeployCells = state => {
  for (var areaRow = 0; areaRow < state.game.scale; areaRow++) {
    for (var areaCol = 0; areaCol <= state.game.scale; areaCol++) {
      markMovableCell(state, 0, 0, areaRow, areaCol, false);
    }
  }
};

const removeUnitInStorage = (array, element) => {
  var index = array.indexOf(element);
  if (index > -1) {
    array.splice(index, 1);
  }
};

const markMovableCells = (state, row, col, mark) => {
  if (state.game.status === constants.GAME_STATUS_INIT) {
    var area = constants.gamePresets[state.game.scale].deploymentArea;
    var areaRow, areaCol;
    for (areaRow = area; areaRow < state.game.scale; areaRow++) {
      for (areaCol = 0; areaCol <= state.game.scale; areaCol++) {
        markMovableCell(state, row, col, areaRow, areaCol, mark);
      }
    }
    return;
  }

  const moves = state.game.cells[row][col].unit.moves;
  var direction, n;
  for (direction = 0; direction < moves.length; direction++) {
    var speed = moves[direction];
    var rst = {};
    var cellPlayer = "";
    if (direction === constants.UPLEFT) {
      for (n = 1; n <= speed; n++) {
        rst = markMovableCell(state, row, col, row - n, col - n, mark);
        if (!rst.marked) break;
        cellPlayer = rst.markedCell.unit.player;
        if (
          mark === true &&
          markedOpponentUnit(cellPlayer, state.game.playerNotInAction)
        )
          break;
      }
    }
    if (direction === constants.UP) {
      for (n = 1; n <= speed; n++) {
        rst = markMovableCell(state, row, col, row - n, col, mark);
        if (!rst.marked) break;
        cellPlayer = rst.markedCell.unit.player;
        if (
          mark === true &&
          markedOpponentUnit(cellPlayer, state.game.playerNotInAction)
        )
          break;
      }
    }
    if (direction === constants.UPRIGHT) {
      for (n = 1; n <= speed; n++) {
        rst = markMovableCell(state, row, col, row - n, col + n, mark);
        if (!rst.marked) break;
        cellPlayer = rst.markedCell.unit.player;
        if (
          mark === true &&
          markedOpponentUnit(cellPlayer, state.game.playerNotInAction)
        )
          break;
      }
    }
    if (direction === constants.LEFT) {
      for (n = 1; n <= speed; n++) {
        rst = markMovableCell(state, row, col, row, col - n, mark);
        if (!rst.marked) break;
        cellPlayer = rst.markedCell.unit.player;
        if (
          mark === true &&
          markedOpponentUnit(cellPlayer, state.game.playerNotInAction)
        )
          break;
      }
    }
    if (direction === constants.RIGHT) {
      for (n = 1; n <= speed; n++) {
        rst = markMovableCell(state, row, col, row, col + n, mark);
        if (!rst.marked) break;
        cellPlayer = rst.markedCell.unit.player;
        if (
          mark === true &&
          markedOpponentUnit(cellPlayer, state.game.playerNotInAction)
        )
          break;
      }
    }
    if (direction === constants.DOWNLEFT) {
      for (n = 1; n <= speed; n++) {
        rst = markMovableCell(state, row, col, row + n, col - n, mark);
        if (!rst.marked) break;
        cellPlayer = rst.markedCell.unit.player;
        if (
          mark === true &&
          markedOpponentUnit(cellPlayer, state.game.playerNotInAction)
        )
          break;
      }
    }
    if (direction === constants.DOWN) {
      for (n = 1; n <= speed; n++) {
        rst = markMovableCell(state, row, col, row + n, col, mark);
        if (!rst.marked) break;
        cellPlayer = rst.markedCell.unit.player;
        if (
          mark === true &&
          markedOpponentUnit(cellPlayer, state.game.playerNotInAction)
        )
          break;
      }
    }
    if (direction === constants.DOWNRIGHT) {
      for (n = 1; n <= speed; n++) {
        rst = markMovableCell(state, row, col, row + n, col + n, mark);
        if (!rst.marked) break;
        cellPlayer = rst.markedCell.unit.player;
        if (
          mark === true &&
          markedOpponentUnit(cellPlayer, state.game.playerNotInAction)
        )
          break;
      }
    }
  }
};

const markMovableCell = (state, fromRow, fromCol, toRow, toCol, mark) => {
  if (toRow < 0 || toCol < 0) return { markedCell: {}, marked: false };

  const scale = state.game.scale;
  if (toRow >= scale || toCol >= scale)
    return { markedCell: {}, marked: false };

  const fromCell = state.game.cells[fromRow][fromCol];
  const toCell = state.game.cells[toRow][toCol];
  if (
    !state.game.playerInAction.action.deploy &&
    state.game.status !== constants.GAME_STATUS_INIT &&
    toCell.unit.player === fromCell.unit.player
  ) {
    return { markedCell: {}, marked: false };
  }

  if (
    state.game.playerInAction.action.deploy &&
    (toCell.unit.player === state.game.playerNotInAction.profile.name ||
      toCell.unit.player === state.game.playerNotInAction.profile.name)
  ) {
    return { markedCell: {}, marked: false };
  }

  var tmp = state.game.cells[toRow].slice(0);
  tmp[toCol].movable = mark;
  Vue.set(state.game.cells, toRow, tmp);
  return { markedCell: toCell, marked: true };
};

const rotateCells = originalCells => {
  var rotatedCells = [];
  for (var row = 0, i = originalCells.length - 1; i >= 0; i--, row++) {
    rotatedCells[row] = [];
    for (var col = 0, j = originalCells[row].length - 1; j >= 0; j--, col++) {
      rotatedCells[row][col] = originalCells[i][j];
    }
  }
  return rotatedCells;
};

const mergeDeployments = (myDeployment, opponentDeployment, scale, turn) => {
  var cells = [];
  const area = constants.gamePresets[scale].deploymentArea;
  for (var row = 0; row < scale; row++) {
    if (row < scale - area) {
      cells[row] = JSON.parse(JSON.stringify(opponentDeployment[row]));
    } else if (row >= area) {
      cells[row] = JSON.parse(JSON.stringify(myDeployment[row - area]));
    } else {
      cells[row] = [];
      for (var col = 0; col < scale; col++) {
        cells[row][col] = getEmptyCell(row, col, scale, turn);
      }
    }
  }
  return cells;
};

const extractDeploymentFromMap = (cells, scale) => {
  var deployment = [];
  const area = constants.gamePresets[scale].deploymentArea;
  for (var i = 0, row = area; row < scale; i++, row++) {
    deployment[i] = cells[row].slice(0);
  }
  return deployment;
};

const getEmptyCell = (row, col, scale, turn) => {
  // Rotate a cell by 180 degree for "White" at data level
  if (turn === constants.GAME_TURN_BLACK) {
    var position = { row: row, col: col };
  } else if (turn === constants.GAME_TURN_WHITE) {
    var position = { row: scale - 1 - row, col: scale - 1 - col };
  }
  return {
    position: position,
    unit: {
      player: "",
      role: "",
      moves: []
    },
    selected: false,
    marked: false,
    movable: false
  };
};

const receiveOpponentDeployment = state => {
  var opponentTurn = constants.GAME_TURN_WHITE;
  if (state.player.turn === constants.GAME_TURN_WHITE) {
    opponentTurn = constants.GAME_TURN_BLACK;
  }
  const tmpCells = generateGameMap(
    state.game.scale,
    state.opponent.profile.name,
    opponentTurn
  );
  const opponentDeployment = extractDeploymentFromMap(
    tmpCells,
    state.game.scale
  );

  return opponentDeployment;
};

const markedOpponentUnit = (cellPlayer, opponentPlayerName) => {
  if (cellPlayer === opponentPlayerName) return true;
  else return false;
};
