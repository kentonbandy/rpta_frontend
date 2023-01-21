<template>
  <div class="d-flex justify-content-center">
    <div class="d-flex flex-row">
      <div class="inventory"></div>
      <div
        id="output"
        class="
          d-flex
          flex-column
          justify-content-end
          align-items-start
          bg-black
        "
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
            @keydown.enter="addText(input, inputContext)"
            @keydown.up="historyBack()"
            @keydown.down="historyForward()"
          />
        </div>
      </div>
      <div
        class="
          d-flex
          flex-column
          justify-content-start
          align-items-start
          bg-black
          inventory
        "
      >
        <div id="inventory-title">Player Inventory</div>
        <div class="inventoryText">
          <div>Item</div>
          <div>Qty</div>
        </div>
        <div
          v-for="item in inventory"
          :key="item.id"
          id="inventorybox"
          class="inventoryText"
        >
          <div>{{ item.item.name }}</div>
          <div>{{ item.qty }}</div>
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
      exits: [], // all exits for a location. Only those with visible=true are available.
      texts: [], // game text. Display lines of text by pushing to this array.
      inventory: [], // player inventory. Appears in its own window.
      playerCurrency: 0,
      input: "", // user input.
      inputContext: null,
      activeNpc: null,
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
    npcs() {
      return this.game.nonPlayerCharacters.filter((c) =>
        this.location.npcs.includes(c.id)
      );
    },
    shopItems() {
      if (this.context !== "shop" || this.activeNpc?.type !== "shop") {
        return [];
      }

      const itemList = [];
      for (const i of this.activeNpc.items) {
        itemList.push({
          item: this.game.items.find((gi) => gi.id === i.id),
          qty: i.qty,
        });
      }

      return itemList;
    },
    inventoryItems() {
      return this.inventory.map((i) => i.item);
    },
    locationItemIds() {
      return this.location.items.map((i) => i.id);
    },
    locationItems() {
      return this.location.items.map(i => {
        const item = this.game.items.find(it => it.id === i.id);
        return {item: item, qty: i.qty}
      });
    }
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
          inv.push({ item: item, qty: invObj.qty });
        }
      }
      return inv;
    },
    loadLocation(locId) {
      // Loads stateful location data into local properties
      this.location = this.game.locations.find((l) => l.id === locId);
      this.containers = location.containers;
      this.enemies = location.enemies;
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
        for (const itemObj of this.locationItems) {
          locDesc += ` ${itemObj.item.locationText}`;
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
      const locationitemObjs = this.locationItems.map((i) => i.item);
      const items = this.inventoryItems.concat(locationitemObjs);
      for (const item of items) {
        for (const alias of item.aliases) {
          if (lowerText.includes(alias)) {
            return item;
          }
        }
      }
      return null;
    },
    parseInput(text, context = null) {
      // lol this is gonna be a huge function
      const inputArr = this.textToArray(text);
      let first = inputArr[0].toLowerCase();
      const item = this.findItemInInput(text);

      // remove unnecessary verb
      if (["go", "travel", "move", "climb", "step", "walk"].includes(first)) {
        inputArr.shift();
        if (inputArr.length === 0) {
          this.texts.push("You need to specify a destination.");
          return;
        } else first = inputArr[0].toLowerCase();
      }

      // check for context
      if (context !== null) {
        this.parseContext(context, inputArr, first, item);
        return;
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
        } else this.handleGetItemFromLocation(inputArr.slice(1).join(" "));
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

      // case: talk to npc
      else if (this.aliases.talk.includes(first)) {
        if (inputArr.length < 2) {
          this.texts.push(
            `Please specify who you'd like to ${this.aliases.talk[0]} to.`
          );
        } else this.handleTalk(inputArr.slice(1));
      }

      // not recognized
      else {
        this.texts.push("That is not a recognized command.");
      }
    },
    parseContext(context, inputArr, first, item) {
      // run parse function based on context (shop, battle, etc).
      if (context === "shop") this.parseShopInput(inputArr, first, item);
    },
    parseShopInput(first, item) {
      const shopBuyAliases = ["buy", "purchase", "get"];
      const shopSellAliases = ["sell"];
      const shopLeaveAliases = ["leave", "done", "quit"];

      if (shopLeaveAliases.includes(first)) {
        return;
      } else if (!item) {
        this.texts.push("Please specify an item.");
      }
      item = this.shopItems.find((i) => i.item.id === item.id);
      if (item === undefined) {
        this.texts.push("That item isn't here.");
      } else if (shopBuyAliases.includes(first)) {
        if (this.playerCurrency < item.item.price) {
          this.texts.push(
            `You don't have enough ${this.game.currencyTerms.generic}.`
          );
          return;
        }
        this.playerCurrency -= item.item.price;
        this.activeNpc.currency += item.item.price;
        item.qty -= 1;
        // add item to inventory
      } else if (shopSellAliases.includes(first)) {
        // do more stuff
      } else {
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
    handleGetItemFromLocation(itemName) {
      const item = this.findItemInLocation(itemName);
      if (item === undefined) {
        this.texts.push("That item isn't here.");
      } else {
        this.addItemToInventory(item);
        this.removeItemFromLocation(item);
        this.texts.push(`${item.name} has been added to your inventory.`);
      }
    },
    addItemToInventory(item, qty = 1) {
      const entryInd = this.inventory.findIndex((e) => e.item.id == item.id);
      if (entryInd !== -1) {
        this.inventory[entryInd].qty++;
      } else {
        this.inventory.push({ item: item, qty: qty });
      }
    },
    findItemInLocation(itemName) {
      // get list of item objects given a list of item IDs
      let locItems = this.locationItems.map(i => i.item);
      // look for a match of any alias, handle success/failure appropriately
      return locItems.find((i) => i.aliases.includes(itemName));
    },
    removeItemFromLocation(item, qty = 1) {
      const ind = this.location.items.findIndex((i) => i.id == item.id);

      if (ind === -1) {
        throw new Error("Item does not exist at location.");
      }
      const locQty = this.location.items[ind].qty;
      if (locQty < qty) {
        throw new Error ("Removal quantity is greater than item quantity at location");
      } else if (locQty === qty) {
        this.location.items.splice(ind, 1);
      } else {
        this.location.items[ind].qty -= qty;
      }
    },
    addItemToLocation(item, qty = 1) {
      const ind = this.location.items.findIndex((i) => i.id === item.id);
      
      if (ind === -1) {
        this.location.items.push({id: item.id, qty: qty});
      } else {
        this.location.items[ind].qty += qty;
      }
    },
    findItemInInventory(itemName) {
      return this.inventory.find((e) =>
        e.item.aliases.includes(itemName.toLowerCase())
      )?.item;
    },
    handleDropItem(itemName) {
      const item = this.findItemInInventory(itemName);
      if (item === undefined) {
        this.texts.push("That item is not in your inventory.");
      } else {
        this.addItemToLocation(item);
        this.removeItemFromInventory(item);
        this.texts.push(`${item.name} has been removed from your inventory.`);
        this.resolveCondition(item.id, null, this.location.id);
      }
    },
    removeItemFromInventory(item, qty = 1) {
      const entryInd = this.inventory.findIndex((e) => e.item.id == item.id);
      if (entryInd === -1) {
        throw new Error("Item was not found in inventory.");
      } else if (this.inventory[entryInd].qty < qty) {
        throw new Error("Insufficient qty of that item");
      } else if (this.inventory[entryInd].qty === qty) {
        this.inventory.splice(entryInd, 1);
      } else {
        this.inventory[entryInd].qty -= qty;
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
            this.removeItemFromInventory(item);
            this.texts.push(
              `You've placed ${item.name} in the ${container.name}.`
            );
            this.resolveCondition(item.id, container.id);
          }
        }
      }
    },
    handleTalk(inputArr) {
      // match word in inputArr with npc
      let npc = this.findNpc(inputArr);
      if (!npc) {
        this.texts.push("That person isn't here.");
        return;
      }
      // initiate conversation with npc
      if (npc.type === "shop") {
        // need to eventually have constants or enum for npc types
        this.shop(npc);
      }
      // ...more npc types
    },
    shop(npc) {
      // initiate shop context
      this.texts.push(this.getRandomElement(npc.greetings));
      this.context = "shop";
      this.activeNpc = npc;
      this.displayShopItems();
    },
    findNpc(inputArr) {
      for (let npc of this.npcs) {
        for (let alias of npc.aliases) {
          if (inputArr.includes(alias)) {
            return npc;
          }
        }
      }
      return null;
    },
    displayShopItems() {
      const topLine = this.addShopItemLine("Item", "Price", "Qty");
      this.texts.push(topLine);
      for (const itemObj of this.shopItems) {
        const shopLine = this.addShopItemLine(
          itemObj.item.name,
          itemObj.item.price,
          itemObj.qty
        );
        this.texts.push(shopLine);
      }
    },
    addShopItemLine(itemName, price, qty) {
      // hardcoded for now, but these parameters should be customizeable via some kind of configuration
      const nameWidth = 16;
      const priceWidth = 8;

      // add name with width
      let shopLine = this.concatTextWithWidth("", itemName, nameWidth);
      // add price with width
      shopLine = this.concatTextWithWidth(shopLine, price, priceWidth);
      // add qty
      shopLine += `${qty}`;

      return shopLine;
    },
    concatTextWithWidth(leftString, toAdd, width) {
      let output = "" + leftString;
      const len = `${toAdd}`.length;
      console.log(width, toAdd, len);
      if (len > width - 2) {
        output += `${toAdd.slice(0, width - 2)}..`;
      } else {
        output += `${toAdd}${".".repeat(width - len)}`;
      }

      return output;
    },
    getAllDirections() {
      // build set of all direction keywords in the game
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
        this.removeItemFromLocation({id: itemId});
      }
      // delete condition
      const conditionInd = this.game.conditions.findIndex(
        (c) => c.id === condition.id
      );
      this.game.conditions.splice(conditionInd, 1);
    },
    getRandomElement(arr) {
      return arr[this.getRandomInt(0, arr.length)];
    },
    getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
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

.inventoryText {
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 6px;
}

.bg-black {
  background-color: black;
}

#inventory-title {
  width: 100%;
  text-align: center;
  color: rgb(255, 255, 162);
  padding: 6px;
}
</style>
