# Text fragment utils and text higlighter

A set of tools for working with text fragment and text directives intended for highlighting text in html pages.

It is based on the syntax that is implemented in Google Chrome and described in more detail in the following draft:
https://wicg.github.io/scroll-to-text-fragment/

----

## Txt2 Fragment directivies

### Motivation

My goal was to integrate functions with text fragments into the [Reabr online bookmark manager](https://www.reabr.com "Reabr online bookmark manager") application.

In the pilot version, a deficiency with highlighted texts was revealed.
The impossibility of selecting text for variously complicated websites mainly for the following reasons:
- duplication
- selector too long
- when using a prefix or suffix, the text fragment included dynamic texts

#### Dynamic prefix/suffix

The third point proved to be the most pressing. I will give an example:

An article, e.g. of a newspaper media, contains a headline and then the same headline text is shown at the bottom of the page, e.g. as a link to newly published articles.
It means that the given heading is not unique on the page. So it will be necessary to include perex in the selector.

The current date, or the number of posts in the discussion, etc. is given before the title (a dynamic element that changes over time).

So perex will include this dynamic text ie. that its reproduction based on the link to the page will not be reliable over time.


### Basic idea

I decided to develop a concept based on a different approach.

The proposed system is primarily intended for HTML documents, but it would be possible to modify it for plaitext or other sources as well.

**Focuses**:
- short selectors
- do not use prefix and suffix
- resolve duplication

### Solutions

`#:~:txt2=startText[{TagName, order}][,endText[{TagName, order}]]`

The structure of the fragment consists only of startText and endText. endText is optional if startText includes the entire highlighted text.

Both the startText and endText strings can be followed by a specification of the position indicated in parentheses.

The information contains in which element of the document the beginning of the selected text is located.

The number then tells how many occurrences the text for the given element is in question.

#### Optimization

- If tag name is `P`, character not shown in result fragment
- If order is 1, number not shown in result fragment
- If tag name of endText is a same as tag name of startText, tag name in end text fragment not shown  


### Examples of fragments

`#:~:txt2=Registration%20and%20login{H2}`

`#:~:txt2=Reabr%20is{STRONG},fullest%2e`

`#:~:txt2=Registration{H2},and%20login{1}`


## Real usage

These tools are used in the source code of the [Goolge Chrome extension](https://chrome.google.com/webstore/detail/reabr/foekanecjajkibjpcppepmnkofmcnjhc) application [Reabr online bookmark manager](https://www.reabr.com).

Here, they ensure convenient highlighting of text in HTML pages and its subsequent saving using a text fragment in the Reabr application. Using the embedded entry in the application, it is possible to recall the highlighted text using a special fragment.



