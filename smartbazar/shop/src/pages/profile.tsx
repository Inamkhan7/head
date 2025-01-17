import ProfileAddressGrid from '@/core/atoms/profile/profile-address';
import Card from '@/core/atoms/ui/cards/card';
import { useTranslation } from 'next-i18next';
import ProfileForm from '@/core/atoms/profile/profile-form';
import ProfileContact from '@/core/atoms/profile/profile-contact';
import Seo from '@/core/atoms/seo/seo';
import { useUser } from '@/framework/user';
import DashboardLayout from '@/layouts/_dashboard';
export { getStaticProps } from '@/framework/general.ssr';

const ProfilePage = () => {
  const { t } = useTranslation('common');
  const { me } = useUser();

  if (!me) return null;
  return (
    <>
      <Seo noindex={true} nofollow={true} />
      <div className="w-full overflow-hidden px-1 pb-1">
        <div className="mb-8">
          <ProfileForm user={me} />
        </div>

        <Card className="w-full">
          <ProfileAddressGrid
            userId={me.id}
            //@ts-ignore
            addresses={me.address}
            label={t('text-addresses')}
          />
        </Card>
      </div>
    </>
  );
};

ProfilePage.authenticationRequired = true;

ProfilePage.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
export default ProfilePage;
