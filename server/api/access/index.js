import { Router } from 'express';
import Actions from './actions';

const router = new Router();
const actions = new Actions();

// POST Methods
router.post('/create', actions.create);
router.post('/verify', actions.verify);
router.post('/history', actions.history);

// GET Methods

export default router;
