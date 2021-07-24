import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  TablePagination,
  CircularProgress,
} from '@material-ui/core';
import Popup from './Popup';

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
  },
  tableRow: {
    '&$hover:hover': {
      backgroundColor: 'rgb(211,211,211)',
    },
  },
  tableCell: {
    '$hover:hover &': {
      color: 'pink',
    },
  },
  hover: {},
  tableContainer: {
    borderRadius: 15,
    maxWidth: 1050,
    margin: '100px auto',
  },
  tableHeaderCell: {
    fontWeight: 'bold',
    backgroundColor: 'rgb(12, 108, 242)',
    color: theme.palette.getContrastText(theme.palette.primary.dark),
  },
  hashCell: {
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    width: '300px',
    display: 'block',
    overflow: 'hidden',
    color: 'rgb(12, 108, 242)',
  },
  loader: {
    margin: '300px auto',
  },
}));

const Blocks = () => {
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [popupData, setPopupData] = useState({ status: false, hash: '' });

  useEffect(() => {
    getBlocksData();
  }, []);

  const getBlocksData = async () => {
    try {
      const data = await axios.get(
        'https://blockchain.info/blocks/1627026861249?format=json'
      );
      setBlocks(data.data);
      setLoading(true);
    } catch (e) {
      console.log(e);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const classes = useStyles();

  return (
    <>
      <div>
        {loading ? (
          <TableContainer component={Paper} className={classes.tableContainer}>
            <Table className={classes.table} aria-label='simple table'>
              <TableHead>
                <TableRow>
                  <TableCell className={classes.tableHeaderCell}>
                    Hash
                  </TableCell>
                  <TableCell className={classes.tableHeaderCell}>
                    Height
                  </TableCell>
                  <TableCell className={classes.tableHeaderCell}>
                    Time
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {blocks
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <TableRow
                      key={row.hash}
                      hover
                      classes={{ hover: classes.hover }}
                      className={classes.tableRow}
                    >
                      <TableCell
                        onClick={() =>
                          setPopupData({ status: true, hash: row.hash })
                        }
                      >
                        <Typography className={classes.hashCell}>
                          {row.hash}
                        </Typography>
                      </TableCell>
                      <TableCell>{row.height}</TableCell>
                      <TableCell>{row.time}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component='div'
              count={blocks.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>
        ) : (
          <CircularProgress className={classes.loader} />
        )}
        <div>
          {popupData.hash ? (
            <Popup
              title='Block Info'
              openPopup={popupData.status}
              hash={popupData.hash}
              setPopupData={setPopupData}
            ></Popup>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default Blocks;
