import axios from 'axios'
import {
  FETCH_DEVICES,

  OPEN_DEVICE,
  CLOSE_DEVICE,

  OPEN_DEVICE_MONITOR_PICKER,
  CLOSE_DEVICE_MONITOR_PICKER,

  OPEN_DEVICE_MONITOR_WIZARD,
  CLOSE_DEVICE_MONITOR_WIZARD,
  CLEAR_DEVICE_WIZARD_INITIAL_VALUES,

  // FETCH_DEVICE_RULES,
  FETCH_DEVICE_WORKFLOWS,
  OPEN_DEVICE_WORKFLOW_MODAL,
  CLOSE_DEVICE_WORKFLOW_MODAL,
  ADD_DEVICE_WORKFLOW,
  UPDATE_DEVICE_WORKFLOW,
  // FETCH_DEVICE_RAW_INCIDENTS,
  FETCH_DEVICE_EVENTS,
  FETCH_DEVICE_PHYSICAL_RULES,
  FETCH_DEVICE_BASIC_MONITORS,
  FETCH_DEVICE_EVENTLOG,
  FETCH_DEVICE_APPS,

  OPEN_DEVICE_EDIT_MODAL,
  CLOSE_DEVICE_EDIT_MODAL,

  FETCH_DEVICE_TEMPLATES,
  ADD_DEVICE_TEMPLATE,
  UPDATE_DEVICE_TEMPLATE,
  DELETE_DEVICE_TEMPLATE,
  OPEN_DEVICE_TEMPLATE_MODAL,
  CLOSE_DEVICE_TEMPLATE_MODAL,

  OPEN_DEVICE_RULE_MODAL,
  CLOSE_DEVICE_RULE_MODAL,

  FETCH_WORKFLOW_CATEGORIES,

  NO_AUTH_ERROR
} from './types'

import { apiError, updateDeviceError } from './Errors'

import { ROOT_URL } from './config'

import { encodeUrlParams } from '../shared/Global'

export const fetchDevices = () => {
  if (!window.localStorage.getItem('token')) {
    return dispatch => dispatch({ type: NO_AUTH_ERROR })
  }
  return (dispatch) => {
    let config = {
      headers: {
        'Cache-Control': 'no-cache',
        'X-Authorization': window.localStorage.getItem('token')
      }
    }
    axios.get(`${ROOT_URL}/device`, config)
      .then(response => fetchDevicesSuccess(dispatch, response))
      .catch(error => apiError(dispatch, error))
  }
}

const fetchDevicesSuccess = (dispatch, response) => {
  console.log('Response DATA:', response.data._embedded.devices)
  dispatch({
    type: FETCH_DEVICES,
    payload: response.data._embedded.devices
  })
}

export const openDevice = (device) => {
  return (dispatch) => {
    dispatch({
      type: OPEN_DEVICE,
      data: device
    })
  }
}

export const closeDevice = () => {
  return (dispatch) => {
    dispatch({
      type: CLOSE_DEVICE
    })
  }
}

export const openDeviceMonitorPicker = () => {
  return (dispatch) => {
    dispatch({
      type: OPEN_DEVICE_MONITOR_PICKER
    })
  }
}

export const closeDeviceMonitorPicker = () => {
  return (dispatch) => {
    dispatch({
      type: CLOSE_DEVICE_MONITOR_PICKER
    })
  }
}

export const openDeviceMonitorWizard = (initialValues) => {
  return (dispatch) => {
    dispatch({
      type: OPEN_DEVICE_MONITOR_WIZARD,
      data: initialValues
    })
  }
}

export const closeDeviceMonitorWizard = () => {
  return (dispatch) => {
    dispatch({
      type: CLOSE_DEVICE_MONITOR_WIZARD
    })
  }
}

export const clearDeviceWizardInitialValues = () => {
  return (dispatch) => {
    dispatch({
      type: CLEAR_DEVICE_WIZARD_INITIAL_VALUES
    })
  }
}

// export const fetchDeviceRules = () => {
//   return (dispatch) => {
//     dispatch({
//       type: FETCH_DEVICE_RULES,
//       data: []
//     })
//   }
// }

export const fetchDeviceWorkflows = (params) => {
  if (!window.localStorage.getItem('token')) {
    return dispatch => dispatch({ type: NO_AUTH_ERROR })
  }
  return (dispatch) => {
    let config = {
      headers: {
        'Content-Type': 'application/hal+json;charset=UTF-8'
      }
    }
    axios.get(`${ROOT_URL}/workflow/search/findById?${encodeUrlParams(params)}`, config)
      .then((response) => fetchDeviceWorkflowsSuccess(dispatch, response))
      .catch(error => apiError(dispatch, error))
  }
}

const fetchDeviceWorkflowsSuccess = (dispatch, response) => {
  dispatch({
    type: FETCH_DEVICE_WORKFLOWS,
    data: response.data._embedded.workflows
  })
}

export const addDeviceWorkflow = (props) => {
  if (!window.localStorage.getItem('token')) {
    return dispatch => dispatch({ type: NO_AUTH_ERROR })
  }
  return (dispatch) => {
    axios.post(`${ROOT_URL}/workflow`, props)
      .then(response => addDeviceWorkflowSuccess(dispatch, response))
      .catch(error => apiError(dispatch, error))
  }
}

const addDeviceWorkflowSuccess = (dispatch, response) => {
  dispatch({
    type: ADD_DEVICE_WORKFLOW,
    data: response.data
  })
  dispatch(closeDeviceWorkflowModal())
}

export const updateDeviceWorkflow = (entity) => {
  if (!window.localStorage.getItem('token')) {
    return dispatch => dispatch({ type: NO_AUTH_ERROR })
  }
  return (dispatch) => {
    axios.put(entity._links.self.href, entity)
      .then(response => updateDeviceWorkflowSuccess(dispatch, response))
      .catch(error => apiError(dispatch, error))
  }
}

const updateDeviceWorkflowSuccess = (dispatch, response) => {
  dispatch({
    type: UPDATE_DEVICE_WORKFLOW,
    data: response.data
  })
  dispatch(closeDeviceWorkflowModal())
}

export const openDeviceWorkflowModal = (entity) => {
  return (dispatch) => {
    dispatch({
      type: OPEN_DEVICE_WORKFLOW_MODAL,
      data: entity
    })
  }
}

export const closeDeviceWorkflowModal = () => {
  return (dispatch) => {
    dispatch({
      type: CLOSE_DEVICE_WORKFLOW_MODAL
    })
  }
}

// export const fetchDeviceRawIncidents = () => {
//   return (dispatch) => {
//     dispatch({
//       type: FETCH_DEVICE_RAW_INCIDENTS,
//       data: []
//     })
//   }
// }

export const fetchDeviceEvents = (deviceid) => {
  if (!window.localStorage.getItem('token')) {
    return dispatch => dispatch({ type: NO_AUTH_ERROR })
  }
  return (dispatch) => {
    axios.get(`${ROOT_URL}/event/search/findBy`, {
      params: {
        deviceid
      }
    })
      .then((response) => fetchDeviceEventsSuccess(dispatch, response))
      .catch(error => apiError(dispatch, error))
  }
}

const fetchDeviceEventsSuccess = (dispatch, response) => {
  dispatch({
    type: FETCH_DEVICE_EVENTS,
    data: response.data._embedded.events
  })
}

export const fetchDevicePhysicalRules = () => {
  return (dispatch) => {
    dispatch({
      type: FETCH_DEVICE_PHYSICAL_RULES,
      data: []
    })
  }
}

export const fetchDeviceBasicMonitors = () => {
  return (dispatch) => {
    dispatch({
      type: FETCH_DEVICE_BASIC_MONITORS,
      data: []
    })
  }
}

export const fetchDeviceEventLog = () => {
  return (dispatch) => {
    dispatch({
      type: FETCH_DEVICE_EVENTLOG,
      data: []
    })
  }
}

export const fetchDeviceApps = () => {
  return (dispatch) => {
    dispatch({
      type: FETCH_DEVICE_APPS,
      data: []
    })
  }
}

export const openDeviceEditModal = (device) => {
  return (dispatch) => {
    dispatch({
      type: OPEN_DEVICE_EDIT_MODAL,
      device
    })
  }
}

export const closeDeviceEditModal = () => {
  return (dispatch) => {
    dispatch({
      type: CLOSE_DEVICE_EDIT_MODAL
    })
  }
}

export const addDevice = (url, props) => {
  if (!window.localStorage.getItem('token')) {
    return dispatch => dispatch({ type: NO_AUTH_ERROR })
  }
  return (dispatch) => {
    axios.post(url, props)
      .then(() => addDeviceSuccess(dispatch))
      .catch(error => updateDeviceError(dispatch, error))
  }
}

const addDeviceSuccess = (dispatch) => {
  dispatch(closeDeviceEditModal())
  dispatch(fetchDevices())
}

export const updateDevice = (url, props) => {
  if (!window.localStorage.getItem('token')) {
    return dispatch => dispatch({ type: NO_AUTH_ERROR })
  }
  return (dispatch) => {
    axios.put(url, props)
      .then(response => updateDeviceSuccess(dispatch))
      .catch(error => updateDeviceError(dispatch, error))
  }
}

const updateDeviceSuccess = (dispatch) => {
  dispatch(closeDeviceEditModal())
  dispatch(fetchDevices())
}

export const deleteDevice = (url) => {
  if (!window.localStorage.getItem('token')) {
    return dispatch => dispatch({ type: NO_AUTH_ERROR })
  }
  return (dispatch) => {
    axios.delete(url)
      .then(() => deleteDeviceSuccess(dispatch))
      .catch(error => updateDeviceError(dispatch, error))
  }
}

const deleteDeviceSuccess = (dispatch) => {
  dispatch(fetchDevices())
}

export const fetchDeviceTemplates = () => {
  if (!window.localStorage.getItem('token')) {
    return dispatch => dispatch({ type: NO_AUTH_ERROR })
  }
  return (dispatch) => {
    axios.get(`${ROOT_URL}/devicetemplate`)
      .then(response => fetchDeviceTemplatesSuccess(dispatch, response))
      .catch(error => apiError(dispatch, error))
  }
}

const fetchDeviceTemplatesSuccess = (dispatch, response) => {
  dispatch({
    type: FETCH_DEVICE_TEMPLATES,
    data: response.data._embedded.deviceTemplates
  })
}

export const addDeviceTemplate = (props) => {
  if (!window.localStorage.getItem('token')) {
    return dispatch => dispatch({ type: NO_AUTH_ERROR })
  }
  return (dispatch) => {
    axios.post(`${ROOT_URL}/devicetemplate`, props)
      .then(response => addDeviceTemplateSuccess(dispatch, response))
      .catch(error => apiError(dispatch, error))
  }
}

const addDeviceTemplateSuccess = (dispatch, response) => {
  dispatch({
    type: ADD_DEVICE_TEMPLATE,
    data: response.data
  })
  dispatch(closeDeviceTplModal())
}

export const updateDeviceTemplate = (entity) => {
  if (!window.localStorage.getItem('token')) {
    return dispatch => dispatch({ type: NO_AUTH_ERROR })
  }
  return (dispatch) => {
    axios.put(entity._links.self.href, entity)
      .then(response => updateDeviceTemplateSuccess(dispatch, response))
      .catch(error => apiError(dispatch, error))
  }
}

const updateDeviceTemplateSuccess = (dispatch, response) => {
  dispatch({
    type: UPDATE_DEVICE_TEMPLATE,
    data: response.data
  })
  dispatch(closeDeviceTplModal())
}

export const deleteDeviceTemplate = (entity) => {
  if (!window.localStorage.getItem('token')) {
    return dispatch => dispatch({ type: NO_AUTH_ERROR })
  }
  return (dispatch) => {
    axios.delete(entity._links.self.href, entity)
      .then(() => deleteDeviceTemplateSuccess(dispatch, entity))
      .catch(error => apiError(dispatch, error))
  }
}

const deleteDeviceTemplateSuccess = (dispatch, entity) => {
  dispatch({
    type: DELETE_DEVICE_TEMPLATE,
    data: entity
  })
}

export const openDeviceTplModal = (tpl) => {
  return (dispatch) => {
    dispatch({
      type: OPEN_DEVICE_TEMPLATE_MODAL,
      data: tpl
    })
  }
}

export const closeDeviceTplModal = () => {
  return (dispatch) => {
    dispatch({
      type: CLOSE_DEVICE_TEMPLATE_MODAL
    })
  }
}

export const openDeviceRuleModal = (rule) => {
  return (dispatch) => {
    dispatch({
      type: OPEN_DEVICE_RULE_MODAL,
      data: rule
    })
  }
}

export const closeDeviceRuleModal = () => {
  return (dispatch) => {
    dispatch({
      type: CLOSE_DEVICE_RULE_MODAL
    })
  }
}

export const fetchWorkflowCategories = () => {
  if (!window.localStorage.getItem('token')) {
    return dispatch => dispatch({ type: NO_AUTH_ERROR })
  }
  return (dispatch) => {
    axios.get(`${ROOT_URL}/workflowcategory`)
      .then((response) => fetchWorkflowCategoriesSuccess(dispatch, response))
      .catch(error => apiError(dispatch, error))
  }
}

const fetchWorkflowCategoriesSuccess = (dispatch, response) => {
  dispatch({
    type: FETCH_WORKFLOW_CATEGORIES,
    data: response.data._embedded.workflowCategories
  })
}
