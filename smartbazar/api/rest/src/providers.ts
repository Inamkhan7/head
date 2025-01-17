import OrderCloud from '@packages/ordercloud';
import BigCommerce from '@packages/bigcommerce';
import CommerceTools from '@packages/commercetools';

export { getSearchParams } from '@packages/commerce/dist/utils';
import { getFeatureFlags } from '../utils/featureFlag';

const providers = {
  ORDERCLOUD: OrderCloud,
  BIGCOMMERCE: BigCommerce,
  COMMERCETOOLS: CommerceTools,
};

type Key = keyof typeof providers;
type Provider = (typeof providers)[Key];

class CommerceProvider {
  private _flags;
  private _provider;
  private _providerName;

  async getProvider(): Promise<Provider> {
    const flags = await getFeatureFlags();
    let provider;

    if (flags && JSON.stringify(flags) !== JSON.stringify(this._flags)) {
      this._flags = flags;

      if (flags.BIGCOMMERCE) {
        this._providerName = 'BIGCOMMERCE';
        provider = providers.BIGCOMMERCE;
        provider.init();
        this._provider = provider;
      }

      if (flags.ORDERCLOUD) {
        this._providerName = 'ORDERCLOUD';
        provider = providers.ORDERCLOUD;
        provider.init();
        this._provider = provider;
      }

      if (flags.COMMERCETOOLS) {
        this._providerName = 'COMMERCETOOLS';
        provider = providers.COMMERCETOOLS;
        provider.init();
        this._provider = provider;
      }
    }

    console.log(`COMMERCE PROVIDER: ${this._providerName}`);
    return this._provider;
  }
}

export default new CommerceProvider();
