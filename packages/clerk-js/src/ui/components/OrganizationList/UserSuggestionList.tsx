import type { ClerkPaginatedResponse, OrganizationSuggestionResource } from '@clerk/types';

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

// export const UserSuggestionList = () => {
//   const { userSuggestions } = useCoreOrganizationList({
//     userSuggestions: organizationListParams.userSuggestions,
//   });
//
//   const { ref } = useInView({
//     threshold: 0,
//     onChange: inView => {
//       if (inView) {
//         userSuggestions.fetchNext?.();
//       }
//     },
//   });
//
//   if ((userSuggestions.count ?? 0) === 0) {
//     return null;
//   }
//
//   return (
//     <PreviewList elementId='suggestions'>
//       <PreviewListSubtitle
//         localizationKey={localizationKeys(
//           (userSuggestions.count ?? 0) > 1
//             ? 'organizationList.suggestionCountLabel_many'
//             : 'organizationList.suggestionCountLabel_single',
//           {
//             count: userSuggestions.count,
//           },
//         )}
//       />
//       <PreviewListItems>
//         {userSuggestions?.data?.map(inv => {
//           return (
//             <SuggestionPreview
//               key={inv.id}
//               {...inv}
//             />
//           );
//         })}
//
//         {userSuggestions.hasNextPage && <PreviewListSpinner ref={ref} />}
//       </PreviewListItems>
//       <PreviewListDivider />
//     </PreviewList>
//   );
// };

export const AcceptRejectInvitationButtons = (props: OrganizationSuggestionResource) => {
  const card = useCardState();
  const { userSuggestions } = useCoreOrganizationList({
    userSuggestions: organizationListParams.userSuggestions,
  });

  const handleAccept = () => {
    return card
      .runAsync(props.accept)
      .then(result => {
        (userSuggestions as any)?.unstable__mutate?.(result, {
          populateCache: (
            updatedSuggestion: OrganizationSuggestionResource,
            suggestionInfinitePages: ClerkPaginatedResponse<OrganizationSuggestionResource>[],
          ) => {
            return suggestionInfinitePages.map(item => {
              const newData = item.data.map(obj => {
                if (obj.id === updatedSuggestion.id) {
                  return {
                    ...updatedSuggestion,
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
      >
        {/*TODO: localize this*/}
        Pending approval
      </Text>
    );
  }

  return (
    <PreviewListItemButton
      isLoading={card.isLoading}
      onClick={handleAccept}
      localizationKey={localizationKeys('organizationList.action__suggestionsAccept')}
    />
  );
};

export const SuggestionPreview = withCardStateProvider((props: OrganizationSuggestionResource) => {
  return (
    <PreviewListItem organizationData={props.publicOrganizationData}>
      <AcceptRejectInvitationButtons {...props} />
    </PreviewListItem>
  );
});
