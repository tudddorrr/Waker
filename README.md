# Waker
The general workflow of Waker is:
* Call server endpoint to return the host and port of a server
* After returning the server info, check to see if it's up
* If it isn't, post a status on the Twitter bot (limited to every half hour)
