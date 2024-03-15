"use client"
import WizardContainer from '../wizard/hooks/use-wizard-state';
import { Wizard } from './wizard';

const AnalysisWizard = () => {

  return <WizardContainer.Provider>
    <Wizard/>
  </WizardContainer.Provider>
}

export default AnalysisWizard;