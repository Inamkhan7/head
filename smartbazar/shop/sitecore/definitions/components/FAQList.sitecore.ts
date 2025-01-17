import { CommonFieldTypes, SitecoreIcon, Manifest } from '@sitecore-jss/sitecore-jss-dev-tools';

/**
 * Adds the FAQList component to the disconnected manifest.
 * This function is invoked by convention (*.sitecore.js) when `jss manifest` is run.
 * @param {Manifest} manifest Manifest instance to add components to
 */
export default function FAQList(manifest: Manifest): void {
  manifest.addComponent({
    name: 'FAQList',
    templateName: 'FAQList',
    // totally optional, but fun
    icon: SitecoreIcon.DocumentTag,
    fields: [
      { name: 'FAQList', type: CommonFieldTypes.ContentList },
      { name: 'Title', type: CommonFieldTypes.SingleLineText },
    ],
  });
}
