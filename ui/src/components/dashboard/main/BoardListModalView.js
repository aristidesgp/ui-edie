import React from 'react'
import {IconButton, Card, CardText, Chip} from 'material-ui'
import DeleteIcon from 'material-ui/svg-icons/action/delete'
import EditIcon from 'material-ui/svg-icons/editor/mode-edit'
import AddCircleIcon from 'material-ui/svg-icons/content/add-circle'
import SetDefIcon from 'material-ui/svg-icons/content/sort'

import {Modal, CardLegend} from 'components/modal/parts'

export default class BoardListModalView extends React.Component {
  render () {
    const {onHide, gaugeBoards, selected, onClickAdd, onClickEdit, onClickDelete, onClickSetDefault, onSelect, defaultBoardId} = this.props
    return (
      <Modal title="Dashboards" onRequestClose={onHide} multiCard>
        <CardLegend>
          Dashboards
          <div className="pull-right" style={{marginTop: -13}}>
            <IconButton onTouchTap={onClickSetDefault}>
              <SetDefIcon size={32}/>
            </IconButton>
            <IconButton onTouchTap={onClickAdd}>
              <AddCircleIcon size={32}/>
            </IconButton>
          </div>
        </CardLegend>
        <Card>
          <CardText>
            <div style={{maxHeight: 300, overflow: 'auto'}}>
              <table className="table table-hover">
                <thead>
                <tr>
                  <th>Name</th>
                  <th></th>
                  <th className="text-right">Actions</th>
                </tr>
                </thead>
                <tbody>
                {gaugeBoards.map(p =>
                  <tr key={p.id} onClick={() => onSelect(p)} className={selected && selected.id === p.id ? 'selected' : ''}>
                    <td>{p.name}</td>
                    <td className="text-center">
                      {p.id === defaultBoardId ? (
                        <Chip style={{margin: 'auto'}}>Default</Chip>
                      ) : null}
                    </td>
                    {p.origin === 'SYSTEM' ? (
                      <td/>
                    ) : (
                      <td className="text-right">
                        <IconButton style={{padding: 0, width: 24, height: 24}} onTouchTap={() => onClickEdit(p)}>
                          <EditIcon color="#545454" hoverColor="#f44336"/>
                        </IconButton>&nbsp;&nbsp;&nbsp;
                        <IconButton style={{padding: 0, width: 24, height: 24}} onTouchTap={() => onClickDelete(p)}>
                          <DeleteIcon color="#545454" hoverColor="#f44336"/>
                        </IconButton>
                      </td>
                    )}
                  </tr>
                )}
                </tbody>
              </table>
            </div>
          </CardText>
        </Card>
      </Modal>
    )
  }
}
