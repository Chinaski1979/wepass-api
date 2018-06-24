import { Router } from 'express';
import Actions from './actions';

const router = new Router();
const actions = new Actions();

router.post('/', actions.create);

router.put('/:eventId', actions.update);

router.delete('/:eventId', actions.delete);

router.get('/:adminId', actions.adminEvent);

export default router;
