import type { OrganizationMembershipResource, OrganizationResource } from '@clerk/types';

import { useCoreOrganizationList, useOrganizationListContext } from '../../contexts';
// import { localizationKeys } from '../../customizables';
import { OrganizationPreview, PreviewButton, useCardState, withCardStateProvider } from '../../elements';
// import { useInView } from '../../hooks';
import { ArrowRightIcon } from '../../icons';
// import {
//   // PreviewList,
//   // PreviewListDivider,
//   PreviewListItemButton,
//   // PreviewListItems,
//   // PreviewListSpinner,
//   // PreviewListSubtitle,
// } from './shared';
// import { organizationListParams } from './utils';

// export const UserMembershipList = () => {
//   const { userMemberships } = useCoreOrganizationList({
//     userMemberships: organizationListParams.userMemberships,
//   });
//
//   const { ref } = useInView({
//     threshold: 0,
//     onChange: inView => {
//       if (inView) {
//         userMemberships.fetchNext?.();
//       }
//     },
//   });
//
//   if ((userMemberships.count ?? 0) === 0) {
//     return null;
//   }
//
//   return (
//     <PreviewList elementId='memberships'>
//       <PreviewListSubtitle
//         localizationKey={localizationKeys(
//           (userMemberships.count ?? 0) > 1
//             ? 'organizationList.organizationCountLabel_many'
//             : 'organizationList.organizationCountLabel_single',
//           {
//             count: userMemberships.count,
//           },
//         )}
//       />
//       <PreviewListItems>
//         {userMemberships?.data?.map(inv => {
//           return (
//             <MembershipPreview
//               key={inv.id}
//               {...inv}
//             />
//           );
//         })}
//
//         {userMemberships.hasNextPage && <PreviewListSpinner ref={ref} />}
//       </PreviewListItems>
//       <PreviewListDivider />
//     </PreviewList>
//   );
// };

// export const SetActiveButton = (props: OrganizationResource) => {
//   const card = useCardState();
//   const { navigateAfterSelectOrganization } = useOrganizationListContext();
//   const { isLoaded, setActive } = useCoreOrganizationList();
//
//   if (!isLoaded) {
//     return null;
//   }
//   const handleOrganizationClicked = (organization: OrganizationResource) => {
//     return card.runAsync(() =>
//       setActive({
//         organization,
//         beforeEmit: () => navigateAfterSelectOrganization(organization),
//       }),
//     );
//   };
//
//   return (
//     <>
//       <PreviewListItemButton
//         isLoading={card.isLoading}
//         onClick={() => handleOrganizationClicked(props)}
//         localizationKey={localizationKeys('organizationList.action__setActiveOrganization')}
//       />
//       <IconButton
//         icon={ArrowRightIcon}
//         aria-label=''
//       />
//     </>
//   );
// };

export const MembershipPreview = withCardStateProvider((props: OrganizationMembershipResource) => {
  const card = useCardState();
  const { navigateAfterSelectOrganization } = useOrganizationListContext();
  const { isLoaded, setActive } = useCoreOrganizationList();

  if (!isLoaded) {
    return null;
  }
  const handleOrganizationClicked = (organization: OrganizationResource) => {
    return card.runAsync(() =>
      setActive({
        organization,
        beforeEmit: () => navigateAfterSelectOrganization(organization),
      }),
    );
  };
  return (
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
      isDisabled={card.isLoading}
      onClick={() => handleOrganizationClicked(props.organization)}
    >
      <OrganizationPreview
        elementId='organizationList'
        avatarSx={t => ({ width: t.sizes.$10, height: t.sizes.$10 })}
        mainIdentifierSx={t => ({
          fontSize: t.fontSizes.$xl,
          color: t.colors.$colorText,
        })}
        organization={props.organization}
      />
    </PreviewButton>
  );
});
