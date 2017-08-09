import React from 'react'
import axios from 'axios'
import {findIndex} from 'lodash'

import FlipView from './FlipView'
import MonitorStatusView from './display/MonitorStatusView'
import GEditView from './GEditView'

import {showAlert} from 'components/common/Alert'
import { ROOT_URL } from 'actions/config'

export default class GMonitor extends React.Component {
  constructor (props) {
    super (props)
    this.state = {
      loading: false,
      monitorGroup: null
    }
    this.renderBackView = this.renderBackView.bind(this)
    this.renderFrontView = this.renderFrontView.bind(this)
  }
  componentWillMount () {
    this.fetchGroupMonitor(this.props.gauge)
  }

  componentWillUpdate (nextProps) {
    const {gauge} = nextProps
    if (gauge && JSON.stringify(this.props.gauge) !== JSON.stringify(gauge)) {
      this.fetchGroupMonitor(gauge)
    }
  }

  fetchGroupMonitor (gauge) {
    if (gauge.resource !== 'logicalgroup') return
    axios.get(`${ROOT_URL}/monitorgroup/${gauge.monitorGroupId}`).then(res => {
      this.setState({
        monitorGroup: res.data
      })
    })
  }

  onClickDelete () {
    this.props.removeDeviceGauge(this.props.gauge, this.props.device)
  }

  onSubmit (options, values) {
    console.log(values)

    if (!values.name) {
      showAlert('Please type name.')
      return
    }
    const gauge = {
      ...this.props.gauge,
      ...values
    }

    this.props.updateDeviceGauge(gauge, this.props.device)
    options.onClickFlip()
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  renderFrontView () {
    let {gauge, device, devices} = this.props
    if (gauge.resource === 'logicalgroup') {
      const {monitorGroup} = this.state
      return (
        <MonitorStatusView isUp={monitorGroup && monitorGroup.status === 'UP'} lastUpdate={0} size={gauge.gaugeSize}/>
      )
    } else {
      if (devices) {
        const devIndex = findIndex(devices, {id: device.id})
        if (devIndex >= 0) device = devices[devIndex]
      }

      const index = findIndex(device.monitors, {uid: gauge.monitorId})
      if (index < 0) return null
      const monitor = device.monitors[index]
      const isUp = monitor.status === 'UP'
      const lastUpdate = isUp ? monitor.lastfalure : monitor.lastsuccess
      return (
        <MonitorStatusView isUp={isUp} lastUpdate={lastUpdate} size={gauge.gaugeSize}/>
      )
    }

  }
  renderBackView (options) {
    return (
      <GEditView
        {...this.props}
        onSubmit={this.onSubmit.bind(this, options)}
        hideDuration
        hideSplit
      />
    )
  }
  render () {
    return (
      <FlipView
        style={this.props.style}
        className={this.props.className}
        gauge={this.props.gauge}

        loading={this.state.loading}
        renderFrontView={this.renderFrontView}
        renderBackView={this.renderBackView}

        onClickDelete={this.onClickDelete.bind(this)}
      />
    )
  }
}
