import React from 'react'
import { findIndex, startsWith } from 'lodash'
import ReactTooltip from 'react-tooltip'

import TopbarContainer from '../../containers/page/topbar/TopbarContainer'
import SidebarContainer from '../../containers/page/sidebar/SidebarContainer'
import DashboardContainer from '../../containers/page/content/dashboard/DashboardContainer'
import ActivationModal from 'components/auth/ActivationModal'
import { scrollTop } from '../../util/Scroll'
import { DragDropContext } from 'react-dnd'
import TouchBackend from 'react-dnd-touch-backend'

import Alert from 'components/shared/Alert'

import { mainMenu, deviceMenu, contentType } from './Config'

const dashboardId = mainMenu[0].id

class Main extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      user: null,
      minHeight: 1300
    }
  }

  componentWillMount () {
    this.props.fetchEnvVars()
  }

  componentWillUpdate (nextProps, nextState) {
    if (nextProps.envVarAvailable && !this.props.envVarAvailable) {
      const index = findIndex(nextProps.envVars, {envvars: {key: 'CUSTOMER_ID'}})
      const customerId = index >= 0 ? nextProps.envVars[index].envvars.key : null
      if (!customerId) {
        // User is not activated yet.
        this.props.openActivationModal()
      }
    }
  }

  renderDashboard () {
    const hidden = !!this.props.children
    return (
      <DashboardContainer hidden={hidden}/>
    )
  }

  onClickMenuItem (type, item) {
    const { router, closeDevice } = this.props

    scrollTop(this.refs.content)

    if (item.id === 'dashboard') {
      closeDevice()
    }

    router.push({
      pathname: item.path
    })
  }

  renderSidebar () {
    const {location, device} = this.props
    const {pathname} = location

    let pageId = dashboardId
    let pageType = contentType.Main

    let found = false
    mainMenu.forEach(item => {
      if (item.id === dashboardId) return true
      if (startsWith(pathname, item.path)) {
        pageId = item.id
        pageType = contentType.Main
        found = true
        return false
      }
    })

    if (!found) {
      let deviceId = device ? device.id : 'main'
      deviceMenu(deviceId).forEach(item => {
        // console.log(item.path, pathname)
        if (item.id === dashboardId) return true
        if (startsWith(pathname, item.path)) {
          pageId = item.id
          pageType = contentType.Device
          found = true
          return false
        }
      })
    }

    return (
      <SidebarContainer
        pageId={pageId}
        pageType={pageType}
        device={device}
        onClickItem={this.onClickMenuItem.bind(this)}
      />
    )
  }

  onCloseAlert () {
    this.props.closeApiErrorModal()
  }

  renderActivationModal () {
    if (!this.props.activationModalOpen) return null
    return (
      <ActivationModal {...this.props}/>
    )
  }

  renderApiError () {
    if (!this.props.apiErrorModalOpen) return null
    return (
      <Alert message={this.props.apiError.message} onClose={this.onCloseAlert.bind(this)}/>
    )
  }

  render () {
    const {children} = this.props
    const {minHeight} = this.state

    let style = {}
    if (!children) style = {minHeight: `${minHeight}px`}

    return (
      <div style={style}>
        <TopbarContainer />
        {this.renderSidebar()}
        <div className="page-content flex-vertical" style={{overflow: 'auto'}} ref="content">
          {this.renderDashboard()}
          {children || null}
        </div>
        <ReactTooltip />
        {this.renderActivationModal()}
        {this.renderApiError()}
      </div>
    )

    // <IncidentAlert />
    // {this.state.loading ? <Loader /> : null}
    // <ReactTooltip />
  }
}

export default DragDropContext(TouchBackend({ enableMouseEvents: true }))(Main)
