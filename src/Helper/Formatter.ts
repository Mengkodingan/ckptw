export const bold = (str: string) => {
    return `*${str}*`;
}

export const italic = (str: string) => {
    return `_${str}_`;
}

export const strikethrough = (str: string) => {
    return `~${str}~`;
}

export const quote = (str: string) => {
    return `> ${str}`;
}

export const monospace = (str: string) => {
    return `\`\`\`${str}\`\`\``
}

export const inlineCode = (str: string) => {
    return `\`${str}\``;
}