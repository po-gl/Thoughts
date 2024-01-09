import { OAuth2Client } from 'google-auth-library';
import { AuthError, AuthRequest, Credentials } from './auth.js';

class VendorAuth {
  constructor(
    public strategy: AuthStrategy,
  ) {}

  signIn(req: AuthRequest) {
    return this.strategy.signIn(req);
  }
}

interface AuthStrategy {
  signIn: (req: AuthRequest) => Promise<Credentials | AuthError>;
}

class GoogleAuth implements AuthStrategy {

  async signIn(req: AuthRequest): Promise<Credentials | AuthError> {
    const client = new OAuth2Client();
    let payload;
    try {
      const ticket = await client.verifyIdToken({ idToken: req.token });
      payload = ticket.getPayload();
    } catch (error) {
      return { error: 'Unable to sign in' };
    }

    const { name, email } = payload;
    const credentials = {
      signedIn: true,
      email,
      name,
      vendor: 'google',
    };
    return credentials;
  }
}

export { VendorAuth, GoogleAuth, AuthStrategy };
