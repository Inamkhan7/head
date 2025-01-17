import { useRouter } from 'next/router';
import { useLocalStorage } from 'react-use';
import { CATALOG } from './constants';

export default function useCatalog() {
  const router = useRouter();
  const [savedCatalog, saveCatalog] = useLocalStorage<string>(CATALOG);
  const queryCatalog =
    ((router.query.catalog ?? router.query.pages?.[0]) as string) || undefined;

  return {
    queryCatalog,
    savedCatalog,
    saveCatalog,
  };
}
