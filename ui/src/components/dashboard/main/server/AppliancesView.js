import React from 'react'
import ComputerIcon from 'material-ui/svg-icons/hardware/computer'
import {purple500, deepPurpleA400} from 'material-ui/styles/colors'

import FloatingMenu from 'components/common/floating/FloatingMenu'
import ServerItem from './ServerItem'
import { showConfirm } from 'components/common/Alert'

const tplColors = [purple500, deepPurpleA400]

export default class AppliancesView extends React.Component {
  getAppliances () {
    const {devices, allDevices} = this.props
    const list = (devices || allDevices).filter(p => (p.tags || []).includes('Appliance'))

    return list
  }

  onClickAddItem (tpl) {
    this.props.history.push(`/addappliance`)
  }

  getMenuItems () {
    const items = [{
      label: 'Add Appliance',
      icon: <ComputerIcon/>,
      color: tplColors[0],
      onClick: this.onClickAddItem.bind(this)
    }]

    return items
  }

  ////////////////////////////////////////////////////////

  onClickServer (server) {
    this.props.history.push(`/dashboard/serverdetail/${server.id}`)
  }

  onClickDeleteServer (server) {
    showConfirm('Click OK to delete.', (btn) => {
      if (btn !== 'ok') return

      this.props.deleteMapDevice(server)
    })
  }

  ////////////////////////////////////////////////////////

  renderAppliance (server, i) {
    return (
      <ServerItem
        key={server.id}
        server={server}
        index={i}
        onClick={() => this.onClickServer(server)}
        onClickDelete={() => this.onClickDeleteServer(server)}
      />
    )
  }

  render () {
    return (
      <div>
        <FloatingMenu menuItems={this.getMenuItems()}/>

        <div style={{paddingLeft: 20}}>
          <ul className="web-applet-cards">
            {this.getAppliances().map(this.renderAppliance.bind(this))}
          </ul>
        </div>
      </div>
    )
  }
}
