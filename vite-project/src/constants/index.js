const flavorlists = [
  { name: "Classic Latte",     color: "brown",  rotation: "md:rotate-[-8deg] rotate-0" },
  { name: "Cappuccino",        color: "red",    rotation: "md:rotate-[8deg] rotate-0" },
  { name: "Iced Cold Brew",    color: "blue",   rotation: "md:rotate-[-8deg] rotate-0" },
  { name: "Caramel Macchiato", color: "orange", rotation: "md:rotate-[8deg] rotate-0" },
  { name: "Vanilla Mocha",     color: "white",  rotation: "md:rotate-[-8deg] rotate-0" },
  { name: "Double Espresso",   color: "black",  rotation: "md:rotate-[8deg] rotate-0" },
];

const nutrientLists = [
  { label: "Caffeine", amount: "95mg" },
  { label: "Calcium", amount: "120mg" },
  { label: "Protein", amount: "3g" },
  { label: "Potassium", amount: "150mg" },
  { label: "Antioxidants", amount: "300mg" },
];

const cards = [
  { src: "/videos/f1.mp4", rotation: "rotate-z-[-10deg]", name: "Sara",  img: "/images/p1.png", translation: "translate-y-[-5%]" },
  { src: "/videos/f2.mp4", rotation: "rotate-z-[4deg]",   name: "Omar",  img: "/images/p2.png" },
  { src: "/videos/f3.mp4", rotation: "rotate-z-[-4deg]",  name: "Lina",  img: "/images/p3.png", translation: "translate-y-[-5%]" },
  { src: "/videos/f4.mp4", rotation: "rotate-z-[4deg]",   name: "Bilal", img: "/images/p4.png", translation: "translate-y-[5%]" },
];
export { flavorlists, nutrientLists, cards };