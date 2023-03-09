export const parseTextFragment = (textFragment: string): string[] => {
    return textFragment
        .replace(/^.*?:~:(.*?)/, '$1')
        .split(/&?text=/).filter(Boolean)
}




export const parseFragmentDirectives = (textFragmentDirectives: string[]): TextDirectiveOptions[] => {
    const TEXT_FRAGMENT = /^(?:(.+?)-,)?(?:(.+?))(?:,([^-]+?))?(?:,-(.+?))?$/
    const list: TextDirectiveOptions[] = []
    textFragmentDirectives.forEach(d=> {
        list.push({
            prefix: decodeURIComponent(d.replace(TEXT_FRAGMENT, '$1')),
            textStart: decodeURIComponent(d.replace(TEXT_FRAGMENT, '$2')),
            textEnd: decodeURIComponent(d.replace(TEXT_FRAGMENT, '$3')),
            suffix: decodeURIComponent(d.replace(TEXT_FRAGMENT, '$4')),
        })
    })
    return list
}