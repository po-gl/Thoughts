import { useEffect, useRef } from 'react';
import Modal from './Modal';
import toast from 'react-hot-toast';
import { useSearchParams } from 'react-router-dom';
import { apiFetch } from '../utils/api.ts';
import './styles/SignInModal.css';
import { User } from './MainMenu.tsx';

const GOOGLE_CLIENT_ID = '933701722173-hc0go2j56cjo66i2ns4bsnfg7jh864lj.apps.googleusercontent.com';

type Props = {
  showing: boolean;
  setShowing: React.Dispatch<React.SetStateAction<boolean>>;
  user: User | undefined;
  setUser: React.Dispatch<React.SetStateAction<User | undefined>>;
  setShouldRefreshMaps: React.Dispatch<React.SetStateAction<boolean>>;
};
function SignInModal( { showing, setShowing, user, setUser, setShouldRefreshMaps }: Props) {
  const googleSignInButton = useRef<HTMLDivElement>(null);
  const [, setSearchParams] = useSearchParams();

  async function signInWithGoogle(res: google.accounts.id.CredentialResponse) {
    try {
      const response = await apiFetch('/auth/signin', 'POST', {
        vendor: 'google',
        token: res.credential,
      });
      const body = await response.text();
      const result = JSON.parse(body);

      if (result.error !== undefined) {
        throw new Error(result.error);
      }

      setUser({ name: result.name, signedIn: true });
      setSearchParams({});
      setShouldRefreshMaps(true);
      setShowing(false);
    } catch (error) {
      console.log(error);
      toast.error('There was an error signing in.');
    }
  }

  function initializeGoogleSignIn() {
    if (typeof google !== 'undefined') {
      google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: (response) => {
          signInWithGoogle(response);
        },
      });
    }
  }

  function renderButtons() {
    if (googleSignInButton.current !== null) {
      if (typeof google !== 'undefined') {
        google.accounts.id.renderButton(googleSignInButton.current, {
          type: 'standard',
          shape: 'pill',
          theme: 'filled_black',
          text: 'signin_with',
          size: 'large',
        });
      } else {
        const signInButtonErrorMsg = document.createElement('p');
        signInButtonErrorMsg.textContent = 'Unable to access Google Sign in button.';
        const signInButtonAdvice = document.createElement('p');
        signInButtonAdvice.textContent = 'Try disabling content blockers.';
        googleSignInButton.current.appendChild(signInButtonErrorMsg);
        googleSignInButton.current.appendChild(signInButtonAdvice);
      }
    }
  }

  async function signOut() {
    try {
      const response = await apiFetch('/auth/signout', 'POST');
      const body = await response.text();
      const result = JSON.parse(body);
      if (!result.signedOut) {
        throw new Error('Not signed out');
      }
      setShouldRefreshMaps(true);
      setShowing(false);
    } catch (error) {
      toast.error('There was an error signing out.');
    }
  }

  useEffect(() => {
    initializeGoogleSignIn();
  });

  useEffect(() => {
    renderButtons();
  }, [showing]);

  if (user === undefined || !user.signedIn) {
    return (
      <Modal
        showing={showing}
        onDismiss={() => {
          setShowing(false);
        }}
      >
        <h2>Sign in</h2>
        <div className="divider" />
        <p>Sign in to save and access your mind maps.</p>
        <div className="signin-button-container">
          <div ref={googleSignInButton} />
        </div>
      </Modal>
    );
  } else {
    return (
      <Modal
        showing={showing}
        onDismiss={() => {
          setShowing(false);
        }}
        actionName="Sign out"
        onSubmit={async () => {
          signOut();
        }}
      >
        <h2>Sign out</h2>
        <div className="divider" />
      </Modal>
    );
  }

}

export default SignInModal;
