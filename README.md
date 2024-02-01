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
