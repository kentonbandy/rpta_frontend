import { Inventory } from "./Inventory";

class Location {
    id;
    name;
    description;
    isSafe;
    items;
    containers;
    enemies;
    npcs;
    exits;

    constructor(locationData, gameData) {
        this.id = locationData.id;
        this.name = locationData.name;
        this.description = locationData.description;
        this.exits = locationData.exits;
        this.isSafe = locationData.isSafe ?? true;
        this.items = this.#buildItems(locationData.items, gameData.items);
        this.containers = locationData.containers.map(c => gameData.containers.find(gc => gc.id === c.id));
        this.enemies = locationData.enemies.map(e => gameData.enemies.find(ge => ge.id === e.id));
        this.npcs = locationData.npcs.map(n => gameData.npcs.find(npc => npc.id === n.id));
    }

    #buildItems(locationItems, gameItems) {
        const itemObjects = locationItems.map((i) => {
            const item = gameItems.find(it => it.id === i.id);
            return { item: item, qty: i.qty };
        });
        return new Inventory(itemObjects);
    }
}

export { Location };