/**
 * @description Text content node index service for analyze document nodes
 * @author Pavel Machacek <pavex@ines.cz> 
 */


export interface ITextContentNode {
    node: Node
    startOffset: number
    endOffset: number
    tagName: string
    order: number
}




export interface IPointer {
    offset: number
    node: Node
}





export class TextContentNodes {

    private textContentNodes: ITextContentNode[] = []
    private textContent: string = ''




    constructor(rootNode?: Node) {
        if (rootNode) {
            this.analyze(rootNode)
        }
    }




    analyze(rootNode: Node): void {
/**
 * Element visiblity check
 * @see: https://stackoverflow.com/questions/19669786/check-if-element-is-visible-in-dom
 */
        const isVisibleElement = (element: HTMLElement): boolean => {
            return !!(element.offsetWidth || element.offsetHeight || element.getClientRects().length)
        }

        const isAllowedNodeType = (nodeType: number): boolean => {
            return nodeType === Node.TEXT_NODE && nodeType !== Node.COMMENT_NODE
        }

        const isAllowedTagName = (tagName: string): boolean => {
            return ['SCRIPT', 'STYLE'].indexOf(tagName) === -1
        }
//
//
        const treeWalker = document.createTreeWalker(rootNode, NodeFilter.SHOW_TEXT)
        let node: Node|null = treeWalker.firstChild()
        let offset: number = 0
        let tags: {[key: string]: number} = {}
//
// Store tagName count
        const getOrder = (tagName: string): number => {
            !tags[tagName] ? tags[tagName] = 0 : undefined
            return tags[tagName]++
        }
//
        while (node) {
            if (node.textContent && !!node.parentElement
                && isAllowedNodeType(node.nodeType)
                && isAllowedTagName(node.parentElement.tagName)
                && isVisibleElement(node.parentElement)) {
// Calculate start and end offset of text
                const textContent = node.textContent
                const len = textContent.length
                const startOffset = offset
                const endOffset = startOffset + len
// Obraint tagName and tag name order
                let tagName =  node.parentElement.tagName
                let order = getOrder(tagName)
//
                this.textContentNodes.push({node, startOffset, endOffset, tagName, order})
                this.textContent += textContent
                offset = endOffset
            }
            node = treeWalker.nextNode()
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




    getTextContentNodes(): ITextContentNode[] {
        return this.textContentNodes
    }




    getTextContentNodeByNode(node: Node): ITextContentNode|null {
        return this.textContentNodes.find(textContentNode => textContentNode.node === node) || null
    }




    getTextContentNodeByPosition(position: number): ITextContentNode|null {
        for (let i: number = 0; i < this.textContentNodes.length; i++) {
            let textContentPointer: ITextContentNode = this.textContentNodes[i]
            if (textContentPointer.startOffset <= position && position < textContentPointer.endOffset) {
                return textContentPointer
            }
        }
        return null
    }




    getTextContentNode(input: Node|number): ITextContentNode|null {
        return input instanceof Node ? this.getTextContentNodeByNode(input) : this.getTextContentNodeByPosition(input)
    }




    getPointer(position: number): IPointer|null {
        const textContentNode = this.getTextContentNodeByPosition(position)
        if (textContentNode) {
            return {
                offset: position - textContentNode.startOffset,
                node: textContentNode.node
            }
        }
        return null
    }




}