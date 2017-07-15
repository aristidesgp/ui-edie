import React from 'react'
import {RaisedButton} from 'material-ui'

import InfiniteTable from 'components/common/InfiniteTable'
import MainTabs from '../MainTabs'
import TabPage from 'components/common/TabPage'
import TabPageBody from 'components/common/TabPageBody'
import TabPageHeader from 'components/common/TabPageHeader'

import MainWorkflowModal from './MainWorkflowModal'
import SysWorkflowsModal from './SysWorkflowsModal'

export default class MainWorkflows extends React.Component {
  constructor (props) {
    super(props)

    const {device} = this.props

    this.state = {
      currentSortCol: 'name',
      currentSortDir: 'asc',
      params: {
        id: device.workflowids || []
      }
    }

    this.cells = [{
      'displayName': 'Name',
      'customHeaderComponent': this.renderColHeader.bind(this),
      'columnName': 'name'
    }, {
      'displayName': 'Category',
      'customHeaderComponent': this.renderColHeader.bind(this),
      'columnName': 'category'
    }, {
      'displayName': 'Severity',
      'customHeaderComponent': this.renderColHeader.bind(this),
      'columnName': 'severity'
    }, {
      'displayName': 'Description',
      'customHeaderComponent': this.renderColHeader.bind(this),
      'columnName': 'desc'
    }, {
      'displayName': 'Global',
      'columnName': 'isglobal',
      'customHeaderComponent': this.renderColHeader.bind(this),
      'customComponent': p => {
        return <span>{p.data ? 'YES' : 'NO'}</span>
      }
    }]
  }

  renderColHeader (col) {
    const {columnName, displayName} = col
    const { currentSortCol, currentSortDir } = this.state
    let caretEl = null

    if (columnName === currentSortCol) {
      const cls = currentSortDir === 'asc' ? 'fa-caret-up' : 'fa-caret-down'
      caretEl = <i className={`margin-sm-left fa ${cls}`} />
    }

    return (
      <a href="javascript:;" className="text-black" onClick={this.onClickColHeader.bind(this, col)}>
        <span className="nowrap">{displayName}{caretEl}</span>
      </a>
    )
  }

  onClickColHeader (col) {
    const {
      columnName
    } = col
    let { currentSortCol, currentSortDir } = this.state

    if (columnName === currentSortCol) {
      currentSortDir = currentSortDir === 'asc' ? 'desc' : 'asc'
    } else {
      currentSortCol = columnName
      currentSortDir = 'asc'
    }
    this.setState({ currentSortCol, currentSortDir })
  }

  onClickAdd () {
    this.props.openDeviceWorkflowModal()
  }

  onClickAddSys () {
    this.props.openSysWorkflowsModal()
  }

  onClickEdit () {
    const selected = this.getTable().getSelected()
    if (!selected) return window.alert('Please select workflow.')
    this.props.openDeviceWorkflowModal(selected, this.props.device)
  }

  onClickRemove () {
    const selected = this.getTable().getSelected()
    if (!selected) return window.alert('Please select workflow.')
    this.props.removeDeviceWorkflow(selected, this.props.device)
  }

  getTable () {
    return this.refs.table
  }

  renderTable () {
    const { device, workflowListDraw } = this.props
    const { currentSortCol, currentSortDir } = this.state
    return (
      <InfiniteTable
        id="rule1"
        cells={this.cells}
        ref="table"
        rowMetadata={{'key': 'id'}}
        selectable
        onRowDblClick={this.onClickEdit.bind(this)}

        url="/workflow/search/findById"
        params={{
          id: device.workflowids || [],
          draw: workflowListDraw,
          sort: `${currentSortCol},${currentSortDir}`
        }}
      />
    )
  }

  renderWorkflowModal () {
    if (!this.props.workflowModalOpen) return null
    return <MainWorkflowModal {...this.props} />
  }

  renderSysWorkflowsModal () {
    if (!this.props.sysWorkflowsModalOpen) return null
    return <SysWorkflowsModal {...this.props} />
  }

  render () {
    const {device} = this.props
    return (
      <TabPage>
        <TabPageHeader title={device.name}>
          <div className="text-center margin-md-top">
            <div className="pull-right">
              <RaisedButton onTouchTap={this.onClickAdd.bind(this)} label="Add"/>&nbsp;
              <RaisedButton onTouchTap={this.onClickAddSys.bind(this)} label="Add System Workflow"/>&nbsp;
              <RaisedButton onTouchTap={this.onClickEdit.bind(this)} label="Edit"/>&nbsp;
              <RaisedButton onTouchTap={this.onClickRemove.bind(this)} label="Remove"/>
            </div>
          </div>
        </TabPageHeader>

        <TabPageBody tabs={MainTabs(device.id)} tab={1} history={this.props.history} location={this.props.location} transparent>
          {this.renderTable()}
          {this.renderWorkflowModal()}
          {this.renderSysWorkflowsModal()}
        </TabPageBody>
      </TabPage>
    )
  }
}
