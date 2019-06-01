const Wiki = require('./models').Wiki;
const User = require('./models').User;
const Sequelize = require('Sequelize');
const Op = Sequelize.Op


module.exports = {
  getAllWikis(callback) {
    return Wiki.findAll({
      where: {
        private: {
          [Op.not]: true
        }
      }
    })
    .then((wikis) => {
      callback(null, wikis)
    }).catch((err) => {
      callback(err)      
    });
  },
  addWiki(newWiki, callback) {
    return Wiki.create(newWiki)
    .then((wiki) => {
      callback(null, wiki)
    }).catch((err) => {
      console.log(err);
      callback(err)
    });
  },
  getWiki(id, callback) {
    return Wiki.findByPk(id)
    .then((wiki) => {
      callback(null, wiki)
    }).catch((err) => {
      callback(err)
    });
  },
  deleteWiki(id, callback) {
    return Wiki.destroy({
      where: {id}
    })
    .then((deletedRecordsCount) => {
      callback(null, deletedRecordsCount)
    }).catch((err) => {
      callback(err)
    });
  },
  updateWiki(id, updatedWiki, callback) {
    return Wiki.findByPk(id)
    .then((wiki) => {
      if(!wiki) {
        return callback('Wiki not found')
      }

      wiki.update(updatedWiki, {fields: Object.keys(updatedWiki)})
      .then(() => {
        callback(null, wiki)
      }).catch((err) => {
        callback(err)
      });
    })
  },
  getPrivateWikis(user, callback) {
    if(user.role === 1) {
    return Wiki.findAll({
      where: {
        private: true,
        userId: user.id
      }
    })
    .then((wikis) => {
      callback(null, wikis)
    }).catch((err) => {
      callback(err)      
    });
    } else {
      callback(err)
    }
  },
  makePublic(user, callback) {
    Wiki.findAll({
      where: { userId: user.id }
    })
    .then((wikis) => {
      for(let i = 0; i < wikis.length; i++) {
        wikis[i].update({
          private: false
        })
      }
    }).catch((err) => {
      callback(err)
    });
  }
}