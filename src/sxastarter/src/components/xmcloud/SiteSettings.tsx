import { Field } from '@sitecore-jss/sitecore-jss-nextjs';

// Component: Site Settings
// Version:   Name

interface Fields {
  OrderCloudAPIID: Field<string>;
  OrderCloudAPIUrl: Field<string>;
  OrderCloudScope: Field<string>;
  XMCWebsiteTheme: Field<string>;
  AllowAnonymous: Field<string>;
  ShowInventory: Field<string>;
}

type SiteSettingsProps = {
  params: { [key: string]: string };
  fields: Fields;
};

export const Default = (props: SiteSettingsProps): void => {
  OrderCloudAPIID: props.fields.OrderCloudAPIID.value;
  OrderCloudAPIUrl: props.fields.OrderCloudAPIUrl.value;
  OrderCloudScope: props.fields.OrderCloudScope.value;
  XMCWebsiteTheme: props.fields.XMCWebsiteTheme.value;
  AllowAnonymous: props.fields.AllowAnonymous.value;
  ShowInventory: props.fields.ShowInventory.value;
};
