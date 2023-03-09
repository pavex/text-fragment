import {TSelectionOptions, setNativeSelection} from './SelectionOptions'
import {parseTextFragment, parseFragmentDirectives} from './TextFragment'




const textDirectiveOptionsPatch = (textDirective: TextDirective): TextDirectiveOptions => {
    const textFragment = textDirective.toString()
    const textFragmentDirectiveList: string[] = parseTextFragment(textFragment)
    const textDirectiveOptionsList: TextDirectiveOptions[] = parseFragmentDirectives(textFragmentDirectiveList)

    if (textDirectiveOptionsList.length === 0) {
        throw Error('Text directive patch error.')
    }
    return textDirectiveOptionsList[0]
}




export const createSelectorDirective = (selectionOptions: TSelectionOptions): Promise<TextDirectiveOptions> => {
    setNativeSelection(selectionOptions)
    const selection = document.getSelection()
    if (!selection) {
        throw Error
    }
    return document.fragmentDirective.createSelectorDirective(selection)
        .then(textDirective => {
            const selection = document.getSelection()
            selection ? selection.removeAllRanges() : undefined
            return textDirectiveOptionsPatch(textDirective)
        })
}




