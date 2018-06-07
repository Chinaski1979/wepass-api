import { Router } from 'express';
import Actions from './actions';

const router = new Router();
const actions = new Actions();

// POST Methods
router.post('/create', actions.create);
router.post('/addOcupant', actions.addOcupant);

// GET Methods
router.get('/byParentModule/:moduleId', actions.byParentModule);

export default router;
