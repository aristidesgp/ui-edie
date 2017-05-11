import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import {
  fixIncident,
  ackIncident,
  fetchDeviceIncidents,
  openAddDeviceIncident,
  closeAddDeviceIncident,
  addDeviceIncident,
  fixAllDeviceIncidents,
  closeDevice,

  replaceSearchWfs,
  updateQueryChips,
  updateSearchParams
} from 'actions'

import MainIncidents from 'components/page/content/device/main/incidents/MainIncidents'

@connect(
  state => ({
    device: state.dashboard.selectedDevice,
    incidents: state.devices.incidents,
    incidentDraw: state.devices.incidentDraw,
    addIncidentModalVisible: state.devices.addIncidentModalVisible,
    params: state.search.params
  }),
  dispatch => ({
    ...bindActionCreators({
      fetchDeviceIncidents,
      fixIncident,
      ackIncident,
      openAddDeviceIncident,
      closeAddDeviceIncident,
      addDeviceIncident,
      fixAllDeviceIncidents,
      closeDevice,

      replaceSearchWfs,
      updateQueryChips,
      updateSearchParams
    }, dispatch)
  })
)
@withRouter
export default class MainIncidentsContainer extends Component {
  render () {
    return (
      <MainIncidents {...this.props} />
    )
  }
}
