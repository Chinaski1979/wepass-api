import { Router } from 'express';
import Actions from './actions';

const router = new Router();
const actions = new Actions();

// POST Methods
router.post('/create', actions.create);

// PUT Methods
router.put('/update/:moduleId', actions.update);

// GET Methods
router.get('/byProperty/:propertyId', actions.byProperty);

// Delete Methods
router.delete('/:moduleId', actions.deleteById);


export default router;
