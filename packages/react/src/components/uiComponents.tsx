import type {
  CreateOrganizationProps,
  OrganizationProfileProps,
  OrganizationSwitcherProps,
  SignInProps,
  SignUpProps,
  UserButtonProps,
  UserProfileProps,
} from '@clerk/types';
import React, { createElement } from 'react';

import type { MountProps, WithClerkProp } from '../types';
import { useCustomPageMounter } from '../utils';
import { withClerk } from './withClerk';

// README: <Portal/> should be a class pure component in order for mount and unmount
// lifecycle props to be invoked correctly. Replacing the class component with a
// functional component wrapped with a React.memo is not identical to the original
// class implementation due to React intricacies such as the useEffect’s cleanup
// seems to run AFTER unmount, while componentWillUnmount runs BEFORE.

// More information can be found at https://clerkinc.slack.com/archives/C015S0BGH8R/p1624891993016300

// The function Portal implementation is commented out for future reference.

// const Portal = React.memo(({ props, mount, unmount }: MountProps) => {
//   const portalRef = React.createRef<HTMLDivElement>();

//   useEffect(() => {
//     if (portalRef.current) {
//       mount(portalRef.current, props);
//     }
//     return () => {
//       if (portalRef.current) {
//         unmount(portalRef.current);
//       }
//     };
//   }, []);

//   return <div ref={portalRef} />;
// });

// Portal.displayName = 'ClerkPortal';
class Portal extends React.PureComponent<MountProps, {}> {
  private portalRef = React.createRef<HTMLDivElement>();

  componentDidUpdate(prevProps: Readonly<MountProps>) {
    if (prevProps.props.appearance !== this.props.props.appearance) {
      this.props.updateProps({ node: this.portalRef.current, props: this.props.props });
    }
  }

  componentDidMount() {
    if (this.portalRef.current) {
      this.props.mount(this.portalRef.current, this.props.props);
    }
  }

  componentWillUnmount() {
    if (this.portalRef.current) {
      this.props.unmount(this.portalRef.current);
    }
  }

  render() {
    // const Wrapper = this.props.customPages;
    return (
      <>
        <div ref={this.portalRef} />
        {this.props?.customPages?.map(customPage => createElement(customPage.Wrapper, { key: customPage.id }))}
      </>
    );
  }
}

export const SignIn = withClerk(({ clerk, ...props }: WithClerkProp<SignInProps>) => {
  return (
    <Portal
      mount={clerk.mountSignIn}
      unmount={clerk.unmountSignIn}
      updateProps={(clerk as any).__unstable__updateProps}
      props={props}
    />
  );
}, 'SignIn');

export const SignUp = withClerk(({ clerk, ...props }: WithClerkProp<SignUpProps>) => {
  return (
    <Portal
      mount={clerk.mountSignUp}
      unmount={clerk.unmountSignUp}
      updateProps={(clerk as any).__unstable__updateProps}
      props={props}
    />
  );
}, 'SignUp');

export const UserProfile = withClerk(
  ({ clerk, ...props }: WithClerkProp<UserProfileProps & { customPages?: any[] }>) => {
    const customPages = props?.customPages?.map((customPage, index) => ({
      ...customPage,
      ...useCustomPageMounter(customPage.component),
      id: `custom-${index}`,
    }));
    // const [CustomPageWrapper, mountCustomPage, unmountCustomPage] = useCustomPageMounter(props.customPage);
    return (
      <Portal
        mount={clerk.mountUserProfile}
        unmount={clerk.unmountUserProfile}
        updateProps={(clerk as any).__unstable__updateProps}
        props={{ ...props, customPages }}
        customPages={customPages}
      />
    );
  },
  'UserProfile',
);

export const UserButton = withClerk(({ clerk, ...props }: WithClerkProp<UserButtonProps>) => {
  // @ts-ignore
  props.userProfileProps.customPages = props?.userProfileProps?.customPages?.map((customPage, index) => ({
    ...customPage,
    ...useCustomPageMounter(customPage.component),
    id: `custom-${index}`,
  }));
  return (
    <Portal
      mount={clerk.mountUserButton}
      unmount={clerk.unmountUserButton}
      updateProps={(clerk as any).__unstable__updateProps}
      props={{ ...props }}
      // @ts-ignore
      customPages={props?.userProfileProps?.customPages}
    />
  );
}, 'UserButton');

export const OrganizationProfile = withClerk(({ clerk, ...props }: WithClerkProp<OrganizationProfileProps>) => {
  return (
    <Portal
      mount={clerk.mountOrganizationProfile}
      unmount={clerk.unmountOrganizationProfile}
      updateProps={(clerk as any).__unstable__updateProps}
      props={props}
    />
  );
}, 'OrganizationProfile');

export const CreateOrganization = withClerk(({ clerk, ...props }: WithClerkProp<CreateOrganizationProps>) => {
  return (
    <Portal
      mount={clerk.mountCreateOrganization}
      unmount={clerk.unmountCreateOrganization}
      updateProps={(clerk as any).__unstable__updateProps}
      props={props}
    />
  );
}, 'CreateOrganization');

export const OrganizationSwitcher = withClerk(({ clerk, ...props }: WithClerkProp<OrganizationSwitcherProps>) => {
  return (
    <Portal
      mount={clerk.mountOrganizationSwitcher}
      unmount={clerk.unmountOrganizationSwitcher}
      updateProps={(clerk as any).__unstable__updateProps}
      props={props}
    />
  );
}, 'OrganizationSwitcher');
