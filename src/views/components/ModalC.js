import React from 'react';
import {Paper, Grid,CircularProgress , Box, Divider, TextField, Typography, List, ListItem, ListItemIcon, ListItemText, Avatar, Fab, Container, MenuItem, Select, FormControl, InputLabel, Button, Modal, Checkbox, OutlinedInput } from '@material-ui/core';
import { Check, FiberManualRecord,CloudQueue,CloudOff } from '@material-ui/icons';
import {SocketContext} from '../../utils/socket/SocketContext'
import { makeStyles } from '@material-ui/styles';
import Card from './Card/Card'
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    border: "none",
    borderRadius: "0.25rem",
    p: 4,
};
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};
const useStyles = makeStyles({
    center: {
        display:"flex",
        justifyContent:"center", 
        alignItems:"center"
    }
})

const ModalC = ({setStatus, status, current, submitAddMember,submitRemoveMember, handleClose, users, onChangeAddedMembers, addedMembers,currentChat, groupMembers, groupName, setGroupName, handleChange, classes, openMenu, setOpenMenu, submitCreateGroup, type}) => {
    // console.log(groupMembers);
    const {onlineUsers} = React.useContext(SocketContext)
    const styles = useStyles()
    const [showCard, setShowCard] = React.useState(false)
    const [online, setOnline] = React.useState(false)
    const [user, setUser] = React.useState({})

    const showProfile = (m) => {
        setUser(m)
        setShowCard(true)
    }

    React.useEffect(()=>{
        console.log(user);
    }, [user])

    React.useEffect(() => {
        if(onlineUsers.includes(user._id)){
            setOnline(true)
        } else {
            setOnline(false)
        }
    }, [onlineUsers])

    const card = () => {
        if(user && showCard) {
            return (
                <Card fullname={`${user?.first_name} ${user?.last_name}`} setShowCard={setShowCard} showCard={showCard} users={user} online={online} />
            )
        }

    }

    return (
        <>
            {card()}
            <Modal
                open={openMenu}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                >
                <Box sx={style}>
                    {
                        type==='create' && (
                            <>
                                <Typography className={classes.spaceBetween} id="modal-modal-title" variant="h6" component="h2">
                                Create a group chat
                                </Typography>

                                <TextField 
                                    id="outlined-basic-email" 
                                    label="Group name" 
                                    variant="outlined"
                                    value={groupName}
                                    onChange={handleChange}
                                    fullWidth />
                                <FormControl sx={{ m: 1, width: 300 }}>
                                <InputLabel id="demo-multiple-checkbox-label">Add</InputLabel>
                                <Select
                                    labelId="demo-multiple-checkbox-label"
                                    id="demo-multiple-checkbox"
                                    multiple
                                    value={addedMembers}
                                    onChange={onChangeAddedMembers}
                                    input={<OutlinedInput label="Add" />}
                                    renderValue={(selected) => selected.map((x) => x.first_name).join(', ')}
                                    MenuProps={MenuProps}
                                    >
                                    {users.map((variant) => (
                                        variant._id!==current && (
                                            <MenuItem key={variant._id} value={variant}>
                                                <Checkbox
                                                    checked={
                                                        addedMembers.findIndex(item => item._id === variant._id) >= 0
                                                    }
                                                />
                                                <ListItemText primary={variant.first_name+" "+variant.last_name} />
                                            </MenuItem>
                                        )                            
                                    ))}
                                </Select>
                            </FormControl>
                            </>
                        )
                    }

                    {
                        type==='add' && (
                            <FormControl sx={{ m: 1, width: 300 }}>
                                <InputLabel id="demo-multiple-checkbox-label">Add</InputLabel>
                                <Select
                                labelId="demo-multiple-checkbox-label"
                                id="demo-multiple-checkbox"
                                multiple
                                value={addedMembers}
                                onChange={onChangeAddedMembers}
                                input={<OutlinedInput label="Add" />}
                                renderValue={(selected) => selected.map((x) => x.first_name).join(', ')}
                                MenuProps={MenuProps}
                                >
                                {
                                    users.map(variant => {
                                        if(groupMembers.some(m => m._id !== variant._id) && variant._id!==current) {
                                            return <MenuItem key={variant._id} value={variant}>
                                                <Checkbox
                                                    checked={
                                                        addedMembers.findIndex(item => item._id === variant._id) >= 0
                                                    }
                                                />
                                                <ListItemText primary={variant.first_name+" "+variant.last_name} />
                                            </MenuItem>
                                        }

                                    })
                                }
                                </Select>
                            </FormControl>
                        )
                    }
                    {
                        type==='remove' && (
                            <>
                            <FormControl sx={{ m: 1, width: 300 }}>
                                <InputLabel id="demo-multiple-checkbox-label">Remove</InputLabel>
                                <Select
                                labelId="demo-multiple-checkbox-label"
                                id="demo-multiple-checkbox"
                                multiple
                                value={addedMembers}
                                onChange={onChangeAddedMembers}
                                input={<OutlinedInput label="Remove" />}
                                renderValue={(selected) => selected.map((x) => x.first_name).join(', ')}
                                MenuProps={MenuProps}
                                >
                                {groupMembers?.map((variant) => (
                                    variant._id!==current && (
                                        <MenuItem key={variant._id} value={variant}>
                                            <Checkbox
                                                checked={
                                                    addedMembers.findIndex(item => item._id === variant._id) >= 0
                                                }
                                            />
                                            <ListItemText primary={variant.first_name+" "+variant.first_name} />
                                        </MenuItem>
                                    )
                                ))}
                                </Select>
                            </FormControl>
                            </>
                        )
                    }
                    {
                        type==='list' && (
                            groupMembers?.map((m, i) => (
                                <List>
                                    <ListItem onClick={() => showProfile(m)} button key={i} className={styles.center}>
                                        <Grid container xs={5} direction="row">
                                            <ListItemText primary={m.first_name+" "+m.last_name} />
                                            {
                                                onlineUsers.some(u => u._id === m._id) ? <CloudQueue style={{color:"#00C853"}} className="front-icons"/> : <CloudOff style={{color:"#F44336"}} className="front-icons"/>
                                            }
                                            
                                        </Grid>

                                    </ListItem>
                                </List>
                            ))
                        )
                    }
                    <Container className={classes.center}>
                        {status===1 && type==='add' && <Typography className={classes.center}><Check /> User(s) added!</Typography>}
                        {status===1 && type==='remove' && <Typography className={classes.center}><Check /> User(s) removed</Typography>}
                        {status===1 && type==='create' && <Typography className={classes.center}><Check /> Room created!</Typography>}
                    </Container>
                    <Container className={classes.spaceBetween}>
                        {type==='create' && <Button variant="contained" color="primary" onClick={submitCreateGroup}>Create group</Button>}
                        {type==='add' && <Button variant="contained" color="primary" onClick={() => {submitAddMember(currentChat, addedMembers); setStatus(1)}}>Add member(s)</Button>}
                        {type==='remove' && <Button variant="contained" color="error" onClick={() => {submitRemoveMember(currentChat, addedMembers); setStatus(1)}}>remove member(s)</Button>}
                        <Button variant="outlined" color="error" onClick={handleClose}>Go back</Button>
                    </Container>
                </Box>
            </Modal>
        </>
    )
}

export default ModalC;
