const state = {
  paymentTerms: [
    { id: 7, name: '7 Days' },
    { id: 14, name: '14 Days' },
    { id: 15, name: '15 Days' },
    { id: 30, name: '30 Days' },
    { id: 60, name: '60 Days' },
    { id: 90, name: '90 Days' },
    { id: 0, name: '0 Days' }
  ],
  frequencies: [
    { name: 'weekly', value: 1, type: 'week' },
    { name: 'two_weeks', value: 2, type: 'week' },
    { name: 'four_weeks', value: 4, type: 'week' },
    { name: 'monthly', value: 1, type: 'month' },
    { name: 'two_months', value: 2, type: 'month' },
    { name: 'three_months', value: 3, type: 'month' },
    { name: 'six_months', value: 6, type: 'month' },
    { name: 'annually', value: 1, type: 'year' }
  ],
  memberStates: [
    { 'code': 'AT', 'name': 'Austria' },
    { 'code': 'BE', 'name': 'Belgium' },
    { 'code': 'BG', 'name': 'Bulgaria' },
    { 'code': 'CY', 'name': 'Cyprus' },
    { 'code': 'CZ', 'name': 'Czech Republic' },
    { 'code': 'DE', 'name': 'Germany' },
    { 'code': 'DK', 'name': 'Denmark' },
    { 'code': 'EE', 'name': 'Estonia' },
    { 'code': 'EL', 'name': 'Greece' },
    { 'code': 'ES', 'name': 'Spain' },
    { 'code': 'FI', 'name': 'Finland' },
    { 'code': 'FR', 'name': 'France ' },
    { 'code': 'GB', 'name': 'United Kingdom' },
    { 'code': 'HR', 'name': 'Croatia' },
    { 'code': 'HU', 'name': 'Hungary' },
    { 'code': 'IE', 'name': 'Ireland' },
    { 'code': 'IT', 'name': 'Italy' },
    { 'code': 'LT', 'name': 'Lithuania' },
    { 'code': 'LU', 'name': 'Luxembourg' },
    { 'code': 'LV', 'name': 'Latvia' },
    { 'code': 'MT', 'name': 'Malta' },
    { 'code': 'NL', 'name': 'The Netherlands' },
    { 'code': 'PL', 'name': 'Poland' },
    { 'code': 'PT', 'name': 'Portugal' },
    { 'code': 'RO', 'name': 'Romania' },
    { 'code': 'SE', 'name': 'Sweden' },
    { 'code': 'SI', 'name': 'Slovenia' },
    { 'code': 'SK', 'name': 'Slovakia' }
  ]
}

export default state
