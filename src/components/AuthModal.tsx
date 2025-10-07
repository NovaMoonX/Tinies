import { useState } from 'react';
import { Modal, AuthForm, AuthFormOnEmailSubmit } from '@moondreamsdev/dreamer-ui/components';
import { logIn, signUp, authWithGoogle } from '@lib/firebase/firebase.auth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [modalTitle, setModalTitle] = useState('Login')
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleMethodClick = async (method: string) => {
    setErrorMessage('');
    
    if (method === 'google') {
      try {
        const { error } = await authWithGoogle();
        if (error) {
          setErrorMessage(error.message);
        } else {
          onClose();
        }
      } catch (err) {
        console.error('Google auth error:', err);
        setErrorMessage('Google authentication failed');
      }
    }
  };

  const handleEmailSubmit: AuthFormOnEmailSubmit = async ({ data, action }) => {
    setErrorMessage('');
    
    try {
      if (action === 'login') {
        const { error } = await logIn(data.email, data.password);
        if (error) {
          return { error: { message: error.message } };
        }
      } else {
        const { error } = await signUp(data.email, data.password);
        if (error) {
          return { error: { message: error.message } };
        }
      }
      
      return {};
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Authentication failed';
      return { error: { message: errorMessage } };
    }
  };

  const handleSuccess = (action: 'login' | 'sign up') => {
    console.log(`${action} successful`);
    onClose();
  };

  const validatePassword = (password: string): string | undefined => {
    if (password.length < 6) {
      return 'Password must be at least 6 characters long';
    }
    return undefined;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setErrorMessage('');
        onClose();
      }}
      title={modalTitle}
    >
      <AuthForm
        methods={['email', 'google']}
        action="both"
        onMethodClick={handleMethodClick}
        onEmailSubmit={handleEmailSubmit}
        onSuccess={handleSuccess}
        errorMessage={errorMessage}
        validatePassword={validatePassword}
        onActionChange={(action) => setModalTitle(action === 'login' ? 'Log In' : 'Sign Up')}
      />
    </Modal>
  );
}

export default AuthModal;