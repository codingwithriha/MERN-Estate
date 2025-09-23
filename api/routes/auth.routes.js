import express from 'express';
import { google, signin, signup } from '../controllers/auth.controller.js';
import { signOut } from '../controllers/user.controller.js';

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post('/google', google);
router.get('/signout', signOut)

export default router;