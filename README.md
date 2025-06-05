# Lifecycle Docs 📕

Documentation for Lifecycle.

---

## Making a post

Making a post can be done in a few steps.

1. Create a new `.mdx` file in the `src/pages` directory.
2. Add frontmatter to the top of the file including at least `title`, and `description`.
   It will look like so:
   ```md
    ---
      title: "My Post"
      description: "This is a description of my post."
    ---
   ```
3. Write your content in markdown.
4. Add images to the `public` directory and reference them in your markdown.
   Images should be placed in a subdirectory of `public` with the same name as the `.mdx` file.
     ```txt
       // example
       src/pages/docs/troubleshooting/<new-page>
       public/docs/troubleshooting/new-page>
     ```

---

## Components

Lifecycle Docs provides a few extra components [in addition to components provided by Nextra](https://nextra.site/docs/guide/built-ins).
View all the currently exported components [here](https://github.com/GoodRxOSS/lifecycle-docs/blob/main/src/components/index.tsx).

- Components like Image & Iframe have been added to make the docs look more consistent visually.
---

### `<Image>`

The `<Image>` component is a wrapper around next/image that provides a few extra features to make it easier to look nice in the docs.

```mdx
import Image from '@lifecycle-docs/components';

<Image src="/path/to/image.png" alt="Alt text" width={16} height={9} ratio={16 / 9} />
```

You can center the image by adding the `center` prop and some extra JSX.

```mdx
<div className="grid pt-6">
  <div className="place-self-center w-[500px]">
    <Image
      src="/custom-multi-service-lifecycle-environments/additional-optional-services.png"
      alt="Additional Optional Services"
      height={906}
      width={538}
      ratio={538 / 906}
      imagePosition="center"
    />
  </div>
</div>
```

---

### `<Iframe>`

The `<Iframe>` component is a wrapper around an iframe that provides a few extra features to make it easier to look nice in the docs.

```mdx
import { Iframe } from '@lifecycle-docs/components';

<Iframe src="https://example.com" title="Example" />
```

---

## Development

Ensure you're using the correct version of node

```bash
# or, n i auto
npm install bun -g
```

Install the dependencies

```bash
bun install
```

Create a PAT with with the permissions below (`"code"` is `"Read and Write content"` ).
Add it to your `.env` file by copying `.env.example` and adding your PAT to the `SYNC_LIFECYCLE_DOCS` and `GITHUB_TOKEN`.

### PAT: Personal Access Token, create a fine-grained access token with the following permissions

| rule | access level |
| --- | --- |
| members | `read` |
| metadata | `read` |
| actions | `read/write` |
| contents | `read/write` |
| pull requests | `read/write` |
| workflows | `read/write` |

\*The following permissiones allow you to update content located in scripts


Run the development server

```bash
bun run dev
```

## Deployment

This site is deployed to GitHub Pages using GitHub Actions. When changes are pushed to the `oss` branch, a GitHub Action workflow automatically builds the site and deploys it to the `gh-pages` branch.

### Automatic Deployment

The deployment process is handled by a GitHub Actions workflow defined in `.github/workflows/deploy.yml`. This workflow:

1. Runs when changes are pushed to the `oss` branch
2. Sets up Bun
3. Installs dependencies
4. Builds the static site
5. Deploys the built site to the `gh-pages` branch

### GitHub Pages Configuration

To enable GitHub Pages for this repository:

1. Go to the repository on GitHub
2. Click on "Settings"
3. Scroll down to the "GitHub Pages" section
4. Under "Source", select "Deploy from a branch"
5. Under "Branch", select "gh-pages" and "/ (root)"
6. Click "Save"

The site will be available at `https://goodrxoss.github.io/lifecycle-docs/` (or your custom domain if configured).

### Static Build for GitHub Pages

For GitHub Pages deployment, we use a simplified build process that doesn't require GitHub API access. This avoids the need for setting up GitHub secrets for the deployment workflow.

The deployment process:
1. Builds the site using the standard build process
2. Creates a `.nojekyll` file to prevent GitHub Pages from processing the site with Jekyll

### Manual Deployment

You can also build and deploy the site manually:

1. Build the site:
   ```bash
   bun run deploy
   ```

2. The static site will be generated in the `out` directory with a `.nojekyll` file.

3. To deploy manually, you can push the `out` directory to the `gh-pages` branch:
   ```bash
   # First time setup
   git checkout --orphan gh-pages
   git reset --hard
   git commit --allow-empty -m "Initial gh-pages commit"
   git push origin gh-pages
   git checkout oss

   # For subsequent deployments
   bun run deploy
   git checkout gh-pages
   git rm -rf .
   cp -r out/* .
   touch .nojekyll
   git add .
   git commit -m "Deploy to GitHub Pages"
   git push origin gh-pages
   git checkout oss
   ```

However, it's recommended to let the GitHub Actions workflow handle the deployment automatically.
