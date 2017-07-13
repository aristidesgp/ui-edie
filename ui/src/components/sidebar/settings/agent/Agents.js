import React, { Component } from 'react'
import moment from 'moment'
import {MenuItem, SelectField, RaisedButton, RefreshIndicator} from 'material-ui'

import InfiniteTable from 'components/common/InfiniteTable'

import SettingTabs from '../SettingTabs'
import TabPage from 'components/common/TabPage'
import TabPageBody from 'components/common/TabPageBody'
import TabPageHeader from 'components/common/TabPageHeader'

import CollectorTabs from '../collector/CollectorTabs'
import AgentModal from './AgentModal'

import { errorStyle, inputStyle, selectedItemStyle } from 'style/common/materialStyles'
import {showAlert, showConfirm} from 'components/common/Alert'

const loadingStyle = {
  position: 'absolute',
  left: '50%',
  top: '50%',
  transform: 'translate(-50%, -50%)'
}

const overlayStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  background: 'rgba(80,80,80,0.5)',
  zIndex: 10
}

const indicatorStyle = {
  display: 'inline-block',
  position: 'relative'
}

export default class Agents extends Component {
  constructor (props) {
    super(props)
    this.state = {
      install: 'all'
    }
    this.cells = [{
      'displayName': 'Device',
      'columnName': 'name'
    }, {
      'displayName': 'Version',
      'columnName': 'agent.version'
    }, {
      'displayName': 'Host',
      'columnName': 'agent.host'
    }, {
      'displayName': 'IP',
      'columnName': 'agent.ipaddress'
    }, {
      'displayName': 'Last Seen',
      'columnName': 'agent.lastSeen',
      'customComponent': p => {
        if (!p.data) return <RaisedButton label="Install" onTouchTap={this.onClickInstall.bind(this, p.rowData)}/>
        return (
          <span>{moment(p.data).fromNow()}</span>
        )
      }
    }]
  }

  componentDidMount () {
    this.props.fetchAgents()
    this.props.showAgentPreloader(false)
  }

  onChangeInstall (e, index, value) {
    this.setState({ install: value })
  }

  onRowDblClick () {
  }

  onClickAdd () {
    this.props.showAgentModal(true)
  }
  onClickEdit () {
    const selected = this.getTable().getSelected()
    if (!selected) return showAlert('Please choose agent.')
    this.props.showAgentModal(true, selected)
  }
  onClickRemove () {
    const selected = this.getTable().getSelected()
    if (!selected) return showAlert('Please choose agent.')
    showConfirm('Click OK to remove.', btn => {
      if (btn !== 'ok') return
      this.props.removeAgent(selected)
    })
  }
  onClickInstall (device) {
    this.props.installAgent(device)
    this.props.showAgentPreloader(true)
  }
  getTable () {
    return this.refs.table
  }

  renderSelect () {
    return (
      <SelectField
        errorStyle={errorStyle}
        selectedMenuItemStyle={selectedItemStyle}
        menuItemStyle={inputStyle}
        labelStyle={inputStyle}
        onChange={this.onChangeInstall.bind(this)}
        value={this.state.install}>
        <MenuItem value="all" primaryText="All"/>
        <MenuItem value="installed" primaryText="Installed"/>
        <MenuItem value="notinstalled" primaryText="Not Installed"/>
      </SelectField>
    )
  }

  renderAgentModal () {
    if (!this.props.agentModalOpen) return null
    return (
      <AgentModal {...this.props}/>
    )
  }

  renderContent () {
    let {agents} = this.props

    const {install} = this.state
    if (install === 'installed') agents = agents.filter(p => !!p.agent)
    else if (install === 'notinstalled') agents = agents.filter(p => !p.agent)

    return (
      <InfiniteTable
        cells={this.cells}
        ref="table"
        rowMetadata={{'key': 'id'}}
        selectable
        onRowDblClick={this.onRowDblClick.bind(this)}
        useExternal={false}
        data={agents}
      />
    )
  }

  renderPreloader () {
    if (!this.props.agentPreloader) return null
    return (
      <div style={overlayStyle}>
        <div style={loadingStyle}>
          <RefreshIndicator
            size={50}
            left={0}
            top={0}
            status="loading"
            style={indicatorStyle}
          />
        </div>
      </div>
    )
  }

  render () {
    return (
      <TabPage>
        <TabPageHeader title="Agents">
          <div className="text-center margin-md-top">
            <div className="pull-left form-inline text-left">
              {this.renderSelect()}
            </div>

            <div style={{position: 'absolute', right: '25px'}}>
              <CollectorTabs history={this.props.history}/>
            </div>
          </div>
        </TabPageHeader>

        <TabPageBody tabs={SettingTabs} tab={1} history={this.props.history} location={this.props.location}>
          {this.renderContent()}
          {this.renderAgentModal()}
        </TabPageBody>
        {this.renderPreloader()}
      </TabPage>
    )
  }
}
