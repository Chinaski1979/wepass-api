import { Router } from 'express';
import Actions from './actions';

const router = new Router();
const actions = new Actions();

// GET Methods
router.get('/search/:vehiclePlate', actions.searchUser);
router.get('/searchByQuery', actions.searchByQuery);
router.get('/searchByParentPremise', actions.searchByParentPremise);

// DELETE Methods
router.delete('/:userId', actions.delete);

export default router;
