# Welcome to {{Name}}

First, run the expo metro bundler:

```bash
npm run start
# or
yarn start
# or
pnpm start
# or
bun start
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

Script

```
"commit": "git-cz"
```

Open device emulator.

You can start editing the page by modifying `src/app/index.tsx`. The page auto-updates as you edit the file.