import React from 'react';

// material-ui
import { makeStyles } from '@material-ui/styles';
import {
    Avatar,
    Button,
    Card,
    CardContent,
    Chip,
    Divider,
    Grid,
    List,
    ListItem,
    ListItemAvatar,
    ListItemSecondaryAction,
    ListItemText,
    Stack,
    Typography
} from '@material-ui/core';

// assets
import { IconBrandTelegram, IconBuildingStore, IconMailbox, IconPhoto } from '@tabler/icons';
import User1 from './../../../../assets/images/users/user-round.svg';
import Notification from '../../../../views/components/Notification';
import { useSelector } from 'react-redux';
import axios from 'axios';
import config from '../../../../config';

// style constant
const useStyles = makeStyles((theme) => ({
    navContainer: {
        width: '30vw',
        maxWidth: '330px',
        paddingTop: 0,
        paddingBottom: 0,
        borderRadius: '10px',
        [theme.breakpoints.down('sm')]: {
            maxWidth: '300px'
        }
    },
    listDivider: {
        marginTop: 0,
        marginBottom: 0
    },
    gutter: {
        marginBottom: '1rem'
    }


}));

//-----------------------|| NOTIFICATION LIST ITEM ||-----------------------//

const NotificationList = ({setNotifLength, notifs}) => {
    const classes = useStyles();
    const account = useSelector(s=> s.account)

    const unreadNotification = async (notifId) => {
        try {
            await axios.put(config.API_SERVER+'notifications/'+notifId)
            setNotifLength(prev => prev-1)
        }catch(e) {console.log(e);}
    }

    

    return (
        <List className={classes.navContainer}>
            {
                notifs?.map((notif)=>(
                    <Notification unreadNotification={unreadNotification} notif={notif} username={account?.user.first_name+" "+account?.user.last_name}/>
                ))
            }
            {
                notifs?.length === 0 && <Typography align="center" className={classes.gutter} variant="subtitle2">No notifications</Typography>
            }
            <Divider className={classes.listDivider} />

        </List>
    );
};

export default NotificationList;
