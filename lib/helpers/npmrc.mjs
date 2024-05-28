const npmrcContents = {
    2: `node-linker=hoisted
enable-pre-post-scripts=true`,
}

export const getNpmrcContent = (template) => {
    return npmrcContents[template] || ''
}
