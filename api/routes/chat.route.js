import express from 'express';
import { addMessgae, findOrCreateChat, getChat, getChats} from '../controller/chat.controller.js';
import verifyToken from '../middleware/verifyToken.js';

const router = express.Router();

router.get('/find-or-create',verifyToken, findOrCreateChat)
router.get('/chat/:chatId', verifyToken, getChat)
router.get('/chats/:userId',verifyToken, getChats)
router.post('/messages/add/:chatId', verifyToken ,addMessgae)

export default router;
