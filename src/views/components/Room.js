import React from 'react';
import axios from 'axios';

import {
    List,
    Container,
    CircularProgress,
    ListItem,
    ListItemText,
    ListItemIcon,
    Avatar,
    Badge,
    Typography,
    Grid,
    Menu,
    MenuItem,
    Divider,
    Button
} from '@material-ui/core';
import config from '../../config';
import { makeStyles, styled } from '@material-ui/styles';
import { selectedGridRowsCountSelector } from '@material-ui/data-grid';
import GetAppTwoToneIcon from '@material-ui/icons/GetAppOutlined';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import Card from './Card/Card';
import { Close, PersonAdd } from '@material-ui/icons';
import { useHistory } from 'react-router-dom';
import { IconUser } from '@tabler/icons';

const useStyles = makeStyles((theme) => ({
    items: {
        marginLeft: '0.1rem'
    },
    button: {
        '&.active': {
            background: 'red'
        }
    },
    badge: {
        marginTop: '0.75rem',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ff1744',
        borderRadius: '3rem',
        width: '6rem',
        height: '1.5rem'
    },
    avatarRight: {
        ...theme.typography.commonAvatar,
        ...theme.typography.mediumAvatar,
        backgroundColor: theme.palette.secondary.light,
        color: theme.palette.secondary[200],
        zIndex: 1
    },
    menuItem: {
        marginRight: '14px',
        fontSize: '1.25rem'
    }
}));

const StyledBadgeOnline = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
        backgroundColor: '#44b700',
        color: '#44b700',
        boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
        '&::after': {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            border: '1px solid currentColor',
            content: '""'
        }
    }
}));
const StyledBadgeOffline = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
        backgroundColor: '#ef4444',
        color: '#ef4444',
        boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
        '&::after': {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            border: '1px solid currentColor',
            content: '""'
        }
    }
}));

export default function Room({ users, roomsLoading, onlineUsers, currentUser, mk, group }) {
    const [online, setOnline] = React.useState(false);
    const [isHovering, setIsHovering] = React.useState(false);
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const history = useHistory();
    const handleClick = (event) => {
        event.preventDefault();
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    React.useEffect(() => {
        !group &&
            onlineUsers &&
            onlineUsers.map((user) => {
                if (users._id === user.userId) {
                    console.log(users.first_name + ' is online');
                    setOnline(true);
                } else {
                    setOnline(false);
                }
            });
        // return () => {
        //     setOnline(false);
        // };
    }, [onlineUsers]);

    const handleOnline = (o) => {
        if (o) {
            setOnline(true);
        } else {
            setOnline(false);
        }
    };

    const handleMouseOver = () => {
        setIsHovering(true);
    };

    const handleMouseOut = () => {
        setIsHovering(false);
    };
    const [showCard, setShowCard] = React.useState(false);
    const showProfile = (e) => {
        history.push('/profile/' + users._id);
    };
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        setLoading(false);
    }, [group]);

    return (
        <>
            {group && (
                <Grid item>
                    <ListItem button key={mk}>
                        <ListItemIcon>
                            <Avatar alt={group.name} src=" " />
                            {/* <Avatar alt={group.name} src={`/public/uploads/${group.profilePicture}`} /> */}
                        </ListItemIcon>
                        <ListItemText className={classes.items}>
                            <Typography style={{ fontWeight: 500 }}>{group.name}</Typography>
                        </ListItemText>
                    </ListItem>
                </Grid>
            )}
            {roomsLoading && <CircularProgress />}
            {users && users._id !== currentUser._id && (
                <Grid
                    direction="row"
                    style={{ display: 'flex', position: 'relative' }}
                    onMouseEnter={handleMouseOver}
                    onMouseLeave={handleMouseOut}
                >
                    {/* <Grid direction="row" style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Card
                            fullname={`${users.first_name} ${users.last_name}`}
                            setShowCard={setShowCard}
                            showCard={showCard}
                            users={users}
                            online={online}
                        />
                    </Grid> */}
                    <Grid item xs={12}>
                        <ListItem button key={mk}>
                            <ListItemIcon>
                                {!group && onlineUsers && onlineUsers.some((u) => u.userId === users._id) ? (
                                    <StyledBadgeOnline
                                        overlap="circular"
                                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                        variant="dot"
                                    >
                                        <Avatar alt={users.first_name} src={config.CONTENT + users.profilePicture} />
                                    </StyledBadgeOnline>
                                ) : (
                                    <StyledBadgeOffline
                                        overlap="circular"
                                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                        variant="dot"
                                    >
                                        <Avatar alt={users.first_name} src={config.CONTENT + users.profilePicture} />
                                    </StyledBadgeOffline>
                                )}
                                {/* {online ? (
                                    <StyledBadgeOnline
                                        overlap="circular"
                                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                        variant="dot"
                                    >
                                        <Avatar alt={users.first_name} src={config.CONTENT + users.profilePicture} />
                                    </StyledBadgeOnline>
                                ) : (
                                    <StyledBadgeOffline
                                        overlap="circular"
                                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                        variant="dot"
                                    >
                                        <Avatar alt={users.first_name} src={config.CONTENT + users.profilePicture} />
                                    </StyledBadgeOffline>
                                )} */}
                            </ListItemIcon>
                            <Grid container direction="row" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Grid item>
                                    <ListItemText className={classes.items}>
                                        <Typography style={{ fontWeight: 500 }}>{users.first_name + ' ' + users.last_name}</Typography>
                                    </ListItemText>
                                    <ListItemText className={classes.items}>
                                        <Typography variant="subtitle2">{users.service.replaceAll('_', ' ')}</Typography>
                                    </ListItemText>
                                </Grid>
                                <Grid item>
                                    {users && (users.role[0] === 'ADMIN' || users.role[0] === 'SUPER_ADMIN') && (
                                        <div className={classes.badge}>
                                            <Typography variant="subtitle2" color="#dfdfdf">
                                                {users.role[0].replaceAll('_', ' ')}
                                            </Typography>
                                        </div>
                                    )}
                                </Grid>
                            </Grid>
                        </ListItem>
                    </Grid>
                    <Grid item style={{ position: 'absolute', right: '3px' }}>
                        {isHovering && (
                            <Avatar
                                variant="rounded"
                                className={classes.avatarRight}
                                aria-haspopup="true"
                                size="small"
                                sx={{ ml: 2 }}
                                aria-controls={open ? 'account-menu' : undefined}
                                aria-expanded={open ? 'true' : undefined}
                                onClick={showProfile}
                            >
                                {/* <MoreHorizIcon fontSize="inherit" /> */}
                                <IconUser stroke={1.5} size="1.3rem" />
                                {/* <Typography>Show profile</Typography> */}
                            </Avatar>
                        )}
                        {/* <Menu
                            anchorEl={anchorEl}
                            id="account-menu"
                            open={open}
                            onClose={handleClose}
                            onClick={handleClick}
                            PaperProps={{
                                elevation: 0,
                                sx: {
                                    overflow: 'visible',
                                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                    mt: 1.5,
                                    '& .MuiAvatar-root': {
                                        width: 32,
                                        height: 32,
                                        ml: -0.5,
                                        mr: 1
                                    },
                                    '&:before': {
                                        content: '""',
                                        display: 'block',
                                        position: 'absolute',
                                        top: 0,
                                        right: 14,
                                        width: 10,
                                        height: 10,
                                        bgcolor: 'background.paper',
                                        transform: 'translateY(-50%) rotate(45deg)',
                                        zIndex: 0
                                    }
                                }
                            }}
                            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                        >
                            <MenuItem onClick={showProfile}>View</MenuItem>
                        </Menu> */}
                    </Grid>
                </Grid>
            )}
        </>
    );
}
