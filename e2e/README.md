#e2e Test Suite

### Development

These e2e tests were made with the WebDriver testing framework. See [WebDriver](http://webdriver.io/) for official documentation.

### Prerequisites

Run the following command in the 'application' directory to install the dependencies for the project.

`yarn install`

If you get the error: The engine "node" is incompatible with this module. Expected version ">=8.x.x".

Rerun the following command.

`node install --ignore-engine`

Start the web server.

`yarn start:[local|dev]`

Change directories.

`cd e2e`

Install the dependencies for the e2e test suite.

`yarn install`


### Running the Tests

##### Usage

`yarn test:e2e[:visual] `

Running in visual mode will slow the execution of the tests but is useful for debugging.

_Test tag functionality will be added later._

##### Examples

