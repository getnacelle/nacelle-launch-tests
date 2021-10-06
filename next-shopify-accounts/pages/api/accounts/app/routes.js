const Express = require('express');
const passport = require('passport');
const router = Express.Router();

const AuthController = require('../controllers/auth.controller');

router.get('/auth/test', (req, res, next) => {
  console.log('HELLO');
  res.status(200).send({ works: 'works' });
});
router.get('/test', (req, res, next) => {
  console.log('HELLO2');
  res.status(200).send({ works: 'works' });
});
router.get('/accounts/test', (req, res, next) => {
  console.log('HELLO3');
  res.status(200).send({ works: 'works' });
});
router.get('api/auth/test', (req, res, next) => {
  console.log('HELLO3');
  res.status(200).send({ works: 'works' });
});
router.get('api/accounts/test', (req, res, next) => {
  console.log('HELLO3');
  res.status(200).send({ works: 'works' });
});

router.get('/auth/facebook', (req, res, next) => {
  const state = AuthController.preservedState(req);
  console.log('HELLO KIND OF WORKING');
  const authenticator = passport.authenticate('facebook', {
    scope: ['email'],
    session: false,
    state
  });
  authenticator(req, res, next);
});

router.get(
  '/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/', session: false }),
  AuthController.handleCallback
);

router.get('/auth/google/', (req, res, next) => {
  const state = AuthController.preservedState(req);
  const authenticator = passport.authenticate('google', {
    scope: ['openid', 'email', 'profile'],
    session: false,
    state
  });
  authenticator(req, res, next);
});

router.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/', session: false }),
  AuthController.handleCallback
);

router.get(
  '/auth/status',
  passport.authenticate('jwt', { session: false }),
  AuthController.getStatus
);

module.exports = router;
