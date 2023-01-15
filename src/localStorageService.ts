import {SAVED_HIDDEN, SAVED_FILTERS } from './consts'
import Utils from './utils'

const localStorageService = {
  setItem(key: string, item: string | boolean) {
    return localStorage.setItem(key, item as string)
  },
  getItem(key: string) {
    return localStorage.getItem(key)
  },
  removeItem(key: string) {
    return localStorage.removeItem(key)
  },
  updateFilters(key: string, value: any) {
    const filtersString = localStorageService.getItem(SAVED_FILTERS) ?? '{}'
    const parsedFilters = JSON.parse(filtersString)
    let updatedFilters = { ...parsedFilters }
    if (!Utils.isEmpty(value)) {
      updatedFilters = { ...updatedFilters, [key]: value }
    } else {
      Reflect.deleteProperty(updatedFilters, key)
    }
    return Utils.isEmpty(updatedFilters)
      ? localStorageService.removeItem(SAVED_FILTERS) : localStorageService.setItem(SAVED_FILTERS, JSON.stringify(updatedFilters))
  },
  updateHidden(key: string, value: any) {
    const hiddenString = localStorageService.getItem(SAVED_HIDDEN) ?? '{}'
    const parseHidden = JSON.parse(hiddenString)
    const updatedHidden = { ...parseHidden }
    updatedHidden[key] = value
    localStorageService.setItem(SAVED_HIDDEN, JSON.stringify(updatedHidden))
  }
}

export default localStorageService
