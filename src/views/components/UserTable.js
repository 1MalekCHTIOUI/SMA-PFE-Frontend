import React from 'react';
import {DataGrid} from "@material-ui/data-grid";
import moment from 'moment'
import { Box, Button,Container,Grid } from '@material-ui/core';
import { IconCheck, IconX, IconBackspace } from '@tabler/icons'
import { makeStyles } from '@material-ui/styles';
import MuiTypography from '@material-ui/core/Typography'
import { Transition } from 'react-transition-group'
import Form from "./Form"
import { useHistory } from 'react-router-dom';


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
    }
}))
const defaultStyle = {
    transition: `opacity 300ms ease-in-out`,
    opacity: 0,
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: "1rem"
}

const transitionStyles = {
    entering: { opacity: 0 },
    entered: { opacity: 1 },
    exiting: { opacity: 1 },
    exited: { opacity: 0 }
}
const Usertable = ({data, setIsEdited}) => {
    let history = useHistory();
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
            width: 300,
          
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
            autoWidth:true,
            renderCell: (cellValues) => {
                return (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={(event) => {
                        handleEdit(event, cellValues);
                    }}
                  >
                    Edit
                  </Button>
                );
              }
    
        },
    ]

    const handleEdit = (e, c) => {
        setIsEditing(true)
        setEditedUser(c.row)
    }

    const handleUndo = () => {
        setIsEditing(false)
        setEditedUser(null)
    }

    const [users, setUsers] = React.useState([])
    const [editedUser, setEditedUser] = React.useState(null)
    const [isEditing, setIsEditing] = React.useState(false)
    const [is, setIs] = React.useState(false)

    
    React.useEffect(() => {
        if(is) {
            setIsEdited(true)
        } else {
            setIsEdited(false)
        }

    }, [is]);

    React.useEffect(()=>{
        setUsers(data)
    }, [data])


    const classes = useStyles()

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


    React.useEffect(() => {
        console.log(isEditing)
    }, [isEditing])


    return (
        <Box
            sx={{
                height: "100%",
                width: 1,
            }}
        >

        <Transition in={isEditing} timeout={{ 
            appear: 300,
            enter: 300,
            exit:0
        }} appear unmountOnExit>
            {
                state => isEditing && (
                    <>
                    <Grid style={{...defaultStyle, ...transitionStyles[state]}}>
                        <Grid container direction='row'>
                            <MuiTypography variant="button" display="block" gutterBottom>
                                Currently editing:
                            </MuiTypography>
                            <MuiTypography variant="button" display="block" gutterBottom>
                                TEST
                            </MuiTypography>
                        </Grid>
                        <Grid container spacing={2} direction='row' className={classes.buttonContainer}>
                            <Button variant="outlined" startIcon={<IconCheck />} onClick={handleEdit}> Apply</Button>
                            <Button variant="contained" startIcon={<IconBackspace />} onClick={handleUndo}> Undo</Button>
                        </Grid>
                    </Grid>
                    <div style={{...defaultStyle, ...transitionStyles[state]}}>
                        <Form user={editedUser} setIsEditing={setIsEditing} setIs={setIs} setEditedUser={setEditedUser}/>
                    </div>

                    </>
                )
            }
            

        </Transition>
        <Transition in={!isEditing} timeout={{
            appear: 300,
            enter: 300,
            exit:0
        }} appear unmountOnExit>
            {
                state => !isEditing && (
                    <Container style={{...defaultStyle, ...transitionStyles[state]}}>
                        <DataGrid
                            autoHeight
                            getRowId={row => row._id}
                            rows={users}
                            columns={columns}
                            pageSize={5}
                            isCellEditable={(params) => !params.row.role.includes("ADMIN")}
                            isRowSelectable={(params) => !params.row.role.includes("ADMIN")}
                            checkboxSelection
                            onRowClick={handleRowClick}
                            onCellClick={handleCellClick}
                            onCellEditStart={() => setIsEditing(true)}
                            onCellEditStop={() => setIsEditing(false)} />
                    </Container>

                )
            }
        </Transition>
        </Box>
    );
}

export default Usertable;


