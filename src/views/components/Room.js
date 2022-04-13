import React from 'react'
import axios from 'axios'

import {List,Container, ListItem,ListItemText, ListItemIcon, Avatar, Badge, Typography, Grid } from '@material-ui/core';
import configData from '../../config'
import { makeStyles, styled } from '@material-ui/styles';
import { selectedGridRowsCountSelector } from '@material-ui/data-grid';

const useStyles = makeStyles({
    items: {
        marginLeft:"0.1rem"
    },
    button: {
        "&.active": {
            background:'red'
        }
    },
    badge: {
        marginTop: "0.75rem",
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:"#ff1744",
        borderRadius: "3rem",
        width: "6rem",
        height: "1.5rem",
        
    }

})

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
        content: '""',
        }
    }
  }));
  const StyledBadgeOffline = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
      backgroundColor: "#ef4444",
      color: "#ef4444",
      boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
      '&::after': {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        border: '1px solid currentColor',
        content: '""',
        }
    }
  }));


export default function Room({users, onlineUsers, currentUser, mk}) {
    const [online, setOnline] = React.useState(null)
    const [array, setArray] = React.useState([])
    const [selectedIndex, setSelectedIndex] = React.useState(1)
    const [selectedId, setSelectedId] = React.useState()
    const classes = useStyles()
    React.useEffect(() => {
        onlineUsers && onlineUsers.map(user => {
            if(currentUser._id !== user.userId) {
                handleOnline(user.userId === users._id)
            }
        })
        return () => {
            setOnline(false)
        }
    }, [users, onlineUsers]);

    const handleOnline = (o) => {
        if(o) {
            setOnline(true)
        }
        else {
            setOnline(false)
        }
    }
    const [selectedKey, setSelectedKey] = React.useState(null)
    const handleClick = (e, users, id, index) => {
        setSelectedKey(mk)
        setSelectedIndex(index)
        setSelectedId(id)
        console.log(selectedKey);
        console.log(index);
    }

    return (
        <>
            {
                users && users._id!==currentUser._id && (
                    <ListItem selected={selectedIndex} onClick={(e) => handleClick(e, users._id, mk)} button key={mk} >
                        <ListItemIcon>
                            { online ?
                                <StyledBadgeOnline
                                overlap="circular"
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                variant="dot"
                                >
                                    <Avatar alt={users.first_name} src=" " />
                                </StyledBadgeOnline>
                                :
                                <StyledBadgeOffline
                                overlap="circular"
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                variant="dot"
                                >
                                    <Avatar alt={users.first_name} src=" " />
                                </StyledBadgeOffline>
                            }
                        </ListItemIcon>
                        <Grid container style={{display: 'flex', justifyContent: 'space-between'}}>
                            <Grid>
                                <ListItemText className={classes.items} primary={`${users.first_name} ${users.last_name}`} />
                                <ListItemText className={classes.items}>
                                    <Typography variant="subtitle2">
                                        {users.service.replaceAll('_', ' ')}
                                    </Typography>
                                </ListItemText>                              
                            </Grid>
                            { users && (users.role[0]==="ADMIN" || users.role[0]==="SUPER_ADMIN") && (
                                <div className={classes.badge}>
                                    <Typography variant="subtitle2" color="#dfdfdf">
                                            {users.role[0].replaceAll('_', ' ')}
                                    </Typography> 
                                </div>
                            )} 

                        </Grid>
                        

                    </ListItem>
                )
            }
        </>
    )
}