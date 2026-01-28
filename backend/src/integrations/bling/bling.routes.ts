import { Router } from 'express';
import { connectBling, callbackBling, homologarBling } from './bling.controller';

const router = Router();

router.get('/connect', connectBling);
router.get('/callback', callbackBling);
router.post('/homologar/:empresaId', homologarBling);

export default router;
