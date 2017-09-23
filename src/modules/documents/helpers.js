import pluralize from 'pluralize'
import S from 'string'

export const getTableName = (name) => {
  return S(pluralize(name)).underscore().s
}

export const getFormName = (name) => {
  return S(pluralize.singular(name)).underscore().s
}

export const getApiRequestName = (name) => {
  return S(getTableName(name)).slugify().s
}

export const getResourceName = (name) => {
  return S(getFormName(name)).slugify().s
}
