import React from 'react'
import Modal from 'react-bootstrap-modal'

export default class GlobalIgnoreModal extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      open: true
    }
  }

  render () {
    let data = this.props.data

    return (
            <Modal show={this.state.open}
              onHide={this.onHide.bind(this)}
              aria-labelledby="ModalHeader"
              className="bootstrap-dialog type-primary">
                <div className="modal-header">
                    <h4 className="modal-title bootstrap-dialog-title">
                        Global Ignore
                    </h4>
                </div>
                <div className="modal-body bootstrap-dialog-message">
                    <div className="row margin-md-bottom">
                        <label className="col-md-3">Ignore:</label>
                        <div className="col-md-9">
                            <input className="form-control" ref="ignore" defaultValue={data ? data.ignore : ''}/>
                        </div>
                    </div>

                    <div className="text-right mb-none">

                        <a href="javascript:;" className="btn btn-default btn-sm"
                          onClick={this.onClickClose.bind(this)}>Cancel</a>
                        <a href="javascript:;" className="btn btn-primary btn-sm margin-sm-left"
                          onClick={this.onClickSave.bind(this)}>OK</a>
                    </div>
                </div>
            </Modal>
    )
  }

  onHide () {
    this.onClickClose()
  }

  onClickClose () {
    this.closeModal()
  }

  onClickSave () {
    let data = {
      ignore: this.refs.ignore.value
    }

    if (!data.ignore) {
      alert('Please input match and ignore.')
      return
    }

    this.closeModal(data)
  }

  closeModal (data) {
    this.setState({
      open: false
    }, () => {
      this.props.onClose &&
            this.props.onClose(this, data)
    })
  }
}
