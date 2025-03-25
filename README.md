# Scrollee
Manage scrapers and feeds to provide a single scrolling experience of your interests

# Scrollee, get your feeds from whereveree

# Concept
 - Login 
	- or create user
	- data saved in database running in the server
 - Land on dashboard
	- some things should be visible
		- the feeds you added already
	 	- ability to prompt for feed creation
		- ability to edit feeds you added already
	- some things can be behind some extra step like button
		- setting up a new feed after you prompted for it in a new page 
		- editing the user info in a new page
 - Feeds
	- Dashboard shows feeds, feeds are essentially just a fetched list of posts coming from a url
	- There will be some logic in place to extrapolate these posts from the site they’re fetched
	- Feeds can be configured/edited via a popup
		- Feeds can be fluid, so on a set interval they will refetch and therefore show new posts
		- Feeds can also be static and be reloaded per a button click inside the feed header
		- Feeds can also grow on scroll down (don’t know if we then show older or newer posts if you scroll down)
		- Feeds can be setup to be ascending or descending  which will also change where new posts will pop in
 - Posts
	- Dashboard shows feeds, these feeds contain posts, posts should:
		- Show original information from fetched post, title, text, image
		- Should have button to show full original post inside a iframe including some meta data
	- Posts should be ordered based on scraped meta data, could be post date creation 

# Technicals
Need to setup a database, a scraping server and an advanced FE based on user friendliness, after all, I want this to be my news feed socially media thing. So it needs to be nice to use. We also want to use web sockets for continuous streams of data