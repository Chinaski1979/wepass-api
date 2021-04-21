import { Router } from 'express';
import Actions from './actions';

const router = new Router();
const actions = new Actions();

// POST Methods
router.post('/createAccount', actions.createAccount);
router.post('/refreshToken', actions.refreshToken);
router.post('/login', actions.login);
router.post('/trialRegistration', actions.trialRegistration);
router.post('/firstTimeAccess', actions.firstTimeAccess);

export default router;
