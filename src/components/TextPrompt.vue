<template>
  <div class="d-flex justify-content-center">
    <div class="d-flex flex-row">
      <div class="inventory"></div>
      <div
        id="output"
        class="d-flex flex-column justify-content-end align-items-start bg-black"
      >
        <div v-for="text in texts" :key="text.id" class="screenText">
          {{ text }}
        </div>
        <div>
          <input
            type="text"
            class="form-control bg-black"
            id="textInput"
            v-model="input"
            @keydown.enter="addText(input)"
            @keydown.up="historyBack()"
            @keydown.down="historyForward()"
          />
        </div>
      </div>
      <div
        class="d-flex flex-column justify-content-start align-items-start bg-black inventory"
      >
        <div
          v-for="item in inventory"
          :key="item.id"
          id="inventorybox"
          class="screenText"
        >
          {{ item.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import world from "@/assets/world.js"; // Comprehensive game/state data
import structuredClone from "@ungap/structured-clone";

export default {
  components: {},
  data() {
    return {
      game: {}, // comprehensive, stateful game data. Game state can be saved by saving this object.
      location: null, // comprehensive location data. Most other local properties are references to children of this object.
      containers: [],
      enemies: [],
      shops: [],
      exits: [], // all exits for a location. Only those with visible=true are available.
      texts: [], // game text. Display lines of text by pushing to this array.
      inventory: [], // player inventory. Appears in its own window.
      input: "", // user input.
      history: [], // this and historyInd are used for saving user inputs and can be accessed with up/down arrows.
      historyInd: null,
      shorthand: {}, // a dictionary of accepted keyword shortenings.
      aliases: {}, // a dictionary of accepted aliases for keywords (see world file)
      allDirections: [], // a lits of all direction keywords used in the game, used to detect whether the user is trying to travel.
      ignored: [
        // Words that are automatically removed from user input.
        "on",
        "of",
        "over",
        "under",
        "underneath",
        "above",
        "below",
        "beneath",
        "into",
        "onto",
        "with",
        "across",
        "around",
        "as",
        "at",
        "beside",
        "between",
        "by",
        "from",
        "near",
        "past",
        "toward",
        "towards",
        "the",
        "some",
        "all",
        "my",
        "to",
      ],
    };
  },
  computed: {
    visibleExits() {
      // filtering by visible allows us to conditionally show exits
      return this.location.exits.filter((e) => e.visible === true);
    },
    items() {
      return this.getItemsListFromIds(this.location.items);
    },
  },
  mounted() {
    this.restart();
  },
  methods: {
    restart() {
      // reads game data and sets local fields
      this.game = structuredClone(world.game);
      this.inventory = this.loadStartingInventory();
      this.shorthand = this.game.shorthand;
      this.aliases = this.game.aliases;
      this.loadLocation(this.game.startingLocation);
    },
    loadStartingInventory() {
      // starting inventory structure: [{id: num, qty: num}, ...]
      let inv = [];
      for (let invObj of this.game.startingInventory) {
        const item = this.game.items.find((i) => i.id === invObj.id);
        if (item !== undefined) {
          [...Array(invObj.qty).keys()].forEach(() => inv.push(item));
        }
      }
      return inv;
    },
    loadLocation(locId) {
      // Loads stateful location data into local properties
      const location = this.game.locations.find((l) => l.id === locId);
      this.location = location;
      this.containers = location.containers;
      this.enemies = location.enemies;
      this.shops = location.shops;
      this.exits = this.visibleExits;
      this.getAllDirections();
      this.gameOver = this.location.gameOver;
      // save this location (locally) as the new startingLocation for save/load resume
      this.game.startingLocation = location.id;
      this.locationPrompt();
    },
    locationPrompt() {
      this.texts.push(`--- ${this.location.name} ---`);
      let locDesc = this.location.description;
      if (this.gameOver === false) {
        // print custom item game text
        for (let id of this.location.items) {
          const item = this.game.items.find((i) => i.id === id);
          if (item !== undefined) {
            locDesc += ` ${item.locationText}`;
          }
        }
      } else {
        locDesc += "\nPress enter to start over.";
      }
      this.texts.push(locDesc);
    },
    addText(text) {
      if (this.gameOver) {
        this.restart();
        return;
      }
      this.texts.push(`> ${text}`);
      this.history.push(text);
      this.parseInput(text);
      this.input = "";
    },
    textToArray(text) {
      return text
        .toLowerCase()
        .split(" ")
        .filter((w) => !this.ignored.includes(w) && w !== "");
    },
    getItemsListFromIds(ids) {
      return ids.map((id) => this.game.items.find((i) => i.id === id));
    },
    findItemInInput(text) {
      const lowerText = text.toLowerCase();
      const items = this.inventory.concat(this.items);
      for (const item of items) {
        for (const alias of item.aliases) {
          if (lowerText.includes(alias)) {
            return item;
          }
        }
      }
      return null;
    },
    parseInput(text) {
      // lol this is gonna be a huge function
      const inputArr = this.textToArray(text);
      let first = inputArr[0];
      const item = this.findItemInInput(text);

      // remove unnecessary verb
      if (["go", "travel", "move", "climb", "step", "walk"].includes(first)) {
        inputArr.shift();
        if (inputArr.length === 0) {
          this.texts.push("You need to specify a destination.");
          return;
        } else first = inputArr[0].toLowerCase();
      }

      // case: travel
      if (this.allDirections.includes(first)) {
        this.handleDirection(first);
      }

      // case: look
      else if (
        inputArr.length === 1 &&
        this.aliases.look.includes(inputArr[0])
      ) {
        this.locationPrompt();
      }

      // case: get item
      else if (this.aliases.get.includes(first)) {
        if (inputArr.length < 2) {
          this.texts.push(
            `Please specify what you'd like to ${this.aliases.get[0]}.`
          );
        } else this.handleGetItem(inputArr.slice(1).join(" "));
      }

      // case: drop item
      else if (this.aliases.drop.includes(first)) {
        if (inputArr.length < 2) {
          this.texts.push(
            `Please specify what you'd like to ${this.aliases.drop[0]}.`
          );
        } else this.handleDropItem(inputArr.slice(1).join(" "));
      }

      // case: examine item
      else if (this.aliases.examine.includes(first)) {
        if (!item) {
          this.texts.push(
            inputArr.length > 1
              ? "That item isn't here."
              : `Please specify what you'd like to ${this.aliases.examine[0]}.`
          );
        } else {
          this.texts.push(item.description);
        }
      }

      // case: put item in container
      else if (this.aliases.put.includes(first)) {
        if (inputArr.length < 2) {
          this.texts.push(
            `Please specify what you'd like to ${this.aliases.put[0]}.`
          );
        } else this.handlePutItem(inputArr.slice(1).join(" "));
      }

      // not recognized
      else {
        this.texts.push("That is not a recognized command.");
      }
    },
    handleDirection(dir) {
      const exit = this.exits.find(
        (e) => e.direction === dir || e.direction === this.shorthand[dir]
      );
      if (exit !== undefined) {
        // change current location
        this.loadLocation(exit.locationId);
      } else {
        this.texts.push("You can't go that way.");
      }
    },
    handleGetItem(itemName) {
      const item = this.findItemInLocation(itemName);
      if (item === undefined) {
        this.texts.push("That item isn't here.");
      } else {
        this.inventory.push(item);
        const ind = this.location.items.findIndex((i) => i.id === item.id);
        this.location.items.splice(ind, 1);
        this.texts.push(`${item.name} has been added to your inventory.`);
      }
    },
    findItemInLocation(itemName) {
      // get list of item objects given a list of item IDs
      let locItems = this.game.items.filter((i) =>
        this.location.items.includes(i.id)
      );
      // look for a match of any alias, handle success/failure appropriately
      return locItems.find((i) => i.aliases.includes(itemName));
    },
    findItemInInventory(itemName) {
      return this.inventory.find((i) =>
        i.aliases.includes(itemName.toLowerCase())
      );
    },
    handleDropItem(itemName) {
      const item = this.findItemInInventory(itemName);
      if (item === undefined) {
        this.texts.push("That item is not in your inventory.");
      } else {
        this.location.items.push(item.id);
        let ind = this.inventory.findIndex((i) => i.id === item.id);
        this.inventory.splice(ind, 1);
        this.texts.push(`${item.name} has been removed from your inventory.`);
        this.resolveCondition(item.id, null, this.location.id);
      }
    },
    handlePutItem(text) {
      const item = this.findItemInInventory(text.split(" ")[0]);
      const locContainers = this.game.containers.filter((c) =>
        this.containers.includes(c.id)
      );
      const container = locContainers?.filter((c) =>
        c.aliases.any((a) => text.includes(a))
      );
      if (
        locContainers === undefined ||
        container === undefined ||
        container === null ||
        item === undefined
      ) {
        this.texts.push("It looks like you can't put that there.");
      } else {
        for (let slot of container.slots) {
          if (slot.item === null && slot.acceptedItems.includes(item.id)) {
            slot.item = item.id;
            this.inventory.remove(item);
            this.texts.push(
              `You've placed ${item.name} in the ${container.name}.`
            );
            this.resolveCondition(item.id, container.id);
          }
        }
      }
    },
    getAllDirections() {
      // build set (so that we can ignore duplicates) of all direction keywords in the game
      let allDir = new Set();
      for (let loc of this.game.locations) {
        for (let exit of loc.exits) {
          allDir.add(exit.direction);
        }
      }
      // include accepted shorthand versions of direction keywords
      for (let [key, value] of Object.entries(this.shorthand)) {
        if (allDir.has(key) || allDir.has(value)) {
          allDir.add(key);
          allDir.add(value);
        }
      }
      // return set as an array
      this.allDirections = Array.from(allDir);
    },
    historyBack() {
      // move back one in user input history
      if (this.historyInd === null) this.historyInd = this.history.length;
      else if (this.historyInd === 0) return;
      this.historyInd--;
      this.input = this.history[this.historyInd];
    },
    historyForward() {
      // move forward one in user input history
      if (this.historyInd === null) return;
      else if (this.historyInd === this.history.length - 1) {
        this.historyInd = null;
        this.input = "";
      } else {
        this.historyInd++;
        this.input = this.history[this.historyInd];
      }
    },
    resolveCondition(itemId = null, containerId = null, locationId = null) {
      // look for a condition that matches the current game conditions
      const condition = this.game.conditions.find(
        (c) =>
          c.item === itemId &&
          c.container === containerId &&
          c.location === locationId
      );
      if (condition === undefined) return;
      // item in container
      if (itemId !== null && containerId !== null) {
        this.texts.push("Item in container condition not implemented yet.");
      }
      // item in location
      else if (itemId !== null && locationId !== null) {
        this.resolveItemInLocation(itemId, condition);
      }
      // item in player inventory
      else if (itemId !== null) {
        this.texts.push(
          "Item in player inventory condition not implemented yet."
        );
      }
      // container full
      if (containerId !== null) {
        this.texts.push("Container full condition not implemented yet.");
      }
    },
    resolveItemInLocation(itemId, condition) {
      // show text
      if (condition.text !== null) {
        this.texts.push(condition.text);
      }
      // check exits
      for (let exit of this.location.exits) {
        if (exit.condition === condition.id) {
          exit.visible = !exit.visible;
          exit.condition = null;
          this.exits = this.visibleExits;
        }
      }
      // check for deleteItemOnTrigger
      if (condition.deleteItemOnTrigger === true) {
        const itemInd = this.location.items.indexOf(itemId);
        this.location.items.splice(itemInd, 1);
      }
      // delete condition
      const conditionInd = this.game.conditions.findIndex(
        (c) => c.id === condition.id
      );
      this.game.conditions.splice(conditionInd, 1);
    },
  },
};
</script>

<style>
#textInput {
  width: 600px;
  margin: auto;
  color: rgb(0, 214, 0);
  border-radius: 0 0 5px 5px;
}

#textInput:focus {
  background-color: black;
}

.inventory {
  width: 200px;
  height: 400px;
  color: rgb(34, 137, 255);
  margin: 0 20px;
  border-radius: 5px;
}

#output {
  height: 600px;
  width: 600px;
  color: rgb(0, 214, 0);
  border-radius: 5px;
  overflow: auto;
}

.screenText {
  width: auto;
  text-align: left;
  margin-left: 6px;
  margin-top: 8px;
}

.bg-black {
  background-color: black;
}
</style>
