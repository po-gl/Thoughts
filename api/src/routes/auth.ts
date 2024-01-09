import { Router } from 'express';
import { signIn, signOut, getUser } from '../auth.js';
import bodyParser from 'body-parser';

const routes = Router();
routes.use(bodyParser.urlencoded({ extended: true }));

routes.post('/auth/signin', async (req, res) => {
  const authRequest = { vendor: req.body.vendor, token: req.body.token };
  const response = await signIn(authRequest, res);
  res.json(response);
});

routes.post('/auth/signout', (_req, res) => {
  signOut(res);
  res.json({ signedOut: true });
});

routes.get('/auth/user', async (req, res) => {
  const credentials = await getUser(req);
  res.json(credentials);
});

export default routes;
