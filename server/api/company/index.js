import { Router } from 'express';
import Actions from './actions';

const router = new Router();
const actions = new Actions();

// POST Methods
router.post('/create', actions.create);
router.post('/addAdmin', actions.addAdmin);

// Get Methods
router.get('/:companyId', actions.getById);

export default router;
