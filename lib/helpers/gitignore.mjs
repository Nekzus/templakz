const gitignoreContents = {
    0: `# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# dependencies
/node_modules
/.pnp
.pnp.js
    
# testing
/coverage
    
# next.js
/.next/
/out/
    
# production
/build
    
# misc
.DS_Store
*.pem
    
# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*
    
# local env files
.env*.local
    
# vercel
.vercel
    
# typescript
*.tsbuildinfo
next-env.d.ts`,
    1: `# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

# dependencies
node_modules
dist
dist-ssr
*.local
    
# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?`,
    2: `# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

node_modules/
.expo/
dist/
npm-debug.*
*.jks
*.p8
*.p12
*.key
*.mobileprovision
*.orig.*
web-build/
    
# macOS
.DS_Store
    
# @generated expo-cli sync-2b81b286409207a5da26e14c78851eb30d8ccbdb
# The following patterns were generated by expo-cli
    
expo-env.d.ts
# @end expo-cli`,
}

export const getGitignoreContent = (template) => {
    return gitignoreContents[template] || ''
}
