import {
  SAVED_HIDDEN,
  SAVED_FILTERS,
  SAVED_RESIZED,
  SAVED_RESIZING_ENABLED
} from './consts'
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
  },
  updateResized(category: string, resizing: Record<string, number>) {
    const resizedString = localStorageService.getItem(SAVED_RESIZED) ?? '{}'
    const parsedResized = JSON.parse(resizedString)
    let updatedResized = { ...parsedResized }
    if (!Utils.isEmpty(resizing)) {
      updatedResized = { ...updatedResized, [category]: resizing }
    } else {
      Reflect.deleteProperty(updatedResized, category)
    }
    return Utils.isEmpty(updatedResized)
      ? localStorageService.removeItem(SAVED_RESIZED)
      : localStorageService.setItem(
          SAVED_RESIZED,
          JSON.stringify(updatedResized)
        )
  },
  updateResizedEnabled(category: string, isResizedEnabled: boolean) {
    const enabledResize =
      localStorageService.getItem(SAVED_RESIZING_ENABLED) ?? '{}'
    const parsedEnabled = JSON.parse(enabledResize)
    const updatedEnabledResize = {
      ...parsedEnabled,
      [category]: isResizedEnabled
    }
    localStorageService.setItem(
      SAVED_RESIZING_ENABLED,
      JSON.stringify(updatedEnabledResize)
    )
  }
}

export default localStorageService
