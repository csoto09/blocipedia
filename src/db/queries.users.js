const User = require("./models").User;
const Wiki = require('./models').Wiki;
const Collaborator = require('./models').Collaborator;
const bcrypt = require("bcryptjs");
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);



module.exports = {
  createUser(newUser, callback){
    const salt = bcrypt.genSaltSync()
    const hashedPassword = bcrypt.hashSync(newUser.password, salt)

    return User.create({
      name: newUser.name,
      email: newUser.email,
      password: hashedPassword
    })
    .then((user) => {
      const msg = {
        to: `${user.email}`,
        from: 'csoto09@gmail.com',
        subject: 'Welcome to Blocipedia!',
        text: `Dear ${user.name},\n\n You successfully created an account at Blocipedia! That makes you the coolest cat on the bloc!`,
        html: `<p>Dear ${user.name},</p>
        
        <p>You successfully created an account at Blocipedia! That makes you the coolest cat on the bloc!</p>`,
      };
      sgMail.send(msg);
      callback(null, user)
    }).catch((err) => {
      callback(err)
    });
  },
  getUser(id, callback) {
    User.findByPk(id)
    .then((user) => {
      callback(null, user)
    }).catch((err) => {
      callback(err)
    });
  },
  upgradeUser(req, callback) {
    return User.update(
      {role: 1},
      {where: {id: req.user.id}}
    )
    .then((user) => {
      callback(null, user)
    }).catch((err) => {
      callback(err)
    });
  },
  downgradeUser(req, callback) {
    return User.update(
      {role: 0},
      {where: {id: req.user.id}}
    )
    .then((user) => {
      callback(null, user)
    }).catch((err) => {
      callback(err)
    });
  },
  makeAdmin(req, callback) {
    return User.update(
      {role: 2},
      {where: {id: req.user.id}}
    ).then((user) => {
      callback(null, user)
    }).catch((err) => {
      callback(err)
    });
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
  },
  getAllUsers(callback) {
    return User.findAll({
      include: [
        {
          model: Collaborator,
          as: 'collaborators'
        }
      ]
    }).then((users) => {
      callback(null, users)
    }).catch((err) => {
      callback(err)
    })
  }
}