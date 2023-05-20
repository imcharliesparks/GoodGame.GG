- [ ] Change firebase to production data mode at some point
- [ ] Set up analytics and logging (if we do console errors are those caught by vercel?)
- [ ] Wire up skelleton UI for game cards
- [ ] Wire up loading spinner for page transitions (also do this in template)
- [ ] Figure out how to set dynamic ENV variables in Vercel based on a cron job (need for access token)
- [ ] Make mobile layout w/ nav footer and consume on set widths
- [ ] Implement page-transition loading like
      [this](https://medium.com/@remoteupskill/how-to-manage-loading-elegantly-in-your-next-js-application-5debbfb4cace)
- [x] Make the sign out button actually redirect to home instead of our Clerk instance
- [ ] Implement mobile-first layout and figure out what to use instead of vw and vh
- [ ] Fix speed on API calls because it's really bad
- [x] Update slug pattern on data structures to be game id instead
- [x] Fix ordering of games in collection as it's currently variable
- [ ] Add filtering/sorting
- [ ] Make this app invite only to start and use the Clerk Invitations API
- [ ] Add the ability to add your gamertag in Clerk and invite/lookup your friends by it. This should be part of the
      intake phase.
- [ ] Fix "This document requires 'TrustedScript' assignment." error on google auth page from clerk (at the page where
      it shows all your google accounts)
- [ ] BIG TODO: Update the Clerk sign-up process. We need name, gamertag, etc.
- [ ] BIG TODO: Add pagination to search for speed
- [ ] Update game to collection and wishlist to include extra datapoints or just pull them live tbh
