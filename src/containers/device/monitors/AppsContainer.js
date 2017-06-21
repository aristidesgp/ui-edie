import React from 'react'
import Apps from 'components/dashboard/map/device/monitors/ApplicationTable'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import {
  fetchDeviceApps,

  updateSearchParams,
  replaceSearchWfs,
  updateSearchTags,
  updateQueryChips,
  updateMonitorRealTime,
  clearMonitors
} from 'actions'

@connect(
  state => ({
    device: state.dashboard.selectedDevice,

    apps: state.devices.apps,
    monitorHotfixes: state.devices.monitorHotfixes,

    params: state.search.params,
    monitorsUpdateTime: state.devices.monitorsUpdateTime
  }),
  {
    fetchDeviceApps,

    updateSearchParams,
    replaceSearchWfs,
    updateSearchTags,
    updateQueryChips,
    updateMonitorRealTime,
    clearMonitors
  }
)
@withRouter
export default class AppsContainer extends React.Component {
  render () {
    return (
      <Apps {...this.props}/>
    )
  }
}
