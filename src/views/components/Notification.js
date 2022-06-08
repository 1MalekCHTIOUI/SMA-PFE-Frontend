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
import { format } from 'timeago.js';
// assets
import { IconBrandTelegram, IconBuildingStore, IconMailbox, IconPhoto } from '@tabler/icons';
import User1 from './../../assets/images/users/user-round.svg';

// style constant
const useStyles = makeStyles((theme) => ({
    navContainer: {
        width: '100%',
        maxWidth: '330px',
        paddingTop: 0,
        paddingBottom: 0,
        borderRadius: '10px',
        [theme.breakpoints.down('sm')]: {
            maxWidth: '300px'
        }
    },
    listAction: {
        top: '22px'
    },
    actionColor: {
        color: theme.palette.grey[500]
    },
    listItem: {
        padding: 0
    },
    sendIcon: {
        marginLeft: '8px',
        marginTop: '-3px'
    },
    listChipError: {
        color: theme.palette.orange.dark,
        backgroundColor: theme.palette.orange.light,
        height: '24px',
        padding: '0 6px',
        marginRight: '5px'
    },
    listChipWarning: {
        color: theme.palette.warning.dark,
        backgroundColor: theme.palette.warning.light,
        height: '24px',
        padding: '0 6px'
    },
    listChipSuccess: {
        color: theme.palette.success.dark,
        backgroundColor: theme.palette.success.light,
        height: '24px',
        padding: '0 6px'
    },
    listAvatarSuccess: {
        color: theme.palette.success.dark,
        backgroundColor: theme.palette.success.light,
        border: 'none',
        borderColor: theme.palette.success.main
    },
    listAvatarPrimary: {
        color: theme.palette.primary.dark,
        backgroundColor: theme.palette.primary.light,
        border: 'none',
        borderColor: theme.palette.primary.main
    },
    listContainer: {
        paddingLeft: '56px'
    },
    uploadCard: {
        backgroundColor: theme.palette.secondary.light
    },
    paddingBottom: {
        paddingBottom: '16px'
    },
    itemAction: {
        cursor: 'pointer',
        padding: '10px',
        '&:hover': {
            background: theme.palette.primary.light
        }
    },
    unread: {
        background: 'rgba(0,0,0,0.05)'
    },
    listDivider: {
        background: 'grey',
        height: '0.05rem'
    }
}));

const Notification = ({ unreadNotification, readNotifs, notif }) => {
    const classes = useStyles();
    const [isRead, setIsRead] = React.useState(notif.read);
    React.useEffect(() => {
        if (readNotifs) {
            setIsRead(true);
        }
    }, [readNotifs]);
    return (
        <div className={`${classes.itemAction} ${isRead === false && classes.unread}`}>
            <ListItem alignItems="center" className={classes.listItem}>
                <ListItemAvatar>
                    <Avatar className={classes.listAvatarSuccess}>
                        <IconBuildingStore stroke={1.5} size="1.3rem" />
                    </Avatar>
                </ListItemAvatar>
                <Grid direction="row">
                    <ListItemText primary={<Typography variant="subtitle1">{notif.title}</Typography>} />
                    <ListItemText primary={<Typography variant="caption">{notif.username}</Typography>} />
                </Grid>
                <ListItemSecondaryAction className={classes.listAction}>
                    <Grid container justifyContent="flex-end">
                        <Grid item xs={12}>
                            <Typography variant="caption" display="block" gutterBottom className={classes.actionColor}>
                                {format(notif.createdAt)}
                            </Typography>
                        </Grid>
                    </Grid>
                </ListItemSecondaryAction>
            </ListItem>
            <Grid container direction="column" className={classes.listContainer}>
                <Grid item xs={12} className={classes.paddingBottom}>
                    <Typography variant="subtitle2">{notif.content}</Typography>
                </Grid>
                <Grid item xs={12}>
                    <Grid container>
                        <Grid item>
                            {notif.read === false && (
                                <Chip
                                    label="Read"
                                    className={classes.listChipError}
                                    onClick={() => {
                                        unreadNotification(notif._id);
                                        setIsRead(true);
                                    }}
                                />
                            )}
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </div>
    );
};

export default Notification;
