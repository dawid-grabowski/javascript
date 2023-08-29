import type { ClerkPaginatedResponse, UserOrganizationInvitationResource } from '@clerk/types';

import { useCoreOrganizationList } from '../../contexts';
import { localizationKeys, Text } from '../../customizables';
import { useCardState, withCardStateProvider } from '../../elements';
// import { useInView } from '../../hooks';
import { handleError } from '../../utils';
import {
  // PreviewList,
  // PreviewListDivider,
  PreviewListItem,
  PreviewListItemButton,
  // PreviewListItems,
  // PreviewListSpinner,
  // PreviewListSubtitle,
} from './shared';
import { organizationListParams } from './utils';

// export const UserInvitationList = () => {
//   const { ref } = useInView({
//     threshold: 0,
//     onChange: inView => {
//       if (inView) {
//         userInvitations.fetchNext?.();
//       }
//     },
//   });
//
//   const { userInvitations } = useCoreOrganizationList({
//     userInvitations: organizationListParams.userInvitations,
//   });
//
//   if ((userInvitations.count ?? 0) === 0) {
//     return null;
//   }
//
//   return (
//     <PreviewList elementId='invitations'>
//       <PreviewListSubtitle
//         localizationKey={localizationKeys(
//           (userInvitations.count ?? 0) > 1
//             ? 'organizationList.invitationCountLabel_many'
//             : 'organizationList.invitationCountLabel_single',
//           {
//             count: userInvitations.count,
//           },
//         )}
//       />
//
//       <PreviewListItems>
//         {userInvitations?.data?.map(inv => {
//           return (
//             <InvitationPreview
//               key={inv.id}
//               {...inv}
//             />
//           );
//         })}
//
//         {userInvitations.hasNextPage && <PreviewListSpinner ref={ref} />}
//       </PreviewListItems>
//       <PreviewListDivider />
//     </PreviewList>
//   );
// };

export const AcceptRejectInvitationButtons = (props: UserOrganizationInvitationResource) => {
  const card = useCardState();
  const { userInvitations } = useCoreOrganizationList({
    userInvitations: organizationListParams.userInvitations,
  });

  const handleAccept = () => {
    return card
      .runAsync(props.accept())
      .then(result => {
        (userInvitations as any)?.unstable__mutate?.(result, {
          populateCache: (
            updatedInvitation: UserOrganizationInvitationResource,
            invitationInfinitePages: ClerkPaginatedResponse<UserOrganizationInvitationResource>[],
          ) => {
            return invitationInfinitePages.map(item => {
              const newData = item.data.map(obj => {
                if (obj.id === updatedInvitation.id) {
                  return {
                    ...updatedInvitation,
                  };
                }

                return obj;
              });
              return { ...item, data: newData };
            });
          },
          // Since `accept` gives back the updated information,
          // we don't need to revalidate here.
          revalidate: false,
        });
      })
      .catch(err => handleError(err, [], card.setError));
  };

  if (props.status === 'accepted') {
    return (
      <Text
        variant='smallRegular'
        colorScheme='neutral'
        localizationKey={localizationKeys('organizationList.invitationAcceptedLabel')}
      />
    );
  }

  return (
    <PreviewListItemButton
      isLoading={card.isLoading}
      onClick={handleAccept}
      localizationKey={localizationKeys('organizationList.action__invitationAccept')}
    />
  );
};

export const InvitationPreview = withCardStateProvider((props: UserOrganizationInvitationResource) => {
  return (
    <PreviewListItem organizationData={props.publicOrganizationData}>
      <AcceptRejectInvitationButtons {...props} />
    </PreviewListItem>
  );
});
