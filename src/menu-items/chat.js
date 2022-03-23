// assets
import { IconBrandFramer, IconTypography, IconPalette, IconShadow, IconWindmill, IconLayoutGridAdd, IconMessage } from '@tabler/icons';

// constant
const icons = {
    IconTypography: IconTypography,
    IconPalette: IconPalette,
    IconShadow: IconShadow,
    IconWindmill: IconWindmill,
    IconBrandFramer: IconBrandFramer,
    IconLayoutGridAdd: IconLayoutGridAdd,
    IconChat: IconMessage
};

//-----------------------|| UTILITIES MENU ITEMS ||-----------------------//

export const chat = {
    id: 'chat',
    title: 'Chat',
    type: 'group',
    children: [
        {
            id: 'chat-video',
            title: 'Chat',
            type: 'item',
            url: '/chat',
            icon: icons['IconChat'],
            breadcrumbs: false
        }
    ]
};
