import pluralize from 'pluralize'
import S from 'string'

export const getNormalizedName = (name) => {
  return S(pluralize.singular(name)).slugify().s.toLowerCase()
}

function singular(name) {
  const map = {
  }
  const normalizedName = getNormalizedName(name)

  if (normalizedName in map) {
    return map[normalizedName]
  }
  return pluralize.singular(name)
}

function plural(name) {
  const map = {
  }
  const normalizedName = getNormalizedName(name)

  if (normalizedName in map) {
    return map[normalizedName]
  }
  return pluralize(name)
}

// some_documents
export const getTableName = (name) => {
  return S(plural(name)).underscore().s
}

// some_document
export const getFormName = (name) => {
  return S(singular(name)).underscore().s
}

/**
 * Get name as title
 *
 * @param  {string} name Name to convert
 * @param  {string} type List of rules to apply in rule1|rule2 format
 * @return {string}      Converted name
 */
export const getDocumentTitle = (name, type = 'singular|lowercase') => {
  const rules = type.split('|')

  return rules.reduce((name, rule) => {
    switch (rule) {
    case 'singular':
      return singular(name)
    case 'plural':
      return plural(name)
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
  return S(singular(name.toLowerCase())).camelize().s
}
