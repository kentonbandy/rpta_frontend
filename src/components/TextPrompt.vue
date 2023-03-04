<template>
    <div class="d-flex justify-content-center">
        <div class="d-flex flex-row">
            <div class="inventory"></div>
            <div id="output" class="d-flex flex-column justify-content-end align-items-start bg-black">
                <div v-for="text in texts" :key="texts.indexOf(text)" class="screenText">
                    {{ text }}
                </div>
                <div>
                    <input
                        type="text"
                        class="form-control bg-black"
                        id="textInput"
                        v-model="input"
                        @keydown.enter="addPlayerInput(input)"
                        @keydown.up="historyBack()"
                        @keydown.down="historyForward()"
                    />
                </div>
            </div>
            <div>
                <div class="d-flex flex-column justify-content-start align-items-start bg-black inventory">
                    <div id="inventory-title">Player Inventory</div>
                    <div class="inventoryText">
                        <div>Item</div>
                        <div>Qty</div>
                    </div>
                    <div v-for="item in playerInventory" :key="item.id" id="inventorybox" class="inventoryText">
                        <div>{{ item.item.name }}</div>
                        <div>{{ item.qty }}</div>
                    </div>
                </div>
                <div class="d-flex align-items-center bg-black inventory currency">
                    Player {{ game?.currencyTerms?.generic }}: {{ playerCurrency }}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import world from '@/assets/world.js'; // Comprehensive game/state data
import structuredClone from '@ungap/structured-clone';
import { Inventory } from '@/models/Inventory.js';
import { Location } from '@/models/Location.js';

export default {
    components: {},
    data() {
        return {
            game: {},
            locations: {},
            location: null, // comprehensive location data.
            texts: [], // game text. Display lines of text by pushing to this array.
            inventory: null, // player inventory. Appears in its own window.
            equipment: { armor: null, weapon: null },
            playerCurrency: 0,
            input: '', // user input.
            context: null,
            activeNpc: null,
            history: [], // this and historyInd are used for saving user inputs and can be accessed with up/down arrows.
            historyInd: null,
            shorthand: {}, // a dictionary of accepted keyword shortenings.
            aliases: {}, // a dictionary of accepted aliases for keywords (see world file)
            allDirections: [], // a lits of all direction keywords used in the game, used to detect whether the user is trying to travel.
            npcLineType: { greeting: 'greetings', purchase: 'purchaseLines', sell: 'sellLines', invalid: 'invalidItemLines', farewell: 'farewells' },
            itemType: { food: 'food', potion: 'potion', armor: 'armor', weapon: 'weapon', key: 'key' },
            ignored: [
                // Words that are automatically removed from user input.
                'on',
                'of',
                'over',
                'under',
                'underneath',
                'above',
                'below',
                'beneath',
                'into',
                'onto',
                'with',
                'across',
                'around',
                'as',
                'at',
                'beside',
                'between',
                'by',
                'from',
                'near',
                'past',
                'toward',
                'towards',
                'the',
                'some',
                'all',
                'my',
                'to',
            ],
        };
    },
    computed: {
        playerInventory() {
            return this.inventory?.getAll() ?? [];
        },
    },
    mounted() {
        this.restart();
    },
    methods: {
        restart() {
            // reads game data and sets local fields
            this.game = structuredClone(world.game);
            this.inventory = this.loadPlayerInventory();
            this.playerCurrency = this.game.startingCurrency;
            this.shorthand = this.game.shorthand;
            this.aliases = this.game.aliases;
            this.texts = [];
            this.history = [];
            this.historyInd = null;
            this.initLocations();
            this.initAllDirections();
            this.loadLocation(this.game.startingLocation);
        },
        loadPlayerInventory() {
            // convert item ids in startingInventory object to item objects, then init Inventory object
            const invObj = this.game.startingInventory.map((o) => {
                const item = this.game.items.find((i) => i.id === o.id);
                return { item: item, qty: o.qty };
            });
            return new Inventory(invObj);
        },
        initLocations() {
            for (const locationData of this.game.locations) {
                this.locations[locationData.id] = new Location(locationData, this.game);
            }
        },
        loadLocation(locId) {
            this.location = this.locations[locId];
            // save this location as the new startingLocation for save/load resume
            this.game.startingLocation = locId;
            this.addText(this.location.getLocationPrompt());
        },
        addPlayerInput(text) {
            if (this.location.gameOver) {
                this.restart();
                return;
            }
            this.addText(`> ${text}`);
            this.history.push(text);
            this.parseInput(text);
            this.input = '';
        },
        textToArray(text) {
            return text
                .toLowerCase()
                .split(' ')
                .filter((w) => !this.ignored.includes(w) && w !== '');
        },
        getItemsListFromIds(ids) {
            return ids.map((id) => this.game.items.find((i) => i.id === id));
        },
        findItemInInput(text) {
            const lowerText = text.toLowerCase();
            let items = this.inventory.items().concat(this.location.inventory.items());
            if (this.activeNpc) {
                items = items.concat(this.activeNpc.items.items());
            }
            if (this.equipment.armor !== null) {
                items = items.concat(this.equipment.armor);
            }
            if (this.equipment.weapon !== null) {
                items = items.concat(this.equipment.weapon);
            }
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
            let first = inputArr[0].toLowerCase();
            const item = this.findItemInInput(text);

            // remove unnecessary verb
            if (['go', 'travel', 'move', 'climb', 'step', 'walk'].includes(first)) {
                inputArr.shift();
                if (inputArr.length === 0) {
                    this.addText('You need to specify a destination.');
                    return;
                } else first = inputArr[0].toLowerCase();
            }

            // check for context
            if (this.context !== null) {
                this.parseContext(inputArr, first, item);
                return;
            }

            // case: travel
            if (this.allDirections.includes(first)) {
                this.handleDirection(first);
            }

            // case: look
            else if (inputArr.length === 1 && this.aliases.look.includes(inputArr[0])) {
                this.addText(this.location.getLocationPrompt());
            }

            // case: get item
            else if (this.aliases.get.includes(first)) {
                if (inputArr.length < 2) {
                    this.addText(`Please specify what you'd like to ${this.aliases.get[0]}.`);
                } else this.handleGetItemFromLocation(inputArr.slice(1).join(' '));
            }

            // case: drop item
            else if (this.aliases.drop.includes(first)) {
                if (inputArr.length < 2) {
                    this.addText(`Please specify what you'd like to ${this.aliases.drop[0]}.`);
                } else this.handleDropItem(inputArr.slice(1).join(' '));
            }

            // case: examine item
            else if (this.aliases.examine.includes(first)) {
                if (!item) {
                    this.addText(
                        inputArr.length > 1
                            ? "That item isn't here."
                            : `Please specify what you'd like to ${this.aliases.examine[0]}.`
                    );
                } else {
                    this.addText(`${this.aliases.item}: ${item.name}`);
                    this.addText(`${this.aliases.item} type: ${item.type}`);
                    this.addText(item.description);
                }
            }

            // case: equip item
            else if (this.aliases.equip.includes(first)) {
                if (inputArr.length < 2) {
                    this.addText(`Please specify what you'd like to ${this.aliases.equip[0]}.`);
                } else this.handleEquipItem(item);
            }

            // case: unequip item
            else if (this.aliases.unequip.includes(first)) {
                if (inputArr.length < 2) {
                    this.addText(`Please specify what you'd like to ${this.aliases.unequip[0]}.`);
                } else this.handleUnequipItem(item);
            }

            // case: put item in container
            else if (this.aliases.put.includes(first)) {
                if (inputArr.length < 2) {
                    this.addText(`Please specify what you'd like to ${this.aliases.put[0]}.`);
                } else this.handlePutItem(inputArr.slice(1).join(' '));
            }

            // case: talk to npc
            else if (this.aliases.talk.includes(first)) {
                if (inputArr.length < 2) {
                    this.addText(`Please specify who you'd like to ${this.aliases.talk[0]} to.`);
                } else this.handleTalk(inputArr.slice(1));
            }

            // not recognized
            else {
                this.addText('That is not a recognized command.');
            }
        },
        parseContext(inputArr, first, item) {
            // run parse function based on context (shop, battle, etc).
            if (this.context === 'shop') this.parseShopInput(first, item);
        },
        parseShopInput(first, item) {
            const shopBuyAliases = ['buy', 'purchase', 'get'];
            const shopSellAliases = ['sell'];
            const shopLeaveAliases = ['leave', 'done', 'quit'];

            if (shopLeaveAliases.includes(first)) {
                this.context = null;
                this.getRandomNpcLine(this.npcLineType.farewell);
                this.addTextWithDelay(this.location.getLocationPrompt());
                return;
            }
            if (!item || (!this.inventory.hasItem(item) && !this.activeNpc.items.hasItem(item))) {
                this.addText('Please specify a relevant item.');
                return;
            } else if (shopBuyAliases.includes(first)) {
                this.shopPurchase(item);
            } else if (shopSellAliases.includes(first)) {
                if (item.price === null) {
                    this.getRandomNpcLine(this.npcLineType.invalid);
                } else {
                    this.shopSell(item);
                }
            } else {
                this.addText('That is not a recognized command.');
            }
            this.addTextWithDelay(this.displayShopItems());
        },
        shopPurchase(item) {
            if (this.playerCurrency < item.price) {
                    this.addText(`You don't have enough ${this.game.currencyTerms.generic} to buy ${item.name}.`);
                    return;
                }
            this.playerCurrency -= item.price;
            this.activeNpc.currency += item.price;
            this.inventory.add(item);
            this.activeNpc.items.remove(item);
            this.addText(`${this.activeNpc.name}: ${this.getRandomElement(this.activeNpc.purchaseLines)}`);
        },
        shopSell(item) {
            if (this.activeNpc.currency < item.price) {
                this.addText(`${this.activeNpc.name} doesn't have enough ${this.game.currencyTerms.generic} to buy ${item.name}.`);
                return;
            }
            this.activeNpc.currency -= item.price;
            this.playerCurrency += item.price;
            this.activeNpc.items.add(item);
            this.inventory.remove(item);
            this.getRandomNpcLine(this.npcLineType.sell);
        },
        getRandomNpcLine(type) {
            this.addText(`${this.activeNpc.name}: ${this.getRandomElement(this.activeNpc[type])}`);
        },
        handleEquipItem(item) {
            if (!this.inventory.hasItem(item)) {
                this.addText(`That item isn't in your ${this.aliases.inventory}.`);
            } else if (![this.itemType.armor, this.itemType.weapon].includes(item.type)) {
                this.addText(`You can only ${this.aliases.equip} ${this.aliases.armor} and ${this.aliases.weapon} type items.`);
            } else {
                if (this.equipment[item.type] !== null) {
                    this.inventory.add(this.equipment[item.type]);
                }
                this.equipment[item.type] = item;
                this.inventory.remove(item);
                this.addText(`${item.name} has been ${this.aliases.equipped}.`);               
            }
        },
        handleUnequipItem(item) {
            if (this.equipment[item.type] === null) {
                this.addText(`There is nothing to ${this.aliases.unequip}.`);
            } else if (this.equipment[item.type].id !== item.id) {
                this.addText(`${item.name} is not ${this.aliases.equipped}.`);
            } else {
                this.inventory.add(item);
                this.equipment[item.type] = null;
                this.addText(`${item.name} has been ${this.aliases.unequipped}`);
            }
        },
        handleDirection(dir) {
            const exit = this.location
                .visibleExits()
                .find((e) => e.direction === dir || e.direction === this.shorthand[dir]);
            if (exit !== undefined) {
                // change current location
                this.loadLocation(exit.locationId);
            } else {
                this.addText("You can't go that way.");
            }
        },
        handleGetItemFromLocation(itemName) {
            const item = this.location.inventory.getItemByName(itemName);
            if (item === undefined) {
                this.addText("That item isn't here.");
            } else {
                this.inventory.add(item);
                this.location.inventory.remove(item);
                this.addText(`${item.name} has been added to your inventory.`);
            }
        },
        handleDropItem(itemName) {
            const item = this.inventory.getItemByName(itemName);
            if (item === undefined) {
                this.addText('That item is not in your inventory.');
            } else {
                this.location.inventory.add(item);
                this.inventory.remove(item);
                this.addText(`${item.name} has been removed from your inventory.`);
                this.resolveCondition(item.id, null, this.location.id);
            }
        },
        handlePutItem(text) {
            const item = this.inventory.getItemByName(text.split(' ')[0]);
            const locContainers = this.game.containers.filter((c) => this.containers.includes(c.id));
            const container = locContainers?.filter((c) => c.aliases.any((a) => text.includes(a)));
            if (locContainers === undefined || container === undefined || container === null || item === undefined) {
                this.addText("It looks like you can't put that there.");
            } else {
                for (let slot of container.slots) {
                    if (slot.item === null && slot.acceptedItems.includes(item.id)) {
                        slot.item = item.id;
                        this.inventory.remove(item);
                        this.addText(`You've placed ${item.name} in the ${container.name}.`);
                        this.resolveCondition(item.id, container.id);
                    }
                }
            }
        },
        handleTalk(inputArr) {
            // match word in inputArr with npc
            let npc = this.findNpc(inputArr);
            if (!npc) {
                this.addText("That person isn't here.");
                return;
            }
            // initiate conversation with npc
            if (npc.type === 'shop') {
                // need to eventually have constants or enum for npc types
                this.shop(npc);
            }
            // ...more npc types
        },
        shop(npc) {
            // initiate shop context
            this.context = 'shop';
            this.activeNpc = npc;
            this.getRandomNpcLine(this.npcLineType.greeting);
            this.displayShopItems();
        },
        findNpc(inputArr) {
            for (let npc of this.location.npcs) {
                for (let alias of npc.aliases) {
                    if (inputArr.includes(alias)) {
                        return npc;
                    }
                }
            }
            return null;
        },
        displayShopItems() {
            this.addText(`${this.activeNpc.name}'s ${this.game.currencyTerms.generic}: ${this.activeNpc.currency}`);
            const topLine = this.addShopItemLine('Item', 'Price', 'Qty');
            this.addText(topLine);
            for (const itemObj of this.activeNpc.items.getAll()) {
                const shopLine = this.addShopItemLine(itemObj.item.name, itemObj.item.price, itemObj.qty);
                this.addText(shopLine);
            }
        },
        addShopItemLine(itemName, price, qty) {
            // hardcoded for now, but these parameters should be customizeable via some kind of configuration
            const nameWidth = 16;
            const priceWidth = 8;

            // add name with width
            let shopLine = this.concatTextWithWidth('', itemName, nameWidth);
            // add price with width
            shopLine = this.concatTextWithWidth(shopLine, price, priceWidth);
            // add qty
            shopLine += `${qty}`;

            return shopLine;
        },
        concatTextWithWidth(leftString, toAdd, width) {
            let output = '' + leftString;
            const len = `${toAdd}`.length;
            if (len > width - 2) {
                output += `${toAdd.slice(0, width - 2)}..`;
            } else {
                output += `${toAdd}${'.'.repeat(width - len)}`;
            }

            return output;
        },
        initAllDirections() {
            // build set of all direction keywords in the game
            let allDir = new Set();
            for (let loc of Object.values(this.locations)) {
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
                this.input = '';
            } else {
                this.historyInd++;
                this.input = this.history[this.historyInd];
            }
        },
        resolveCondition(itemId = null, containerId = null, locationId = null) {
            // look for a condition that matches the current game conditions
            const condition = this.game.conditions.find(
                (c) => c.item === itemId && c.container === containerId && c.location === locationId
            );
            if (condition === undefined) return;
            // item in container
            if (itemId !== null && containerId !== null) {
                this.addText('Item in container condition not implemented yet.');
            }
            // item in location
            else if (itemId !== null && locationId !== null) {
                this.resolveItemInLocation(itemId, condition);
            }
            // item in player inventory
            else if (itemId !== null) {
                this.addText('Item in player inventory condition not implemented yet.');
            }
            // container full
            if (containerId !== null) {
                this.addText('Container full condition not implemented yet.');
            }
        },
        resolveItemInLocation(itemId, condition) {
            // show text
            if (condition.text !== null) {
                this.addText(condition.text);
            }
            // check exits
            for (let exit of this.location.exits) {
                if (exit.condition === condition.id) {
                    exit.visible = !exit.visible;
                    exit.condition = null;
                }
            }
            // check for deleteItemOnTrigger
            if (condition.deleteItemOnTrigger === true) {
                this.location.inventory.remove(itemId);
            }
            // delete condition
            const conditionInd = this.game.conditions.findIndex((c) => c.id === condition.id);
            this.game.conditions.splice(conditionInd, 1);
        },
        getRandomElement(arr) {
            return arr[this.getRandomInt(0, arr.length)];
        },
        getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min)) + min;
        },
        addText(text) {
            this.texts.push(text);
            if (this.texts.length > 1000) this.texts.shift();
        },
        addTextWithDelay(text, delay = 800) {
            // remember: this is is async
            setTimeout(() => this.addText(text), delay);
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

.currency {
    height: 30px;
    margin-top: 5px;
    padding: 6px;
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
    white-space: pre-line;
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
