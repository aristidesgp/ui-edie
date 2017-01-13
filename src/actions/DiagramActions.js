import {

  ADD_DIAGRAM_OBJECT,
  SELECT_DIAGRAM_OBJECT,

  SET_HOVER_DIAGRAM_OBJECT,
  CLEAR_HOVER_DIAGRAM_OBJECT,

  SET_HOVER_POINT,

  SET_DIAGRAM_MOUSE_DOWN,
  SET_DIAGRAM_DRAGGING

} from './types'

export function addDiagramObject (object) {
  return dispatch => {
    dispatch({
      type: ADD_DIAGRAM_OBJECT,
      data: object
    })
  }
}

export function selectDiagramObject (object) {
  return dispatch => {
    dispatch({
      type: SELECT_DIAGRAM_OBJECT,
      data: object ? [object] : []
    })
  }
}

export function setHoverDiagramObject (object) {
  return dispatch => {
    dispatch({
      type: SET_HOVER_DIAGRAM_OBJECT,
      data: object
    })
  }
}

export function clearHoverDiagramObject (object) {
  return dispatch => {
    dispatch({
      type: CLEAR_HOVER_DIAGRAM_OBJECT,
      data: object
    })
  }
}

export function setHoverPoint (point) {
  return dispatch => {
    dispatch({
      type: SET_HOVER_POINT,
      data: point
    })
  }
}

export function setDiagramMouseDown (isDown) {
  return dispatch => {
    dispatch({
      type: SET_DIAGRAM_MOUSE_DOWN,
      data: isDown
    })
  }
}

export function setDiagramDragging (dragging) {
  return dispatch => {
    dispatch({
      type: SET_DIAGRAM_DRAGGING,
      data: dragging
    })
  }
}
