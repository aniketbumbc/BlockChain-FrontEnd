import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  makeStyles,
  Typography,
  IconButton,
  CircularProgress,
  Backdrop,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles((theme) => ({
  dialogWrapper: {
    padding: theme.spacing(2),
    position: 'absolute',
    top: theme.spacing(5),
    minWidth: '500px',
    marginTop: '75px',
  },

  dialogTitle: {
    color: 'rgb(12, 108, 242)',
    fontWeight: 'bold',
    borderRadius: 15,
    paddingRight: '0px',
  },
  closebtn: {
    color: 'rgb(12, 108, 242)',
    display: 'block',
    borderWidth: '3px',
    borderStyle: 'solid',
    borderColor: 'rgb(12, 108, 242)',
    borderRadius: '100%',
    backgroundColor: 'white',
    width: '15px',
    height: '15px',
    background:
      ' -webkit-linear-gradient(-45deg, transparent 0%, transparent 46%, white 46%,  white 56%,transparent 56%, transparent 100%), -webkit-linear-gradient(45deg, transparent 0%, transparent 46%, white 46%,  white 56%,transparent 56%, transparent 100%)',
  },
  row: {
    margin: '0 -5px',
  },
  column: {
    float: 'left',
    width: '25%',
    padding: '0 10px',
  },
  card: {
    boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)',
    padding: '16px',
    textAlign: 'center',
    backgroundColor: '#4f86f7',
  },
  hashCell: {
    wordWrap: 'break-word',
    width: '500px',
  },
  h3: {
    color: 'white',
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

const Popup = (props) => {
  const initialState = {
    size: '',
    block_index: '',
    prev_block: '',
  };
  const { title, openPopup, hash, setPopupData } = props;
  const [open, setOpen] = React.useState(true);
  const [blockData, setBlockData] = useState(initialState);
  const classes = useStyles();

  useEffect(() => {
    getBlockData();
  }, []);

  const getBlockData = async () => {
    try {
      const data = await axios.get(`https://blockchain.info/rawblock/${hash}`);
      setBlockData({
        size: data.data.size,
        block_index: data.data.block_index,
        prev_block: data.data.prev_block,
      });
      setOpen(false);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div>
      {blockData.size ? (
        <Dialog open={openPopup} classes={{ paper: classes.dialogWrapper }}>
          <DialogTitle className={classes.dialogTitle}>
            <div style={{ display: 'flex' }}>
              <Typography variant='h5' component='div' style={{ flexGrow: 1 }}>
                {title}
              </Typography>
              <IconButton
                onClick={() => setPopupData({ status: false, hash: '' })}
              >
                <CloseIcon className={classes.closebtn} />
              </IconButton>
            </div>
          </DialogTitle>
          <DialogContent className={classes.content} dividers>
            <div className={classes.row}>
              <div className={classes.column}>
                <div className={classes.card}>
                  <h3 className={classes.h3}>Size</h3>
                  <p>{blockData.size}</p>
                </div>
              </div>
              <div className={classes.column}>
                <div className={classes.card}>
                  <h3 className={classes.h3}>Block Index</h3>
                  <p>{blockData.block_index}</p>
                </div>
              </div>
              <div className={classes.column}>
                <div className={classes.card}>
                  <h3 className={classes.h3}>Previous Hash</h3>
                  <div style={{ wordWrap: 'break-word' }}>
                    {blockData.prev_block}
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      ) : (
        <Backdrop className={classes.backdrop} open={open}>
          <CircularProgress color='primary' />
        </Backdrop>
      )}
    </div>
  );
};

export default Popup;
