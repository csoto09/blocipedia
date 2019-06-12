
const collabQueries = require('../db/queries.collaborators');
module.exports = {
  addCollab(req, res, next) {
    let newCollab = {
      userId: req.body.userId,
      wikiId: req.params.id
    }
    collabQueries.create(newCollab, (err, collab) => {
      if(err) {
        req.flash('error', 'There has been an error adding your collaborator. Please try again.')
        res.redirect(`/wikis/${req.params.id}/add-collab`)
      } else {
        req.flash('notice', 'Collaborator added.')
        res.redirect(303, `/wikis/${req.params.id}`)
      }
    })
  },
  removeCollab(req, res, next) {
    collabQueries.delete(req.params.id, (err, deletedRecordsCount) => {
      if(err) {
        req.flash("error", err);
        res.redirect(`/wikis/${req.params.id}`)
      } else {
        req.flash('notice', 'removed successfully')
        res.redirect(`/wikis/${req.params.id}/editcollab`)
      }
    })
  }
}
