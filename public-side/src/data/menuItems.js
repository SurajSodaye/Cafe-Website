export const menuItems = [
  // COFFEE
  {
    id: "item-1",
    name: "Bloom Signature Flat White",
    description: "Double ristretto of Chikmagalur Arabica with silky micro-foam, velvety texture, and caramel undertones.",
    price: 240,
    category: "coffee",
    imageUrl: "https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&w=700&q=80",
    isVeg: true,
    isPopular: true,
    available: true
  },
  {
    id: "item-2",
    name: "Single Origin Pour-Over (V60)",
    description: "Light roast estate beans from Attikan Estate with crisp notes of jasmine, orange peel, and raw honey.",
    price: 260,
    category: "coffee",
    imageUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=700&q=80",
    isVeg: true,
    isPopular: false,
    available: true
  },
  {
    id: "item-3",
    name: "Classic Spanish Latte",
    description: "Espresso sweetened with slow-cooked condensed milk, dusted with organic Ceylon cinnamon.",
    price: 270,
    category: "coffee",
    imageUrl: "https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=700&q=80",
    isVeg: true,
    isPopular: true,
    available: true
  },
  {
    id: "item-4",
    name: "Vanilla Bean Cortado",
    description: "Equal parts intense espresso and warm steamed whole milk infused with authentic Madagascan vanilla pods.",
    price: 220,
    category: "coffee",
    imageUrl: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=700&q=80",
    isVeg: true,
    isPopular: false,
    available: false // Demonstrates sold out state
  },

  // TEA
  {
    id: "item-5",
    name: "Kashmiri Kahwa Reserve",
    description: "Delicate green tea leaves simmered with Kashmiri saffron strands, green cardamom, cinnamon, and slivered almonds.",
    price: 210,
    category: "tea",
    imageUrl: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=700&q=80",
    isVeg: true,
    isPopular: false,
    available: true
  },
  {
    id: "item-6",
    name: "Masala Chai Pot with Ginger & Jaggery",
    description: "Authentic Assam CTC slow-steeped with fresh grated ginger, crushed cloves, organic jaggery, and creamy milk.",
    price: 160,
    category: "tea",
    imageUrl: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=700&q=80",
    isVeg: true,
    isPopular: true,
    available: true
  },
  {
    id: "item-7",
    name: "Hibiscus Rose Petal Infusion",
    description: "Caffeine-free tart crimson botanical tea infused with sun-dried organic rosebuds and fresh mint leaves.",
    price: 190,
    category: "tea",
    imageUrl: "https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?auto=format&fit=crop&w=700&q=80",
    isVeg: true,
    isPopular: false,
    available: true
  },

  // COLD DRINKS
  {
    id: "item-8",
    name: "18-Hour Cascara Cold Brew",
    description: "Steeped slowly overnight for maximum smoothness, zero bitterness, finished with an orange peel zest twist.",
    price: 250,
    category: "cold-drinks",
    imageUrl: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=700&q=80",
    isVeg: true,
    isPopular: true,
    available: true
  },
  {
    id: "item-9",
    name: "Yuzu Espresso Tonic",
    description: "Chilled effervescent Japanese yuzu tonic layered over a freshly pulled double shot of specialty espresso.",
    price: 280,
    category: "cold-drinks",
    imageUrl: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=700&q=80",
    isVeg: true,
    isPopular: false,
    available: true
  },
  {
    id: "item-10",
    name: "Matcha Mint Coconut Cooler",
    description: "Ceremonial Uji matcha hand-whisked with cold-pressed tender coconut water and bruised garden mint.",
    price: 270,
    category: "cold-drinks",
    imageUrl: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=700&q=80",
    isVeg: true,
    isPopular: false,
    available: true
  },
  {
    id: "item-11",
    name: "Belgian Chocolate Iced Frappe",
    description: "54% Callebaut dark chocolate melted with espresso and double cream, crowned with dark cacao nibs.",
    price: 290,
    category: "cold-drinks",
    imageUrl: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=700&q=80",
    isVeg: true,
    isPopular: false,
    available: true
  },

  // SNACKS
  {
    id: "item-12",
    name: "Truffled Mushroom & Brie Sourdough",
    description: "Pan-roasted wild cremini mushrooms, French Brie, white truffle oil, and thyme on toasted house sourdough.",
    price: 360,
    category: "snacks",
    imageUrl: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=700&q=80",
    isVeg: true,
    isPopular: true,
    available: true
  },
  {
    id: "item-13",
    name: "Avocado & Heritage Tomato Tartine",
    description: "Hass avocado mash, heirloom cherry tomatoes, dukkah spice crunch, micro-greens, and balsamic glaze on rustic bread.",
    price: 380,
    category: "snacks",
    imageUrl: "https://images.unsplash.com/photo-1588137378633-dea1336ce1e2?auto=format&fit=crop&w=700&q=80",
    isVeg: true,
    isPopular: false,
    available: true
  },
  {
    id: "item-14",
    name: "Smoked Chicken & Pesto Panini",
    description: "Herb-smoked tender chicken breast, basil pine-nut pesto, fresh mozzarella, and sun-dried tomatoes in ciabatta.",
    price: 390,
    category: "snacks",
    imageUrl: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=700&q=80",
    isVeg: false,
    isPopular: true,
    available: true
  },
  {
    id: "item-15",
    name: "Spiced Sweet Potato & Feta Croquettes",
    description: "Crispy panko-crusted roasted sweet potato and goat feta patties served with garlic aioli and coriander dip.",
    price: 310,
    category: "snacks",
    imageUrl: "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=700&q=80",
    isVeg: true,
    isPopular: false,
    available: true
  },
  {
    id: "item-16",
    name: "Crispy Bacon & Egg Brioche Roll",
    description: "Smoked streaky pork bacon, free-range runny fried egg, aged cheddar, and house tomato relish on a toasted brioche bun.",
    price: 370,
    category: "snacks",
    imageUrl: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=700&q=80",
    isVeg: false,
    isPopular: false,
    available: false // Demonstrates sold out non-veg
  },

  // DESSERTS
  {
    id: "item-17",
    name: "Flaky Almond Frangipane Croissant",
    description: "Twice-baked French butter croissant filled with rich almond cream and showered in toasted sliced almonds.",
    price: 230,
    category: "desserts",
    imageUrl: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=700&q=80",
    isVeg: true,
    isPopular: true,
    available: true
  },
  {
    id: "item-18",
    name: "Burnt Basque Cheesecake",
    description: "Caramelized exterior with a decadently creamy, molten center, served with warm berry compote.",
    price: 320,
    category: "desserts",
    imageUrl: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=700&q=80",
    isVeg: true,
    isPopular: true,
    available: true
  },
  {
    id: "item-19",
    name: "Warm Valrhona Dark Molten Lava Cake",
    description: "Single-origin 70% dark chocolate sponge with an oozing liquid chocolate center and Madagascar vanilla gelato.",
    price: 340,
    category: "desserts",
    imageUrl: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=700&q=80",
    isVeg: true,
    isPopular: false,
    available: true
  },
  {
    id: "item-20",
    name: "Pistachio Rose Tea Cake",
    description: "Tender Persian pistachio crumb infused with rose water, topped with crushed green pistachios and dried rosebuds.",
    price: 250,
    category: "desserts",
    imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=700&q=80",
    isVeg: true,
    isPopular: false,
    available: true
  }
];
