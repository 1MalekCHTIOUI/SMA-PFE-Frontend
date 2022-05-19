import React from 'react';
import { Grid, Typography, Button, Container, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import {Work, CalendarToday} from '@material-ui/icons';
import moment from 'moment'
import MainCard from './../../../ui-component/cards/MainCard';
import {replaceDash, capitalizeFirstLetter} from '../../../utils/scripts'
const useStyles = makeStyles((theme) => ({
    sidebar: {
        // background: 'linear-gradient(45deg, lightblue, white,lightblue)',
        // border: '2px solid gray',
        // padding: '20px'
    },
    center: {
        display:'flex',
        alignItems:'center'
    },
    item: {
        color: 'black', fontSize: '12px', fontWeight:'bold'
    }
}))

const ProfileSidebar = ({user}) => {
    const classes = useStyles()
    return (
        <MainCard title='Information' className={classes.sidebar}>
            <List>
                <ListItemText>
                <Typography variant="h6" className={[classes.center, classes.item]}>

                        <CalendarToday />
                        <div style={{marginLeft: '0.75vw'}}>
                            {moment(user.createdAt).format("D MMM YYYY")}
                        </div>
                    </Typography>
                </ListItemText> 
                <ListItemText>
                    <Typography variant="subtitle2" className={[classes.center, classes.item]}>
                        <Work />
                        <div style={{marginLeft: '0.75vw'}}>
                        {capitalizeFirstLetter(user.service)}
                        </div>
                    </Typography>
                </ListItemText> 
            </List>
        </MainCard>
    );
}

export default ProfileSidebar;
