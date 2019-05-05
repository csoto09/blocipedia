'use strict';

const faker = require("faker");

let wikis = []

for(let i = 1; i <= 20; i++) {
  wikis.push({
    title: faker.lorem.words(),
    body: faker.lorem.lines(10),
    private: false,
    userId: 5,
    createdAt: new Date(),
    updatedAt: new Date()
  })
}
module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
   return queryInterface.bulkInsert("Wikis", wikis, {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
   return queryInterface.bulkDelete("Wikis", null, {});
  }
};
