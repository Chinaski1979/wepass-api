import { Router } from 'express';
import { authMidleware } from 'helpers/tokens';

const router = new Router();

/**
 * @apiDefine authorizationHeaders
 * @apiHeader (Headers) {String} Authorization JSON Web Token
 * @apiHeaderExample {json} Example
 *  {
 *    "Authorization": "Bearer: JWT_TOKEN"
 *  }
 *
 * @apiErrorExample {json} Authorization Error
   HTTP/1.1 401 Unauthorized
   {
     "error": {
       "message": ERROR_MESSAGE,
       "typeName": "jwt",
       "typeId": 0
     }
   }
 *
 */

/**
 * @apiDefine applicationError
 * @apiErrorExample {json} Application Error
   HTTP/1.1 400 Bad Request
   {
     "error": {
       "message": ERROR_MESSAGE
     }
   }
 *
 */

// API endpoints.
router.all('*', authMidleware);
router.use('/auth', require('./auth').default);
router.use('/company', require('./company').default);

export default router;
