module.exports = {
  init(app){
    const staticRoutes = require("../routes/static");
    const userRoutes = require('../routes/users');
    const wikiRoutes = require('../routes/wikis');
    const collabRoutes = require('../routes/collaborators');
    app.use(staticRoutes);
    app.use(userRoutes);
    app.use(wikiRoutes)
    app.use(collabRoutes)
  }
}