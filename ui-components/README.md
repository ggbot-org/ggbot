# ggbot2 ui-components

## Usage

Install [Inter font](https://rsms.me/inter/).

For instance add the following into the `head` of your HTML page.

```html
<link rel="preconnect" href="https://rsms.me" crossOrigin="">
<link href="https://rsms.me/inter/inter.css" rel="stylesheet">
```

Import styles in your React app.

```css
@import "@ggbot2/ui-components";

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer utilities {
  /* Make page full height */
  html,
  body,
  body > div:first-child,
  div#__next,
  div#__next > div {
    height: 100%;
  }
}
```

Import components in your React app.

```js
import { Button } from '@ggbot2/ui-components'
```
