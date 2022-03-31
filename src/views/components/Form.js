import React, { useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';

import configData from '../../config';

// material-ui
import { makeStyles } from '@material-ui/styles';
import {
    Box,
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    FormHelperText,
    Grid,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    TextField,
    Typography,
    useMediaQuery,
    Select,
    MenuItem,
} from '@material-ui/core';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';
import axios from 'axios';

// project imports
import useScriptRef from '../../hooks/useScriptRef';
import AnimateButton from './../../ui-component/extended/AnimateButton';
// import { strengthColor, strengthIndicator } from '../../../../utils/password-strength';

// assets
// import Visibility from '@material-ui/icons/Visibility';
// import VisibilityOff from '@material-ui/icons/VisibilityOff';

// style constant
const useStyles = makeStyles((theme) => ({
    redButton: {
        fontSize: '1rem',
        fontWeight: 500,
        backgroundColor: theme.palette.grey[50],
        border: '1px solid',
        borderColor: theme.palette.grey[100],
        color: theme.palette.grey[700],
        textTransform: 'none',
        '&:hover': {
            backgroundColor: theme.palette.primary.light
        },
        [theme.breakpoints.down('sm')]: {
            fontSize: '0.875rem'
        }
    },
    signDivider: {
        flexGrow: 1
    },
    signText: {
        cursor: 'unset',
        margin: theme.spacing(2),
        padding: '5px 56px',
        borderColor: theme.palette.grey[100] + ' !important',
        color: theme.palette.grey[900] + '!important',
        fontWeight: 500
    },
    loginIcon: {
        marginRight: '16px',
        [theme.breakpoints.down('sm')]: {
            marginRight: '8px'
        }
    },
    loginInput: {
        ...theme.typography.customInput
    }
}));

//===========================|| API JWT - REGISTER ||===========================//

const Form = ({user, setIsEditing, setIs, setEditedUser, ...others }) => {
    const classes = useStyles();
    let history = useHistory();
    const scriptedRef = useScriptRef();
    const matchDownSM = useMediaQuery((theme) => theme.breakpoints.down('sm'));

    return (
        <React.Fragment>
            <Formik
                initialValues={{
                    firstName: user? user.first_name :'',
                    lastName: user? user.last_name :'',
                    email: user? user.email :'',
                    role: user? user.role :'',
                    submit: null
                }}
                validationSchema={Yup.object().shape({
                    email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
                    firstName: Yup.string().required('First name is required'),
                    lastName: Yup.string().required('Last name is required'),
                    role: Yup.string().required('Role is required'),
                })}
                onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                    try {
                        try {
                            const updatedUser = {
                                _id: user._id,
                                first_name: values.firstName,
                                last_name: values.lastName,
                                email: values.email,
                                role: values.role,
                            }
                            const res = await axios.put( configData.API_SERVER + 'user/users/'+user._id, updatedUser)
                            setIsEditing(false)
                            setEditedUser(updatedUser)
                            setIs(true)
                            history.push("/management")
                        }catch(e) {
                            setStatus({ success: false });
                            setErrors({ submit: e.response.data.message });
                            setSubmitting(false);
                            setIs(false)
                        }
                    } catch (err) {
                        console.error(err);
                        if (scriptedRef.current) {
                            setStatus({ success: false });
                            setErrors({ submit: err.message });
                            setSubmitting(false);
                            setIs(false)
                        }
                    }
                }}
            >
                {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                    <form noValidate onSubmit={handleSubmit} {...others}>
                        <Grid container spacing={matchDownSM ? 0 : 2}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="First name"
                                    margin="normal"
                                    name="firstName"
                                    id="firstName"
                                    type="text"
                                    value={values.firstName}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    className={classes.loginInput}
                                    error={touched.firstName && Boolean(errors.firstName)}
                                />
                                {touched.firstName && errors.firstName && (
                                    <FormHelperText error id="standard-weight-helper-text--register">
                                        {errors.firstName}
                                    </FormHelperText>
                                )}
                            </Grid>
                        </Grid>
                        <Grid container spacing={matchDownSM ? 0 : 2}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Last name"
                                    margin="normal"
                                    name="lastName"
                                    id="lastName"
                                    type="text"
                                    value={values.lastName}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    className={classes.loginInput}
                                    error={touched.lastName && Boolean(errors.lastName)}
                                />
                                {touched.lastName && errors.lastName && (
                                    <FormHelperText error id="standard-weight-helper-text--register">
                                        {errors.lastName}
                                    </FormHelperText>
                                )}
                            </Grid>
                        </Grid>
                        <FormControl fullWidth error={Boolean(touched.email && errors.email)} className={classes.loginInput}>
                            <InputLabel htmlFor="outlined-adornment-email-register">Email</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-email-register"
                                type="email"
                                value={values.email}
                                name="email"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                inputProps={{
                                    classes: {
                                        notchedOutline: classes.notchedOutline
                                    }
                                }}
                            />
                            {touched.email && errors.email && (
                                <FormHelperText error id="standard-weight-helper-text--register">
                                    {' '}
                                    {errors.email}{' '}
                                </FormHelperText>
                            )}
                        </FormControl>

                        <FormControl fullWidth>
                            <InputLabel id="role">Role</InputLabel>
                            
                            <Select
                                fullWidth
                                label="Role"
                                name="role"
                                id="role"
                                type="text"
                                value={values.role}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                className={classes.loginInput}
                                error={touched.role && Boolean(errors.role)}
                            >                        
                                <MenuItem value="ADMIN">Admin</MenuItem>
                                <MenuItem value="USER">User</MenuItem>
                            </Select>
                                {touched.role && errors.role && (
                                    <FormHelperText error id="standard-weight-helper-text--register">
                                        {errors.role}
                                    </FormHelperText>
                                )}    
                        </FormControl>
                        {errors.submit && (
                            <Box
                                sx={{
                                    mt: 3
                                }}
                            >
                                <FormHelperText error>{errors.submit}</FormHelperText>
                            </Box>
                        )}

                        <Box
                            sx={{
                                mt: 2
                            }}
                        >
                            <AnimateButton>
                                <Button
                                    disableElevation
                                    disabled={isSubmitting}
                                    fullWidth
                                    size="large"
                                    type="submit"
                                    variant="contained"
                                    color="secondary"
                                >
                                    Apply
                                </Button>
                            </AnimateButton>
                        </Box>
                    </form>
                )}
            </Formik>
        </React.Fragment>
    );
};

export default Form;
