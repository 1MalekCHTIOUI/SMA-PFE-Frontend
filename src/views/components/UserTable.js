import React from 'react';
import {DataGrid, GridSearchIcon} from "@material-ui/data-grid"
import moment from 'moment'
import axios from 'axios'
import PropTypes from 'prop-types'
import configData from "../../config"
import { Box,IconButton,Button,Container,Grid, Alert, AlertTitle, Dialog,  DialogTitle, DialogContent, Typography, DialogActions, TextField  } from '@material-ui/core'
import { IconCheck, IconX, IconBackspace } from '@tabler/icons'
import { makeStyles } from '@material-ui/styles';
import MuiTypography from '@material-ui/core/Typography'
import { Transition } from 'react-transition-group'
import Form from "./Form"
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';


const ConfirmDialog = (props) => {
    const { title, children, open, setOpen, onConfirm } = props;
    return (
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="confirm-dialog"
      >
        <DialogTitle id="confirm-dialog">{title}</DialogTitle>
        <DialogContent>{children}</DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpen(false)}
          >
            No
          </Button>
          <Button
            onClick={() => {
              setOpen(false);
              onConfirm();
            }}
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    );
  };
  
  
  function escapeRegExp(value) {
    return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
  }
  
  function QuickSearchToolbar(props) {
    return (
      <Box
        sx={{
          p: 0.5,
          pb: 0,
        }}
      >
        <TextField
          variant="standard"
          value={props.value}
          onChange={props.onChange}
          placeholder="Search…"
          InputProps={{
            startAdornment: <GridSearchIcon fontSize="small" />,
            endAdornment: (
              <IconButton
                title="Clear"
                aria-label="Clear"
                size="small"
                style={{ visibility: props.value ? 'visible' : 'hidden' }}
                onClick={props.clearSearch}
              >
                <IconX fontSize="small" />
              </IconButton>
            ),
          }}
          sx={{
            width: {
              xs: 1,
              sm: 'auto',
            },
            m: (theme) => theme.spacing(1, 0.5, 1.5),
            '& .MuiSvgIcon-root': {
              mr: 0.5,
            },
            '& .MuiInput-underline:before': {
              borderBottom: 1,
              borderColor: 'divider',
            },
          }}
        />
      </Box>
    );
  }
  
QuickSearchToolbar.propTypes = {
clearSearch: PropTypes.func.isRequired,
onChange: PropTypes.func.isRequired,
value: PropTypes.string.isRequired,
};
  



function getFullName(params) {
    return `${params.row.first_name || ''} ${params.row.last_name || ''}`;
}
  
function setFullName(params) {
    const [first_name, last_name] = params.value.toString().split(' ');
    return { ...params.row, first_name, last_name };
}

function parseFullName(value) {
    return String(value)
        .split(' ')
        .map((str) => (str.length > 0 ? str[0].toUpperCase() + str.slice(1) : ''))
        .join(' ');
}
    

const useStyles = makeStyles((theme) => ({
    buttonContainer: {
        display: 'flex',
        justifyContent: 'flex-end',
        marginBottom: "1rem",
    },
    invisibleContainer: {
        display: "none"
    },
    buttons: { 
        display:"flex",
        alignItems: "center",
        justifyContent: "space-evenly",
        
    }
}))
const defaultStyle = {
    transition: `opacity 300ms ease-in-out`,
    opacity: 0,
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: "1rem"
}
const formStyle = {
    transition: `opacity 300ms ease-in-out`,
    opacity: 0,
    margin: "0 auto",
    width: "70%",
    marginBottom: "1rem"
}
const alertStyle = {
    transition: `opacity 300ms ease-in-out`,
    opacity: 0,
    display:"flex",
    justifyContent: "center",
    width: "40%",
    marginBottom: "1rem"
}
const transitionStyles = {
    entering: { opacity: 0 },
    entered: { opacity: 1 },
    exiting: { opacity: 1 },
    exited: { opacity: 0 }
}
const Usertable = ({data, setIsEdited, setIsDeleted, usersLoading}) => {
    let history = useHistory()
    const [deleted, setDeleted] = React.useState(null)
    const [users, setUsers] = React.useState([])
    const [editedUser, setEditedUser] = React.useState(null)
    const [isEditing, setIsEditing] = React.useState(false)
    const [is, setIs] = React.useState(false)
    const [open, setOpen] = React.useState(false)
    const [deletedValues, setDeletedValues] = React.useState(null)
    const columns = [
        { field: '_id', hide:true, headerName: 'ID', width: 100},
        {
          field: 'first_name',
          headerName: 'First name',
          width: 180,
        
          hide:true,
        },
        {
            field: 'last_name',
            headerName: 'Last name',
            width: 180,
          
            hide:true,
        },
        {
            field: 'full_name',
            headerName: 'Full name',
            width: 160,
          
            valueGetter: getFullName,
            valueSetter: setFullName,
            valueParser: parseFullName,
            sortComparator: (v1, v2) => v1.toString().localeCompare(v2.toString()),
          },
        {
            field: 'email',
            headerName: 'Email',
            width: 230,
          
        },
        {
            field: 'service',
            headerName: 'Service',
            width: 200,
          
        },
        {
            field: 'role',
            headerName: 'Role',
            width: 115,
          
        },
        {
            field: 'createdAt',
            headerName: 'Created at',
            width: 150,
          
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 300,
            renderCell: (cellValues) => {
                return (
                    <Container className={classes.buttons}>
                        <Button
                            variant="contained"
                            color="primary"
                            disabled={!canEdit(cellValues)}
                            onClick={(event) => {
                                handleEdit(event, cellValues);
                            }}
                        >
                            Edit
                        </Button>
                        <Button
                            variant="contained"
                            color="error"
                            disabled={!canEdit(cellValues)}
                            onClick={(event) => {
                                setDeletedValues(cellValues)
                            }}
                        >
                            Delete
                        </Button>
                    </Container>
                );
              }
    
        },
        
    ]

    const handleEdit = (e, c) => {
        setIsEditing(true)
        setEditedUser(c.row)
    }
    React.useEffect(()=>{
        if(deletedValues!=null && open === false) {
            setOpen(true)

        }
    },[deletedValues])


    const handleDelete = async () => {
        try {
            if(deletedValues) {
                await axios.delete(configData.API_SERVER + "user/users/"+ deletedValues?.row._id)
                setDeleted(deletedValues?.row)
                setIsDeleted(deletedValues?.row)
                setDeletedValues(null)
            }

        } catch (error) {
            setDeleted(false)
            setIsDeleted(false)
            console.log(error)
        }
    }


    const handleUndo = () => {
        setIsEditing(false)
        setEditedUser(null)
    }
    
    React.useEffect(() => {
        if(is) {
            setIsEdited(true)
        } else {
            setIsEdited(false)
        }

    }, [is])
    

    React.useEffect(()=>{
        setUsers(data)
    }, [data])


    const classes = useStyles()
    const account = useSelector(s => s.account)
    const handleCellClick = (param, event) => {
        event.stopPropagation();
    }
    
    const handleRowClick = (param, event) => {
        event.stopPropagation();
    }

    React.useEffect(()=>{
        users.map(user => {
            const dateFormated = moment(user.createdAt, "DD/MM/YYYY").format("DD/MM/YYYY")
    
            if(dateFormated !== user.createdAt) {
                user.createdAt = moment(user.createdAt).format("DD/MM/YYYY")
            }
        })

    }, [users, data])

    const [goOut, setGoOut] = React.useState(false)
    React.useEffect(() => {

        const Ts = () => {
                if(deleted !== null || is) {
                    setTimeout(() => {
                        setGoOut(true)  
                    }, 3000);
                }
            }
        Ts()

    }, [deleted, is])

    const canEdit = (params) => {
        if(account.user._id === params.row._id) {
            return false
        }
        else if(
            params.row.role.includes("SUPER_ADMIN")==false && 
            params.row._id !== account.user._id && 
            account.user.role.includes("SUPER_ADMIN")) {
            return true
        } else if (
            account.user.role.includes("ADMIN") && params.row.role[0] !== "USER"){
            return false
        }
        else {
            return true
        }
    }

    const [searchText, setSearchText] = React.useState('');
    const [rows, setRows] = React.useState(data);
  
    const requestSearch = (searchValue) => {
      setSearchText(searchValue);
      const searchRegex = new RegExp(escapeRegExp(searchValue), 'i');
      const filteredRows = data.filter((row) => {
        return Object.keys(row).some((field) => {
          return searchRegex.test(row[field].toString());
        });
      });
      setRows(filteredRows);
    };

    React.useEffect(() => {
        setRows(data);
      }, [data]);
    return (
        <Box
            sx={{
                height: "100%",
                width: 1,
            }}
        >
            
        <ConfirmDialog
            title="Please confirm"
            open={open}
            setOpen={setOpen}
            onConfirm={handleDelete}
            values={deletedValues}
        >
            <Typography align="center">
                Are you sure you want to delete this user? <br /> <strong>{deletedValues?.row.first_name} {deletedValues?.row.last_name}</strong>
            </Typography>
        </ConfirmDialog>


        <Transition in={deleted || is} out={1000} timeout={{ 
            appear: 300,
            enter: 300,
            exit:0
            }} appear unmountOnExit>
                {
                    state => (deleted || is) && (
                        <Container style={{...alertStyle, ...transitionStyles[state]}}>
                            {
                                deleted ? 
                                deleted !== null && goOut === false && (
                                    <Alert style={{textAlign: 'center'}}severity="success">
                                        <AlertTitle>Success</AlertTitle>
                                        User — <strong>{deleted.first_name} {deleted.last_name}</strong> successfully deleted!
                                    </Alert>
                                )
                                : 
                                is !== null && goOut === false && (
                                    <Alert style={{textAlign: 'center'}}severity="success">
                                        <AlertTitle>Success</AlertTitle>
                                        User successfully Edited!
                                    </Alert>
                                )
                            }
                        </Container>
                    )
                }
        </Transition>

        { isEditing && 
        <Transition in={isEditing} timeout={{ 
            appear: 300,
            enter: 300,
            exit:0
        }} appear unmountOnExit>
            {
                state => isEditing && (
                    <>
                    <Grid style={{...defaultStyle, ...transitionStyles[state]}}>
                        <Grid container spacing={2} direction='row' className={classes.buttonContainer}>
                            {/* <Button variant="outlined" startIcon={<IconCheck />} onClick={handleEdit}> Apply</Button> */}
                            <Button variant="contained" startIcon={<IconBackspace />} onClick={handleUndo}>Go Back</Button>
                        </Grid>
                    </Grid>
                    <Container style={{...formStyle, ...transitionStyles[state]}}>
                        <Form user={editedUser} accessFrom="ADMIN-C" setIsEditing={setIsEditing} setIs={setIs} setEditedUser={setEditedUser}/>
                    </Container>

                    </>
                )
            }
            

        </Transition>
}
        <Transition in={isEditing==false} timeout={{
            appear: 300,
            enter: 300,
            exit:100
        }} appear unmountOnExit>
            {
                state => isEditing==false && (
                    <Container style={{...defaultStyle, ...transitionStyles[state]}}>
                        <DataGrid
                            autoHeight
                            components={{Toolbar: QuickSearchToolbar}}
                            getRowId={row => row._id}
                            rows={rows}
                            columns={columns}
                            componentsProps={{
                                toolbar: {
                                  value: searchText,
                                  onChange: (event) => requestSearch(event.target.value),
                                  clearSearch: () => requestSearch(''),
                                },
                              }}
                            pageSize={5}
                            isCellEditable={(params) => canEdit(params)}
                            isRowSelectable={(params) => canEdit(params)}
                            checkboxSelection
                            onRowClick={handleRowClick}
                            onCellClick={handleCellClick}
                            onCellEditStart={() => setIsEditing(true)}
                            onCellEditStop={() => setIsEditing(false)}
                            loading={usersLoading}
                            />
                    </Container>

                )
            }
        </Transition>
        </Box>
    );
}

export default Usertable;


