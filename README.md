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

##### Final Design Changes

- [ ] Find a better UX way of handling deletion, updates, etc., than just pushing router as path
- [ ] Get an actual image for no image available
- [ ] Add some way to discover games and see what games are on whose lists from your friends
- [ ] Could Add something like Minimaps intake with a list of the most popular games and say "Which have you played/can
      you rate these?" - I really hate how you _have_ to complete that step now, though
- [ ] Copy the goodreads add to list buttons that pull up a menu from the bottom with a list on mobile:
      https://www.goodreads.com/book/show/123247704-house-of-flame-and-shadow
