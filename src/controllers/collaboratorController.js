//TODO: finish methods below

const collabQueries = require('../db/queries.collaborators');
const userQueries = require('../db/queries.users');
module.exports = {
  addCollab(res, req, next) {
    userQueries.getUser({where: {id: req.body.user}})
    .then((user) => {
      
    }).catch((err) => {
      
    });
  },
  removeCollab(res, req, next) {

  }
}

//TODO: bring in users and wikis. save to collab model