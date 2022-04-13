import React from 'react';

// material-ui
import { Typography } from '@material-ui/core';

// project imports
import NavGroup from './NavGroup';
import menuItem from './../../../../menu-items';
import { useSelector } from 'react-redux';

//-----------------------|| SIDEBAR MENU LIST ||-----------------------//

const MenuList = () => {
    const {user} = useSelector(s => s.account)
    const navItems = menuItem.items.map((item) => {
        if(item.id==='management' && user && user.role.includes('USER')) return ""
        
        switch (item.type) {
            case 'group':
                return <NavGroup key={item.id} item={item} />;
            default:
                return (
                    <Typography key={item.id} variant="h6" color="error" align="center">
                        Menu Items Error
                    </Typography>
                );
        }
    });

    return navItems;
};

export default MenuList;
