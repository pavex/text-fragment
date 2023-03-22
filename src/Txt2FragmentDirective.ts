/**
 * @description Txt2 fragment direcitvies and text fragmetn builder
 * @author Pavel Machacek <pavex@ines.cz> 
 */


import {TSelectionOptions} from './SelectionOptions'
import {TextContentNodes} from './TextContentNodes'
import {Txt2DirectiveOptions, ITxt2DirectiveOptions, ITxt2PointerOptions} from './Txt2DirectiveOptions'





export const parseFragment = (fragment: string): string[] => {
    return fragment
        .replace(/^.*?:~:(.*?)/, '$1')
        .split(/&/).filter(Boolean)
}




export const parseDirectiveOptions = (txt2Fragment: string): ITxt2DirectiveOptions|null => {
    //
    const parsePointer = (text: string, defaultTagName: string = 'P', defaultOrder: number = 0): ITxt2PointerOptions|undefined => {
        let m0 = text.match(/([^\{]+)(\{(.+)\}|)/)
        if (m0) {
            let text = decodeURIComponent(m0[1])
            let tagName: string = defaultTagName
            let order: number = defaultOrder
//
            if (m0[3]) {
                let m = m0[3].match(/(^[0-9]+$)|(^[A-Z0-9]+$)|(^([A-Z0-9]+),([0-9]+)$)/)
                if (m) {
                    tagName = m[2] || m[4] || tagName
                    order = parseInt(m[1] || m[5]) || order
                }
            }
            return {text, tagName, order}
        }
        return undefined
    }

//
    let m = txt2Fragment.match(/txt2=([^,]+)(,(.+)|$)$/)
    if (m) {    
        let start = parsePointer(m[1] || '')
        if (start) {
            let end = parsePointer(m[3] || '', start.tagName, start.order)
            return new Txt2DirectiveOptions(start, end)
        }
    }
    return null
}

    


export const createSelectorDirective = (selectionOptions: TSelectionOptions): Promise<Txt2DirectiveOptions> => {
    return new Promise((resolve, reject) => {

        const minlen: number = 8
//
        const textContentNodes = new TextContentNodes(document.body)
        const textContent: string = textContentNodes.getTextContent()
        const startNode = textContentNodes.getTextContentNode(selectionOptions.anchorNode)
        const endNode = textContentNodes.getTextContentNode(selectionOptions.focusNode)
//
// Selection is not completed
        if (!startNode || !endNode) {
            reject()
            return
        }
//
        const start = startNode.startOffset + selectionOptions.anchorOffset
        const end = endNode.startOffset + selectionOptions.focusOffset
        const selectedText = textContentNodes.getTextContent().substring(start, end)

if (selectedText.trim() === '') {
    reject('Empty selection.')
    return
}

        const words = selectedText.split(' ')
        const count = words.length

// Prepare min length startText
        const getStartText = (): string => {
            let newtext = ''
            let len = Math.min(minlen, selectedText.length)
            let i = 1
            while (newtext.length < len) {
                newtext = words.slice(0, i++).join(' ')
            }
            return newtext
        }

// Prepare min length endText
        const getEndText = (): string => {
            let newtext = ''
            let len = Math.min(minlen, selectedText.length)
            let i = count - 1
            while (newtext.length < len) {
                newtext = words.slice(i--, count).join(' ')
            }
            return newtext
        }

//
        const findOrder = (text: string, tagName: string, knownPosition: number, fromIndex: number = 0): number => {
            let order: number = 0
            let index: number = -1
//
            do {
                index = textContent.indexOf(text, fromIndex)
                if (index >= 0) {
                    let textContentNode = textContentNodes.getTextContentNode(index)
                    if (textContentNode && textContentNode.tagName === tagName) {
                        if (index === knownPosition) {
                            return order
                        }
                        order++
                    }
                }
                fromIndex = index + 1
            }
            while (index >= 0)
            //throw Error
            reject()
            return -1
        }
    
//
        const createPointer = (text: string, tagName: string, knownPosition: number, fromIndex: number = 0): ITxt2PointerOptions => {
            const order = findOrder(text, tagName, knownPosition, fromIndex)
            return {text, tagName, order}
        }

//
        if (!startNode || !endNode) {
            reject()
            return
        }
        let startText = getStartText()
        if (startText.length * 2 >= selectedText.length) {
            resolve(new Txt2DirectiveOptions(createPointer(selectedText, startNode.tagName, start)))
            return
        }
        let endText = getEndText()
        if (startText.length + endText.length >= selectedText.length) {
            resolve(new Txt2DirectiveOptions(createPointer(selectedText, startNode.tagName, start)))
            return
        }
        let endKnownPosition = end - endText.length
        let endTextIndex = start + 1
        resolve(new Txt2DirectiveOptions(
            createPointer(startText, startNode.tagName, start),
            createPointer(endText, endNode.tagName, endKnownPosition, endTextIndex)
        ))
    })
}




export const makeSelectionOptions = (directiveOptions: ITxt2DirectiveOptions) => {

    const textContentNodes = new TextContentNodes(document.body)
    const textContent: string = textContentNodes.getTextContent()


    interface INodePointer {
        node: Node
        index: number
        offset: number
    }


    const findStartText = (pointerOptions: ITxt2PointerOptions): INodePointer => {
        let index: number = -1
        let offset: number = 0
        let order: number = 0
//
        do {
            index = textContent.indexOf(pointerOptions.text, offset)
            let textContentNode = textContentNodes.getTextContentNode(index)
            if (textContentNode) {
                if (pointerOptions.tagName === textContentNode.tagName) {
                    if (pointerOptions.order === order) {
                        return {
                            node: textContentNode.node,
                            index,
                            offset: index - textContentNode.startOffset
                        }
                    }
                    order++
                }
            }
            offset = index + 1
        }
        while (index >= 0)
        throw Error
    }


    const findEndText = (pointerOptions: ITxt2PointerOptions, fromIndex: number) => {  
        let index: number = -1
        let offset: number = fromIndex
        let order: number = 0
//
        do {
            index = textContent.indexOf(pointerOptions.text, offset)
            let nodeIndex = index + pointerOptions.text.length
            let textContentNode = textContentNodes.getTextContentNode(nodeIndex - 1)
            if (textContentNode) {
                if (pointerOptions.tagName === textContentNode.tagName) {
                    if (pointerOptions.order === order) {
                        return {
                            node: textContentNode.node,
                            index,
                            offset: nodeIndex - textContentNode.startOffset
                        }
                    }
                    order++
                }
            }
            offset = index + 1
        }
        while (index >= 0)
        throw Error
    }


    let startPointer = findStartText(directiveOptions.start)
    let endPointer

    if (!!directiveOptions.end) {
        endPointer = findEndText(directiveOptions.end, startPointer.index + 1)
    }
    else {
        let index = startPointer.index + directiveOptions.start.text.length
        let textContentNode = textContentNodes.getTextContentNode(index)

        if (textContentNode) {
            endPointer = {
                node: textContentNode.node,
                offset: index - textContentNode.startOffset
            }
        }
    }

//
    if (startPointer && endPointer) {
        let selectionOptions: TSelectionOptions = {
            anchorNode: startPointer.node,
            anchorOffset: startPointer.offset,
            focusNode: endPointer.node,
            focusOffset: endPointer.offset
        }
        return selectionOptions
    }
    return null
}
