
const express = require('express');
const router = express.Router();
const morgan = require('morgan');
const bodyParser = require('body-parser');

// const {ShoppingList} = require('./models');
// const {Recipes} = require('./models');
const {ShoppingList, Recipes} = require('./models');

const jsonParser = bodyParser.json();
const app = express();

// log the http layer
app.use(morgan('common'));
app.use(jsonParser);

// we're going to add some items to ShoppingList
// so there's some data to look at
ShoppingList.create('beans', 2);
ShoppingList.create('tomatoes', 3);
ShoppingList.create('peppers', 4);

// when the root of this router is called with GET, return
// all current ShoppingList items
app.get('/shopping-list', (req, res) => {
  res.json(ShoppingList.get());
});

// app.post('/shopping-list',jsonParser, (req, res) => {
//   ShoppingList.create('bread', 5);
//   console.log(req.body.name);
//   res.json(ShoppingList.get());
// });

app.post('/shopping-list', jsonParser, (req, res) => {
  // ensure `name` and `budget` are in request body
  const requiredFields = ['name', 'budget'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }

  const item = ShoppingList.create(req.body.name, req.body.budget);
  res.status(201).json(item);
});

app.delete('/shopping-list/:id', (req, res) => {
  ShoppingList.delete(req.params.id);
  console.log(`Deleted shopping list item \`${req.params.id}\``);
  res.status(204).end();
});

// 1 - Create recipes
Recipes.create('Chocolate Milk', ['cocoa', 'Milk', 'Sugar']);
Recipes.create(
  'boiled white rice', ['1 cup white rice', '2 cups water', 'pinch of salt']);
Recipes.create(
  'milkshake', ['2 tbsp cocoa', '2 cups vanilla ice cream', '1 cup milk']);

// 2 - Retrieve recipe - GET
app.get('/recipes', (req, res) => {
  res.json(Recipes.get());
});

// 3 - POST recipe
app.post('/recipes', jsonParser, (req, res) => {
  // ensure `name` and `ingredients` are in request body
  const requiredFields = ['name', ['ingredients']];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }

  const item = Recipes.create(req.body.name, req.body.ingredients);
  res.status(201).json(item);
});

// 4 - DELETE recipes
app.delete('/recipes/:id', (req, res) => {
  Recipes.delete(req.params.id);
  console.log(`Deleted recipes item \`${req.params.id}\``);
  res.status(204).end();
});

app.listen(process.env.PORT || 8080, () => {
  console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
});
