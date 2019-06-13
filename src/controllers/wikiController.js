// TODO: implement authorization, maybe
const wikiQueries = require('../db/queries.wikis');
const userQueries = require('../db/queries.users');
const Authorizer = require('../policies/application')

const md = require('markdown-it')();

module.exports = {
  index (req, res, next) {
    wikiQueries.getAllWikis((err, wikis) => {
      if(err) {
        res.redirect(500, '/')
        console.log(err);
        
      } else {
        res.render('wikis/index', {wikis})
      }
    })
  },
  privateIndex(req, res, next) {
    wikiQueries.getPrivateWikis(req.user, (err, wikis) => {
      if (err) {
        res.redirect(500, '/')
      } else {
        console.log(req.user);
        
        res.render('wikis/priv', {wikis})
      }
    })
  },
  new(req, res, next) {
    const authorized = new Authorizer(req.user).new()

    if(authorized) {
      res.render('wikis/new')
    } else {
      req.flash('notice', 'You are not authorized to do that. Please sign in and try again.')
      res.redirect('/wikis')
    }

  },
  create(req, res, next) {
    const authorized = new Authorizer(req.user).create();
    if(authorized) {
      let newWiki = {
        title: req.body.title,
        body: req.body.body,
        private: req.body.private,
        userId: req.user.id
      }
      wikiQueries.addWiki(newWiki, (err, wiki) => {
        if(err) {
          console.log(err);
          res.redirect(500, '/wikis/new')
        } else {
          req.flash('notice', 'success')
          res.redirect(303, `/wikis/${wiki.id}`)
        }
      })
    } else {
      req.flash('notice', 'You are not authorized to do that. Please sign in and try again.')
      res.redirect('/wikis')
    }

  },
  show(req, res, next) {
    wikiQueries.getWiki(req.params.id, (err, wiki) => {      
      if(err || wiki == null) {
        res.redirect(404,'/')
      } else {
        if(!wiki.private || req.user.id === wiki.userId)
        res.render('wikis/show', {wiki, md})
      }
    })
  },
  destroy(req, res, next) {
    wikiQueries.deleteWiki(req.params.id, (err, deletedRecordsCount) => {
      if (err) {
        res.redirect(500, `/wikis/${req.params.id}`)
      } else {
        res.redirect(303, `/wikis`)
      }
    })
  },
  edit(req, res, next) { 
    wikiQueries.getWiki(req.params.id, (err, wiki) => {
      if(err || wiki == null) {
        res.redirect(404, '/')
      } else {
        const authorized = new Authorizer(req.user, topic).edit()
        if(authorized) {
          res.render('wikis/edit', {wiki})
        } else {
          req.flash('You are not authorized to do that.')
          res.redirect(`/wikis/${req.params.id}`)
        }

      }
    })
  },
  update(req, res, next) {
    wikiQueries.updateWiki(req.params.id, req.body, (err, wiki) => {
      if(err || wiki == null) {
        res.redirect(404, `/wikis/${req.params.id}/edit`)
      } else {
        res.redirect(`/wikis/${req.params.id}`)
      }
    })
  }, 
  addCollab(req, res, next) {
    wikiQueries.getWiki(req.params.id, (err, wiki) => {
      if(err || wiki == null) {
        res.redirect(404, '/')
      } else {
        const authorized = new Authorizer(req.user, wiki).edit()
        if(authorized) {
          userQueries.getAllUsers((err, users) => {
            if (err) { 
              res.redirect(404, '/')
              req.flash('You are not authorized to do that')
            } else {
              res.render('wikis/editcollab', {wiki, users})
            }
          })
        } else {
          req.flash('You are not authorized to do that.')
          res.redirect(`/wikis/${req.params.id}`)
        }

      }
    })
  }   
}