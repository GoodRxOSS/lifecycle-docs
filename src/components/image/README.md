# Lifecycle Docs `<Image>`

The lifecycle docs image component provides a basic image wrapper so that Lifecycle Doc images match the look and feel of the rest of the site.

---

## Usage

```mdx
import { Image } from '@lifecycle-docs/components';

---

# Markdown

Some markdown content

<Image src="<link-to-an-iframe>" w />
```

---

## Props

```ts
type ImageProps = {
  alt?: string;
  src: string;
  border?: boolean;
  ratio?: number;
  width?: number;
  height?: number;
};
```
