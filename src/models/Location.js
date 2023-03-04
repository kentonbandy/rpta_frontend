import { Inventory } from "@/models/Inventory";

export class Location {
    id;
    name;
    description;
    isSafe;
    inventory;
    containers;
    enemies;
    npcs;
    exits;
    gameOver;

    constructor(locationData, gameData) {
        this.id = locationData.id;
        this.name = locationData.name;
        this.description = locationData.description;
        this.exits = locationData.exits;
        this.isSafe = locationData.isSafe ?? true;
        this.inventory = this.#buildItems(locationData.items, gameData.items);
        this.containers = locationData.containers?.map(c => gameData.containers?.find(gc => gc.id === c.id)) ?? [];
        this.enemies = locationData.enemies.map(e => gameData.enemies.find(ge => ge.id === e.id));
        this.npcs = locationData.npcs?.map(n => gameData.npcs?.find(npc => npc.id === n)) ?? [];
        for (let npc of this.npcs) {
            npc.items = this.#buildItems(npc.items, gameData.items);
        }
        this.gameOver = locationData.gameOver ?? false;
    }

    #buildItems(locationItems, gameItems) {
        const itemObjects = locationItems.map((i) => {
            const item = gameItems.find(it => it.id === i.id);
            return { item: item, qty: i.qty };
        });
        return new Inventory(itemObjects);
    }

    /**
     * Filters and returns exits with visible = true.
     * @returns 
     */
    visibleExits() {
        return this.exits.filter((e) => e.visible === true);
    }

    /**
     * Builds the location prompt and returns it as a string.
     * @returns 
     */
    getLocationPrompt() {
        let locDesc = `--- ${this.name} ---\n`;
        locDesc += this.description;
        if (this.gameOver === false) {
            // print custom item game text
            for (const itemObj of this.inventory.items()) {
                locDesc += ` ${itemObj.locationText}`;
            }
        } else {
            locDesc += "\nPress enter to start over.";
        }
        return locDesc;
    }
}
