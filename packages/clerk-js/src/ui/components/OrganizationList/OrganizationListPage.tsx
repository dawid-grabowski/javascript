import { useCoreClerk, useCoreOrganizationList, useEnvironment, useOrganizationListContext } from '../../contexts';
import { Button, Col, descriptors, Flex, localizationKeys, Spinner } from '../../customizables';
import { Card, CardAlert, Divider, Header, useCardState, withCardStateProvider } from '../../elements';
import { useInView } from '../../hooks';
import { PreviewListItems, PreviewListSpinner } from './shared';
import { InvitationPreview } from './UserInvitationList';
import { MembershipPreview, PersonalAccountPreview } from './UserMembershipList';
import { SuggestionPreview } from './UserSuggestionList';
import { organizationListParams } from './utils';

const useFetchList = () => {
  const { userMemberships, userInvitations, userSuggestions } = useCoreOrganizationList(organizationListParams);

  const { ref } = useInView({
    threshold: 0,
    onChange: inView => {
      if (!inView) {
        return;
      }
      if (userMemberships.hasNextPage) {
        userMemberships.fetchNext?.();
      } else if (userInvitations.hasNextPage) {
        userInvitations.fetchNext?.();
      } else {
        userSuggestions.fetchNext?.();
      }
    },
  });

  return {
    userMemberships,
    userInvitations,
    userSuggestions,
    ref,
  };
};

export const OrganizationListPage = withCardStateProvider(() => {
  const card = useCardState();
  const clerk = useCoreClerk();
  const { hidePersonal, createOrganizationMode, afterCreateOrganizationUrl, navigateCreateOrganization } =
    useOrganizationListContext();

  const environment = useEnvironment();

  const { ref, userMemberships, userSuggestions, userInvitations } = useFetchList();

  const isLoading = userMemberships?.isLoading || userInvitations?.isLoading || userSuggestions?.isLoading;

  const hasNextPage = userMemberships?.hasNextPage || userInvitations?.hasNextPage || userSuggestions?.hasNextPage;

  const handleCreateOrganizationClicked = () => {
    if (createOrganizationMode === 'navigation') {
      return navigateCreateOrganization();
    }
    return clerk.openCreateOrganization({ afterCreateOrganizationUrl });
  };

  return (
    <Card
      sx={t => ({
        padding: `${t.space.$8} ${t.space.$none}`,
      })}
    >
      <CardAlert>{card.error}</CardAlert>
      {isLoading && (
        <Flex
          direction={'row'}
          align={'center'}
          justify={'center'}
          sx={t => ({
            height: '100%',
            minHeight: t.sizes.$60,
          })}
        >
          <Spinner
            size={'lg'}
            colorScheme={'primary'}
          />
        </Flex>
      )}

      {!isLoading && (
        <>
          <Header.Root
            sx={t => ({
              padding: `${t.space.$none} ${t.space.$8}`,
            })}
          >
            <Header.Title
              localizationKey={localizationKeys(
                !hidePersonal ? 'organizationList.title' : 'organizationList.titleWithoutPersonal',
              )}
            />
            <Header.Subtitle
              localizationKey={localizationKeys('organizationList.subtitle', {
                applicationName: environment.displayConfig.applicationName,
              })}
            />
          </Header.Root>
          <Col
            elementDescriptor={descriptors.main}
            gap={4}
          >
            <PreviewListItems>
              <PersonalAccountPreview />
              {userMemberships?.data?.map(inv => {
                return (
                  <MembershipPreview
                    key={inv.id}
                    {...inv}
                  />
                );
              })}

              {!userMemberships?.hasNextPage &&
                userInvitations?.data?.map(inv => {
                  return (
                    <InvitationPreview
                      key={inv.id}
                      {...inv}
                    />
                  );
                })}

              {!userMemberships?.hasNextPage &&
                !userInvitations?.hasNextPage &&
                userSuggestions?.data?.map(inv => {
                  return (
                    <SuggestionPreview
                      key={inv.id}
                      {...inv}
                    />
                  );
                })}

              {(hasNextPage || isLoading) && <PreviewListSpinner ref={ref} />}
            </PreviewListItems>

            <Divider
              key={`divider`}
              sx={t => ({
                padding: `${t.space.$none} ${t.space.$8}`,
              })}
            />

            <Flex
              align='center'
              justify='between'
              sx={t => ({
                padding: `${t.space.$none} ${t.space.$8}`,
              })}
            >
              <Button
                elementDescriptor={descriptors.button}
                block
                colorScheme='neutral'
                size='sm'
                variant='outline'
                textVariant='buttonExtraSmallBold'
                onClick={handleCreateOrganizationClicked}
                localizationKey={localizationKeys('organizationList.action__createOrganization')}
              />
            </Flex>
          </Col>
        </>
      )}
    </Card>
  );
});
