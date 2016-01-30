![GA Logo](https://raw.github.com/generalassembly/ga-ruby-on-rails-for-devs/master/images/ga.png)

[![Codeship Status](https://www.codeship.io/projects/6ffa7db0-a9aa-0133-cb95-327eac131552/status?branch=master)](https://www.codeship.io)

## WDI Instructor Code Challenge

### GOAL 

> Create a single page application that will utilize an external API to request movie data. The client side application will be served by a back-end which will have the ability to persist data.

#### Back-end Instructions

- Within this repo you will have noticed two folders entitled `node-backend-starter-code` and `ruby-backend-starter-code`. Each of these contains similar back-ends written in frameworks respective to their languages - Sinatra for Ruby and Express for Node.

- Please **choose one** of the back-ends before you proceed. Feel free to pick whichever language you feel more comfortable in.

- Both back-ends contain several errors that commonly made by students, so you will need to do some debugging to ensure they are working correctly.

#### Front-end Instructions

- Use Vanilla Javascript to complete.

- The page should have a form that uses the [OMDBapi](http://www.omdbapi.com/) to search for matching movies and then display the results.
 - *Example*: If a user searches for `Star Wars`, a list of every Star Wars movie will be displayed.

- When the user clicks on a search result display detailed information about that movie.
  - *Example*: If a user is viewing a list of every Star Wars movie and clicks on `Star Wars: A New Hope`, detailed information about that specific movie will be displayed.

- Users should be able to "favorite" a movie and have it persisted via the provided back-end.

- Provide a link to display favorited movies.

#### Things we are looking for

- Clear, simple code
- Explanatory comments for beginners
- Consistent Naming Conventions
- Valid HTML, CSS, and JavaScript

#### Deliverables

- Please fork [this repo](https://github.com/generalassembly-hk/wdi-instructor-challenge) and send us a pull request with the completed code challenge. 

- Include a README.md file in your repo with a link to your application deployed on Heroku or Digital Ocean.

#### Bonus

- Rewrite the application using a JavaScript MVC library. Include a readme that explains the benefits and any additional challenges students would face learning the library
- Use code linting to check and enforce consistent code syntax.
- Add unit tests and code coverage metrics to establish confidence when refactoring.
- Connect your deployment via a continuous integration service like Travis, Circle, or Codeship.

**Happy Coding!!**


#### Solution

I have implemented the core requirement above. I have added a MongoDB database to store the user's faviorites. I have used a uuid to generate a unique url that a user can use as a very basic but quick authentication to retrieve their account and add new faviourites.

Of the bonus taks, I have:
- Added linting
- Added basic unit tests and coverage metrics, although the application is not at full coverage
- Setup continuous deployment through codeship

Some known Limitations include:
- not using pagination, so only the first page of results are returned
- data is refetched and redrawn when a user switches from search to favorites or vice-versa
- I used bootstap for responsiveness and basic CSS - it wasn't specified whether CSS needed to be writen from scartch
- When a user adds or removes a favorite, the display is immediately refreshed rather than waiting for a success confirmation 

[Application is here on Heroku](http://secret-caverns-47270.herokuapp.com)

