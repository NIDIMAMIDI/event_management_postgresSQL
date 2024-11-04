import { Router } from 'express';
import { authorization } from '../../middlewares/authorization/authorization.middlewares.js';
import {
  allEvents,
  cancelEventRegister,
  createEvent,
  deleteEvent,
  getEvent,
  registerEvent,
  updateEvent
} from '../../controllers/events/events.controllers.js';
import { eventValidation } from '../../utils/validations/event.create.validations.js';

export const eventRouter = Router();

eventRouter.use(authorization);
eventRouter.post('/create', eventValidation, createEvent);
eventRouter.get('/all', allEvents);
eventRouter.get('/:id', getEvent);
eventRouter.put('/:id', updateEvent);
eventRouter.delete('/:id', deleteEvent);
eventRouter.post('/:id/register', registerEvent);
eventRouter.delete('/:id/register', cancelEventRegister);
