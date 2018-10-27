const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const _ = require('underscore');
const verbose = process.env.NODE_ENV != 'test';
const app = express();
const port = 9000;
const Backbone = require('backbone');

// Config
app.set('view engine', 'ejs');
app.set('layout', path.join(__dirname, 'views', 'layout'));
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'));
app.use('/js/lib', express.static('node_modules'));
app.use(expressLayouts);

// Routing
app.get('/', (req, res, next) => {
  try {
    res.locals = {
      title: 'Example',
      message: 'This is a message'
    };
    res.render('view');
  }
  catch(err) {
    next(err);
  }
});
app.use((req, res, next) => {
  res.status(404).send("Sorry can't find that!")
});
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.locals = {
    title: 'Internal server error',
    name: err.name,
    message: err.message,
    stack: _.difference(err.stack.split('\n'), err.message.split('\n')),
    headerClass: 'header-error'
  };
  res.status(500).render('http500');
  res.status(500).send(err.stack);
});

// Start server
app.listen(port, () => console.log(`Name builder listening on port ${port}!`));
