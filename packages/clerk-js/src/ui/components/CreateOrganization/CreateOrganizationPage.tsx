import { useCoreClerk, useCreateOrganizationContext } from '../../contexts';
import { localizationKeys } from '../../customizables';
import { withCardStateProvider } from '../../elements';
import { CreateOrganizationForm } from '../OrganizationList/CreateOrganization';

export const CreateOrganizationPage = withCardStateProvider(() => {
  const title = localizationKeys('createOrganization.title');
  const { closeCreateOrganization } = useCoreClerk();

  const { mode, navigateAfterCreateOrganization, skipInvitationScreen } = useCreateOrganizationContext();

  return (
    <CreateOrganizationForm
      skipInvitationScreen={skipInvitationScreen}
      navigateAfterCreateOrganization={navigateAfterCreateOrganization}
      flow={'organizationList'}
      startPage={{
        headerTitle: title,
      }}
      onComplete={() => {
        if (mode === 'modal') {
          closeCreateOrganization();
        }
      }}
    />
  );
});
