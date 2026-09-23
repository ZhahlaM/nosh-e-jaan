// All recipes live here, in the same order as the book's recipe list.
// A recipe with only slug/title/section/colour shows as "coming soon" in the index.
// To publish it, fill in image, intro, serves, oven, time, ingredients and method
// (copy a finished entry such as Beetroot Brownies as a template).
// `image` is optional: if the file is missing, an illustrated placeholder is shown.
window.RECIPES = [
  { slug: "zhahlas-chai", title: "Zhahla\u2019s Chai", section: "chai", colour: "#A0522D" },

  { slug: "one-pot-chicken-pie", title: "One Pot Chicken Pie", section: "savoury", colour: "#B7853F" },
  { slug: "sweet-potato-fries", title: "Sweet Potato Fries", section: "savoury", colour: "#C8733A" },
  { slug: "french-chicken", title: "French Chicken", section: "savoury", colour: "#9A7B3F" },
  { slug: "one-pot-beef-pasta", title: "One Pot Beef Pasta", section: "savoury", colour: "#A4443A" },
  { slug: "moroccan-pastries", title: "Moroccan Pastries", section: "savoury", colour: "#B8863B" },
  { slug: "kadu-borani", title: "Kadu Borani", section: "savoury", colour: "#C06A2E" },
  { slug: "salad-shirazi", title: "Salad Shirazi", section: "savoury", colour: "#56705C" },
  { slug: "palak-paneer", title: "Palak Paneer", section: "savoury", colour: "#4E7045" },
  { slug: "baba-ganoush", title: "Baba Ganoush", section: "savoury", colour: "#7A6A5C" },
  { slug: "beetroot-and-walnut-dip", title: "Beetroot and Walnut Dip", section: "savoury", colour: "#8C2446" },

  {
    slug: "beetroot-brownies",
    title: "Beetroot Brownies",
    image: "images/beetroot-brownies.jpg",
    section: "sweet",
    colour: "#8C2446",
    intro:
      "Okay you might be thinking, why would you put beetroot in a brownie? Now I think these brownies are amazing. They are a great way of adding some vegetables into your diet and the brownies are fudgy and cakey in texture. Absolutely divine.",
    serves: "Six to seven people",
    oven: "200C / 180C Fan / Gas Mark 6",
    time: "20 min bake",
    ingredients: [
      "100g vegetable oil",
      "275g cooked beetroot",
      "3 large eggs",
      "60g cocoa powder",
      "100g soft pitted dates",
      "100g self raising flour",
      "1tsp ground cinnamon",
      "1tsp bicarbonate of soda",
      "75g plain dark chocolate",
    ],
    method: [
      "Preheat the oven to 200C/ 180C Fan/ Gas Mark 6.",
      "Line a baking tin that is around 20 x 20cm with baking paper (or a tin of a similar or equivalent size).",
      "Place beetroot, eggs, cocoa powder, dates and oil in a blender and blend until thoroughly combined.",
      "Add the flour, cinnamon, a pinch of sea salt and bicarbonate of soda and blend until well combined.",
      "Stir in the chocolate then spoon into the tin.",
      "Bake for 20 minutes or until risen and just firm to the touch.",
      "Cool in the tin for 10 minutes then turn out and cut into squares to serve.",
    ],
  },
  {
    slug: "chocolate-mug-cake",
    title: "Chocolate Mug Cake",
    image: "images/chocolate-mug-cake.jpg",
    section: "sweet",
    colour: "#5A3A31",
    intro:
      "After busy days at uni, I would make a mug cake for myself in the evening and cosy up and eat this with some ice cream. With a show on in the background, this was a perfect little self care moment for me.",
    serves: "One",
    oven: "Microwave",
    time: "About 80 seconds",
    ingredients: [
      "3tbsp self raising flour",
      "3tbsp caster sugar (or maple syrup)",
      "1.5tbsp cocoa powder",
      "0.25tsp table salt",
      "0.25tsp baking powder",
      "4tbsp oat milk",
      "2tbsp vegetable oil (or olive oil)",
      "0.5tsp vanilla extract",
      "30g dark chocolate",
    ],
    method: [
      "Mix the dry ingredients together, then add the oat milk, vegetable oil and vanilla extract.",
      "Mix until smooth, place chocolate in the mixture and microwave for about 80 seconds.",
    ],
  },
  {
    slug: "raspberry-bakewell-cake",
    title: "Raspberry Bakewell Cake",
    image: "images/raspberry-bakewell-cake.jpg",
    section: "sweet",
    colour: "#C8677A",
    intro: "",
    serves: "Six to seven people",
    oven: "180C / 160C Fan / Gas 4",
    time: "50 min bake",
    ingredients: [
      "140g ground almonds",
      "140g butter",
      "140g golden caster sugar",
      "140g self raising flour",
      "2 eggs",
      "1tsp vanilla extract",
      "250g raspberries",
      "2tsp flaked almonds (optional)",
      "Icing sugar to serve (optional)",
    ],
    method: [
      "Heat oven to 180C/160C fan/Gas 4.",
      "Base-line and grease a deep 20cm loose-bottomed cake tin or something of a similar size.",
      "Melt the butter in the microwave or in a pot. Then mix the ground almonds, butter, sugar, flour, eggs and vanilla extract until well combined.",
      "Spread half the mix over the cake tin and smooth over the top. Scatter the raspberries over, then dollop the remaining cake mixture on top and roughly spread. You might find this easier to do with your fingers. Scatter with flaked almonds and bake for 50 mins until golden.",
      "Cool, remove from the tin and dust with icing sugar to serve.",
    ],
  },
];

window.SECTIONS = [
  { id: "chai", label: "Chai", title: "To start, a cup of chai" },
  { id: "savoury", label: "Savoury", title: "Savoury" },
  { id: "sweet", label: "Sweet", title: "Something sweet" },
];
