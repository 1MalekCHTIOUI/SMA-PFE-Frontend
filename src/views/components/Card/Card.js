import { Box, Container, Fade, Grid, Modal, Typography } from '@material-ui/core';
import {Facebook, GitHub, LinkedIn, AdminPanelSettings, Work, Close, Verified, CloudQueue, CloudOff} from '@material-ui/icons';
import React from 'react';
import moment from 'moment'
import { makeStyles } from '@material-ui/styles';
import {capitalizeFirstLetter, replaceDash} from '../../../utils/scripts'; 
import { Link } from 'react-router-dom';
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: '',
    border: 'none',
    outline:'none',
    p: 4,
};

const useStyles = makeStyles(theme => ({

}))

const Card = ({fullname, users, showCard, setShowCard, online}) => {
    const classes = useStyles()

    const redirect = (val) => {
        window.location.href = `https://${val}`
    }
    return (
        <Modal style={{outline: "none"}}
            open={showCard}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            >

            <Fade in={showCard}>
            <Box sx={style}>
            <Close style={{cursor:"pointer", color:"white"}} onClick={() => setShowCard(false)}/>
            <div className="outer-div">
                <div className="inner-div">
                    <div className="front">
                    <div className="front__bkg-photo"></div>
                    <div className="front__face-photo"></div>
                    <div className="front__text">
                        <h3 className="front__text-header">{fullname}</h3>
                        <p className="front__text-para"><Work className="front-icons" />{capitalizeFirstLetter(users.service)}</p>
                        <p className="front__text-para"><Verified className="front-icons" />Joined: {moment(users.createdAt).format("D MMM YYYY")}</p>
                        {users.role[0]!=="USER" && <p className="front__text-para"><AdminPanelSettings className="front-icons" />{capitalizeFirstLetter(users?.role[0])}</p>}
                        {online && <p className="front__text-status" > <CloudQueue style={{color:"#00C853"}} className="front-icons"/> Online</p> }
                        {!online && <p className="front__text-status" style={{color:"#F44336"}}> <CloudOff style={{color:"#F44336"}} className="front-icons"/> Offline</p> }
                        <span className="front__text-hover">Social media</span>
                    </div>
                    </div>
                    <div className="back">
                        <div className="social-media-wrapper">
                            {users.social.github && <a component={Link} target="_blank" href={`https://${users.social.github}`} className="social-icon"><GitHub /></a>}
                            {users.social.linkedin && <a component={Link} target="_blank" href={`https://${users.social.linkedin}`} className="social-icon"><LinkedIn /></a>}
                            {users.social.facebook && <a component={Link} target="_blank" href={`https://${users.social.facebook}`} className="social-icon"><Facebook /></a>}
                            {users.social.facebook==='' && users.social.linkedin==='' && users.social.github==='' && <Typography variant='overline' color="white">No social links..</Typography>}
                        </div>
                    </div>

                </div>
            </div>

            </Box>
            </Fade>
            </Modal>

    )
}

export default Card;
