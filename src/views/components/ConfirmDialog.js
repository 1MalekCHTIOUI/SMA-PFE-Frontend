import React from 'react';
import {Alert, AlertTitle, Dialog,  DialogTitle, DialogContent,Button,DialogActions} from '@material-ui/core'
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
export default ConfirmDialog;
