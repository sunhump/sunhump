# frontend-seed-project

Included packages:

* Compilation
  * Gulp
  * npm
  * yarn
  * (bower?)
  * browserify (babel, ES6)
* Frameworks
  * Panini
  * jQuery
* Test frameworks
  * mocha
  * chai

# Install

## Dependencies

[Install node.js LTS](https://nodejs.org/en/)

[Install yarn](https://yarnpkg.com/en/docs/install)

[Install gulp](https://gulpjs.com/)

## Project dependencies

```
yarn install
```
or if you cant live without npm run ```npm install```.

## Setup build path

Set ```BUILD_PATH``` variable in the file ```.env```.

## Optional frameworks

### Foundation

To use Foundation, install these npm packages:
```
yarn add foundation-sites --dev
```

Uncomment Foundation lines in:
```
app/app.init.js
app/app.scss
gulpfile.js
```

### React

To use React, install these npm packages:
```
yarn add react babel-preset-react --dev
```

Uncomment React lines in:
```
app/app.init.js
.babelrc
```

# Structures

## Panini

Folders used by [Panini](https://github.com/zurb/panini):

```
components
helpers
layouts
pages
data
```

## JavaScript

Javascript is placed in its component folder ```components/c-todo/c-todo.js```. Follow the script example ```c-todo.js``` for structure.

## React (with redux)

TODO

# Run

Development
```
npm run dev
```

Production
```
npm run production
```

Test
````
npm run test
```