import { Router } from 'express';
import Actions from './actions';

const router = new Router();
const actions = new Actions();

// POST Methods
router.post('/create', actions.create);
router.post('/verify', actions.verify);

// GET Methods
// router.get('/history', actions.history);

export default router;
