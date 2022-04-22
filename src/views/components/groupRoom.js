import React from 'react'
import axios from 'axios'

import {List,Container,CircularProgress, ListItem,ListItemText, ListItemIcon, Avatar, Badge, Typography, Grid, Menu, MenuItem, Divider, Button } from '@material-ui/core';
import configData from '../../config'
import { makeStyles, styled } from '@material-ui/styles';
import { selectedGridRowsCountSelector } from '@material-ui/data-grid';
import GetAppTwoToneIcon from '@material-ui/icons/GetAppOutlined';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import Card from './Card/Card';
import { Close, PersonAdd } from '@material-ui/icons';


const useStyles = makeStyles(theme => ({
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

}))

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


export default function GroupRoom({group, listKey}) {
    const classes = useStyles()

    React.useEffect(()=>{
        // setLoading(false)
        // console.log(group);
        // console.log(listKey);
    }, [group])

    return (
        <Grid item key={listKey}>
            <ListItem button key={listKey}>
                <ListItemIcon>
                    <Avatar alt={group.name} src=" " />
                </ListItemIcon>
                <ListItemText className={classes.items} primary={group.name} />
            </ListItem>
        </Grid>
    )
}