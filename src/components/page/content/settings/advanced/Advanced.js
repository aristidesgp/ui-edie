import React from 'react'
import {
    ButtonGroup,
    DropdownButton
} from 'react-bootstrap'
import {RaisedButton, Menu, MenuItem, Popover} from 'material-ui'
import SettingIcon from 'material-ui/svg-icons/action/settings'

import MainSettings from './MainSettings'
import Websocket from './websocket/Websocket'
import Routing from './routing/Routing'

import SettingTabs from '../SettingTabs'
import TabPage from '../../../../shared/TabPage'
import TabPageBody from '../../../../shared/TabPageBody'
import TabPageHeader from '../../../../shared/TabPageHeader'
import {showAlert} from 'components/shared/Alert'

export default class Advanced extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      pageIndex: 0
    }
  }

  componentWillUpdate (nextProps, nextState) {
    const {syncStatus} = this.props
    if (nextProps.syncStatus && syncStatus !== nextProps.syncStatus) {
      if (nextProps.syncStatus === 'OK') showAlert('Sync completed successfully!')
      else showAlert('Sync failed!')
    }
  }

  renderContent () {
    switch (this.state.pageIndex) {
      case 1: return <Websocket />
      case 2: return <Routing />
    }

    return <MainSettings {...this.props} />
  }

  onClickTab (pageIndex) {
    this.setState({ pageIndex })
  }

  onClickAddRouting () {

  }

  onClickEditRouting () {

  }

  handleTouchTap (event) {
    this.setState({
      open: true,
      anchorEl: event.currentTarget
    })
  }

  handleRequestClose () {
    this.setState({open: false})
  }

  render () {
    const {pageIndex} = this.state
    return (
      <TabPage>
        <TabPageHeader title="Settings">
          <div className="text-center margin-md-top">
            <div style={{position: 'absolute', right: '25px'}}>
              <ButtonGroup>

                <DropdownButton title="Routing" id="dd-setting-routing" pullRight
                  className={pageIndex === 2 ? '' : 'hidden'}>
                  <MenuItem eventKey="1" onClick={this.onClickAddRouting.bind(this)}>Add</MenuItem>
                  <MenuItem eventKey="2" onClick={this.onClickEditRouting.bind(this)}>Edit</MenuItem>
                </DropdownButton>

                <RaisedButton icon={<SettingIcon />} onTouchTap={this.handleTouchTap.bind(this)}/>
                <Popover
                  open={this.state.open}
                  anchorEl={this.state.anchorEl}
                  anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                  targetOrigin={{horizontal: 'left', vertical: 'top'}}
                  onRequestClose={this.handleRequestClose.bind(this)}
                >
                  <Menu>
                    <MenuItem primaryText="Main" onTouchTap={this.onClickTab.bind(this, 0)}/>
                    <MenuItem primaryText="Websocket" onTouchTap={this.onClickTab.bind(this, 1)}/>
                    <MenuItem primaryText="Routing" onTouchTap={this.onClickTab.bind(this, 2)}/>
                  </Menu>
                </Popover>
              </ButtonGroup>
            </div>
          </div>
        </TabPageHeader>

        <TabPageBody tabs={SettingTabs} tab={9}>
          {this.renderContent()}
        </TabPageBody>
      </TabPage>
    )
  }
}
