import React from 'react';
import { Grid, Typography, Button, Container, TextField, Box, Divider } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
const useStyles = makeStyles((theme) => ({
    container: {
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
        border:'1px solid black',
    },
    textfield: {
        width: '100%'
    },
    center: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between'
    },
    profile: {
        width:'60px',
        height:'60px',
        float:'left',
        borderRadius: '50%',
        position:'relative',
        zIndex:111,
        backgroundColor:'white',
        overflow:'hidden',
    },
    btn:{
        marginLeft: '2rem',
        marginRight: '2rem',
        width: '4vw',
        borderRadius:'5rem'
    }
}))


const ProfilePost = ({user}) => {
    const classes = useStyles()
    return (
        <Box sx={{ boxShadow: '0 0 4px 0.8px #999', display: 'grid', gridTemplateRows: '3fr 1fr 7fr', gap:'1vh', padding: '0.25rem', borderRadius:'0.5rem', }} >
            <Box sx={{ display: 'grid', gridTemplateColumns: 'auto auto', padding: '0.25rem', justifyContent:'center'}}>
                <Button className={classes.btn} variant='outlined' color='error'>Image</Button>
                <Button className={classes.btn} variant='outlined' color='error'>Video</Button>
            </Box>
            <Divider />
            <div>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 11fr', gap: '0'}}>
                        <Container>
                        <img src={`/uploads/profilePictures/${user.profilePicture}`} className={classes.profile}/>
                        </Container>
                        <div>
                            <TextField
                                multiline={true}
                                rows={3}
                                // variant="standard"
                                autoComplete="off"
                                id="outlined-basic-email" 
                                label="Type Something" 
                                className={classes.textfield}
                                // InputProps={{
                                //     disableUnderline: true,
                                // }}
                            />
                        </div>
                </Box>
            </div>
            <Divider />
            <div style={{display:'flex', justifyContent:'flex-end', padding: '0.25rem'}}>
                <Button className={classes.btn} variant='contained' color='primary'>POST</Button>
            </div>
        </Box>
    );
}

export default ProfilePost;
