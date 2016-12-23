import React from 'react'
import TimeAgo from 'react-timeago'
import {
  // assign, // Never used
  forIn,
  findIndex
} from 'lodash'
import moment from 'moment'

import { chatSocket } from '../../../../util/socket/ChatSocket'
import { showAlert } from '../../../shared/Alert'

import { scrollBottom } from '../../../../util/Scroll'

class Chat extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      incidents: [],
      selected: null,
      rooms: {},
      roomUsers: []
    }

    this.socketEvents = {
      open: this.onSocketOpen.bind(this),
      close: this.onSocketClose.bind(this),
      message: this.onSocketMessage.bind(this)
    }

    this.msgTimer = 0
    this.lastTyping = 0
    this.beepSound = null
  }

  componentWillMount () {
    forIn(this.socketEvents, (value, key) => {
      chatSocket.addListener(key, value)
    })
    chatSocket.connect()

    this.loadIncidents()
  }

  componentWillUnmount () {
    forIn(this.socketEvents, (value, key) => {
      chatSocket.removeListener(key, value)
    })
    chatSocket.close()
  }

  renderIncident (item) {
    const name = item.description || item.name || 'Incident'
    const room = this.state.rooms[item.id]
    const unread = room.unread
    return (
            <li className={`room${this.state.selected === item ? ' active open' : ''}`}
              key={item.id}
              onClick={this.onClickIncident.bind(this, item)}>
                <a href="javascript:;">
                    <strong>#</strong><span className="room-title">
                        {name}(<TimeAgo date={new Date(item.starttimestamp)}/>)
                    </span>
                    <span className={`badge pull-right badge-message ${unread ? '' : 'hidden'}`}>{unread}</span>
                </a>
            </li>
    )
  }

  renderMessage (item) {
    const {content, pictureId, senderName, timestamp} = item

    let text, accessory
    if (content.startsWith('picture:')) {
      accessory = (
                <div className="attachment-image">
                    <a href="javascript:;">
                        <img className="image" src={`/externalpictures?name=${content.substring(8)}`} height="300px" />
                    </a>
                </div>
            )
    } else {
      text = content
    }

    return (
            <div className="message-group" key={item.id}>
                <div className="avatar-large"
                  style={{backgroundImage: `url(/externalpictures?name=${pictureId})`}} />
                <div className="comment">
                    <div className="message first">
                        <div className="body">
                            <h2>
                                <span><strong className="user-name">{senderName}</strong></span>
                                <span className="highlightSeparator"> - </span>
                                <span className="timestamp">{moment(new Date(timestamp)).format('h:mm A')}</span>
                            </h2>
                            <div className="message-text">
                                <div className="btn-option" />
                                <div className="markup">
                                    <span>{text}</span>
                                </div>
                            </div>
                        </div>
                        <div className="accessory">{accessory}</div>
                    </div>
                </div>
            </div>
    )
  }

  renderTypingStatus (room) {
    if (!room) return null

    let list = room.usersTyping.filter(existing => {
      return existing !== this.context.user.fullname
    })

    return (
            <div className={`typing ${list.length ? 'animate' : 'hidden'}`}>
                <div className="ellipsis">
                    <div />
                    <div />
                    <div />
                </div>
                <strong>
                    <span>{list.join(', ')}</span>
                </strong>
                <span>{list.length === 1 ? ' is typing...' : ' are typing...'}</span>
            </div>
    )
  }

  renderUser (user, room) {
    let typing = false
    if (room) {
      typing = room.usersTyping.indexOf(user.fullName) >= 0
    }

    return (
            <div className="member" key={user.userName}>
                <div className={`avatar-small ${typing ? 'animate' : ''}`}
                  style={{backgroundImage: `${'url(' + 'externalpictures?name='}${user.pictureId})`}}>
                    <div className={`status ${user.online ? 'online' : 'idle'} ${typing ? 'status-typing' : ''}`}>
                        <div className={`ellipsis${typing ? '' : 'hidden'}`}><div /><div /><div /></div>
                    </div>
                </div>
                <div className="member-inner">
                    <div className="member-username">{user.fullName}</div>
                </div>
            </div>
    )
  }

    // //////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  loadIncidents () {
    $.get(Api.incidents.getUnfixedIncidentsQuick, { // eslint-disable-line no-undef
      draw: 1,
      start: 0,
      length: 150,
      sid: this.context.sid,
      type: 'web',
      msgcount: true
    }).done((res) => {
      let {rooms} = this.state
      res.data.forEach(item => {
        rooms[item.id] = {
          unread: item.unread || 0,
          lastMsgId: 0,
          messages: [],

          timerScroll: 0,
          timerSync: 0,

          usersTyping: [],
          userNamesTyping: [],

          joined: false
        }
      })
      this.setState({
        incidents: res.data,
        rooms: rooms
      }, () => {
        this.showDefaultIncident()
      })
    })
  }

  onClickIncident (incident) {
    if (!chatSocket.connected) {
      return showAlert('Not connected. Please try later.')
    }

    const id = incident.id
    let {rooms} = this.state
    let room = rooms[id]

    if (!room.joined) {
      this.joinIncidentChat(id, room)
      room.joined = true
    }

    this.loadIncidentUsers(id)
    room.unread = 0

    this.setState({
      selected: incident,
      rooms: rooms
    }, () => {
      this.refs && scrollBottom(this.refs.messages)
    })
  }

  showDefaultIncident () {
    if (!chatSocket.connected) return
    if (this.state.selected) return

    if (this.state.incidents.length) { this.onClickIncident(this.state.incidents[0]) }
  }

  moveCurrentToTop () {
    const {selected, incidents} = this.state
    if (!selected) return
    const index = incidents.indexOf(selected)
    if (index < 0) return
    incidents.splice(index, 1)
    incidents.splice(0, 0, selected)

    this.setState({ incidents })
  }

    // ///////////////////////////////////////////////////////////

  onTextKeyUp (e) {
    if (e.keyCode === 13) {
      let msg = e.target.value
      if (msg.endsWith('\n')) msg = msg.substring(0, msg.length - 1)
      if (!msg) return false

      this.sendGroupMessage(msg)

      this.sendTypingStatus(false)
      this.lastTyping = 0

      e.target.value = ''
      return false
    }

    let now = new Date().getTime()
    if (now - this.lastTyping > 2000) {
      this.sendTypingStatus(true)
      this.lastTyping = now
    }
  }

  onTextBlur () {
    this.sendTypingStatus(false)
    this.lastTyping = 0
  }

  onFileChange (e) {
    let input = e.target

    if (!input.files || !input.files.length) return

    let file = input.files[0]
    let formData = new FormData() // eslint-disable-line no-undef

    formData.append('file', file, input.value.split(/(\\|\/)/g).pop())
    formData.append('sid', this.context.sid)

    $.ajax({ // eslint-disable-line no-undef
      url: Api.upload.uploadImage, // eslint-disable-line no-undef
      type: 'POST',
      data: formData,
      cache: false,
      processData: false,
      contentType: false,

      success: data => {
        if (typeof data.error === 'undefined' && data.success) {
          const img = data.info
                    // Send image via message
          this.sendGroupMessage(`picture:${img}`)
        } else {
          showAlert('Failed to upload.')
        }
      },
      error: () => {
        showAlert('Failed to upload.')
      }
    })
    input.value = null
  }

    // ///////////////////////////////////////////////////////////

  loadIncidentUsers (incidentId) {
    this.setState({
      roomUsers: []
    })
    $.get(Api.chat.users, { // eslint-disable-line no-undef
      sid: this.context.sid,
      incidentId: incidentId
    }).done(res => {
      if (!res.success) return

      this.setState({
        roomUsers: res.object.map(user => {
          return {
            'timerTyping': 0,
            'pictureId': user.pictureId,
            'userId': user.userId,
            'userName': user.userName,
            'fullName': user.fullName,
            'online': user.online
          }
        })
      })
    })
  }

  updateUserOnlineStatus (userId, online) {
    let {roomUsers} = this.state
    const index = findIndex(roomUsers, { userId })
    if (index < 0) return

    let roomUser = roomUsers[index]
    if (roomUser.online === online) return
    roomUser.online = online

    this.setState({roomUsers})
  }

    // ///////////////////////////////////////////////////////////

  onSocketOpen () {
    console.log('Local Chat Socket Opened')
    this.registerSocket()
    this.showDefaultIncident()
  }

  onSocketClose () {
    console.log('Local Chat Socket Closed')
  }

  onSocketMessage (sockMsg) {
        // console.log(data);
    if (sockMsg.messagetype === 'MessageToGroup') {
      let {rooms} = this.state
      let room = rooms[sockMsg.incidentid]
      if (!room) return

      if (room.joined) {
        const id = sockMsg['id']
        if (id <= room.lastMsgId) return
        room.lastMsgId = id

        room.messages.push({
          id: id,
          senderName: sockMsg['fullname'],
          pictureId: sockMsg['userpictureid'],
          timestamp: sockMsg['time'],
          content: sockMsg['message']
        })

                // Play Beep
        if (this.state.selected &&
                    this.state.selected.id === sockMsg.incidentid && !sockMsg.history) {
          this.playBeep()
        }

                // Scroll to the bottom
        clearTimeout(room.timerScroll)
        room.timerScroll = setTimeout(() => {
          this.refs && scrollBottom(this.refs.messages)
        }, 150)

                // Sync Message
        clearTimeout(room.timerSync)
        room.timerSync = setTimeout(() => {
          this.sendSyncMessage(sockMsg.incidentid, room.lastMsgId)
        }, 50)
      }

            // Add badge for real time messages
      if (!sockMsg.history && (!this.state.selected || sockMsg.incidentid !== this.state.selected.id)) {
        room.unread += 1
      }

      clearTimeout(this.msgTimer)
      this.msgTimer = setTimeout(() => {
        this.setState({ rooms })
      }, 50)

            // Notification
            // if (document['hidden'] && !sockMsg.history && user.id !== sockMsg['userId']) {
            //     var msg = sockMsg['message'];
            //     if (msg.startsWith("picture:")) msg = sockMsg['fullname'] + " has sent an image.";
            //     else msg = sockMsg['fullname'] + ": " + sockMsg['message'];
            //
            //     var title = sockMsg['incident'];
            //     chatNotification.notify(title, msg, {
            //         onclick: function(){
            //             me.onClickIncidentItem(room.liRoom);
            //         },
            //     });
            // }
    } else if (sockMsg.messagetype === 'TypingStatus') {
      let {rooms} = this.state
      let room = rooms[sockMsg.incidentid]
      if (!room) return

      const user = sockMsg.fullname
      // if (!user || user === user.fullname) return;

      const typing = sockMsg.message === 'typing'
      let users = room.usersTyping
      const index = users.indexOf(user)

            // Update Users
      if (index < 0 && typing) {
        users.push(user)
      } else if (index >= 0 && !typing) {
        users.splice(index)
      } else {
        return
      }

      this.setState({rooms})
    } else if (sockMsg.messagetype === 'status') {
      const user = sockMsg.userId
      if (sockMsg.message === 'online') {
        this.updateUserOnlineStatus(user, true)
      } else if (sockMsg.message === 'offline') {
        this.updateUserOnlineStatus(user, false)
      }
    } else if (sockMsg.messagetype === 'NewIncident') {
            // try {
            //     var incident = JSON.parse(sockMsg['message']);
            //     var title = incident.description;
            //     var msg = incident.descriptioninfo;
            //     chatNotification.notify(title, msg, {
            //         onclick: function(){
            //         },
            //     });
            // } catch (e) {
            //
            // }

    }
  }

    // ///////////////////////////////////////////////////////////

  registerSocket () {
    chatSocket.send({
      'lastmessageid': -1,
      'messagetype': 'Register',
      'sid': this.context.sid
    })
  }

  joinIncidentChat (incidentId, room) {
    chatSocket.send({
      'lastmessageid': room.lastMsgId,
      'messagetype': 'Register',
      'sid': this.context.sid,
      'incidentid': incidentId
    })
  }

  sendGroupMessage (text) {
    if (!this.state.selected) {
      return showAlert('Please select incident first.')
    }

    chatSocket.send({
      'messagetype': 'MessageToGroup',
      'sid': this.context.sid,
      'incidentid': this.state.selected.id,
      'message': text
    })

    this.moveCurrentToTop()
  }

  sendTypingStatus (typing) {
    if (!this.state.selected) return

    chatSocket.send({
      'messagetype': 'TypingStatus',
      'sid': this.context.sid,
      'incidentid': this.state.selected.id,
      'message': typing ? 'typing' : 'idle'
    })
  }

  sendSyncMessage (incidentId, msgId) {
    chatSocket.send({
      'messagetype': 'Sync',
            // "sid": s,
      'incidentid': incidentId,
      'id': msgId
    })
  }

    // ///////////////////////////////////////////////////////////

  playBeep () {
    if (!this.beepSound) this.beepSound = new Audio('/snd/beep.mp3') // eslint-disable-line no-undef
    this.beepSound && this.beepSound.play()
  }

  render () {
    let {rooms, selected} = this.state
    let room = null
    let messages = []
    if (selected) room = rooms[selected.id]
    if (room) messages = room.messages

    return (
      <div className="chat-content">
        <section className="incidents">
          <ul className="nav nav-stacked" id="nav-incidents">{
            this.state.incidents.map(item => this.renderIncident(item))
          }
          </ul>
        </section>

        <section className="chat flex-vertical">
          <div className="messages-wrapper flex-vertical" ref="messages">
            <div>
              {messages.map(item => this.renderMessage(item))}
            </div>
          </div>
          <form>
            <div className="channel-textarea">
              <div className="channel-textarea-inner">
                <div className="channel-textarea-upload">
                  <input type="file" name="file"
                    accept="image/png, image/x-png, image/gif, image/jpeg"
                    onChange={this.onFileChange.bind(this)}/>
                </div>
                <textarea rows="1" placeholder="Chat in general..."
                  onKeyUp={this.onTextKeyUp.bind(this)}
                  onBlur={this.onTextBlur.bind(this)} />
              </div>
            </div>

            {this.renderTypingStatus(room)}
          </form>
        </section>

        <section className="channel-members">
          <h2>
            <span>Users</span>
            <span>—</span>
            <span className="online-count">{this.state.roomUsers.length}</span>{
            this.state.roomUsers.map(item => this.renderUser(item, room))
          }
          </h2>
        </section>
      </div>
    )
  }
}

Chat.contextTypes = {
  user: React.PropTypes.object,
  sid: React.PropTypes.string
}

export default Chat
