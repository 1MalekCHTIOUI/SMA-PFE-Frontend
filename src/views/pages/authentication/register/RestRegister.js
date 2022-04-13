import React, { useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';

import configData from '../../../../config';

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
import useScriptRef from '../../../../hooks/useScriptRef';
import AnimateButton from './../../../../ui-component/extended/AnimateButton';
import { useSelector } from 'react-redux';
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

const RestRegister = ({ ...others }) => {
    const classes = useStyles();
    let history = useHistory();
    const scriptedRef = useScriptRef();
    const matchDownSM = useMediaQuery((theme) => theme.breakpoints.down('sm'));
    // const [showPassword, setShowPassword] = React.useState(false);
    const [checked, setChecked] = React.useState(true);
    const account = useSelector(s => s.account)
    // const [strength, setStrength] = React.useState(0);
    // const [level, setLevel] = React.useState('');

    // const handleClickShowPassword = () => {
    //     setShowPassword(!showPassword);
    // };

    // const handleMouseDownPassword = (event) => {
    //     event.preventDefault();
    // };

    // const changePassword = (value) => {
    //     const temp = strengthIndicator(value);
    //     setStrength(temp);
    //     setLevel(strengthColor(temp));
    // };

    // useEffect(() => {
    //     changePassword('123456');
    // }, []);

    return (
        <React.Fragment>
            <Formik
                initialValues={{
                    firstName: '',
                    lastName: '',
                    email: '',
                    role:'',
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
                            await axios.post( configData.API_SERVER + 'auth/signup', {
                                first_name: values.firstName,
                                last_name: values.lastName,
                                email: values.email,
                                role: values.role,
                            })
                            history.push('/management');
                        }catch(e) {
                            setStatus({ success: false });
                            setErrors({ submit: e.response.data.message });
                            setSubmitting(false);
                        }
                    } catch (err) {
                        console.error(err);
                        if (scriptedRef.current) {
                            setStatus({ success: false });
                            setErrors({ submit: err.message });
                            setSubmitting(false);
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
                            <InputLabel id="role">Service</InputLabel>
                            
                            <Select
                                fullWidth
                                label="Service"
                                name="service"
                                id="service"
                                type="text"
                                value={values.service}
                                disabled={account.user.role[0] !== "SUPER_ADMIN"}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                className={classes.loginInput}
                                error={touched.service && Boolean(errors.service)}
                            >                        
                                <MenuItem value="HUMAN_RESOURCES">Human resources manager</MenuItem>
                                <MenuItem value="GRAPHIC_DESIGNER">Graphic designer</MenuItem>
                                <MenuItem value="PRODUCT_MANAGER">Product manager</MenuItem>
                                <MenuItem value="MAINTENANCE">Maintenance</MenuItem>
                                <MenuItem value="FULLSTACK_DEVELOPER">Fullstack developer</MenuItem>
                                <MenuItem value="BACKEND_DEVELOPER">Backend developer</MenuItem>
                                <MenuItem value="FRONTEND_DEVELOPER">Frontend developer</MenuItem>
                                <MenuItem value="UX/UI_DESIGNER">UX/UI designer</MenuItem>
                            </Select>
                                {touched.service && errors.service && (
                                    <FormHelperText error id="standard-weight-helper-text--register">
                                        {errors.service}
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

                        {/* <FormControl fullWidth error={Boolean(touched.password && errors.password)} className={classes.loginInput}>
                            <InputLabel htmlFor="outlined-adornment-password-register">Password</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-password-register"
                                type={showPassword ? 'text' : 'password'}
                                value={values.password}
                                name="password"
                                label="Password"
                                onBlur={handleBlur}
                                onChange={(e) => {
                                    handleChange(e);
                                    changePassword(e.target.value);
                                }}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                        >
                                            {showPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                inputProps={{
                                    classes: {
                                        notchedOutline: classes.notchedOutline
                                    }
                                }}
                            />
                            {touched.password && errors.password && (
                                <FormHelperText error id="standard-weight-helper-text-password-register">
                                    {errors.password}
                                </FormHelperText>
                            )}
                        </FormControl>

                        {strength !== 0 && (
                            <FormControl fullWidth>
                                <Box
                                    sx={{
                                        mb: 2
                                    }}
                                >
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid item>
                                            <Box
                                                backgroundColor={level.color}
                                                sx={{
                                                    width: 85,
                                                    height: 8,
                                                    borderRadius: '7px'
                                                }}
                                            ></Box>
                                        </Grid>
                                        <Grid item>
                                            <Typography variant="subtitle1" fontSize="0.75rem">
                                                {level.label}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </FormControl>
                        )}
 */}
                        <Grid container alignItems="center" justifyContent="space-between">
                            <Grid item>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={checked}
                                            onChange={(event) => setChecked(event.target.checked)}
                                            name="checked"
                                            color="primary"
                                        />
                                    }
                                    label={
                                        <Typography variant="subtitle1">
                                            Agree with &nbsp;
                                            <Typography variant="subtitle1" component={Link} to="#">
                                                Terms & Condition.
                                            </Typography>
                                        </Typography>
                                    }
                                />
                            </Grid>
                        </Grid>
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
                                    Sign UP
                                </Button>
                            </AnimateButton>
                        </Box>
                    </form>
                )}
            </Formik>
        </React.Fragment>
    );
};

export default RestRegister;
