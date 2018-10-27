let Greet = Backbone.View.extend({
  initialize: (name) => {
    this.name = name;
    this.el = $('div.greet');
    this.template = _.template('Hello <%= name %>!!!');
  },
  render: () => {
    this.el.html(this.template({name: 'World'}));
  }
});
