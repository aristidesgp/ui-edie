import React from 'react'
import Modal from 'react-bootstrap-modal'
import moment from 'moment'

import {renderEntity} from 'components/shared/CellRenderers'

export default class IncidentEventsModal extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
    }
  }

  renderTable () {
    const {events} = this.props.incident
    return (
      <table className="table table-hover dataTable">
        <thead>
          <tr>
            <th>Date/Time</th>
            <th>Description</th>
            <th>Rawdata</th>
            <th>Parsed Json</th>
          </tr>
        </thead>
        <tbody>{
          (events || []).map((e, i) =>
          <tr key={i}>
            <td className="nowrap">{moment(e.timestamp).format('YYYY-MM-DD HH:mm:ss')}</td>
            <td>{e.description}</td>
            <td>{e.rawdata}</td>
            <td>{renderEntity(e.dataobj)}</td>
          </tr>)
        }</tbody>
      </table>
    )
  }

  onHide () {

  }

  onClickClose () {
    this.props.onClose &&
        this.props.onClose(this)
  }

  render () {
    return (
      <Modal show onHide={this.onHide.bind(this)}
        aria-labelledby="ModalHeader" className="bootstrap-dialog type-primary modal-w-fit">
        <div className="modal-header">
          <h4 className="modal-title bootstrap-dialog-title">
            Incident Events
          </h4>
          <div className="bootstrap-dialog-close-button">
            <button className="close" onClick={this.onClickClose.bind(this)}>×</button>
          </div>
        </div>
        <div className="modal-body bootstrap-dialog-message">
          <div style={{height: '600px', overflow: 'auto'}}>
            {this.renderTable()}
          </div>
        </div>
      </Modal>
    )
  }
}

IncidentEventsModal.defaultProps = {
  incident: null,
  onClose: null
}
