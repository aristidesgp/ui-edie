import React from 'react'

import { appendComponent, removeComponent } from 'util/Component.jsx'
import { showAlert, showPrompt } from 'components/shared/Alert.jsx'

import IncidentDetailModal from './IncidentDetailModal.jsx'
import CommentsModal from './CommentsModal.jsx'
import IncidentEventsModal from './IncidentEventsModal'

export function showIncidentDetail(incident) {
    appendComponent(
        <IncidentDetailModal incident={incident}
                             onClose={removeComponent}/>
    )
}

export function showIncidentRaw(incident) {
    appendComponent(
        <IncidentEventsModal
            incident={incident}
            onClose={(modal) => {
                removeComponent(modal)
            }}
        />
    )
}

export function showIncidentComments(sid, incident, cb) {
    appendComponent(
        <CommentsModal
            incident={incident}
            onClose={(modal) => {
                removeComponent(modal)
                cb && cb()
            }}
        />
    )
}