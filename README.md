# frontend-seed-project

## Includes

* Panini
* Gulp
* Imagemin
* npm
* yarn

### Panini

Folders used by [Panini](https://github.com/zurb/panini):

```
components
helpers
layouts
pages
data
```

### JavaScript

Javascript is placed in its component folder ```components/c-todo/c-todo.js```. Follow the script example ```c-todo.js``` for structure.

### React

To use React, install node package:
```
yarn add react babel-preset-react --dev
```

Uncomment React lines in:
```
app/app.init.js
.babelrc
```

# Setup

## Build path

Set build path variable ```BUILD_PATH``` in the file ```.env```.

## Optional frameworks

These are optional frameworks that can be included in the seed project based on your needs.

### Foundation
To use Foundation, install node package:
```
yarn add foundation-sites --dev
```

Uncomment Foundation lines in:
```
app/app.init.js
app/app.scss
gulpfile.js
```

### React (with redux)

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