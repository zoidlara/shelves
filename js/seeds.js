// Starter shelf: the books and films Mirko asked for.
// Covers and genres are looked up online the first time the shelf loads.

const hp = [
  ["Harry Potter and the Philosopher's Stone", 1997, "An orphaned boy living in a cupboard under the stairs learns on his eleventh birthday that he is a wizard, and is whisked away to Hogwarts School of Witchcraft and Wizardry, where friendship, mystery and a hidden stone await.", 223],
  ["Harry Potter and the Chamber of Secrets", 1998, "Harry's second year at Hogwarts brings whispering walls, petrified students and an ancient legend about a hidden chamber that only the heir of Slytherin can open.", 251],
  ["Harry Potter and the Prisoner of Azkaban", 1999, "A dangerous prisoner has escaped Azkaban and seems to be hunting Harry, while dementors guard the school and old secrets about his parents come to light.", 317],
  ["Harry Potter and the Goblet of Fire", 2000, "Harry is mysteriously entered into the perilous Triwizard Tournament, a contest of dragons, lakes and labyrinths that ends with the return of an old darkness.", 636],
  ["Harry Potter and the Order of the Phoenix", 2003, "With the Ministry refusing to believe Voldemort has returned, Harry and his friends form a secret band to learn defence while a toad-like professor tightens her grip on Hogwarts.", 766],
  ["Harry Potter and the Half-Blood Prince", 2005, "Dumbledore shares memories of the young Tom Riddle with Harry, while a mysterious old potions book marked 'property of the Half-Blood Prince' changes everything.", 607],
  ["Harry Potter and the Deathly Hallows", 2007, "Harry, Ron and Hermione leave Hogwarts behind to hunt the Horcruxes that keep Voldemort alive, uncovering the legend of three powerful Hallows along the way.", 607],
];

export const SEED_ITEMS = [
  {
    kind: "book", status: "done", title: "Fourth Wing", creator: "Rebecca Yarros", year: "2023",
    description: "Twenty-year-old Violet Sorrengail was meant to live a quiet life among books, but her mother orders her into Basgiath War College to train as a dragon rider, where dragons bond with only the strong and everyone around her wants her dead.",
    genres: ["Romantasy", "Dragons", "Fantasy"], extra: { series: "The Empyrean #1", pages: 498 },
  },
  ...hp.map(([title, year, description, pages], i) => ({
    kind: "book", status: "done", title, creator: "J.K. Rowling", year: String(year), description,
    genres: ["Fantasy", "Magic", "School"], extra: { series: `Harry Potter #${i + 1}`, pages },
  })),

  { kind: "film", status: "done", title: "Shrek", creator: "Andrew Adamson, Vicky Jenson", year: "2001",
    description: "A grumpy ogre whose swamp is overrun by fairy-tale creatures strikes a deal with a tiny tyrant: rescue the feisty Princess Fiona from a dragon-guarded tower, with a talkative donkey in tow.",
    genres: ["Animation", "Comedy", "Fairy tale"] },
  { kind: "film", status: "done", title: "Legally Blonde", creator: "Robert Luketic", year: "2001",
    description: "Sorority queen Elle Woods follows her ex to Harvard Law School to prove she is serious, and discovers she is a far better lawyer than anyone expected.",
    genres: ["Comedy", "Romance"] },
  { kind: "film", status: "done", title: "Mr. Bean's Holiday", creator: "Steve Bendelack", year: "2007",
    description: "Mr. Bean wins a trip to Cannes and stumbles across France with a camcorder, a lost boy and a string of glorious mishaps.",
    genres: ["Comedy"] },
  { kind: "film", status: "done", title: "Barbie as Rapunzel", creator: "Owen Hurley", year: "2002",
    description: "Rapunzel, kept by the wicked Gothel, discovers a magic paintbrush that opens a path to a hidden kingdom, a prince, and her true family.",
    genres: ["Animation", "Princess", "Fairy tale"] },
  { kind: "film", status: "done", title: "Barbie as the Princess and the Pauper", creator: "William Lau", year: "2004",
    description: "A princess and a village seamstress who look exactly alike trade places to save a kingdom, in a musical full of songs and a very brave cat.",
    genres: ["Animation", "Princess", "Musical"] },
  { kind: "film", status: "done", title: "Barbie in the 12 Dancing Princesses", creator: "Greg Richardson", year: "2006",
    description: "Princess Genevieve and her eleven sisters find a secret magical kingdom where they can dance through the night, while a scheming duchess plots against their father.",
    genres: ["Animation", "Princess", "Ballet"] },
  { kind: "film", status: "done", title: "Barbie as the Island Princess", creator: "Greg Richardson", year: "2007",
    description: "Shipwrecked as a child and raised by animals, Ro discovers she may be a lost princess when a prince arrives on her island.",
    genres: ["Animation", "Princess", "Musical"] },

  { kind: "show", status: "done", title: "Mr. Bean", creator: "ITV", year: "1990",
    description: "Rowan Atkinson's almost wordless, endlessly inventive man-child turns the smallest everyday tasks into chaos and comedy.",
    genres: ["Comedy"] },
];
