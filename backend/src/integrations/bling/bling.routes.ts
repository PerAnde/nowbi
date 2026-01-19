import { Router } from 'express';
import { connectBling, callbackBling } from './bling.controller';

const router = Router();

router.get('/connect', connectBling);
router.get('/callback', callbackBling);

export default router;
