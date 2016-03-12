# Facebook London Hackathon (London, 12-13th March 2016)

### Notes

Cannot use iframes (disallowed by indiv. sites, CORS) - Create a Chrome App or Extension that will control browser windows

It will allow you to see several different pages at a single screen

Great for external displays (or when you use 2 or 3 in the office) with high res but also for regular users because you get the continuous range rather than only fixed half and half split (like standard OSs allow you to do) + once you start resizing one, other windows can be resized as well (normally they would stay the same - independent)

User wants to open up Facebook, Gmail, Slack, Spotify, stock market,...and would like to see several browser windows at the same time without clicking through the tabs...  all at one screen + actions to add new, remove and dock and undock and resize (drag edge between - continuous range), lock position, reset layout

Save windows on close (maybe just save addresses and positions if not possible)? How can an extension store data?

### Ideas to mention during presentation
The thing that I am most proud is that we implemented the layout as a binary tree and all operations such as resizing, adding, deleting or moving windows are implemented as modifications of this tree and most updates are recursive traversals...