import { useCallback } from 'react';

import {
  PENDO_ACCOUNT_ID,
  PENDO_ALLOWED_HOSTNAMES,
} from 'configs/constants';


interface InitialInterface {
  email: string;
  job_roles: { identifier: string; name: string; }[];
}

interface Init {
  visitor: {
    id: string;
    job_roles: string[];
    client: string;
  };
  account: {
    id: string;
  };
}

interface PendoInterface {
  initialize: (props: Init) => void;
}

declare global {
  interface Window {
    pendo: PendoInterface;
  }
}

export default () => {

  /**
   * Generate a hash from the user's email address, so we have a unique and sticky
   * identifier, which can't be simply traced back to any id in our system.
   */
  const generateUserId = async (string: string) => {
    const msgUint8 = new TextEncoder().encode(string);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
    return hashHex;
  };

  /**
   * Init the hook.
   */
  const init = useCallback(({
    email,
    job_roles = [],
  }: InitialInterface) => {

    const host = window.location.hostname;
    const pendo = window.pendo;

    // Don't initialize Pendo if it's not found (API key not provided, or global undefined).
    if (!pendo) {
      return;
    }

    // Don't load Pendo on disallowed hostnames.
    // Note that we can't easily distinguish between `test`, `stag` and `prod` builds,
    // so a hostname whitelist is a fairly easy solution.
    if (!PENDO_ALLOWED_HOSTNAMES.includes(host)) {
      console.info(`Not initializing Pendo on hostname '${host}'.`);
      return;
    }

     // Extract role names
     const roleNames = job_roles.map(role => role.name);

    // Generate anonomized user id and initialize Pendo.
    generateUserId(email).then(id => {
      pendo.initialize({
        visitor: {
          id: `das-user-${id}`,
          job_roles: roleNames,
          client: email?.split('@').at(-1) || 'unknown client',
        },
        account: {
          id: PENDO_ACCOUNT_ID,
        },
      });
    });

  }, []);

  return {
    init,
  };

}
