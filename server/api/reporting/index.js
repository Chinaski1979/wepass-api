import { Router } from 'express';
import Actions from './actions';

const router = new Router();
const actions = new Actions();

// Post Methods
router.post('/incidents/create', actions.createIncident);

// Get Methods
router.get('/incidents/:propertyId', actions.incidentsByProperty);

export default router;
