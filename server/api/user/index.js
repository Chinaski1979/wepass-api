import { Router } from 'express';
import Actions from './actions';

const router = new Router();
const actions = new Actions();

// GET Methods
router.get('/search/:vehiclePlate', actions.searchUser);
router.get('/searchByQuery', actions.searchByQuery);
router.get('/searchByParentPremise', actions.searchByParentPremise);
router.get('/resetPasswordForm/:token', actions.resetPasswordForm);

// DELETE Methods
router.delete('/:userId', actions.delete);

// PUT Methods
router.put('/:userId', actions.update);

// POST Methods
router.post('/sendResetPasswordEmail/:email', actions.sendResetPasswordEmail);
router.post('/changePassword/:token', actions.changePassword);

export default router;
