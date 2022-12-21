# fitnesstrackr

an API for our new fitness empire, FitnessTrac.kr, using node, express, and postgresql

## Getting Started

Install Packages

    npm i

Initialize Database

    createdb fitness-dev

Run Seed Script

    npm run seed:dev

## Automated Tests

**NOTE:** At first, there will be too many errors for the tests to even run. Start by running the seed:dev script above, until it is working.

Once you've resolved all errors in your console, we recommend running the DB tests first, and move to API next. When you open the test files, you'll notice that the `it()` blocks defining tests are all prefaced with an `x`. Adding and removing the `x` lets you decide to set some tests as _skipped_, meaning they won't run. To get the tests to run remove the `x`.

If you'd like to remove all of them in a file at once you can use the `CMD + f` on Mac or `CTRL + f` on Windows to begin a search. In the search bar type `xit` and select the drop down arrow at the left of the search bar. You'll see a placeholder in another bar that says replace. In this bar type `it`. Lastly, look to the right hand side and hover your cursor over the icons to find the one that will replace all. Typically this is the last one on the right. Then save the file. If you have run the test script below, you should see the tests begin running in the terminal.

If you only want to run one or two tests, you can add `.only` after `it` and `describe` to isolate that particular test. That is, to run only the tests in a particular `describe` block, use: the syntax `describe.only()`. To isolate one or more `it` blocks, use `it.only()`.

Make sure to read the tests and comments in this repo carefully, they offer some hints every now and again that could save you hours!

To run all the tests in watch mode (re-runs on code update), run

    npm run test:watch

### DB Methods

    npm run test:watch db

### API Routes (server must be running for these to pass)

    npm run test:watch api
