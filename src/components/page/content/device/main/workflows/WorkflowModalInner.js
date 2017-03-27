import React, { Component } from 'react'
import RuleModal from './RuleModal'
import CategoryModal from './CategoryModal'
import ActionModal from './ActionModal'
import DiagramModalContainer from 'containers/page/content/device/main/workflows/DiagramModalContainer'
import { WorkflowStep1, WorkflowStep2, WorkflowStep3, WorkflowWizard,
  MainWorkflowModalView } from 'components/modal'

export default class WorkflowModalInner extends Component {
  renderRuleModal () {
    if (!this.props.ruleModalOpen) return null
    return (
      <RuleModal {...this.props} onClose={this.props.onCloseRuleModal.bind(this)} />
    )
  }

  renderCategoryModal () {
    if (!this.props.wfCategoryModalOpen) return null
    return (
      <CategoryModal />
    )
  }

  renderActionModal () {
    if (!this.props.wfActionModalOpen) return null
    return (
      <ActionModal onClose={this.props.onCloseActionModal.bind(this)} />
    )
  }

  renderDiagramModal () {
    if (!this.props.wfDiagramModalOpen) return null
    return (
      <DiagramModalContainer
        commands={this.props.actions.map(a => a.command)}
        onClose={this.props.onDiagramModalClose.bind(this)}/>
    )
  }

  renderStep () {
    const {current, rules, selectedRuleIndex, actions, selectedActionIndex} = this.props
    let categoryModal = this.renderCategoryModal()
    let ruleModal = this.renderRuleModal()
    let actionModal = this.renderActionModal()

    if (current === 1) {
      return (
        <WorkflowStep1
          categories={this.props.workflowCategories}
          onAddCategory={this.props.onClickAddCategory}
          categoryModal={categoryModal}
        />
      )
    } else if (current === 2) {
      return (
        <WorkflowStep2
          onRemoveRule={this.props.onClickRemoveRule}
          rules={rules}
          onRuleChange={this.props.onRuleChange}
          onRuleClick={this.props.onRuleClick}
          ruleModal={ruleModal}
          selected={selectedRuleIndex}
        />
      )
    } else if (current === 3) {
      return (
        <WorkflowStep3
          onAddAction={this.props.onClickAddAction}
          onEditAction={this.props.onClickEditAction}
          onRemoveAction={this.props.onClickRemoveAction}
          onActionClick={this.props.onActionClick}
          actions={actions}
          selected={selectedActionIndex}
          actionModal={actionModal}
        />
      )
    }
    return null
  }

  renderWizard () {
    const {current, steps} = this.props
    let step = this.renderStep()
    let diagramModal = this.renderDiagramModal()
    let markers = []
    for (let i = 0; i < steps; i++) {
      const cls = `marker ${current >= (i + 1) ? 'marker-checked' : ''}`
      markers.push(
        <div key={i} className={cls} style={{left: `${100 / steps * (i + 0.5)}%`}}>
          <div className="marker-label">{i + 1}</div>
        </div>
      )
    }
    return (
      <WorkflowWizard
        markers={markers}
        step={step}
        steps={steps}
        current={current}
        diagramModal={diagramModal}
        isDiagramButton={this.props.isDiagramButton}
        onClose={this.props.onClickClose}
        onDiagram={this.props.onClickDiagram}
        onPrev={this.props.onClickPrev}
        onNext={this.props.onClickNext}
      />
    )
  }

  render () {
    const {onSubmit} = this.props
    let wizard = this.renderWizard()
    return (
      <MainWorkflowModalView
        onSubmit={onSubmit}
        wizard={wizard}
      />
    )
  }
}
