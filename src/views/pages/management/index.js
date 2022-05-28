import React from 'react';
import axios from 'axios';
import { Link as RouterLink } from 'react-router-dom';
import PerfectScrollbar from 'react-perfect-scrollbar';

import {
    Grid,
    Container,
    Typography,
    Divider,
    List,
    Button,
    Collapse,
    ListItem,
    Alert,
    AlertTitle,
    ListItemButton,
    ListItemText,
    ListItemIcon
} from '@material-ui/core';
import Usertable from '../../components/UserTable';
import { PersonOff } from '@material-ui/icons';
import configData from '../../../config';
import MainCard from '../../../ui-component/cards/MainCard';
import { useSelector } from 'react-redux';
import ConfirmDialog from '../../components/ConfirmDialog';

const Management = () => {
    const [users, setUsers] = React.useState([]);
    const [isEdited, setIsEdited] = React.useState(null);
    const [isDeleted, setIsDeleted] = React.useState(null);
    const [usersLoading, setUsersLoading] = React.useState(false);
    const [usersToDelete, setUsersToDelete] = React.useState([]);

    React.useEffect(() => {
        const fetchUsers = async () => {
            try {
                setUsersLoading(true);
                const res = await axios.get(configData.API_SERVER + 'user/users');
                setUsers(res.data);
                setUsersLoading(false);
            } catch (e) {
                setUsersLoading(false);
                console.log(e);
            }
        };
        fetchUsers();
    }, []);

    const account = useSelector((s) => s.account);
    const [show, setShow] = React.useState(false);
    const [deleted, setDeleted] = React.useState(false);

    const handleDeleteSelectedUsers = () => {
        if (usersToDelete.length === 0) return;
        usersToDelete.map(async (item) => {
            try {
                const id = item._id;
                await axios.delete(configData.API_SERVER + 'user/users/' + item._id);
                window.location.reload();
                console.log(users.filter((user) => user._id !== id));
                setUsers(users.filter((user) => user._id !== id));
                setUsersToDelete([]);
                setDeleted(true);
            } catch (error) {
                setDeleted(false);
                console.log(error);
            }
        });
    };

    React.useEffect(() => {
        const fetchUsers = async () => {
            try {
                if (isEdited === true) {
                    const res = await axios.get(configData.API_SERVER + 'user/users');
                    setUsers(res.data);
                }
                if (isDeleted) {
                    setUsers((users) => users.filter((user) => user._id !== isDeleted._id));
                    console.log(users);
                }
            } catch (e) {
                console.log(e);
            }
        };
        fetchUsers();
    }, [isEdited, isDeleted]);

    return (
        <MainCard title="User management">
            <ConfirmDialog title="Please confirm" open={show} setOpen={setShow} onConfirm={handleDeleteSelectedUsers}>
                <Typography align="center">Are you sure you want to delete these users?</Typography>
            </ConfirmDialog>

            {deleted && (
                <Alert style={{ textAlign: 'center' }} severity="success">
                    <AlertTitle>Success</AlertTitle>
                    Users successfully deleted!
                </Alert>
            )}
            {account.user.role[0] === 'SUPER_ADMIN' && (
                <Grid item xs={12}>
                    <Grid container direction="column" alignItems="center" sx={{ marginBottom: '1rem' }}>
                        <Typography variant="subtitle1" gutterBottom component={RouterLink} to="/register" sx={{ textDecoration: 'none' }}>
                            Create an account
                        </Typography>
                    </Grid>
                </Grid>
            )}

            <Grid
                container
                style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginBottom: '5rem' }}
            >
                <Collapse orientation="vertical" in={usersToDelete.length > 0}>
                    <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }} aria-label="contacts">
                        <PerfectScrollbar component="div" style={{ maxHeight: '20vh', marginBottom: '2rem' }}>
                            {usersToDelete?.map((item) => (
                                <ListItem disablePadding>
                                    <ListItemButton>
                                        <ListItemIcon>
                                            <PersonOff />
                                        </ListItemIcon>
                                        <ListItemText primary={item.first_name + ' ' + item.last_name} />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </PerfectScrollbar>
                        <Button variant="contained" color="error" style={{ marginLeft: '0.4rem' }} onClick={() => setShow(true)}>
                            Delete selected users
                        </Button>
                    </List>
                </Collapse>
                <Usertable
                    usersLoading={usersLoading}
                    setUsersToDelete={setUsersToDelete}
                    data={users}
                    setIsEdited={setIsEdited}
                    setIsDeleted={setIsDeleted}
                />
            </Grid>
        </MainCard>
    );
};

export default Management;
