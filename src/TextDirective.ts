import {TextContentNodes} from './TextContentNodes'
import {TSelectionOptions} from './SelectionOptions'




export const makeTextDirectiveSelectionOptions = (textDirectiveOptions: TextDirectiveOptions, defaultTextContentNodes?: TextContentNodes): TSelectionOptions|null => {
//
    const textContentNodes: TextContentNodes = defaultTextContentNodes || new TextContentNodes(document.body)
    const textContent: string = textContentNodes.getTextContent()
    const NOT_FOUND_INDEX: number = -1


//console.log('textContent=', textContent)


//
    const findTextStartIndex = (textStart: string, prefix: string, offset: number = 0): number => {
        let textStartIndex: number
//
        const hasPrefix = (): boolean => {
            let len = prefix.length
            let o = textStartIndex - len
            do {
                if (textContent.substring(o, o + len) === prefix) {
                    return textContent.substring(o + len, textStartIndex).trim() === ''
                }
                o--
            }
            while (o >= 0)
            return false
        }
//
        do {
            textStartIndex = textContent.indexOf(textStart, offset)
            if (textStartIndex >= 0) {
                if ((prefix && hasPrefix()) || !prefix) {
                    return textStartIndex
                }
            }
            offset = textStartIndex + 1
        }
        while (textStartIndex >= 0)
        return NOT_FOUND_INDEX
    }



//
    const findTextEndIndex = (textEnd: string, suffix: string, offset: number = 0): number => {

//console.log('findTextEndIndex', textEnd, suffix, offset)

        let textEndIndex: number
//
        const hasSuffix = (): boolean => {

//            console.log('hasSuffix')

            let len = suffix.length
            let tclen = textContent.length - len
            let e = textEndIndex + textEnd.length
            let o = e
            do {
                if (textContent.substring(o, o + len) === suffix) {

//                    console.log('hasSuffix OK:', '"', textContent.substring(e, o), '"', textContent.substring(e, o).trim() === '')


                    return textContent.substring(e, o).trim() === ''
                }
                o++
            }
            while (o < tclen)
            return false
       }
//
        do {
            textEndIndex = textContent.indexOf(textEnd, offset)

//console.log('findTextEndIndex indexOf:', textEndIndex, offset, textEnd, suffix)

            if (textEndIndex >= 0) {

//                console.log('findTextEndIndex suffix OK:', ((suffix && hasSuffix()) || !suffix) ? textEndIndex : NOT_FOUND_INDEX)

                return ((suffix && hasSuffix()) || !suffix) ? textEndIndex : NOT_FOUND_INDEX
            }
            offset = textEndIndex + 1
        }
        while (textEndIndex >= 0)
        return NOT_FOUND_INDEX
    }




    const createSelection = (start: number, end: number): TSelectionOptions|null => {

//console.log('=> createSelection', start, end)

        let textStartPointer = textContentNodes.getPointer(start)
        let textEndPointer = textContentNodes.getPointer(end)

        return textStartPointer && textEndPointer ? {
            anchorNode: textStartPointer.node,
            anchorOffset: textStartPointer.offset,
            focusNode: textEndPointer.node,
            focusOffset: textEndPointer.offset
        } : null
    }




    let textStartIndex = findTextStartIndex(textDirectiveOptions.textStart, textDirectiveOptions.prefix)
    if (textStartIndex >= 0) {
        if (!textDirectiveOptions.textEnd) {
            let endIndex = textStartIndex + textDirectiveOptions.textStart.length
            return createSelection(textStartIndex, endIndex)
        }
        if (textDirectiveOptions.textEnd) {
            let textEndIndex = findTextEndIndex(textDirectiveOptions.textEnd, textDirectiveOptions.suffix, textStartIndex)
            if (textEndIndex >= 0) {
                let endIndex = textEndIndex + textDirectiveOptions.textEnd.length
                return createSelection(textStartIndex, endIndex)
            }
        }
    }
    return null
}




/**
 * Make native selection range from SelectionOptions record
 *//*
export const makeNativeSelection = (selectionOptions: TSelectionOptions): void => {
    let nativeSelection = document.getSelection()
    if (nativeSelection) {
        let {anchorNode, anchorOffset, focusNode, focusOffset} = selectionOptions
        let range = document.createRange()
        range.setStart(anchorNode, anchorOffset)
        range.setEnd(focusNode, focusOffset)
        nativeSelection.removeAllRanges()
        nativeSelection.addRange(range)
    }
}
*/



const encode = (str: string): string => {
    return encodeURIComponent(str)
        .replace(/\-/g, '%2D')
        .replace(/\,/g, '%2C')
}




export const makeTextDirectiveString = (textDirectiveOptions: TextDirectiveOptions): string => {

console.log('makeTextDirectiveString, textDirectiveOptions=', textDirectiveOptions)

    const prefix = textDirectiveOptions.prefix ? `${encode(textDirectiveOptions.prefix)}-,` : '';
    const suffix = textDirectiveOptions.suffix ? `,-${encode(textDirectiveOptions.suffix)}` : '';
    const textStart = encode(textDirectiveOptions.textStart);
    const textEnd = textDirectiveOptions.textEnd ? `,${encode(textDirectiveOptions.textEnd)}` : '';
    return `${prefix}${textStart}${textEnd}${suffix}`;
}




export const makeFragmentDirectiveString = (textDirectiveOptionsList: TextDirectiveOptions[]): string => {
    let fragmentDirectivies: string = ''
    textDirectiveOptionsList.forEach(textDirectiveOptions => {
        let textDirective = makeTextDirectiveString(textDirectiveOptions)
        fragmentDirectivies += textDirective ? ((fragmentDirectivies ? `&` : ``) + `text=${textDirective}`) : ''
    })
    return fragmentDirectivies
}




export const makeLink = (textFragment: string): string => {
    return `${location.origin}${location.pathname}${location.search}${textFragment}`
}
