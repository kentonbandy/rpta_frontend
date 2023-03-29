export default {
    game: {
        startingLocation: 1,
        startingInventory: [{ id: 1, qty: 1 }],
        startingEquipment: { armor: 20, weapon: 19 },
        startingCurrency: 10,
        locations: [
            {
                id: 1,
                name: "WHS",
                description: "You're in front of a red brick school that has bees painted all over the interior. A sign nearby says, 'Williamsville High School'. The vice principal is walking toward you.",
                isSafe: true,
                items: [],
                enemies: ["Vice Principal"],
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
                items: [{ id: 3, qty: 1 }],
                enemies: [],
                exits: [
                    { direction: "outside", locationId: 3, condition: null, visible: true },
                ]
            },
            {
                id: 5,
                name: "Park",
                description: "A bunch of kids are playing frisbee, swinging, making out, fighting, you know, what kids do. You take shelter from the sun under a Maple tree. WHS is to the west, a corner store is to the north.",
                isSafe: false,
                items: [{ id: 5, qty: 1 }],
                enemies: ["Punk Kid", "Nerd", "Jock"],
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
                items: [{ id: 9, qty: 1 }],
                enemies: [],
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
                items: [{ id: 1, qty: 1 }, { id: 2, qty: 1 }, { id: 10, qty: 1 }],
                enemies: [],
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
                items: [{ id: 1, qty: 1 }, { id: 2, qty: 1 }],
                enemies: [],
                gameOver: true,
                exits: []
            },
            {
                id: 12,
                name: "Inside Farr's House",
                description: "You're in Farr's house. The smell of spaghetti is wafting in from the kitchen. The place is bustling - how many sisters does Farr have again?",
                isSafe: true,
                items: [{ id: 4, qty: 1 }],
                enemies: [],
                exits: [
                    { direction: "outside", locationId: 7, condition: null, visible: true }
                ]
            },
            {
                id: 13,
                name: "Zach's House",
                description: "You arrive at a hulking structure in its own forest on an unassuming street corner. A tiny white dog is having a blast chewing on a stick. Farr's house is to the west, WHS is to the south, and a corner store is to the east.",
                isSafe: true,
                items: [],
                enemies: [],
                exits: [
                    { direction: "south", locationId: 1, condition: null, visible: true },
                    { direction: "east", locationId: 6, condition: null, visible: true },
                    { direction: "west", locationId: 7, condition: null, visible: true },
                    { direction: "inside", locationId: 4, condition: null, visible: true },
                ]
            },
        ],
        attacks: [
            // Backpack
            {
                id: 1,
                name: "Backpack Bash",
                prompt: "A crushing blow with a backpack full of books!",
                power: 2,
                mpCost: 0,
            },
            {
                id: 2,
                name: "Throw Book",
                prompt: "A hardcover textbook to the face! Ouch.",
                power: 4,
                mpCost: 5,
            },
            // Stick
            {
                id: 3,
                name: "Thwack",
                prompt: "Slapped with a stick!",
                power: 3,
                mpCost: 0,
            },
            {
                id: 4,
                name: "Crisscross",
                prompt: "Twho thwacks in opposing directions!",
                power: 5,
                mpCost: 7,
            },
            // Mellophone
            {
                id: 5,
                name: "Blast",
                prompt: "A disorienting sonic blast!",
                power: 6,
                mpCost: 0,
            },
            {
                id: 6,
                name: "Energy Burst",
                prompt: "The mellophone begins to glow as it absorbs energy... and releases it in a devastating giant beam out of the bell!",
                power: 10,
                mpCost: 15,
            },
            // Clip-on Tie
            {
                id: 7,
                name: "Give Detention",
                prompt: "Straight to Detention!",
                power: 8,
                mpCost: 0,
            },
            {
                id: 8,
                name: "Call parents",
                prompt: "Your child has been very very naughty!",
                power: 12,
                mpCost: 6,
            },
            // Tiny Fangs
            {
                id: 9,
                name: "Ankle Bite",
                prompt: "That's gonna hurt in the morning!",
                power: 12,
                mpCost: 0
            },
            {
                id: 10,
                name: "Threatening Aura",
                prompt: "Hostile vibes extend in all directions in an explosive blast!",
                power: 10,
                mpCost: 0,
            },
            {
                id: 11,
                name: "Pee on Leg",
                prompt: "That smells awful!",
                power: 12,
                mpCost: 6,
            },
            // Teen Angst
            {
                id: 12,
                name: "Call Names",
                prompt: "Wow, name calling is so mean!",
                power: 2,
                mpCost: 0,
            },
            {
                id: 13,
                name: "Crude Joke",
                prompt: "Part of a balanced public school education!",
                power: 3,
                mpCost: 3,
            },
            {
                id: 14,
                name: "Threatening Odor",
                prompt: "Breathing is painful!",
                power: 4,
                mpCost: 5,
            },
            // Glasses
            {
                id: 15,
                name: "Corrects Grammar",
                prompt: "A grammatical error comes at a cost... in HP!",
                power: 1,
                mpCost: 0,
            },
            {
                id: 16,
                name: "Thick Lenses",
                prompt: "The sun catches the lenses at the perfect angle, creating a death ray!",
                power: 3,
                mpCost: 4,
            },
            {
                id: 17,
                name: "Steal WiFi",
                prompt: "A laptop appears... password cracked... WiFi stolen!",
                power: 4,
                mpCost: 5,
            },
            // Ego
            {
                id: 18,
                name: "Muscle Flex",
                prompt: "Those muscles are too big to handle!",
                power: 2,
                mpCost: 0,
            },
            {
                id: 19,
                name: "Football",
                prompt: "A football smashes into its target as only a third-stringer could throw it!",
                power: 3,
                mpCost: 4,
            },
            {
                id: 20,
                name: "Bench",
                prompt: "You've been bench pressed! How does this cause damage? No one knows!",
                power: 5,
                mpCost: 6,
            },
        ],
        items: [
            {
                id: 1,
                name: "Snack",
                description: "Your favorite pre-packaged salty snack. Heals HP by 40% up to max.",
                locationText: "You see a snack bar. Your stomach grumbles slightly.",
                type: "food",
                price: 10,
                effect: 5,
                // convention: include name, all aliases lowercase
                aliases: ["snack", "bar", "snack bar"],
            },
            {
                id: 2,
                name: "Soda",
                description: "A bottle of your favorite carbonated sugar drink. Replenishes MP by 40% up to max.",
                locationText: "Woah, is that a can of Surge?",
                type: "potion",
                price: 10,
                effect: 5,
                aliases: ["soda", "pop", "surge", "can"],
            },
            {
                id: 3,
                name: "Police Helmet",
                description: "A flimsy toy police helmet. It offers a surprising amount of protection.",
                locationText: "Is that... a police helmet??",
                type: "armor",
                price: 15,
                effect: 10,
                aliases: ["police helmet", "helmet"],
            },
            {
                id: 4,
                name: "Mellophone",
                description: "It's like a french horn for marching band, also played by Chuck Mangione. These are its total use cases outside of combat.",
                locationText: "You spot Farr's mellophone. With a bell that big, a blast from that thing would probably do some damage.",
                type: "weapon",
                price: 20,
                attacks: [5, 6],
                aliases: ["mellophone", "horn"],
            },
            {
                id: 5,
                name: "Stick",
                description: "A stick, about an arm's length.",
                locationText: "A stick is lying on the ground. Seems like the kind of stick a dog would love to chew on.",
                type: "weapon",
                price: 1,
                attacks: [3, 4],
                aliases: ["stick", "branch"],
            },
            {
                id: 6,
                name: "Coffee",
                description: "Bitter, hot, black liquid, packed with caffeine. What more is there to say?",
                locationText: "Steam rises from a cup of black coffee.",
                type: "potion",
                price: 5,
                effect: 5,
                aliases: ["coffee"],
            },
            {
                id: 9,
                name: "Brownie",
                description: "This appears to be a normal brownie, it smells slightly... dank.",
                locationText: "A brownie sits on a small plate extended toward you.",
                type: "food",
                price: null,
                aliases: ["brownie", "brownies", "pot brownie"],
            },
            {
                id: 10,
                name: "Ribs",
                description: "Juicy, well-seasoned, melt-in-your-mouth ribs.",
                locationText: "Some tasty looking ribs just came out of the oven.",
                type: "food",
                price: null,
                aliases: ["ribs", "rib"],
            },
            {
                id: 11,
                name: "Blazer",
                description: "A blazer at least a decade out of style.",
                type: "armor",
                effect: 12,
                price: 20,
                aliases: ["blazer", "jacket"],
            },
            {
                id: 12,
                name: "Clip-on Tie",
                description: "A fashion decision that is somehow simultaneously tacky and too formal for the setting.",
                type: "weapon",
                price: 20,
                attacks: [7, 8],
                aliases: ["clip-on tie", "tie", "clip-on", "clipon"],
            },
            {
                id: 13,
                name: "Spike Choker",
                description: "It's like a pointy dog collar but for humans. It's edgy, I guess.",
                type: "armor",
                effect: 3,
                price: 5,
                aliases: ["spike choker", "choker"],
            },
            {
                id: 14,
                name: "Teen Angst",
                description: "A powerful anti-establishment force stemming from puberty and counter culture.",
                type: "weapon",
                price: 5,
                attacks: [12, 13, 14],
                aliases: ["teen angst", "angst"],
            },
            {
                id: 15,
                name: "Pocket Protector",
                description: "Do they still make these things? A sturdy piece of plastic that goes in a shirt pocket and holds pens.",
                type: "armor",
                effect: 4,
                price: 5,
                aliases: ["pocket protector", "protector", "pocket"],
            },
            {
                id: 16,
                name: "Glasses",
                description: "A pair of bombastic bifocals.",
                type: "weapon",
                price: 10,
                attacks: [15, 16, 17],
                aliases: ["glasses", "spectacles"],
            },
            {
                id: 17,
                name: "Shoulder Pads",
                description: "Big, bulky shoulder pads designed to absorb impacts. Ironically worn by people with already gigantic shoulders.",
                type: "armor",
                effect: 3,
                price: 10,
                aliases: ["shoulder pads", "pads"],
            },
            {
                id: 18,
                name: "Ego",
                description: "The first step in succeeding is believing you can. This ego is inflated to the point of bursting.",
                type: "weapon",
                price: 5,
                attacks: [18, 19, 20],
                aliases: ["ego"],
            },
            {
                id: 19,
                name: "Backpack",
                description: "A worn-out Jansport backpack full of books.",
                type: "weapon",
                price: 1,
                attacks: [1, 2],
                aliases: ["backpack", "pack", "bookbag", "bag"]
            },
            {
                id: 20,
                name: "Tee Shirt",
                description: "A black tee shirt with System of a Down on the front.",
                type: "armor",
                effect: 2,
                price: 1,
                aliases: ["tee shirt", "shirt", "tee"]
            },
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
            in: "inside",
            enter: "inside",
        },
        conditions: [
            {
                id: 1,
                item: 5,
                container: null,
                location: 3,
                newLocation: 13,
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
            shop: "shop",
            explore: "explore",
            examine: "examine",
            // aliases for player commands - when aliases are in list form, index 0 is default
            look: ["look", "l", "description", "location", "area"],
            get: ["get", "grab", "take", "acquire", "cop"],
            drop: ["drop", "throw", "dump", "eject", "yeet"],
            examineCommands: ["examine", "x", "inspect"],
            shopBuy: ['buy', 'purchase', 'get'],
            shopSell: ['sell'],
            shopLeave: ['leave', 'done', 'quit'],
            // syntax: put {item} {container}
            put: ["put", "place", "insert", "set"],
            talk: ["talk", "speak", "chat", "converse"],
            armor: "armor",
            weapon: "weapon",
            equip: ["equip"],
            equipped: ["equipped"],
            unequip: ["unequip", "remove"],
            unequipped: ["unequipped"],
            useItem: {
                food: ["use", "consume", "eat"],
                potion: ["use", "consume", "drink"],
                key: ["use"],
            },
        },
        currencyTerms: {
            generic: "money",
            singular: "dollar",
            plural: "dollars"
        },
        enemies: [
            {
                id: 1,
                name: "Vice Principal",
                aliases: ["vice principle", "vice", "principal"],
                description: "An overdressed man with a thick southern accent. From what you can tell, he despises kids.",
                items: [],
                currency: 100,
                battleMessage: "The vice principal is trying to give you detention!",
                armor: 11,
                weapon: 12,
            },
            {
                id: 2,
                name: "Tank",
                aliases: ["tank", "dog"],
                description: "A small, white dog with an ironic name.",
                items: [],
                currency: 50,
                battleMessage: "Tank charges toward you and bares his tiny fangs!",
                armor: null,
                weapon: null,
            },
            {
                id: 3,
                name: "Punk Kid",
                aliases: ["punk kid", "kid", "punk"],
                description: "A kid who's clearly looking for trouble. Wears a spike choker and is poised to battle with weaponized teen angst.",
                items: [],
                currency: 10,
                battleMessage: "A Punk Kid is looking for a fight!",
                armor: 13,
                weapon: 14,
            },
            {
                id: 4,
                name: "Nerd",
                aliases: ["nerd"],
                description: "This kid has everything: thick glasses, pocket protector, and it looks like there's a laptop in their backpack.",
                items: [],
                currency: 10,
                battleMessage: "For some reason a Nerd is looking for trouble and they found you!",
                armor: 15,
                weapon: 16,
            },
            {
                id: 5,
                name: "Jock",
                aliases: ["jock"],
                description: "Great, a meathead who spends half their time in the weight room has challenged you to a fight. Good luck!",
                items: [],
                currency: 10,
                battleMessage: "A muscly Jock is squaring up and pounding their fist!",
                armor: 17,
                weapon: 18,
            }
        ],
        npcs: [
            {
                id: 1,
                name: "Cashier",
                aliases: ["cashier"],
                type: "shop",
                items: [{ id: 1, qty: 5 }, { id: 2, qty: 5 }, { id: 6, qty: 3 }],
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
                invalidItemLines: [
                    "I won't buy that junk.",
                    "Do I look like a sucker?",
                    "The sheer audacity of kids these days.",
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