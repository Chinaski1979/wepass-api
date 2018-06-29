import { Router } from 'express';
import Actions from './actions';

const router = new Router();
const actions = new Actions();

// POST Methods
router.post('/create', actions.create);
router.post('/addAdmin', actions.addAdmin);

// PUT Methods
router.put('/update/:companyId', actions.update);

// Get Methods
router.get('/:companyId', actions.getById);
router.get('/:companyId/properties', actions.getProperties);

// Delete Methods
router.delete('/:companyId', actions.deleteById);

export default router;
