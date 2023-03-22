import * as Txt2 from '/Txt2FragmentDirective'
import * as SelectionOptions from '/SelectionOptions'



//
document.addEventListener('mouseup', e => {

// Get current selection data
    let selectionOptions = SelectionOptions.getSelectionOptions()
    if (selectionOptions) {

// Create directive options from selection
        Txt2.createSelectorDirective(selectionOptions).then(txt2DirectiveOption => {

// Create directive string
            let directiveOptionsString = txt2DirectiveOption.toString()

// Complete fragment 
            let textFragment = `#:~:txt2=${directiveOptionsString}`

// Out
            console.log('txt2DirectiveOption=', txt2DirectiveOption)
            console.log('\u27F6 textFragment= %c' + textFragment + '%c',
                'background-color: yellow; color: black',
                'background-color: initial; color: initial'
            )

// Try to parse again to generate SelectionOptions
            console.log('parsed textFragment=', Txt2.parseDirectiveOptions(textFragment))
        })
    }
})


/*
// Parse multi-fragment string

let hash = '#:~:txt2=Core%20%28photoswipe%2eesm%2ejs%29%2e{STRONG}&txt2=JS%20files,main%20bundle%2e{H1,2}'
let fragments = Txt2.parseFragment(hash)


fragments.forEach(fragment => {
    console.log('parse fragment', fragment, Txt2.parseDirectiveOptions(fragment))
})
*/