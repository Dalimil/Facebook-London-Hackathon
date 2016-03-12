# Facebook London Hackathon (London, 12-13th March 2016)
Facebook London Hackathon 2016

### UPDATE:
Chrome App (not extension)

### Notes

Cannot use iframes (disallowed by indiv. sites, CORS) - Create a Chrome extension that will control browser windows

It will allow you to see several different pages at a single screen

Great for external displays (or when you use 2 or 3 in the office) with high res but also for regular users because you get the continuous range rather than only fixed half and half split (like standard OSs allow you to do) + once you start resizing one, other windows can be resized as well (normally they would stay the same - independent)

User wants to open up Facebook, Gmail, Slack, Spotify, stock market,...and would like to see several browser windows at the same time without clicking through the tabs...  all at one screen + actions to add new, remove and dock and undock and resize (drag edge between), lock position, reset layout

Override NewTab window?

Save windows on close (maybe just save addresses and positions if not possible)? How can an extension store data?

Layout - how to keep track of windows that need to be resized when you resize one?

Idea_1: don't save as arrays/lists but as a graph - two types of nodes - window and boundary and edges are always between 'window' and 'boundary'... Bipartite? Resizing a window is then just checking all neighbours of a boundary node (but need to detect relevant edge first). 
- Allow colspan not just row span  
- One should be able to resize continuous range (not just discrete steps)  
- Force clipping and update graph on clip/unclip - boundaries change...  

#### Issues
What if I close a window in the middle? How does the layout change?

What if I want to move a window (instead of a resize)?

What if I want to move a window to a different position but keep it docked?