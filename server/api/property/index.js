import { Router } from 'express';
import Actions from './actions';

const router = new Router();
const actions = new Actions();

// POST Methods
router.post('/create', actions.create);
router.post('/addAdmin', actions.addAdmin);

// PUT Methods
router.put('/update/:propertyId', actions.update);

// GET Methods
router.post('/adminProperties', actions.adminProperties);

export default router;
