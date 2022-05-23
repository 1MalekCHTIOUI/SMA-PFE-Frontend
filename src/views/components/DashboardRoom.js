import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid, Typography, Avatar, List, ListItem, ListItemIcon, ListItemText, Button } from '@material-ui/core';
import { useHistory } from 'react-router';
import config from '../../config';
const useStyles = makeStyles((theme) => ({
    content: {
        padding: '20px !important'
    },
    carousel: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        minHeight: '6.8rem',
        position: 'relative'
    },
    item: {
        marginLeft: '10px',
        marginRight: '10px'
    },
    container: {
        position: 'relative',
        padding: '0.75rem',
        borderRadius: '2px',
        '&:hover': {
            backgroundColor: 'rgba(0,0,0,0.05)',
            cursor: 'pointer'
        }
    }
}));

const DashboardRoom = ({ item }) => {
    const classes = useStyles();
    const [isHovering, setIsHovering] = React.useState(false);
    const history = useHistory();
    const handleMouseOver = () => {
        setIsHovering(true);
    };

    const handleMouseOut = () => {
        setIsHovering(false);
    };

    const handleClick = (id) => {
        history.push('/profile/' + id);
    };
    return (
        <Grid
            container
            onClick={() => handleClick(item._id)}
            alignItems="center"
            justifyContent="center"
            className={classes.container}
            onMouseEnter={handleMouseOver}
            onMouseLeave={handleMouseOut}
            direction="column"
        >
            <Grid item>
                <ListItemIcon>
                    <Avatar alt={item.first_name} src={config.HOST + `public/uploads/${item.profilePicture}`} />
                </ListItemIcon>
            </Grid>
            <Grid item>
                <Typography className={classes.item} style={{ fontWeight: 500 }}>
                    {item.first_name} {item.last_name}
                </Typography>
            </Grid>
            {/* {isHovering && <Button variant={outl} style={{position:'absolute', top: '25%', right: '25%'}} color='error'>Test</Button>} */}
        </Grid>
    );
};

export default DashboardRoom;
