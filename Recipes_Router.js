// initial functions

const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');

const {Recipes} = require('./models');

const jsonParser = bodyParser.json();

// 1 - Create recipes
Recipes.create('Chocolate Milk', ['cocoa', 'Milk', 'Sugar']);
Recipes.create(
  'boiled white rice', ['1 cup white rice', '2 cups water', 'pinch of salt']);
Recipes.create(
  'milkshake', ['2 tbsp cocoa', '2 cups vanilla ice cream', '1 cup milk']);

// 2 - Retrieve recipe - GET
router.get('/', (req, res) => {
  res.json(Recipes.get());
});

// 3 - POST recipe
router.post('/', jsonParser, (req, res) => {
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

// 5 - PUT recipes = update
router.put('/:id', jsonParser, (req, res) => {
  const requiredFields = ['name', 'ingredients', 'id'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }
  if (req.params.id !== req.body.id) {
    const message = (
      `Request path id (${req.params.id}) and request body id `
      `(${req.body.id}) must match`);
    console.error(message);
    return res.status(400).send(message);
  }
  console.log(`Updating recipes item \`${req.params.id}\``);
  const updatedItem = Recipes.update({
    id: req.params.id,
    name: req.body.name,
    ingredients: req.body.ingredients
  });
  res.status(204).json(updatedItem);
});

// 4 - DELETE recipes
router.delete('/:id', (req, res) => {
  Recipes.delete(req.params.id);
  console.log(`Deleted recipes item \`${req.params.id}\``);
  res.status(204).end();
});

module.exports = router;