# ChapmanU Dimensions
The one stop shop for all things related to image resizing on the Chapman University website network

Located at [dimensions.chapman.edu](http://dimensions.chapman.edu).

### Development Environment Setup
This is as simple as it gets. Clone the repository locally, navigate to the project folder, and run `php -S localhost:8000`

### Testing
Install test dependencies:

  `npm install`

Run all tests:

  `npm test`

### Deployment:
Dimensions is hosted on GitHub pages which publishes from the `gh-pages` branch.
After changes are merged into the `master` branch, bring changes into `gh-pages` branch.

    # From the master brach:
    git pull origin master
    git checkout gh-pages
    git merge master
    git push origin gh-pages