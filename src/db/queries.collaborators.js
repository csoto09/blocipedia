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

  delete(req, callback) {
    return Collaborator.findByPk(req.params.id)
    .then((collab) => {
      return collab.destroy()
    }).catch((err) => {
      callback(err)
    });
  }

}