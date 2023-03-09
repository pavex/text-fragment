export interface TSelectionOptions {
    anchorNode: Node
    anchorOffset: number
    focusNode: Node
    focusOffset: number
}




// Normalize to left-right selection
export const normalize = (selection: Selection) => {
    if (selection.anchorNode && selection.focusNode) {
        if (selection.toString().length > 0) {
            let range = selection.getRangeAt(0)
            selection.removeAllRanges()
            selection.addRange(range)
        }
    }
}




// Expand selection to whole words
export const wordExpand = (selection: Selection) => {
    if (selection.anchorNode && selection.focusNode) {
        let {anchorOffset, focusOffset} = selection
        const {anchorNode, focusNode} = selection
        const anchorNodeContent: string = anchorNode.textContent || ''
        const focusNodeContent: string = focusNode.textContent || ''
//
        if (anchorNodeContent.charAt(anchorOffset) != ' ') {
            while (anchorOffset > 0 && anchorNodeContent.charAt(anchorOffset - 1) != ' ') {
                anchorOffset--
            }
        }
        else {
            anchorOffset++
        }
//
        if (focusOffset !== 0) {
            if (focusNodeContent.charAt(focusOffset - 1) != ' ') {
                while (focusOffset < focusNodeContent.length && focusNodeContent.charAt(focusOffset) != ' ') {
                    focusOffset++
                }
            }
            else {
                focusOffset--
            }
        }
//
        const range = selection.getRangeAt(0)
        range.setStart(anchorNode, anchorOffset)
        range.setEnd(focusNode, focusOffset)
    }
}




export const setNativeSelection = (selection: TSelectionOptions): void => {
    const nativeSelection = window.getSelection()
    if (nativeSelection) {
        const range = document.createRange()
        range.setStart(selection.anchorNode, selection.anchorOffset)
        range.setEnd(selection.focusNode, selection.focusOffset)
        nativeSelection.removeAllRanges()
        nativeSelection.addRange(range)
    }
}




export const getSelectionOptions = (): TSelectionOptions|null => {
//
    const normalizeFocusNode = (focusNode: Node): Node => {
        if (focusNode.nodeType !== Node.TEXT_NODE && focusOffset === 0) {
            let treeWalker = document.createTreeWalker(document.body)
            let textContentNode = focusNode
            let nextNode
            do {
                nextNode = treeWalker.nextNode()
                if (nextNode) {
                    if (nextNode.nodeType === Node.TEXT_NODE) {
                        textContentNode = nextNode
                    }
                    if (nextNode === focusNode) {
                        return textContentNode
                    }
                }
            }
            while (!!nextNode)
        }
        return focusNode
    }

//
    const nativeSelection = window.getSelection()
    if (!nativeSelection || !nativeSelection.anchorNode || !nativeSelection.focusNode) {
        return null
    }

    console.log('getSelectionOptions, selectionOptions=', nativeSelection)


//
// Normalize native selection
    normalize(nativeSelection)
    wordExpand(nativeSelection)
//
// Make SelectionOption record from native selection
    let {anchorNode, anchorOffset, focusNode, focusOffset} = nativeSelection
    nativeSelection.removeAllRanges()
//
// Normalize anchorNode, TODO: same method as focusNode
    if (anchorNode.nodeType !== Node.TEXT_NODE) {
        anchorNode = anchorNode.childNodes.item(0)
    }
// Repair focusNode when focusOffset is 0 by TreeWalker patch.
    if (focusNode.nodeType !== Node.TEXT_NODE && focusOffset === 0) {
        focusNode = normalizeFocusNode(focusNode)
        focusOffset = focusNode.textContent ? focusNode.textContent.length : 0
    }
//
//console.log('getSelectionOptions, selectionOptions=', {anchorNode, anchorOffset, focusNode, focusOffset})


    return {anchorNode, anchorOffset, focusNode, focusOffset}
}