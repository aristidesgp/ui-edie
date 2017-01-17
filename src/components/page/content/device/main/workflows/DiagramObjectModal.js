import React from 'react'
import Modal from 'react-bootstrap-modal'
import { assign } from 'lodash'

class DiagramObjectModal extends React.Component {
  onHide () {

  }

  onClickClose () {
    this.props.closeModal()
  }

  onClickSave () {
    const name = this.refs.name.value
    const { objectConfig } = this.props
    if (!name) return window.alert('Please type name.')

    if (objectConfig.id) {
      this.props.updateDiagramObject(assign({}, objectConfig, { name }))
    } else {
      this.props.addDiagramObject(assign({}, objectConfig, { name }))
    }

    this.props.closeModal()
  }

  render () {
    const {objectConfig} = this.props
    return (
      <Modal
        show
        onHide={this.onHide.bind(this)}
        aria-labelledby="ModalHeader"
        className="bootstrap-dialog type-primary">
        <div className="modal-header">
          <h4 className="modal-title bootstrap-dialog-title">
            Command
          </h4>
          <div className="bootstrap-dialog-close-button">
            <button className="close" onClick={this.onClickClose.bind(this)}>×</button>
          </div>
        </div>
        <div className="modal-body bootstrap-dialog-message p-none">
          <div className="padding-md">
            <div className="row">
              <label className="col-md-3">Name</label>
              <div className="col-md-9">
                <select className="form-control" ref="name" defaultValue={objectConfig ? objectConfig.name : ''}>
                  {this.props.commands.map((c, index) => <option key={index}>{c}</option>)}
                </select>
              </div>
            </div>
          </div>
          <div className="text-right panel-footer">
            <a href="javascript:;" className="btn btn-primary btn-sm margin-sm-right" onClick={this.onClickSave.bind(this)}>OK</a>
            <a href="javascript:;" className="btn btn-default btn-sm" onClick={this.onClickClose.bind(this)}>Cancel</a>
          </div>
        </div>
      </Modal>
    )
  }
}

export default DiagramObjectModal
