### Resources

##### APIs

- https://psn-api.achievements.app/
- https://andshrew.github.io/PlayStation-Trophies/#/APIv2
- https://github.com/achievements-app/psn-api
- https://github.com/xDimGG/node-steamapi#steamapigetuserstatsid-app-%E2%87%92-codepromiseltplayerstatsgtcode
- https://github.com/XboxReplay/xboxlive-api

##### Feature Ideas

- A lot to unpack here: https://www.collectorz.com/game/video-game-database
- Potentially update layout w/ grid: https://www.digitalocean.com/community/tutorials/css-css-grid-holy-grail-layout

##### To Do

- [ ] Make sure all API routes are protected by middleware, and if not, add `getAuth` checks
- [ ] Maybe add search bar to nav for searching for a game && Make the page an SSR'd one
- [ ] Make sure DB is working as it's in prod mode
- [ ] Replace all wrong imports of getAuth
- [ ] Fix firebase permissions (should do this for all apps)
- [ ] BIG TODO: Change out the JSON payloads in Docs to be in our DBs somewhere
- [ ] TODO: Figure out how the hell we want to handle genres and stuff
- [ ] Eventually figure out how to handle multiple editions
- [ ] Write a service that has an aggregate score rather than just the moby score
- [ ] Eventually sign up for the metacritic API and use that
- [ ] Remove node environment checks in middleware before golive
- [ ] Come back to the user intake flow when we have more data to add (steam integrations, other APIs, etc.)
- [ ] Set up SSR handled search queries in search/games
- [ ] Refactor lists so that they support platform and digital/physical
- [ ] look into APICalypse for your API caching Handling Lists
- [ ] Convert your after auth call to just a req that fires to an endpoint instead of doing user lookup logic
- [ ] Rewrite nav header to not use daisy
- [x] Fix bug where currently selectd game is undefined
- [ ] When a user gets added, we need to create three lists for them: Collection Wishlist and Backlog and make sure they
      have the `dateAdded` and `dateUpdated` props
- [x] Fix bug where save game to modal checkboxes don't update properly
- [ ] Fix descriptions being empty breaking bug (see persona 5 ultimate edition)
- [ ] Get more user data (see SparkAssit project for how to do it)
- [ ] Make sure all error instances are properly handled (just text search error)
- [ ] Fix all usages of `container` so they actually are enforcing max width
- [ ] Figure out why drawer is slow to come up
- [ ] Make use of owned platforms state

##### Final Design Changes

- [ ] Find a better UX way of handling deletion, updates, etc., than just pushing router as path
- [ ] Get an actual image for no image available
- [ ] Add some way to discover games and see what games are on whose lists from your friends
- [ ] Could Add something like Minimaps intake with a list of the most popular games and say "Which have you played/can
      you rate these?" - I really hate how you _have_ to complete that step now, though
- [ ] Copy the goodreads add to list buttons that pull up a menu from the bottom with a list on mobile:
      https://www.goodreads.com/book/show/123247704-house-of-flame-and-shadow
- [ ] Rethink dialog behavior around adding and deleting games (right now the drawer stays up)
- [ ] Add a loading screen on navigation that waits for the page to fully settle before it makes any further changes
- [ ] When viewing a game, either on search or details, I'd like some way to visually indicate that a game is on one of
      your lists. Maybe a simple one on search/collection view, and more details on the details view
- [ ] Fix the button getting highlighted after adding to list from the bottom drawer
- [ ] Replace all icons with Hero Icons instead of icons kit
- [ ] Add badge to add to list buttons (see checkmark example in material docs)
- [ ] Rethink the hover on the collection page
- [ ] Think of a better way to delineanate between delete and update in the bottom drawer
- [ ] Make a better way to view what list the user is on when udpating or deleting a game
- [ ] We need a better way to get to a specific list from mobile instead of having to see them all

### Architecture Changes for ReWrite

- [ ] Make lists its own collection with IDs for each list instead of doing everything by list name

### Still To Do for M-ist MVP

- [ ] Redo header
- [ ] Add list creation
- [ ] Start some form of data backup
- [x] Fix bug with list names not getting sorted
- [x] Fix bug where bottom drop up isn't cleared on exit
- [ ] Change alerts to toast
- [ ] Fix overflow on cards on lists page of titles
- [ ] Resconsider adding a search bar to the header
- [ ] Consider removing Good Game text from mobile view (or place in the center)
- [ ] Maybe add a dopeass carosel on the discover games page (or the home page)
- [ ] Add auto adding to backlog and wishlist based on answers
- [ ] Figure out an inbetween fix for doing router.replace instead of push

### Central State Management Changes

- [ ] Toasts with dispatchers from anywhere
- [ ] Dialog/Modal openers from anywhere
- [ ] Logic for: adding a game, removing a game
