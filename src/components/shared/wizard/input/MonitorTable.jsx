import React from 'react'
import { forIn, findIndex } from 'lodash'
import { InputBase } from 'react-serial-forms'
import { PanelGroup, Panel } from 'react-bootstrap'
import { concat } from 'lodash'

import DeviceWizard from 'components/shared/wizard/DeviceWizard.jsx'
import { wizardConfig, deviceTypeMap } from 'components/shared/wizard/WizardConfig.jsx'

import { util } from '../WizardUtil.jsx'
import { appendComponent, removeComponent } from 'util/Component.jsx'
import { showAlert, showPrompt, showConfirm } from 'components/shared/Alert.jsx'

class MonitorTable extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            menuHidden: true,
            selected: -1,

            monitorConfig: null,
            monitorWizardVisible: false,
        }

        this.handleClick = this.handleClick.bind(this)
    }

    componentDidMount() {
        document.addEventListener('click', this.handleClick, false);

    }

    componentWillUnmount() {

        document.removeEventListener('click', this.handleClick, false);
    }

    render() {
        return (
            <div className="panel panel-default panel-noborder">
                <div className="panel-heading drag-handle">
                    <h4 className="panel-title">Monitors</h4>
                    <div className="panel-options">
                        <a href="javascript:;" className="option trash"
                           onClick={this.onClickRemove.bind(this)}>
                            <i className="fa fa-trash-o"></i>
                        </a>
                        <a href="javascript:;" className="option add-device"
                           onClick={this.onClickAdd.bind(this)}>
                            <i className="fa fa-plus-square"></i>
                        </a>
                    </div>

                    {this.renderMenu()}
                </div>

                <div className="panel-body"
                     style={{minHeight: "100px", maxHeight: "350px", overflow: "auto", padding:"3px"}}>
                    <table className="table dataTable hover">
                        <thead>
                        <tr>
                            <th width="5%">Type</th>
                            <th width="5%">Name</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            this.props.monitors.map((item, index) =>
                                <tr key={index}
                                    className={index == this.state.selected ? 'selected' : ''}
                                    onClick={() => this.setState({selected: index})}>
                                    <td>{item.monitortype}</td>
                                    <td>{item.name}</td>
                                </tr>
                            )
                        }
                        </tbody>
                    </table>

                    {this.renderMonitorWizard()}
                </div>
            </div>
        )
    }

    renderMenu() {
        if (this.state.menuHidden) return null

        return (
            <div className="dropdown">
                <div id="dropdown-monitor" className="panel-group">
                    <Panel>
                        <ul ref="liDevices">
                            {this.props.templates.map(item =>this.renderMenuItem(item))}
                        </ul>
                    </Panel>
                </div>
            </div>
        )
    }

    renderMenuItem(item) {
        return (
            <li key={item.id} onClick={this.onClickItem.bind(this, item)}>
                <a href="javascript:;">
                    <span className="pull-left item-icon" ref="div">
                        <img src={"/images/" + item.image}/>
                    </span>

                    <span className="item-text">
                        <strong>{item.name}</strong>
                    </span>
                </a>
            </li>
        )
    }

    renderMonitorWizard() {
        if (!this.state.monitorWizardVisible) return

        const {monitorConfig} = this.state
        const type = 'monitor-custom'

        return (
            <DeviceWizard
                deviceType={type}
                title={monitorConfig ? monitorConfig.name : ''}
                onClose={() => {
                    this.setState({ monitorWizardVisible: false })
                }}
                extraParams={{
                    monitortype: monitorConfig.monitortype
                }}
                configParams={{}}
                onFinish={this.onFinishMonitorWizard.bind(this)}
            />
        )
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    handleClick(e) {
        //Detect device menu outer click
        if (!this.state.menuHidden) {
            if (!this.refs.liDevices.contains(e.target)) {
                this.setState({ menuHidden: true })
            }
        }
    }

    onClickItem(item) {
        this.setState({ menuHidden: true })
        this.addMonitor(item)

    }

    onClickAdd(e) {
        this.setState({ menuHidden: !this.state.menuHidden})

        e.preventDefault()
        e.nativeEvent.stopImmediatePropagation()
    }

    onClickRemove() {
        let {selected} = this.state
        const {monitors, onChanged} = this.props
        if (selected < 0) return
        monitors.splice(selected, 1)
        selected = -1
        this.setState({selected, monitors})


        onChanged && onChanged(monitors)
        // this.updateValue(monitors)
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    addMonitor(monitorConfig){
        this.setState({ monitorWizardVisible: true, monitorConfig })
    }

    onFinishMonitorWizard(res, params) {
        const { monitors, onChanged } = this.props

        monitors.push(params)

        onChanged && onChanged(monitors)
    }
}

MonitorTable.defaultProps = {
    config: {},
    values: {},
    monitors: [],
    templates: [],
    onChanged: null,
}

export default MonitorTable