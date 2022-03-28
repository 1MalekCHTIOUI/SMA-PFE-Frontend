// assets
import { IconBrandFramer, IconTypography, IconPalette, IconShadow, IconWindmill, IconLayoutGridAdd, IconMessage, IconUsers } from '@tabler/icons';

// constant
const icons = {
    IconTypography: IconTypography,
    IconPalette: IconPalette,
    IconShadow: IconShadow,
    IconWindmill: IconWindmill,
    IconBrandFramer: IconBrandFramer,
    IconLayoutGridAdd: IconLayoutGridAdd,
    IconChat: IconMessage,
    IconUsers: IconUsers,
};

//-----------------------|| UTILITIES MENU ITEMS ||-----------------------//

export const management = {
    id: 'management',
    title: 'Management',
    type: 'group',
    children: [
        {
            id: 'manage-users',
            title: 'Users',
            type: 'item',
            url: '/management',
            icon: icons['IconUsers'],
            breadcrumbs: false
        }
    ]
};
