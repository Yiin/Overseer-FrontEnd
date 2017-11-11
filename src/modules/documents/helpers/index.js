import pluralize from 'pluralize'
import S from 'string'

// some_documents
export const getTableName = (name) => {
  return S(pluralize(name)).underscore().s
}

// some_document
export const getFormName = (name) => {
  return S(pluralize.singular(name)).underscore().s
}

// some document / some documents
export const getDocumentTitle = (name, type = 'singular|lowercase') => {
  const rules = type.split('|')

  return rules.reduce((name, rule) => {
    switch (rule) {
    case 'singular':
      return pluralize.singular(name)
    case 'plural':
      return pluralize(name)
    case 'capitalize':
      return S(name).capitalize().s
    case 'lowercase':
      return name.toLowerCase()
    case 'uppercase':
      return name.toUpperCase()
    }
  }, S(name).humanize().s)
}

// some-documents
export const getApiRequestName = (name) => {
  return S(getTableName(name)).slugify().s
}

// some-document
export const getResourceName = (name) => {
  return S(getFormName(name)).slugify().s
}

// someDocument
export const getRepositoryName = (name) => {
  return S(pluralize.singular(name.toLowerCase())).camelize().s
}
