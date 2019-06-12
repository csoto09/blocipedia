const Wiki = require('./models').Wiki
const User = require('./models').User;
const Collaborator = require('./models').Collaborator;

module.exports = {
  create(newCollab, callback) {
    return Collaborator.create(newCollab)
    .then((collab) => {
      callback(null, collab)
    }).catch((err) => {
      callback(err)
    });
  },

  delete(id, callback) {
    return Collaborator.destroy({ where: {id}})
    .then((deletedRecordsCount) => {
      callback(null, deletedRecordsCount);
    }).catch((err) => {
      callback(err)
    });
  }

}