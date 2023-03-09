import {TSelectionOptions} from './SelectionOptions'
import {TextContentNodes} from './TextContentNodes'




const MARK_TEXT_COLOR = 'MarkText'
const MARK_BACKGROUND_COLOR = 'Mark'




export type TMark = {
    uid: string
    elements: Element[]
}




export const MARK_ELEMENT_TAGNAME: string = 'REABR-MARK'
const MARK_UID_KEY: string = 'data-uid'




export const mark = (selectionOptions: TSelectionOptions, defaultTextContentNodes?: TextContentNodes): TMark|null => {

    const textContentNodes: TextContentNodes = defaultTextContentNodes || new TextContentNodes(document.body)
    const uid: string = new Date().getTime().toString()    
    const elements: Element[] = []


    const createElement = (node: Node, textStart: string|null, textContent: string|null, textEnd: string|null): Element => {
        let fragment = document.createDocumentFragment()
//
        if (textStart) {
            fragment.appendChild(document.createTextNode(textStart))
        }
        let element = document.createElement(MARK_ELEMENT_TAGNAME)
        element.appendChild(document.createTextNode(textContent || node.textContent || ''))
        element.setAttribute(MARK_UID_KEY, uid)
        element.style.color = MARK_TEXT_COLOR
        element.style.backgroundColor = MARK_BACKGROUND_COLOR
        fragment.appendChild(element)
//
        if (textEnd) {
            fragment.appendChild(document.createTextNode(textEnd))
        }
        if (node.parentNode) {
            node.parentNode.insertBefore(fragment, node)
            node.parentNode.removeChild(node)
        }
        return element
    }


//
    const {anchorNode, anchorOffset, focusNode, focusOffset} = selectionOptions


    if (anchorNode && anchorNode === focusNode) {
        if (anchorNode.textContent) {
            elements.push(createElement(anchorNode, 
                anchorNode.textContent.substring(0, anchorOffset),
                anchorNode.textContent.substring(anchorOffset, focusOffset),
                anchorNode.textContent.substring(focusOffset)    
            )) 
        }
    }
    else if (anchorNode && focusNode && anchorNode !== focusNode) {
        if (anchorNode.textContent) {

//            console.log('=> elements.push', anchorOffset, anchorNode.textContent.length)

            if (anchorNode.textContent.length !== anchorOffset) {
                elements.push(createElement(anchorNode, 
                    anchorNode.textContent.substring(0, anchorOffset),
                    anchorNode.textContent.substring(anchorOffset),
                    null
                ))
            }
            if (focusOffset && focusNode.textContent /*&& focusNode.textContent.length < focusOffset*/) {
                elements.push(createElement(focusNode, 
                    null,
                    focusNode.textContent.substring(0, focusOffset),
                    focusNode.textContent.substring(focusOffset)   
                ))
            }
        }
        textContentNodes.getNodes(anchorNode, focusNode).forEach(node => {
            elements.push(createElement(node, null, null, null))
        })
    }


// Return valid mark
    return {uid, elements}
}  




export const unmark = (uid: string) => {


    const fetchElements = () => {
        const marks: Element[] = []
        const elements: HTMLCollection = document.getElementsByTagName(MARK_ELEMENT_TAGNAME)
        for (let i = 0; i < elements.length; i++) {
            let element = elements[i]
            if (element.getAttribute('data-uid') == uid && element.parentNode && element.textContent) {
                marks.push(element)
            }
        }
        return marks
    }


    const elements: Element[] = fetchElements()


    for (let i = 0; i < elements.length; i++) {
        let element = elements[i]
        let nodes = element.childNodes
        
        const fragment = document.createDocumentFragment()

        for (let y = 0; y < nodes.length; y++) {
            fragment.appendChild(nodes.item(y))
        }
        if (element.parentNode) {
            let p = element.parentNode
            p.insertBefore(fragment, element)
            p.removeChild(element)
            p.normalize()
        }
    }
}