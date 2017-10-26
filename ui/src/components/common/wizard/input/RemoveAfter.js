import React from 'react'
import {Field} from 'redux-form'

import {FormSelect} from 'components/modal/parts'

import {removeAfterDurations, removeAfterDurationUnits} from 'shared/Global'

export default class RemoveAfter extends React.Component {
  render () {
    return (
      <div className="inline-block valign-bottom">
        <div className="inline-block valign-middle" style={{fontSize: '16px', paddingLeft: 7}}>Add remove events after</div>
        <Field
          name="remove_after" component={FormSelect} options={removeAfterDurations}
          style={{width: 80, paddingLeft: 15}} className="valign-middle"/>
        <Field
          name="remove_after_unit" component={FormSelect} options={removeAfterDurationUnits}
          style={{width: 120}} className="valign-middle"/>
      </div>
    )
  }
}