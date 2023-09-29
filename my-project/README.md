# Welcome to my-project

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun run dev
```
Semantic-realease configuration

```
npx semantic-release-cli setup
```
Script

```
"semantic-release": "semantic-release --branches main"
```
Commitizen configuration

```
npx commitizen init cz-conventional-changelog --save-dev --save-exact
```
Scipt

```
"commit": "git-cz"
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.
