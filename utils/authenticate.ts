const passport = require('passport')

function ensureAuthenticated(req: any, res: any, next: any) {
    if (req.isAuthenticated()) {
      return next();
    } else res.redirect('/login');
  }

function forwardAuthenticated(req: any, res: any, next: any) {
    if (!req.isAuthenticated()) {
      return next();
    } else {
      res.redirect('/')
    } 
}

module.exports = {ensureAuthenticated, forwardAuthenticated}