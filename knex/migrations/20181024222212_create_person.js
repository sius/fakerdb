
exports.up = function(knex, Promise) {
  return knex.schema.createTable('person', function (table) {
    table.increments();
    table.string('name');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('person');
};
