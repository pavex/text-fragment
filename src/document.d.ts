export declare global {


    interface Document {
        fragmentDirective: FragmentDirective
    }


    class Directive {
        readonly DirectiveType: type
        toString(): DOMString
    }
      
      
    class SelectorDirective extends Directive {
        getMatchingRange(): Promise<Range>
    }


    interface TextDirectiveOptions {
        prefix: DOMString
        textStart: DOMString
        textEnd: DOMString
        suffix: DOMString
    }

    
    class TextDirective extends SelectorDirective, TextDirectiveOptions {
        constructor(textDirectiveOptions: TextDirectiveOptions)
    }


    interface FragmentDirective {
        items: TextDirective[]
        createSelectorDirective(selection: Selection): Promise<TextDirective>
    }


}