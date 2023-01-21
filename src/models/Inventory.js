export class Inventory {
    mainInventory = [];

    constructor(inventoryArray) {
        this.mainInventory = inventoryArray;
    }

    items() {
        return this.mainInventory.map(e => e.item);
    }

    getAll() {
        return [...this.mainInventory];
    }

    // item can be item object or item id
    hasItem(item) {
        const itemId = item.id ?? item;
        return this.items().some(i => i.id === itemId);
    }

    findItemByName(itemAlias) {
        return this.items().find(i => i.aliases.includes(itemAlias.toLowerCase()));
    }

    itemCount(item) {
        const itemId = item.id ?? item;
        return this.mainInventory.find(o => o.item.id === itemId)?.qty ?? 0;
    }

    remove(item, qty = 1) {
        const itemId = item.id ?? item;

        if (!this.hasItem(itemId)) {
            throw new Error("Remove item error - the inventory does not contain the item.");
        }

        const ind = this.mainInventory.findIndex(o => o.item.id === itemId);

        const itemCount = this.itemCount(itemId);
        if (itemCount < qty) {
            throw new Error("Remove item error - attempt to remove more of the item than the inventory contains.");
        } else if (itemCount === qty) {
            this.mainInventory.splice(ind, 1);
        } else {
            this.mainInventory[ind].qty -= qty;
        }
    }

    add(item, qty = 1) {
        const id = item?.id;

        if (id === undefined) {
            throw new Error("Invalid item object passed to Inventory.add.");
        }

        if (this.hasItem(id)) {
            const ind = this.mainInventory.findIndex(o => o.item.id === id);
            this.mainInventory[ind].qty += qty;
        } else {
            this.mainInventory.push({ item: item, qty: qty });
            this.sortItems();
        }
    }

    // todo: add sorting by different properties (id, name, type, etc)
    sortItems() {
        this.mainInventory.sort((a, b) => a.id < b.id ? 1 : -1);
    }
}