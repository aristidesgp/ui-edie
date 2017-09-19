import React from 'react'
import { IconButton } from 'material-ui'
import AddCircleIcon from 'material-ui/svg-icons/content/add-circle'
import CloseIcon from 'material-ui/svg-icons/navigation/close'

import { CardPanel } from 'components/modal/parts'

export default class CredPicker extends React.Component {
  onClickAdd () {
    this.props.showDeviceCredsPicker(1)
  }

  onClickDelete (index) {
    this.props.onClickDelete(index)
  }

  getCredentials() {
    const {credentials} = this.props
    return credentials.filter(p => p.global && p.isDefault)
  }

  renderButtons () {
    return (
      <div>
        <IconButton onTouchTap={this.onClickAdd.bind(this)} tooltip="Add Credentials">
          <AddCircleIcon size={32}/>
        </IconButton>
      </div>
    )
  }
  render () {
    const credentials = this.props.deviceCredentials
    return (
      <CardPanel title="Credentials" tools={this.renderButtons()}>
        <div style={{minHeight: 200, maxHeight: 300, overflow: 'auto'}}>
          <table className="table table-hover">
            <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Description</th>
              <th>User</th>
              <th />
            </tr>
            </thead>
            <tbody>
            {credentials.map((p, i) =>
              <tr key={i}>
                <td>{p.name}</td>
                <td>{p.type}</td>
                <td>{p.description}</td>
                <td>{p.username}</td>
                <th><CloseIcon className="link" onTouchTap={this.onClickDelete.bind(this, i)}/></th>
              </tr>
            )}
            </tbody>
          </table>
        </div>
      </CardPanel>
    )
  }
}
