import React from 'react'
import axios from 'axios'

import {List, ListItem,ListItemText, ListItemIcon, Avatar, Badge } from '@material-ui/core';
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
    const [online, setOnline] = React.useState(false)
    const [array, setArray] = React.useState([])
    const [selectedIndex, setSelectedIndex] = React.useState(0)
    const [selectedId, setSelectedId] = React.useState()

    const classes = useStyles()

    React.useEffect(() => {
        onlineUsers && onlineUsers.map(user => {
            if(user.userId === users._id && currentUser._id !== user.userId) {
                setOnline(true)
            }
        })
    }, [users, onlineUsers]);

    const handleClick = (e, id, index) => {
        setSelectedIndex(index)
        setSelectedId(id)
    }

    return (
        <>
            {
                users && users._id!==currentUser._id && (
                    <ListItem selected={mk === selectedIndex} onClick={(e) => handleClick(e, users._id, mk)} button key={users.first_name} >
                        <ListItemIcon>
                            { online ?
                                <StyledBadgeOnline
                                overlap="circular"
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                variant="dot"
                                >
                                    <Avatar alt="Remy Sharp" src="dsq" />
                                </StyledBadgeOnline>
                                :
                                <StyledBadgeOffline
                                overlap="circular"
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                variant="dot"
                                >
                                    <Avatar alt="Remy Sharp" src="dsq" />
                                </StyledBadgeOffline>
                            }
                        </ListItemIcon>
                        <ListItemText className={classes.items} primary={`${users.first_name} ${users.last_name}`} />
                    </ListItem>
                )
            }
        </>
    )
}