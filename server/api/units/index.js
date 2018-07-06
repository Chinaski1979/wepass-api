import { Router } from 'express';
import Actions from './actions';

const router = new Router();
const actions = new Actions();

// POST Methods
router.post('/create', actions.create);
router.post('/addOcupant', actions.addOcupant);

// PUT Methods
router.put('/update/:unitId', actions.update);
router.put('/empty/:unitId', actions.empty);

// GET Methods
router.get('/byParentModule/:moduleId', actions.byParentModule);

// Delete Methods
router.delete('/:unitId', actions.deleteById);

export default router;
