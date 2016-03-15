# Mosaic - Chrome App
## Facebook London Hackathon (London, 12-13th March 2016)

### [Mosaic in the Chrome Web Store](https://chrome.google.com/webstore/detail/mosaic/jjkdinonnkgnnapdocolkjfnabepfkmj?hl=en-US&gl=GB)

**Mosaic offers an innovative way of browsing the internet using multiple web pages in a single window view rather than many individual tabs.**

![Mosaic Chrome App](https://github.com/Dalimil/Mosaic-Chrome-App/blob/master/Screenshot-Mosaic.jpg)

#### [Mosaic Chrome App](https://chrome.google.com/webstore/detail/mosaic/jjkdinonnkgnnapdocolkjfnabepfkmj?hl=en-US&gl=GB)
Chrome App that provides the main Mosaic application. It allows you to easily view and manipulate multiple web pages in a single window.

#### [Mosaic Helper Extension](https://chrome.google.com/webstore/detail/helper-extension-for-mosa/nnhknchgeoeghedkfolliaihjghiijih)
Chrome extension that allows you to move your browser tabs from a Chrome window to Mosaic.

![Mosaic Icon](https://github.com/Dalimil/Mosaic-Chrome-App/blob/master/Logo-Icon-Mosaic.png)

### Notes
Iframes could not be used to accomplish the required functionality as they are often blocked by the origin websites. That is why a Chrome App, which can use webview elements and completely avoid iframes, was created. Users have the ability to add, delete, resize and drag and drop webpage views. State of the layout is synchronized with user's Google account and reopening the app always restores the last opened web pages, thanks to storing the user session in the cloud.

Having the ability to see several different webpages at a single screen increases productivity and is generally more convenient. It is a great tool with external displays or screens that have high resolution. Do you ever get bored of clicking through all your browser tabs? With Mosaic you can see all your favourite websites in a single window...

### Layout
The representation of the layout is implemented as a binary tree.  
All operations (such as resizing, adding, deleting or moving windows) are implemented as functions that modify this tree and often involve recursive traversals. For example, action 'resetLayout' is a function that rebuilds the whole tree using breadth first search and adding new nodes/views layer by layer.

### Hackathon Team
[Dalimil Hajek](https://github.com/dalimil), [Alexis Chevalier](https://github.com/AlexisChevalier), [Ben Clark](https://github.com/GreenyRepublic), [Ben Pye](https://github.com/benpye)