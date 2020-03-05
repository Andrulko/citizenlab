import eventEmitter from 'utils/eventEmitter';
import { ContextShape, VerificationModalSteps } from 'components/VerificationModal/VerificationModal';
import { IParticipationContextType, ICitizenAction } from 'typings';

export interface OpenVerificationModalData {
  step: VerificationModalSteps;
  context: ContextShape | null;
}

enum VerificationModalEvents {
  open = 'openVerificationModal',
  close = 'closeVerificationModal'
}

export function openVerificationModalWithContext(source: string, participationContextId: string, participationContextType: IParticipationContextType, action: ICitizenAction) {
  console.log('openVerificationModalWithContext');

  eventEmitter.emit<OpenVerificationModalData>(
    source,
    VerificationModalEvents.open,
    {
      step: 'method-selection',
      context: {
        action,
        id: participationContextId,
        type: participationContextType
      }
    }
  );
}

export function openVerificationModalWithoutContext(source: string) {
  eventEmitter.emit<OpenVerificationModalData>(
    source,
    VerificationModalEvents.open,
    {
      step: 'method-selection',
      context: null
    }
  );
}

export function closeVerificationModal(location: string) {
  eventEmitter.emit(
    location,
    VerificationModalEvents.close,
    null
  );
}

export const openVerificationModal$ = eventEmitter.observeEvent<OpenVerificationModalData>(VerificationModalEvents.open);

export const closeVerificationModal$ = eventEmitter.observeEvent(VerificationModalEvents.close);
