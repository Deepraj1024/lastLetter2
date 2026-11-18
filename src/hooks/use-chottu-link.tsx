import { useQuery } from '@tanstack/react-query';
import { createDynamicLink } from 'react-native-chottulink-sdk';

import { useProfile } from '@/hooks/use-profile';

export const useChottuLink = () => {
  const { data } = useProfile();
  const userId = data?.agent.id;
  const userName = data?.agent.fullName;

  return useQuery({
    enabled: !!userId,
    queryFn: async () => {
      const linkConfig = {
        destinationURL: `${process.env.EXPO_PUBLIC_WEBSITE_URL}?userId=${userId}&userName=${userName}&isAgentReferred=true`,
        domain: 'chabi-link.chottu.link',
        linkName: `Referral link from ${data?.agent?.fullName}, as an agent`,
        utmCampaign: 'refer-via-agent-app',
        utmMedium: 'share',
        utmSource: 'agent-app',
      };
      console.log('linkConfig', linkConfig);

      return await createDynamicLink(linkConfig);
    },
    queryKey: ['chottu-link', 'create-dynamic-link'],
  });
};
