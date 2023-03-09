/**
 * @description Text content node collection service
 * @author Pavel Machacek <pavex@ines.cz> 
 */


export interface ITextContentNode {
    startOffset: number
    endOffset: number
    node: Node
}




export interface IPointer {
    offset: number
    node: Node
}




export class TextContentNodes {

    private textContentNodes: ITextContentNode[] = []
    private textContent: string = ''




    constructor(initialNode?: Node) {
        if (initialNode) {
            this.putNode(initialNode)
        }
    }




    putNode(initialNode: Node): void {

// Get fist valid text node from node/element
        const firstNode = (node: Node): Node => {
            let firstChild: Node = node
            while (firstChild && firstChild.nodeType != 3 && firstChild.firstChild) {
                firstChild = firstChild.firstChild
            }
            return firstChild
        }

// Get next "sibling" node from specific node
        const nextNode = (node: Node): Node|null => {
            if (node.nextSibling) {
                return firstNode(node.nextSibling)
            }
            if (node.parentNode) {
                return node.parentNode
            }
            return null
        }

/**
 * Element visiblity check
 * @see: https://stackoverflow.com/questions/19669786/check-if-element-is-visible-in-dom
 */
        const isVisible = (element: HTMLElement): boolean => {
            return !!(element.offsetWidth || element.offsetHeight || element.getClientRects().length)
        }
//
        const isValidNode = (node: Node): boolean => {
            return node.nodeType == node.TEXT_NODE
                && node.nodeType !== node.COMMENT_NODE
                && !!node.parentElement
                && node.parentElement.tagName !== 'STYLE'
                && node.parentElement.tagName !== 'SCRIPT'
                && isVisible(node.parentElement)
        }
//
//
        let node: Node|null = firstNode(initialNode)
        let offset: number = 0
//
        while (node) {
            if (node.textContent && isValidNode(node)) { 
                const textContent = node.textContent
                const len = textContent.length
                const startOffset = offset
                const endOffset = startOffset + len
                this.textContentNodes.push({startOffset, endOffset, node})
                this.textContent += textContent
                offset = endOffset
            }
            node = nextNode(node)
        }
    }




    getNodes(startNode?: Node, endNode?: Node): Node[] {
        let nodes: Node[] = []
        let enabled: boolean = !startNode
        this.textContentNodes.forEach(textContentNode => {
            if (textContentNode.node === startNode) {
                enabled = true
            }
            if (textContentNode.node === endNode) {
                enabled = false
            }
            if (enabled) {
                nodes.push(textContentNode.node)
            }
        })
        return nodes
    }




    getTextContent(): string {
        return this.textContent
    }




    getTextContentNode(position: number): ITextContentNode|null {
        for (let i: number = 0; i < this.textContentNodes.length; i++) {
            let textContentPointer: ITextContentNode = this.textContentNodes[i]
            if (textContentPointer.startOffset <= position && position < textContentPointer.endOffset) {
                return textContentPointer
            }
        }
        return null
    }




    getPointer(position: number): IPointer|null {
        const textContentNode = this.getTextContentNode(position)
        if (textContentNode) {
            return {
                offset: position - textContentNode.startOffset,
                node: textContentNode.node
            }
        }
        return null
    }




}
