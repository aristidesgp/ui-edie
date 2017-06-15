import React from 'react'
import { InputBase } from 'react-serial-forms'
import GlobalIgnoreModal from './GlobalIgnoreModal'

import {appendComponent, removeComponent}
    from 'util/Component'

export default class GlobalIgnore extends InputBase {
  constructor (props) {
    super(props)
    this.state = {
      data: [],
      selected: -1,
      keyword: ''
    }

    let values = this.props.values
    if (values && props.name && values[props.name]) {
      this.state.data = values[props.name]
    }
  }

  getInitialValue () {
    return this.state.data
  }

  render () {
    return (
      <div className="panel-body p-none" style={{minHeight: '300px'}}>
        <div className="panel panel-default panel-noborder">
          <div className="panel-heading">
            <h4 className="panel-title">Global Ignore</h4>
            <div className="panel-options">
              <a href="javascript:;"
                className="option"
                onClick={this.onClickDelete.bind(this)}>
                  <i className="fa fa-trash-o" />
              </a>
              <a href="javascript:;"
                className="option"
                onClick={this.onClickAdd.bind(this)}>
                  <i className="fa fa-plus-square" />
              </a>
              <a href="javascript:;"
                className="option"
                onClick={this.onClickEdit.bind(this)}>
                  <i className="fa fa-edit" />
              </a>
            </div>
          </div>
          <div className="panel-body" style={{maxHeight: '250px', overflowY: 'auto', overflowX: 'hidden'}}>
            <div className="form-inline text-right">
              <input type="text" className="input-sm form-control" placeholder="Search..."
                ref="search"
                onChange={this.filter.bind(this)}/>
            </div>
            <table className="table dataTable hover">
              <thead>
              <tr>
                <th>Ignore</th>
              </tr>
              </thead>
              <tbody>
              {
                this.state.data.map((item, i) =>
                  item.ignore.includes(this.state.keyword)
                    ? (
                      <tr key={i}
                        className={this.state.selected === i ? 'selected' : ''}
                        onClick={() => { this.setState({selected: i}) }}>
                        <td>{item.ignore}</td>
                      </tr>
                      )
                    : null
                )
              }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }

    // //////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  filter () {
    this.setState({
      keyword: this.refs.search.value,
      selected: -1
    })
  }

  onClickAdd () {
    appendComponent(
      <GlobalIgnoreModal
        onClose={this.onCloseAdd.bind(this)}
      />
    )
  }

  onCloseAdd (modal, item) {
    removeComponent(modal)
    if (!item) return

    let data = this.state.data
    data.push(item)
    this.setState(data)

    this.updateValue(data)
  }

  onClickEdit () {
    if (this.state.selected < 0) {
      window.alert('Please select row.')
      return
    }

    appendComponent(
      <GlobalIgnoreModal
        onClose={this.onCloseEdit.bind(this)}
        data = {this.state.data[this.state.selected]}
        item={this.state.data[this.state.selected]}
      />
    )
  }

  onCloseEdit (modal, item) {
    removeComponent(modal)
    if (!item) return

    let data = this.state.data
    data[this.state.selected] = item
    this.setState({data})

    this.updateValue(data)
  }

  onClickDelete () {
    if (this.state.selected < 0) {
      window.alert('Please select row.')
      return
    }
    let data = this.state.data
    data.splice(this.state.selected, 1)

    this.setState({
      data: data,
      selected: -1
    })

    this.updateValue(data)
  }
}

GlobalIgnore.defaultProps = {
  config: {},
  values: {}
}
