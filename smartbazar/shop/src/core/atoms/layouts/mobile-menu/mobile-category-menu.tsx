import DrawerWrapper from '@/core/atoms/ui/drawer/drawer-wrapper';
import Categories from '@/core/atoms/categories/categories';

export default function MobileCategoryMenu({ variables }: { variables: any }) {
  return (
    <DrawerWrapper>
      <div className="h-full max-h-full">
        <Categories layout="classic" className="!block" variables={variables} />
      </div>
    </DrawerWrapper>
  );
}
