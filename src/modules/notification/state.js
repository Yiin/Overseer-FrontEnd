export const defaultOptions = {
  message: '',
  action: null,
  actionText: '',
  color: 'black',
  timeout: 6000
}

export default {
  isVisible: false,

  options: { ...defaultOptions }
}
