import React from 'react'
import axios from 'axios'

import {List, ListItem,ListItemText, ListItemIcon, Avatar, Typography } from '@material-ui/core';
import configData from '../../config'
import { makeStyles } from '@material-ui/styles';
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

export default function Room({users, currentUser}) {
    const [user, setUser] = React.useState(null)
    const [array, setArray] = React.useState([])
    const [selected, setSelected] = React.useState(false)
    const [selectedId, setSelectedId] = React.useState()

    const classes = useStyles()

    React.useEffect(() => {
        console.log(selectedId);
    }, [selectedId]);


    return (
        <>
            {
                users && users._id!==currentUser._id && (
                    <ListItem selected={ selectedId === users._id ? true : false} onClick={()=>setSelectedId(users._id)} button key={users.first_name} >
                        <ListItemIcon>
                            <Avatar alt={users.first_name} src="https://material-ui.com/static/images/avatar/1.jpg" />
                        </ListItemIcon>
                        <ListItemText className={classes.items} primary={`${users.first_name} ${users.last_name}`} />
                        <ListItemText secondary="online" align="right" />
                    </ListItem>
                )
            }
        </>
    )
}