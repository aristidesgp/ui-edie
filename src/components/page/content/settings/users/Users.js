import React from 'react'
import {
    ButtonGroup,
    // Button, // Never used
    DropdownButton,
    MenuItem
} from 'react-bootstrap'
import { ResponsiveInfiniteTable } from '../../../../shared/InfiniteTable'
import { appendComponent, removeComponent } from '../../../../../util/Component'
import { showAlert, showConfirm } from '../../../../shared/Alert'

import GroupModal from './GroupModal'
import UserModal from './UserModal'
import PasswordModal from './PasswordModal'

import SettingTabs from '../SettingTabs'
import TabPage from '../../../../shared/TabPage'
import TabPageBody from '../../../../shared/TabPageBody'
import TabPageHeader from '../../../../shared/TabPageHeader'

import { ROOT_URL } from '../../../../../actions/config'

export default class Users extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      groupId: '',
      groups: [],
      selected: -1
    }

    this.cells = [{
      'displayName': 'User Name',
      'columnName': 'username'
    }, {
      'displayName': 'Enabled',
      'columnName': 'enabled'
    }, {
      'displayName': 'Role',
      'columnName': 'role'
    }, {
      'displayName': 'Full Name',
      'columnName': 'fullname'
    }, {
      'displayName': 'Email',
      'columnName': 'email'
    }, {
      'displayName': 'Phone',
      'columnName': 'phone'
    }]

        // this.listeners = {
        //     [EVENTS.USERS_GROUP_CHANGED]: this.onChangeGroup.bind(this),
        //     [EVENTS.USERS_GROUP_ADD_CLICKED]: this.onAddGroup.bind(this),
        //
        //     [EVENTS.USERS_ADD_CLICKED]: this.onAddUser.bind(this),
        //     [EVENTS.USERS_EDIT_CLICKED]: this.onEditUser.bind(this),
        //     [EVENTS.USERS_REMOVE_CLICKED]: this.onRemoveUser.bind(this),
        //
        //     [EVENTS.USERS_PASSWORD_CLICKED]: this.onChangePassword.bind(this),
        //     [EVENTS.USERS_PINCODE_CLICKED]: this.onClickPin.bind(this),
        // }
  }

  componentWillMount () {
    console.log(this.props)
    this.loadGroups()
    this.props.fetchSettingUsers()
  }

  loadGroups () {
    // $.get(Api.group.getGroupsDT, {
    //     draw: 1,
    //     start: 0,
    //     length: 100,
    // }).done(res => {
    //     this.setState({
    //         groups: res.data
    //     })
    // })
  }

  renderContent () {
    return (
      <ResponsiveInfiniteTable
        cells={this.cells}
        ref="users"
        rowMetadata={{'key': 'id'}}
        selectable
        onRowDblClick={this.onEditUser.bind(this)}

        useExternal={false}
        data={this.props.users}
      />
    )
  }

  renderUserModal () {
    if (!this.props.userModalVisible) return null
    return (
      <UserModal {...this.props}/>
    )
  }

  renderPasswordModal () {
    if (!this.props.userPasswordModalVisible) return null
    return (
      <PasswordModal {...this.props}/>
    )
  }

  getUsers () {
    return this.refs.users.refs.wrappedInstance
  }

  onChangeGroup (groupId) {
    this.setState({ groupId })
  }

  onAddGroup () {
    appendComponent(
      <GroupModal sid={this.context.sid} onClose={this.onGroupAdded.bind(this)}/>
    )
  }

  onGroupAdded (modal, group) {
    removeComponent(modal)
    group && emit(EVENTS.GROUP_ADDED, group) // eslint-disable-line no-undef
  }

  onClickEditGroup () {
    const selected = this.state.selected
    if (selected < 0) return showAlert('Please select a group.')

    appendComponent(
      <GroupModal group={this.state.groups[selected]} onClose={this.onCloseEditGroup.bind(this)}
      />
    )
  }

  onCloseEditGroup (modal, group) {
    removeComponent(modal)
    if (!group) return
    this.onChangeGroup({
      target: { value: group.id }
    })

    this.loadGroups()
  }

  onClickRemoveGroup () {
    const selected = this.state.selected
    if (selected < 0) return showAlert('Please select a group.')

    let groups = this.state.groups
    const group = groups[selected]
    $.get(`${ROOT_URL}${Api.group.removeGroup}`, { // eslint-disable-line no-undef
      id: group.id
    }).done(res => {
      if (!res.success) return showAlert('Remove failed!')
      groups.splice(selected, 1)
      this.setState({
        selected: -1,
        groups: groups
      })

      emit(EVENTS.USERS_GROUP_CHANGED, '') // eslint-disable-line no-undef
      this.refs.groups.value = ''
    })
  }

  onAddUser () {
    this.props.openSettingUserModal()
  }

  onEditUser () {
    const selected = this.getUsers().getSelected()
    if (!selected) return showAlert('Please select user.')

    this.props.openSettingUserModal(selected)
  }

  onRemoveUser () {
    const selected = this.getUsers().getSelected()
    if (!selected) return showAlert('Please select user.')

    showConfirm('Click OK to remove user.', btn => {
      if (btn !== 'ok') return

      this.props.deleteSettingUser(selected)
    })
  }

  onChangePassword () {
    const selected = this.getUsers().getSelected()
    if (!selected) return showAlert('Please select user.')
    this.props.openUserPasswordModal(selected)
  }

  onClickPin () {
    const selected = this.refs.users.getSelected()
    if (!selected) return showAlert('Please select user.')

    $.get(`${ROOT_URL}${Api.user.resetPin}`, { // eslint-disable-line no-undef
      id: selected.id
    }).done(res => {
      if (res.success) {
        let pin = res.object
        pin = `${pin.substring(0, 4)} - ${
                    pin.substring(4, 8)} - ${
                    pin.substring(8, 12)}`
        showAlert(pin)
      } else {
        showAlert('Failed!')
      }
    }).fail(() => {
      showAlert('Failed!')
    })
  }

  render () {
    // let table // Never used
    // const {tabIndex} = this.state // Never used
    return (
      <TabPage>
        <TabPageHeader title="Settings">
          <div className="text-center margin-md-top">
            <div className="pull-left">
              <select className="form-control"
                onChange={this.onChangeGroup.bind(this)}
                ref="groups">
                <option value="">All groups</option>
                {
                  this.state.groups.map(item =>
                    <option key={item.id} value={item.id}>{item.name}</option>
                  )
                }
              </select>
            </div>

            <div style={{position: 'absolute', right: '25px'}}>
              <ButtonGroup>

                <DropdownButton title="Group" id="dd-setting-groups" pullRight>

                  <MenuItem eventKey="1" onClick={this.onAddGroup.bind(this)}>Add</MenuItem>
                  <MenuItem eventKey="2" onClick={this.onClickEditGroup.bind(this)}>Edit</MenuItem>
                  <MenuItem eventKey="3" onClick={this.onClickRemoveGroup.bind(this)}>Remove</MenuItem>

                </DropdownButton>

                <DropdownButton title="User" id="dd-setting-users" pullRight>

                  <MenuItem eventKey="1" onClick={this.onAddUser.bind(this)}>Add</MenuItem>
                  <MenuItem eventKey="2" onClick={this.onEditUser.bind(this)}>Edit</MenuItem>
                  <MenuItem eventKey="3" onClick={this.onRemoveUser.bind(this)}>Remove</MenuItem>
                  <MenuItem eventKey="4" onClick={this.onChangePassword.bind(this)}>Change Password</MenuItem>
                  <MenuItem eventKey="5" onClick={this.onClickPin.bind(this)}>Regenerate Pin</MenuItem>

                </DropdownButton>

              </ButtonGroup>
            </div>
          </div>
        </TabPageHeader>

        <TabPageBody tabs={SettingTabs} tab={4}>
          {this.renderContent()}
          {this.renderUserModal()}
          {this.renderPasswordModal()}
        </TabPageBody>
      </TabPage>
    )
  }
}
