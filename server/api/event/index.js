import { Router } from 'express';
import Actions from './actions';

const router = new Router();
const actions = new Actions();

// POST Methods
router.post('/create', actions.create);

// GET Methods
router.post('/adminEvents', actions.adminEvents);

export default router;
