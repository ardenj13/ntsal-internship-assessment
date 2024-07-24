import React, { useEffect } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const UrlList = ({ urls, setUrls, onUrlSelected, onUrlDeleted }) => {
  const fetchUrls = async () => {
    try {
      const response = await axios.get('http://localhost:8080/fetch/urls');
      // Assuming your backend returns an array of URLs
      setUrls(response.data);
    } catch (error) {
      console.error('Error fetching URLs:', error);
    }
  };
  useEffect(() => {
    fetchUrls();
  }, []);

  const handleDelete = async (short) => {
    try {
      await axios.delete(`http://localhost:8080/${short}`);
      onUrlDeleted(short);
    } catch (error) {
      console.error('Error deleting URL:', error);
    }
  };

  return (
    <Box
      sx={{
        my: 8,
        mx: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Typography component="h1" variant="h5">
        Shortened Urls list
      </Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Short ID</TableCell>
              <TableCell align="right">Original Url</TableCell>
              <TableCell align="right">Views</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {urls.map((url) => (
              <TableRow
                key={url.short}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  <a href={`http://localhost:8080/${url.short}`} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                    {url.short}
                  </a>
                </TableCell>
                <TableCell align="right">
                  <a href={url.url} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                    {url.url}
                  </a>
                </TableCell>
                <TableCell align="right">{url.views}</TableCell>
                <TableCell align="right">
                  <ButtonGroup variant="outlined" aria-label="Basic button group" size="small">
                    <Button onClick={() => onUrlSelected(url)}>Edit</Button>
                    <Button onClick={() => handleDelete(url.short)}>Delete</Button>
                  </ButtonGroup>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default UrlList;