# Overseer

> Front-End

## Future TODO List:

### Product items

Ability to create product items and treat product as
template for the items, e.g. user may have 50 pens he
wants to sell, but each of the pen is has unique color.
Instead of adding 50 different products, he may create
a single product "Pen" and add/import 50 items with same
properties as its product, but custom color property.

That would allow to keep track of individual items without
cluttering the products list or losing important item
information (i.e. the color of the pen).

## Naming rules:

### Api request
some-documents

### Resource name
some-document

### Table Module
some_documents

### Form Module
some_document

### Repository
someDocument

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
