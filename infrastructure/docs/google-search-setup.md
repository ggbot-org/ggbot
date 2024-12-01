# Google Search setup

Go to [Google Search console](https://search.google.com/search-console/) and add a new property for the project `DNS_DOMAIN`.

Choose the `TXT` DNS record to verify the domain. Go to _ROute 53_ on _AWS Console_ and add the given _TXT_ record.

Assuming the webapp is already deployed, go to _Sitemap_ section and upload the sitemap.xml by providing its URL which will be something like `https://www.{DSN_DOMAN}/sitemap.xml`.
The easiest way is to go to the webapp homepage and add `/sitemap.xml` to the browser address to both verify the sitemap is online and get its URL.
