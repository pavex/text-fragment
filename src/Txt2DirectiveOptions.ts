import {parseDirectiveOptions} from './Txt2FragmentDirective'




export interface ITxt2PointerOptions {
    text: string
    tagName: string
    order: number
}




export interface ITxt2DirectiveOptions {
    start: ITxt2PointerOptions
    end?: ITxt2PointerOptions
}




export class Txt2DirectiveOptions implements ITxt2DirectiveOptions {

    readonly start: ITxt2PointerOptions
    readonly end?: ITxt2PointerOptions
    



    constructor(start: ITxt2PointerOptions, end?: ITxt2PointerOptions) {
        this.start = start
        this.end = end
    }




    static fromString(txt2FragmentString: string): Txt2DirectiveOptions|null {
        return parseDirectiveOptions(txt2FragmentString)
    }




    toString(): string {
//
        const makeBracket = (fragmentPointer: ITxt2PointerOptions, ignoreTagName?: string): string => {
            let s = ''
            if (fragmentPointer.tagName !== 'P' && fragmentPointer.tagName !== ignoreTagName) {
                s += fragmentPointer.tagName
            }
            if (fragmentPointer.order > 0) {
                s += s ? ',' : ''
                s += fragmentPointer.order
            }
            return s ? `{${s}}` : ``
        }

//
        const encodeExtras = (str: string): string => {
            '.,{}[]()-_'.split('').forEach(ch => {
                str = str.replace(new RegExp(`\\${ch}`, 'g'), '%' + ch.charCodeAt(0).toString(16))
            })
            return str
        } 

//
        const encode = (str: string): string => {
            return encodeExtras(encodeURIComponent(str))
        }
//
        let s = ''  
        s += encode(this.start.text)
        s += makeBracket(this.start)
        if (this.end) {
            s += ','
            s += encode(this.end.text)
            s += makeBracket(this.end, this.start.tagName)    
        }
        return s
    }


}