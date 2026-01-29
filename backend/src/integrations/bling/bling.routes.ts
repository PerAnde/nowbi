import { Router } from 'express';
import { connectBling, callbackBling, homologarBling } from './bling.controller';
import { telaIntegracaoBling } from './bling.test.controller';

const router = Router();

router.get('/connect', connectBling);
router.get('/callback', callbackBling);
router.get('/integrar', telaIntegracaoBling);
// router.post('/homologar/:empresaId', homologarBling);

export default router;
