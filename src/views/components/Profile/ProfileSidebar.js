import React from 'react';
import { Grid, Typography, Button, Container, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { Work, CalendarToday, LinkedIn, GitHub, Facebook } from '@material-ui/icons';
import moment from 'moment';
import MainCard from './../../../ui-component/cards/MainCard';
import { replaceDash, capitalizeFirstLetter } from '../../../utils/scripts';
import { Link } from 'react-router-dom';
const useStyles = makeStyles((theme) => ({
    sidebar: {
        // background: 'linear-gradient(45deg, lightblue, white,lightblue)',
        // border: '2px solid gray',
        // padding: '20px'
        width: '100%',
        height: '100%',
        marginBottom: '28px'
    },
    center: {
        display: 'flex',
        alignItems: 'center'
    },
    item: {
        display: 'flex',
        alignItems: 'center',
        color: 'black',
        fontSize: '12px',
        fontWeight: 'bold'
    }
}));

const ProfileSidebar = ({ user }) => {
    const classes = useStyles();
    console.log(user);
    return (
        <Container>
            <MainCard title="Information" className={classes.sidebar}>
                <List>
                    <ListItemText>
                        <Typography variant="h6" className={classes.item}>
                            <CalendarToday />
                            <div style={{ marginLeft: '0.75vw' }}>{moment(user.createdAt).format('D MMM YYYY')}</div>
                        </Typography>
                    </ListItemText>
                    <ListItemText>
                        <Typography variant="subtitle2" className={classes.item}>
                            <Work />
                            <div style={{ marginLeft: '0.75vw' }}>{capitalizeFirstLetter(user.service)}</div>
                        </Typography>
                    </ListItemText>

                    {user.social?.linkedin !== '' && (
                        <ListItemText>
                            {/* <Typography variant="subtitle2" className={classes.item}>
                                <LinkedIn />
                                <div style={{ marginLeft: '0.75vw' }}>{user?.social.linkedin}</div>
                            </Typography> */}
                            <a component={Link} href={user?.social?.linkedin} target="_blank" className={classes.item}>
                                <LinkedIn />
                                <div style={{ marginLeft: '0.75vw' }}>{user?.social?.linkedin}</div>
                            </a>
                        </ListItemText>
                    )}
                    {user.social?.facebook !== '' && (
                        <ListItemText>
                            <a component={Link} href={user?.social?.facebook} target="_blank" className={classes.item}>
                                <Facebook />
                                <div style={{ marginLeft: '0.75vw' }}>{user?.social?.facebook}</div>
                            </a>
                            {/* <Typography variant="subtitle2">
                                
                            </Typography>
                            <a component={Link} href={user?.social.facebook} target="_blank"> */}
                        </ListItemText>
                    )}
                    {user.social?.github !== '' && (
                        <ListItemText>
                            <a component={Link} href={user?.social?.github} target="_blank" className={classes.item}>
                                <GitHub />
                                <div style={{ marginLeft: '0.75vw' }}>{user?.social?.github}</div>
                            </a>
                        </ListItemText>
                    )}
                </List>
            </MainCard>
        </Container>
    );
};

export default ProfileSidebar;
