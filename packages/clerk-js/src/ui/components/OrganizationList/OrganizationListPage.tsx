import type { UserOrganizationInvitationResource } from '@clerk/types';
import type { PropsWithChildren } from 'react';

import {
  useCoreClerk,
  useCoreOrganizationList,
  useCoreUser,
  useEnvironment,
  useOrganizationListContext,
} from '../../contexts';
import { Button, Col, descriptors, Flex, localizationKeys, Spinner } from '../../customizables';
import {
  Card,
  CardAlert,
  Divider,
  Header,
  OrganizationPreview,
  PersonalWorkspacePreview,
  PreviewButton,
  useCardState,
  withCardStateProvider,
} from '../../elements';
import { useInView } from '../../hooks';
import { ArrowRightIcon } from '../../icons';
import { PreviewListItems, PreviewListSpinner } from './shared';
import { InvitationPreview } from './UserInvitationList';
import { MembershipPreview } from './UserMembershipList';
import { SuggestionPreview } from './UserSuggestionList';
import { organizationListParams } from './utils';

export const OrganizationListPage = withCardStateProvider(() => {
  const card = useCardState();
  const clerk = useCoreClerk();
  const {
    hidePersonal,
    navigateAfterSelectPersonal,
    createOrganizationMode,
    afterCreateOrganizationUrl,
    navigateCreateOrganization,
  } = useOrganizationListContext();

  const environment = useEnvironment();

  const { isLoaded, setActive, userMemberships, userInvitations, userSuggestions } =
    useCoreOrganizationList(organizationListParams);

  const isLoading = userMemberships?.isLoading || userInvitations?.isLoading || userSuggestions?.isLoading;

  const hasNextPage = userMemberships?.hasNextPage || userInvitations?.hasNextPage || userSuggestions?.hasNextPage;

  const user = useCoreUser();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { username, primaryEmailAddress, primaryPhoneNumber, ...userWithoutIdentifiers } = user;

  const handlePersonalClicked = () => {
    if (!isLoaded) {
      return;
    }
    return card.runAsync(() =>
      setActive({
        organization: null,
        beforeEmit: () => navigateAfterSelectPersonal(user),
      }),
    );
  };

  const { ref } = useInView({
    threshold: 0,
    onChange: inView => {
      if (!inView) {
        return;
      }

      if (userMemberships.hasNextPage) {
        (userMemberships as any)?.unstable__fetchNextAsync?.();
      } else if (userInvitations.hasNextPage) {
        (userInvitations as any)?.unstable__fetchNextAsync?.();
      } else {
        userSuggestions.fetchNext?.();
      }
    },
  });

  const handleCreateOrganizationClicked = () => {
    if (createOrganizationMode === 'navigation') {
      return navigateCreateOrganization();
    }
    return clerk.openCreateOrganization({ afterCreateOrganizationUrl });
  };

  return (
    <Card
      // justify={'between'}
      sx={t => ({
        // minHeight: t.sizes.$100,
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
              {!hidePersonal && (
                <PreviewButton
                  sx={t => ({
                    height: t.space.$24,
                    padding: `${t.space.$2} ${t.space.$8}`,
                  })}
                  icon={ArrowRightIcon}
                  iconProps={{
                    size: 'lg',
                  }}
                  showIconOnHover={false}
                  onClick={handlePersonalClicked}
                >
                  {/*<Flex*/}
                  {/*  align='center'*/}
                  {/*  gap={2}*/}
                  {/*  sx={t => ({*/}
                  {/*    minHeight: 'unset',*/}
                  {/*    height: t.space.$24,*/}
                  {/*    justifyContent: 'space-between',*/}
                  {/*    padding: `${t.space.$2} ${t.space.$8}`,*/}
                  {/*  })}*/}
                  {/*  elementDescriptor={descriptors.organizationListPreviewItem}*/}
                  {/*>*/}
                  <PersonalWorkspacePreview
                    user={userWithoutIdentifiers}
                    avatarSx={t => ({ width: t.sizes.$10, height: t.sizes.$10 })}
                    mainIdentifierSx={t => ({
                      fontSize: t.fontSizes.$xl,
                      color: t.colors.$colorText,
                    })}
                    title={localizationKeys('organizationSwitcher.personalWorkspace')}
                  />
                </PreviewButton>
              )}
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
            {/*<UserMembershipList />*/}
            {/*<UserInvitationList />*/}
            {/*<UserSuggestionList />*/}
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
              {/*  <Text*/}
              {/*  variant='largeMedium'*/}
              {/*  colorScheme='neutral'*/}
              {/*  sx={t => ({*/}
              {/*    fontWeight: t.fontWeights.$normal,*/}
              {/*    minHeight: 'unset',*/}
              {/*    height: t.space.$7,*/}
              {/*    display: 'flex',*/}
              {/*    alignItems: 'center',*/}
              {/*  })}*/}
              {/*  localizationKey={localizationKeys('organizationList.createOrganization')}*/}
              {/*/>*/}
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

      {/*{!isLoading && afterSkipUrl && (*/}
      {/*  <Footer.Root>*/}
      {/*    <Footer.Action*/}
      {/*      elementId='organizationList'*/}
      {/*      sx={t => ({*/}
      {/*        padding: `${t.space.$none} ${t.space.$8}`,*/}
      {/*      })}*/}
      {/*    >*/}
      {/*      <Footer.ActionLink*/}
      {/*        localizationKey={localizationKeys('organizationList.actionLink')}*/}
      {/*        to={clerk.buildUrlWithAuth(afterSkipUrl)}*/}
      {/*      />*/}
      {/*    </Footer.Action>*/}
      {/*    <Footer.Links />*/}
      {/*  </Footer.Root>*/}
      {/*)}*/}
    </Card>
  );
});

export const PreviewListItem = (
  props: PropsWithChildren<{
    organizationData: UserOrganizationInvitationResource['publicOrganizationData'];
  }>,
) => {
  return (
    <Flex
      align='center'
      gap={2}
      sx={t => ({
        minHeight: 'unset',
        height: t.space.$12,
        justifyContent: 'space-between',
        padding: `0 ${t.space.$8}`,
      })}
      elementDescriptor={descriptors.organizationListPreviewItem}
    >
      <OrganizationPreview
        elementId='organizationList'
        avatarSx={t => ({ margin: `0 calc(${t.space.$3}/2)`, width: t.sizes.$10, height: t.sizes.$10 })}
        mainIdentifierSx={t => ({
          fontSize: t.fontSizes.$xl,
          color: t.colors.$colorText,
        })}
        organization={props.organizationData}
      />
      {props.children}
    </Flex>
  );
};
