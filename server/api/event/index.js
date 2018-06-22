import { Router } from 'express';
import Actions from './actions';

const router = new Router();
const actions = new Actions();

// POST Methods
router.post('/create', actions.create);

router.post('/update', actions.update);

router.post('/delete', actions.delete);

router.post('/adminEvents', actions.adminEvent);


export default router;
