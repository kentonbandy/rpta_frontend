export default {
    game: {
        startingLocation: 1,
        locations: [
            {
                id: 1,
                name: "WHS",
                description: "You're in front of a red brick school that has bees painted all over the interior. The vice principal is walking toward you.",
                isSafe: true,
                items: [],
                containers: [
                    {
                        item: null,
                        acceptedItems: []
                    }
                ],
                enemies: ["Vice Principal"],
                shop: null,
                gameOver: false,
                exits: [
                    { direction: "west", locationId: 2, condition: null, visible: true },
                    { direction: "north", locationId: 3, condition: null, visible: true },
                    { direction: "east", locationId: 5, condition: null, visible: true },
                ]
            },
            {
                id: 2,
                name: "Crossroads",
                description: "The road splits. To the North you see a yellow house. To the West you see a non-yellow house.",
                isSafe: false,
                items: [],
                enemies: ["Punk Kid", "Nerd", "Jock"],
                shop: null,
                gameOver: false,
                exits: [
                    { direction: "north", locationId: 7, condition: null, visible: true },
                    { direction: "west", locationId: 8, condition: null, visible: true },
                    { direction: "east", locationId: 1, condition: null, visible: true },
                ]
            },
            {
                id: 3,
                name: "Zach's House",
                description: "You arrive at a hulking structure in its own forest on an unassuming street corner. A tiny white dog comes running at you. Farr's house is to the west, WHS is to the south, and a corner store is to the east.",
                isSafe: true,
                items: [],
                enemies: ["Tank"],
                shop: null,
                gameOver: false,
                exits: [
                    { direction: "south", locationId: 1, condition: null, visible: true },
                    { direction: "east", locationId: 6, condition: null, visible: true },
                    { direction: "west", locationId: 7, condition: null, visible: true },
                    { direction: "inside", locationId: 4, condition: 1, visible: false },
                ]
            },
            {
                id: 4,
                name: "Inside Zach's House",
                description: "You're in a spacious house that you recognize as zach's. Tank's toys adorn much of the interior.",
                isSafe: true,
                items: [3],
                enemies: [],
                shop: null,
                gameOver: false,
                exits: [
                    { direction: "outside", locationId: 3, condition: null, visible: true },
                ]
            },
            {
                id: 5,
                name: "Park",
                description: "A bunch of kids are playing frisbee, swinging, making out, fighting, you know, what kids do. You take shelter from the sun under a Maple tree. WHS is to the west, a corner store is to the north.",
                isSafe: false,
                items: [5],
                enemies: ["Punk Kid", "Nerd", "Jock"],
                shop: null,
                gameOver: false,
                exits: [
                    { direction: "west", locationId: 1, condition: null, visible: true },
                    { direction: "north", locationId: 6, condition: null, visible: true },
                ]
            },
            {
                id: 6,
                name: "Corner Store",
                description: "You've arrived at a Subway/gas station/convenience store. Usually a hot open lunch location for students, this shop has somehow run out of everything except Snacks and Sodas. The cashier eyes you suspiciously from the counter.",
                isSafe: true,
                items: [],
                enemies: [],
                npcs: [1],
                gameOver: false,
                exits: [
                    { direction: "south", locationId: 5, condition: null, visible: true },
                    { direction: "west", locationId: 3, condition: null, visible: true },
                ]
            },
            {
                id: 7,
                name: "Farr's House",
                description: "An unambiguously yellow house stands before you. Farr's mom sees you and invites you in to have spaghetti for dinner. Zach's house is to the east, the crossroads lie to the south.",
                isSafe: true,
                items: [],
                enemies: [],
                shop: null,
                gameOver: false,
                exits: [
                    { direction: "east", locationId: 3, condition: null, visible: true },
                    { direction: "south", locationId: 2, condition: null, visible: true },
                    { direction: "inside", locationId: 12, condition: null, visible: true }
                ]
            },
            {
                id: 8,
                name: "Travis's House",
                description: "You're at the door of a house on the corner of an attractive development. Travis's mom opens the door and says 'I have no idea where Travis is but I just made brownies! Want one?'. You see another house to the West.",
                isSafe: true,
                items: [9],
                enemies: [],
                shop: null,
                gameOver: false,
                exits: [
                    { direction: "west", locationId: 9, condition: null, visible: true },
                    { direction: "east", locationId: 2, condition: null, visible: true },
                ]
            },
            {
                id: 9,
                name: "Wood's House",
                description: "You approach a house with a fleet of various trucks, jeeps, and cars. Chances are Wood and Zach are inside.",
                isSafe: true,
                items: [],
                enemies: [],
                shop: null,
                gameOver: false,
                exits: [
                    { direction: "inside", locationId: 10, condition: null, visible: true },
                    { direction: "east", locationId: 8, condition: null, visible: true },
                ]
            },
            {
                id: 10,
                name: "Inside Wood's House",
                description: "As expected, you see Wood and Zach at the dining room table, laptops out, playing World of Gamecraft. Fresh ribs have just come out of the oven and are resting on the counter. Wood and Zach beckon you to join them.",
                isSafe: true,
                items: [1, 2],
                enemies: [],
                shop: null,
                gameOver: false,
                exits: [
                    { direction: "outside", locationId: 9, condition: null, visible: true },
                    { direction: "join", locationId: 11, condition: null, visible: true }
                ]
            },
            {
                id: 11,
                name: "World of Gamecraft",
                description: "You settle in with a spare laptop and log on to World of Gamecraft. Your grasp on the passage of time loosens and in the blink of an eye, it's 3am. Looks like game over, for now.",
                isSafe: true,
                items: [1, 2],
                enemies: [],
                shop: null,
                gameOver: true,
                exits: []
            },
            {
                id: 12,
                name: "Inside Farr's House",
                description: "You're in Farr's house. The smell of spaghetti is wafting in from the kitchen. The place is bustling - how many sisters does Farr have again?",
                isSafe: true,
                items: [4],
                enemies: [],
                shop: null,
                gameOver: false,
                exits: [
                    { direction: "outside", locationId: 7, condition: null, visible: true }
                ]
            }
        ],
        startingInventory: [{ id: 1, qty: 1 }],
        items: [
            {
                id: 1,
                name: "Snack",
                description: "Your favorite pre-packaged salty snack. Heals HP by 40% up to max.",
                locationText: "You see a snack bar. Your stomach grumbles slightly.",
                type: "Potion",
                price: 10,
                effect: 5,
                // convention: include name, all aliases lowercase
                aliases: ["snack", "bar", "snack bar"]
            },
            {
                id: 2,
                name: "Soda",
                description: "A bottle of your favorite carbonated sugar drink. Replenishes MP by 40% up to max.",
                locationText: "Woah, is that a can of Surge?",
                type: "Potion",
                price: 10,
                effect: 5,
                aliases: ["soda", "pop", "surge", "can"]
            },
            {
                id: 3,
                name: "Police Helmet",
                description: "A flimsy toy police helmet. It offers a surprising amount of protection.",
                locationText: "Is that... a police helmet??",
                type: "Armor",
                price: 15,
                effect: 10,
                aliases: ["police helmet", "helmet"]
            },
            {
                id: 4,
                name: "Mellophone",
                description: "It's like a french horn for marching band, also played by Chuck Mangione. These are its total use cases outside of combat.",
                locationText: "You spot Farr's mellophone. With a bell that big, a blast from that thing would probably do some damage.",
                type: "Weapon",
                price: 15,
                attacks: [
                    { name: "Blast", effect: 20 },
                    { name: "Energy Burst", effect: 25 }
                ],
                aliases: ["mellophone", "horn"]
            },
            {
                id: 5,
                name: "Stick",
                description: "A stick, about an arm's length.",
                locationText: "A stick is lying on the ground. Seems like the kind of stick a dog would love to chew on.",
                type: "key",
                price: null,
                aliases: ["stick", "branch"]
            },
            {
                id: 6,
                name: "Coffee",
                description: "Bitter, hot, black liquid, packed with caffeine. What more is there to say?",
                locationText: "Steam rises from a cup of black coffee.",
                type: "potion",
                price: 5,
                effect: 5,
                aliases: ["coffee"]
            },
            {
                id: 7,
                name: "Collar",
                description: "It's definitely some kind of collar, but a bit larger than a dog's neck. What could it be for?",
                locationText: "You see a large collar.",
                type: "key",
                price: null,
                aliases: ["collar"]
            },
            {
                id: 8,
                name: "Unicorn",
                description: "Holy cow, a unicorn?! You definitely didn't think these things were real. You should probably take this to a safe place before anyone sees it.",
                locationText: "No big deal, but there's a unicorn here.",
                type: "key",
                price: null,
                aliases: ["unicorn"]
            },
            {
                id: 9,
                name: "Brownie",
                description: "This appears to be a normal brownie, it smells slightly... dank.",
                locationText: "A brownie sits on a small plate extended toward you.",
                type: "potion",
                price: null,
                aliases: ["brownie", "brownies", "pot brownie"],
            },
            {
                id: 10,
                name: "Ribs",
                description: "Juicy, well-seasoned, melt-in-your-mouth ribs.",
                locationText: "Some tasty looking ribs just came out of the oven.",
                type: "potion",
                price: null,
                aliases: ["ribs", "rib"],
            }
        ],
        containers: [
            {
                id: 1,
                name: "Band Director's Podium",
                aliases: [
                    "band director's podium",
                    "band directors podium",
                    "podium",
                    "director's podium",
                    "directors podium",
                    "band podium",
                    "conductor's podium",
                    "conductors podium"
                ],
                description: "A conductor's podium. On closer inspection, you notice a {1}, a {2}, and a {3} {0}",
                notFullText: "It looks like a horn and coffee mug are usually here... along with something else.",
                slots: [
                    {
                        id: 1,
                        item: null,
                        acceptedItems: [6],
                        emptyText: "coffee mug stain",
                        fullText: "cup of coffee",
                        putOnly: true
                    },
                    {
                        id: 2,
                        item: null,
                        acceptedItems: [4],
                        emptyText: "horn stand",
                        fullText: "mellophone",
                        putOnly: true
                    },
                    {
                        id: 3,
                        item: 7,
                        acceptedItems: [8],
                        emptyText: "collar. ",
                        fullText: "unicorn?!",
                        putOnly: false
                    }
                ],
            }
        ],
        shorthand: {
            n: "north",
            e: "east",
            s: "south",
            w: "west",
            ne: "northeast",
            se: "southeast",
            sw: "southwest",
            nw: "northwest",
            out: "outside",
            in: "inside"
        },
        conditions: [
            {
                id: 1,
                item: 5,
                container: null,
                location: 3,
                text: "Just as Tank the dog is about to leap for your jugular, you take the stick and throw it around the side of the house. Tank immediately chases after it, unwittingly sparing your life. It looks like you can now safely make it inside.",
                deleteItemOnTrigger: true
            }
        ],
        aliases: {
            // aliases for the game to use
            location: "location",
            inventory: "inventory",
            item: "item",
            stat: "stat",
            container: "container",
            // aliases for player commands - when aliases are in list form, index 0 is default
            look: ["look", "l", "description", "location", "area"],
            get: ["get", "grab", "take", "acquire", "cop"],
            drop: ["drop", "throw", "dump", "remove", "eject", "yeet"],
            examine: ["examine", "x", "inspect"],
            // syntax: put {item} {container}
            put: ["put", "place", "insert", "set"],
            talk: ["talk", "speak", "chat", "converse"],
        },
        currencyTerms: {
            generic: "money",
            singular: "dollar",
            plural: "dollars"
        },
        nonPlayerCharacters: [
            {
                id: 1,
                name: "cashier",
                aliases: ["cashier"],
                type: "shop",
                items: [{ id: 1, qty: 5 }, {id: 2, qty: 5}, {id: 6, qty: 3}],
                currency: 30,
                greetings: [
                    "Uh, sure, what do you want?",
                    "Don't you need supervision? Whatever, business is business.",
                    "I can tell you aren't 21, so don't even try.",
                    "Wow, school's out already? If only the end of my shift came so quickly.",
                ],
                purchaseLines: [
                    "There you go.",
                    "Thanks for your business, I guess.",
                ],
                sellLines: [
                    "I know just what to do with that.",
                    "Hmm, looks like it's in good condition.",
                    "You've got yourself a deal.",
                ],
                farewells: [
                    "Until next time.",
                    "Try to stay out of trouble. Or don't. I don't really care.",
                    "Beat it, kid.",
                ],
            }
        ]
    }
}