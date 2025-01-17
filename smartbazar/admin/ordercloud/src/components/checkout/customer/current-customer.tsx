import { useEffect } from 'react';
import { useAtom } from 'jotai';
import { customerAtom } from '@contexts/checkout';
import { useMeQuery } from '@data/user/use-me.query';

const CurrentCustomer: React.FC = () => {
  const [, setCustomer] = useAtom(customerAtom);
  const { data: user } = useMeQuery();

  useEffect(() => {
    if (user) {
      setCustomer({
        value: user.id,
      });
    }
  }, [user]);

  return null;
};

export default CurrentCustomer;
