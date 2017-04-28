import React from 'react'
import Modal from 'react-bootstrap-modal'
import {
    Button
} from 'react-bootstrap'
import {
  findIndex,
  clone
} from 'lodash'

import { showAlert } from '../../../../shared/Alert'
import { ROOT_URL } from 'actions/config'

export default class GroupModal extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      open: true,
      data: [],

      selected: []

    }
  }

  componentWillMount () {
    this.loadGroups()
  }

  loadGroups () {
    $.get(`${ROOT_URL}${Api.user.getUsers}`, { // eslint-disable-line no-undef
      draw: 1,
      start: 0,
      length: 100
    }).done(res => {
      const { group } = this.props
      let groupId = 0 // eslint-disable-line no-unused-vars
      if (group) groupId = group.id
      let selected = []

      if (group) {
        res.data.forEach(item => {
          if (findIndex(group.groupUsers, { userId: item.id }) >= 0) {
            selected.push(item.id)
          }
        })
      }

      this.setState({
        data: res.data,
        selected: selected
      })
    })
  }

  onHide () {
    this.onClickClose()
  }

  closeModal (data) {
    this.setState({ open: false }, () => {
      this.props.onClose && this.props.onClose(this, data)
    })
  }

  onClickClose () {
    this.closeModal()
  }

  onClickSave () {
    let { group } = this.props
    let params = {}

    params.name = this.refs.name.value
    if (!params.name) return showAlert('Please input group name')
    if (group) {
      params.id = group.id
      params.description = group.description
    }

    let url = group ? Api.group.modifyGroup : Api.group.addGroup // eslint-disable-line no-undef

    let added = clone(this.state.selected)
    let removed = []

    if (group) {
      group.groupUsers.forEach(alloc => {
        const index = added.indexOf(alloc.userId)
        if (index < 0) {
          removed.push(alloc.id)
        } else {
          added.splice(index, 1)
        }
      })
    }

    $.get(`${ROOT_URL}${url}`, params).done(res => { // eslint-disable-line no-undef
      if (!res.success) return showAlert('Save failed!')

      let newGroup = res.object

      let calls = []
      added.forEach(userId => {
        calls.push($.get(`${ROOT_URL}${Api.group.addGroupAlloc}`, { // eslint-disable-line no-undef
          groupId: newGroup.id,
          userId: userId
        }))
      })

      removed.forEach(id => {
        calls.push($.get(`${ROOT_URL}${Api.group.removeGroupAlloc}`, { id })) // eslint-disable-line no-undef
      })

      $.when.apply(null, calls).always(() => { // eslint-disable-line no-undef
        this.closeModal(newGroup)
      })
    })
  }

    // /////////////////////////////////////////////////////////////////

  onChangeCheck (userId, e) {
    let { selected } = this.state
    if (e.target.checked) {
      selected.push(userId)
    } else {
      const index = selected.indexOf(userId)
      if (index >= 0) selected.splice(index, 1)
    }

    this.setState({ selected })
  }

  render () {
    const { group } = this.props
    let groupId = 0 // eslint-disable-line no-unused-vars
    if (group) groupId = group.id

    return (
      <Modal
        show={this.state.open}
        onHide={this.onHide.bind(this)}
        aria-labelledby="ModalHeader"
        className="bootstrap-dialog type-primary"
      >

        <div className="modal-header">
          <h4 className="modal-title bootstrap-dialog-title">
            Group
          </h4>
          <div className="bootstrap-dialog-close-button">
            <button className="close" onClick={this.onClickClose.bind(this)}>×</button>
          </div>
        </div>

        <div className="modal-body bootstrap-dialog-message">
          <div className="row form-group margin-md-bottom">
            <div className="col-xs-12">
              <label className="control-label">Group Name</label>
              <input
                type="text" className="form-control input-sm"
                style={{width: '30%', marginLeft: '10px', display: 'inline-block'}}
                defaultValue={group ? group.name : ''}
                ref="name"
              />
            </div>
          </div>

          <div style={{maxHeight: '400px', overflow: 'auto'}}>
            <table className="table table-hover">
              <thead>
              <tr>
                <th />
                <th>User Name</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Phone</th>
              </tr>
              </thead>
              <tbody>
              {
                this.state.data.map(item =>
                  <tr key={item.id}>
                    <td className="text-right groupcheck">
                      <input
                        type="checkbox"
                        defaultChecked={group ? (findIndex(group.groupUsers, {userId: item.id}) >= 0) : false}
                        onChange={this.onChangeCheck.bind(this, item.id)}
                      />
                    </td>
                    <td>{item.username}</td>
                    <td>{item.fullname}</td>
                    <td>{item.email}</td>
                    <td>{item.phone}</td>
                  </tr>
                )
              }
              </tbody>
            </table>
          </div>

          <div className="text-right p-none">
            <Button
              className="btn-primary btn-sm"
              onClick={this.onClickSave.bind(this)}>Save</Button>
            <Button className="btn-sm margin-sm-left"
              onClick={this.onClickClose.bind(this)}>Cancel</Button>
          </div>
        </div>
      </Modal>
    )
  }
}

GroupModal.defaultProps = {
  onClose: null,
  group: null,
  sid: ''
}
