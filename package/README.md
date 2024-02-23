# Project: Horizon Web Components

This project contains web components built from the Data Cloud Studio design system guidelines. This is published to NPM: [@horizon-msft/web-components](https://www.npmjs.com/package/@horizon-msft/rfwcw),

```
.
├── libs
|  ├── horizon-web-components
|  |  └── src
|  |  |  └── components
```

## Project Scripts

The project's package.json scripts are your starting point.

### SvgIcon Component

Prior to running Storybook, generate the sprites used by this component for demonstration purposes. **Run this script from within the project. This is a one-time task.**

- `yarn run generate-sprite` generate the SVG sprite.

### Storybook

- `yarn run web-components:storybook` run Storybook.

### Build

- `yarn run web-components:build` build the Horizon web components.

### Install

Run this script to build the Horizon web components workspace and then add the built package to your project. This is also used to install Horizon web components as a dependency of the angular-wrappers and react-wrappers projects.

- `yarn run web-components:install` install the Horizon web components.

### Test

Run these tests from within the project.

- `yarn install playwright` install Playwright.
- `yarn run test` test wrappers with Playwright.
- `yarn run unit-test` run Jest unit tests in SvgIcon component scripts/ folder.

### Pack

- `yarn run web-components:pack` pack the Horizon web components.

### Publish

Publishes the Horizon web components to Npm. It encompasses the entire process from pre-publishing tasks like version bumping, compiling, and building, to the final step of publishing the wrappers to the npm registry.

- `yarn run web-components:publish` publish the Horizon web components.
- `yarn run web-components:publish-dry` dry run the publish script.

#### Command Execution Flow

Running one of the above scripts will in turn run its respective script in libs/horizon-web-components:  
`"build-and-publish": "yarn pre-publish ; yarn publish-lib"`

1. **Pre-Publish:** Executes the fluent-wrappers:pre-publish script within the @horizon-msft/react-wrappers workspace. This step includes bumping the wrapper version, compiling TypeScript files, and building the package to ensure it is up-to-date.
2. **Publish Wrappers:** Runs the fluent-wrappers:publish-wrappers script, which navigates to the distribution directory and publishes the Fluent Wrappers package to npm with public access.
3. **Usage Context:** Utilize this script when the Fluent Wrappers for React are fully tested and ready for release and distribution. This is typically the final step in the development cycle of Fluent Wrappers for React.

### Release Instructions

**Fabric Web Components**

1. Ensure all local changes are up to date with `main` via `git pull origin main`
2. Check out a new version of the package from `main`, e.g. `release-0.0.12`
3. Ensure the workspace's project.json version number matches the current version number on npmjs.org at [https://www.npmjs.com/package/@horizon-msft/web-components?activeTab=versions](https://www.npmjs.com/package/@horizon-msft/web-components?activeTab=versions)
4. Run `yarn web-components:build`
5. `cd` into `dist` folder and verify correct version in `package.json`
6. Run `yarn web-components:publish`
