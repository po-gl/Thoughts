import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { AuthStrategy, GoogleAuth, VendorAuth } from './authvendors.js';
import { NextFunction, Request, Response } from 'express';

dotenv.config();

let { JWT_SECRET } = process.env;
if (JWT_SECRET === undefined) {
  if (process.env.NODE_ENV !== 'production') {
    JWT_SECRET = 'unsafejwtdevelopmentsecret';
    console.log('Missing JWT_SECRET environment variable. Using unsafe development secret.');
  } else {
    console.log('Missing JWT_SECRET environment variable. Authentication is disabled.');
  }
}

type AuthRequest = {
  vendor: string
  token: string
};

type Credentials = {
  signedIn: boolean
  email?: string
  name?: string
  vendor?: string
  identifier?: string
};

type AuthError = {
  error: string
};

async function signIn(req: AuthRequest, httpResponse: Response): Promise<Credentials | AuthError> {
  if (JWT_SECRET === undefined) {
    return { error: 'Authentication is disabled.' };
  } else if (req.token === undefined) {
    return { error: 'Missing token.' };
  } else if (req.vendor === undefined) {
    return { error: 'Missing vendor.' };
  }

  let strategy: AuthStrategy;
  if (req.vendor === 'google') {
    strategy =  new GoogleAuth();
  } else if (req.vendor === 'apple') {
    return { error: 'Unimplemented for apple.' };
  } else {
    return { error: 'Invalid vendor.' };
  }
  const auth = new VendorAuth(strategy);

  const credentials = await auth.signIn(req);
  if ('error' in credentials) {
    return credentials as AuthError;
  }

  const token = jwt.sign(credentials, JWT_SECRET);
  httpResponse.cookie('jwt', token, { httpOnly: true });
  return credentials;
}

async function signOut(httpResponse: Response) {
  httpResponse.clearCookie('jwt');
}

async function getUser(httpRequest: Request): Promise<Credentials | AuthError> {
  if (JWT_SECRET === undefined) {
    return { error: 'Authentication is disabled.' };
  }
  const token = httpRequest.cookies.jwt;
  try {
    const credentials = jwt.verify(token, JWT_SECRET);
    const { signedIn, email, name, vendor } = credentials as Credentials;

    let identifier: string | undefined;
    if (email !== undefined && vendor !== undefined) {
      identifier = email + '-' + vendor;
    }
    return { signedIn, email, name, vendor, identifier };
  } catch (error) {
    return { signedIn: false };
  }
}

async function mustBeSignedIn(req: Request, res: Response, next: NextFunction) {
  const credentials = await getUser(req);
  if ('signedIn' in credentials && credentials.signedIn) {
    req.credentials = credentials;
    next();
  } else {
    res.status(401).json({ error: 'Must be signed in.' });
  }
}

export { signIn, signOut, getUser, AuthRequest, Credentials, AuthError, mustBeSignedIn };
