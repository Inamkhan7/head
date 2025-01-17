import { useRouter } from 'next/router';
import { useLocalStorage } from 'react-use';
import { CART_ENABLED } from './constants';
import { useEffect } from 'react';

export default function useCartEnabled() {
  const router = useRouter();
  const [isEnabled, setEnabled] = useLocalStorage<string>(CART_ENABLED);

  useEffect(() => {
    if (router.query.cart !== undefined && isEnabled === undefined) {
      setEnabled(router.query.cart as string);
    }
  }, [isEnabled, router.query, setEnabled]);

  return {
    isCartEnabled: isEnabled !== 'false',
  };
}
