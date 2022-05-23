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
    Divider,
    Input,
    Container
} from '@material-ui/core';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
// project imports
import useScriptRef from '../../hooks/useScriptRef';
import AnimateButton from './../../ui-component/extended/AnimateButton';
import { strengthColor, strengthIndicator } from '../../utils/password-strength';

import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import { useDispatch, useSelector } from 'react-redux';
import { ACCOUNT_UPDATED } from '../../store/actions';
import { Avatar } from 'antd';
import { addStr, randomNumber } from '../../utils/scripts';
import { Build } from '@material-ui/icons';
import config from '../../config';

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
    },
    image: {
        width: '200px',
        height: '200px',
        borderRadius: '125px',
        '&:hover': {
            filter: 'brightness(50%)'
        }
    },
    center: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    parentHover: {
        position: 'relative'
    },
    tool: {
        color: 'black',
        position: 'absolute',
        top: '80%',
        right: '10%'
    },
    button: {
        '&:hover': {
            background: 'none'
        }
    }
}));

//===========================|| API JWT - REGISTER ||===========================//

const Form = ({ user, setIsEditing, setIs, setEditedUser, accessFrom, ...others }) => {
    const classes = useStyles();
    let history = useHistory();
    const scriptedRef = useScriptRef();
    const matchDownSM = useMediaQuery((theme) => theme.breakpoints.down('sm'));
    const [showOldPassword, setOldShowPassword] = React.useState(false);
    const [showPassword, setShowPassword] = React.useState(false);
    const [xOldPassword, setXOldPassword] = React.useState('');
    const [strength, setStrength] = React.useState(0);
    const [level, setLevel] = React.useState('');
    const [ifSame, setIfSame] = React.useState(null);
    const [file, setFile] = React.useState('');
    const [filename, setFilename] = React.useState('Choose file');
    const [uploadedFile, setUploadedFile] = React.useState(null);
    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const onChangeFileUpload = (e) => {
        setFile(e.target.files[0]);
        setFilename(e.target.files[0].name);
    };

    const handleClickShowOldPassword = () => {
        setOldShowPassword(!showOldPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const changePassword = (value) => {
        const temp = strengthIndicator(value);
        setStrength(temp);
        setLevel(strengthColor(temp));
    };
    const checkIfPasswordLegit = async (email, oldPassword) => {
        let test = false;
        try {
            const res = await axios.post(configData.API_SERVER + 'user/compare', { email, oldPassword });
            if (res.data.same) {
                setIfSame(true);
                test = true;
            } else {
                setIfSame(false);
                test = false;
            }
        } catch (error) {
            console.log(error);
        }
        return test;
    };

    const dispatch = useDispatch();
    const account = useSelector((state) => state.account);

    useEffect(() => {
        setXOldPassword(user.password);
    }, [user]);

    useEffect(() => {
        console.log(uploadedFile);
    }, [uploadedFile]);

    const [isHovering, setIsHovering] = React.useState(false);
    const re =
        /^((https?|ftp):\/\/)?(www.)?(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i;
    return (
        <React.Fragment>
            <Formik
                initialValues={{
                    firstName: user ? user.first_name : '',
                    lastName: user ? user.last_name : '',
                    email: user ? user.email : '',
                    role: user ? user.role[0] : '',
                    service: user ? user.service : '',
                    profilePicture: user ? user.profilePicture : '',
                    linkedin: user && user.social.linkedin ? user.social.linkedin : '',
                    github: user && user.social.github ? user.social.github : '',
                    facebook: user && user.social.facebook ? user.social.facebook : '',
                    oldPassword: '',
                    newPassword: '',
                    submit: null
                }}
                validationSchema={Yup.object().shape({
                    email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
                    linkedin: Yup.string().matches(re, 'URL is not valid'),
                    facebook: Yup.string().matches(re, 'URL is not valid'),
                    github: Yup.string().matches(re, 'URL is not valid'),
                    firstName: Yup.string().required('First name is required'),
                    lastName: Yup.string().required('Last name is required'),
                    role: Yup.string().required('Role is required'),
                    service: Yup.string().required('Service is required')
                })}
                onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                    const random = randomNumber();
                    const dotIndex = file.name.indexOf('.');
                    const newFilename = addStr(file.name, dotIndex, random);
                    const formData = new FormData();
                    formData.append('file', file, newFilename);
                    try {
                        try {
                            let test = await checkIfPasswordLegit(values.email, values.oldPassword);

                            if (test === false && values.oldPassword != '' && accessFrom === 'USER-C') {
                                console.log('Old password wrong');
                            } else {
                                const updatedUser = {
                                    _id: user._id,
                                    first_name: values.firstName,
                                    last_name: values.lastName,
                                    email: values.email,
                                    role: [values.role],
                                    service: values.service,
                                    social: {
                                        linkedin: values.linkedin,
                                        github: values.github,
                                        facebook: values.facebook
                                    },
                                    profilePicture: ''
                                };
                                if (values.newPassword != '' && values.oldPassword != '') {
                                    updatedUser.password = values.newPassword;
                                }
                                try {
                                    // console.log(updatedUser)
                                    try {
                                        const r = await axios.post(configData.API_SERVER + 'upload', formData);
                                        updatedUser.profilePicture = r.data.upload;
                                        try {
                                            await axios.put(configData.API_SERVER + 'user/users/' + user._id, updatedUser);

                                            if (accessFrom === 'USER-C') {
                                                dispatch({ type: ACCOUNT_UPDATED, payload: updatedUser });
                                                history.push(configData.defaultPath);
                                            } else {
                                                setIsEditing(false);
                                                setEditedUser(updatedUser);
                                                setIs(true);
                                            }
                                        } catch (error) {}
                                    } catch (error) {
                                        console.log(error.response.data.message);
                                    }
                                } catch (error) {
                                    console.log(error);
                                }
                            }
                        } catch (e) {
                            console.error(e);
                            setStatus({ success: false });
                            setErrors({ submit: e.message });
                            setSubmitting(false);
                            setIs && setIs(false);
                        }
                    } catch (err) {
                        console.error(err);
                        if (scriptedRef.current) {
                            setStatus({ success: false });
                            setErrors({ submit: err.message });
                            setSubmitting(false);
                            setIs && setIs(false);
                        }
                    }
                }}
            >
                {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                    <form noValidate onSubmit={handleSubmit} {...others}>
                        <Grid container spacing={matchDownSM ? 0 : 2}>
                            <Grid item xs={12} className={classes.center}>
                                <Button className={classes.button} component="label">
                                    <Container
                                        className={classes.parentHover}
                                        onMouseEnter={() => setIsHovering(true)}
                                        onMouseLeave={() => setIsHovering(false)}
                                    >
                                        {!file && account.user.profilePicture ? (
                                            <img
                                                className={classes.image}
                                                src={config.HOST + `public/uploads/${account.user.profilePicture}`}
                                                alt=""
                                            />
                                        ) : null}
                                        {file ? <img className={classes.image} src={URL.createObjectURL(file)} alt="" /> : null}
                                        {isHovering && <Build className={classes.tool} />}
                                    </Container>
                                    <Input
                                        hidden
                                        style={{ width: '35.50vw' }}
                                        accept="image/*"
                                        fullWidth
                                        label="Profile picture"
                                        margin="normal"
                                        name="profilePicture"
                                        id="profilePicture"
                                        type="file"
                                        onBlur={handleBlur}
                                        onChange={onChangeFileUpload}
                                        className={classes.loginInput}
                                    />
                                </Button>
                            </Grid>
                        </Grid>
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
                                disabled={accessFrom === 'USER-C' || account.user.role[0] !== 'SUPER_ADMIN'}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                className={classes.loginInput}
                                error={touched.role && Boolean(errors.role)}
                            >
                                {account.user.role[0] === 'SUPER_ADMIN' && <MenuItem value="SUPER_ADMIN">Super Administrator</MenuItem>}
                                <MenuItem value="ADMIN">Administrator</MenuItem>
                                <MenuItem value="USER">User</MenuItem>
                            </Select>
                            {touched.role && errors.role && (
                                <FormHelperText error id="standard-weight-helper-text--register">
                                    {errors.role}
                                </FormHelperText>
                            )}
                        </FormControl>
                        <Divider />

                        {accessFrom === 'USER-C' && (
                            <Grid direction="row" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <FormControl error={Boolean(touched.password && errors.password)} className={classes.loginInput}>
                                    <InputLabel htmlFor="outlined-adornment-old-password-register">Old password</InputLabel>
                                    <OutlinedInput
                                        id="outlined-adornment-old-password-register"
                                        type={showOldPassword ? 'text' : 'password'}
                                        value={values.oldPassword}
                                        autoComplete="new-password"
                                        name="oldPassword"
                                        label="Password"
                                        error={values.oldPassword !== '' && ifSame === false}
                                        onBlur={handleBlur}
                                        onChange={(e) => {
                                            handleChange(e);
                                        }}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowOldPassword}
                                                    onMouseDown={handleMouseDownPassword}
                                                    edge="end"
                                                >
                                                    {showOldPassword ? <Visibility /> : <VisibilityOff />}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                        inputProps={{
                                            classes: {
                                                notchedOutline: classes.notchedOutline
                                            }
                                        }}
                                    />

                                    {ifSame === false && ifSame !== null && (
                                        <FormHelperText error id="standard-weight-helper-text-password-register">
                                            {errors.oldPassword}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                                <FormControl error={Boolean(touched.password && errors.password)} className={classes.loginInput}>
                                    <InputLabel htmlFor="outlined-adornment-new-password-register">New Password</InputLabel>
                                    <OutlinedInput
                                        id="outlined-adornment-new-password-register"
                                        type={showPassword ? 'text' : 'password'}
                                        value={values.newPassword}
                                        name="newPassword"
                                        label="Password"
                                        autoComplete="new-password"
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
                                            {errors.newPassword}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                        )}

                        {strength !== 0 && (
                            <FormControl fullWidth>
                                <Box
                                    sx={{
                                        mb: 2
                                    }}
                                >
                                    <Grid container spacing={2} justifyContent="right" alignItems="right">
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
                        <Divider />
                        <Typography variant="h6" align="center">
                            Social
                        </Typography>
                        <Divider />
                        <FormControl fullWidth error={Boolean(touched.linkedin && errors.linkedin)} className={classes.loginInput}>
                            <InputLabel id="linkedin">LinkedIn</InputLabel>
                            <OutlinedInput
                                id="linkedin"
                                type="text"
                                value={values.linkedin}
                                name="linkedin"
                                onBlur={handleBlur}
                                onChange={handleChange}
                            />
                            {touched.linkedin && errors.linkedin && (
                                <FormHelperText error id="standard-weight-helper-text--register">
                                    {' '}
                                    {errors.linkedin}{' '}
                                </FormHelperText>
                            )}
                        </FormControl>
                        <FormControl fullWidth error={Boolean(touched.github && errors.github)} className={classes.loginInput}>
                            <InputLabel id="linkedin">Github</InputLabel>
                            <OutlinedInput
                                id="github"
                                type="text"
                                value={values.github}
                                name="github"
                                onBlur={handleBlur}
                                onChange={handleChange}
                            />
                            {touched.linkedin && errors.linkedin && (
                                <FormHelperText error id="standard-weight-helper-text--register">
                                    {' '}
                                    {errors.linkedin}{' '}
                                </FormHelperText>
                            )}
                        </FormControl>
                        <FormControl fullWidth error={Boolean(touched.facebook && errors.facebook)} className={classes.loginInput}>
                            <InputLabel id="linkedin">Facebook</InputLabel>
                            <OutlinedInput
                                id="facebook"
                                type="text"
                                value={values.facebook}
                                name="facebook"
                                onBlur={handleBlur}
                                onChange={handleChange}
                            />
                            {touched.facebook && errors.facebook && (
                                <FormHelperText error id="standard-weight-helper-text--register">
                                    {' '}
                                    {errors.facebook}{' '}
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
