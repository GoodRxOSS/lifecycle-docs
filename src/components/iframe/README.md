# Lifecycle Docs `<Iframe>`

The lifecycle docs iframe component provides a basic iframe wrapper so that Lifecycle Doc embeds match the look and feel of the rest of the site.

---

## Usage

```mdx
import { Iframe } from '@lifecycle-docs/components';

---

# Markdown

Some markdown content

<Iframe src="<link-to-an-iframe>" />
```

---

## Props

```ts
type IframeProps = {
  border?: boolean;
  panelSize?: number;
  src: string;
};
```
