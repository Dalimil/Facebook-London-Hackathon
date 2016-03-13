# Facebook London Hackathon (London, 12-13th March 2016)

### We built [Mosaic](https://chrome.google.com/webstore/detail/mosaic/jjkdinonnkgnnapdocolkjfnabepfkmj?hl=en-US&gl=GB)

Mosaic offers an innovative way of browsing the internet using multiple web pages in a single window instead of many single tabs

### Avaliable on the Google Chrome Store
[Mosaic](https://chrome.google.com/webstore/detail/mosaic/jjkdinonnkgnnapdocolkjfnabepfkmj?hl=en-US&gl=GB)
[Mosaic helper extension](https://chrome.google.com/webstore/detail/helper-extension-for-mosa/nnhknchgeoeghedkfolliaihjghiijih)

### Notes
Cannot use iframes (disallowed by indiv. sites, CORS) - Create a Chrome App (+ Extension) that will control webviews

It will allow you to see several different pages at a single screen

Great for external displays (or when you use 2 or 3 in the office) with high res but also for regular users because you get the continuous range rather than only fixed half and half split (like standard OSs allow you to do) + once you start resizing one, other windows can be resized as well (normally they would stay the same - independent)

User wants to open up Facebook, Gmail, Slack, Spotify, stock market,...and would like to see several browser windows at the same time without clicking through the tabs...  all at one screen + actions to add new, remove and dock and undock and resize (drag edge between - continuous range), lock position, reset layout.  
Window state is saved to the cloud and is restored after closing and reopening.

### Ideas to mention during presentation
The thing that I am most proud is that we implemented the layout as a binary tree and all operations such as resizing, adding, deleting or moving windows are implemented as modifications of this tree and most updates are recursive traversals... For example: action 'resetLayout' is a breadth first search that recreates the layout tree