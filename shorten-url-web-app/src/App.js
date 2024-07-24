import React, { useState } from 'react';
import UrlShortener from './components/UrlShortener';
import UrlList from './components/UrlList';
import UrlUpdater from './components/UrlUpdater';
import axios from 'axios';

import CssBaseline from '@mui/material/CssBaseline';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
const defaultTheme = createTheme();


const App = () => {
  const [urls, setUrls] = useState([]);
  const [selectedUrl, setSelectedUrl] = useState(null);
  const [open, setOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState('');
  const [snackbarSeverity, setSnackbarSeverity] = React.useState('success');

  const handleShowSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpen(true);
  };

  const handleClose = (event, reason) => {

    setOpen(false);
    setSnackbarMessage('');
  };


  const fetchUrls = async () => {
    try {
      const response = await axios.get('http://localhost:8080/fetch/urls');
      setUrls(response.data);
    } catch (error) {
      console.error('Error fetching URLs:', error);
    }
  };

  const handleUrlCreated = () => {
    handleShowSnackbar('URL shortened successfully', 'success');
    fetchUrls();
  };

  const handleUrlUpdated = (updatedUrl) => {
    handleShowSnackbar('URL updated successfully', 'success');
    setUrls(urls.map(url => url.short === updatedUrl.short ? updatedUrl : url));
    setSelectedUrl(null);
  };

  const handleUrlDeleted = (deletedShort) => {
    handleShowSnackbar('URL deleted successfully', 'success');
    setUrls(urls.filter(url => url.short !== deletedShort));
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid item xs={12} sm={12} md={5} component={Paper} elevation={6} square>
          {selectedUrl ? (
            <UrlUpdater
              url={selectedUrl}
              onUrlUpdated={handleUrlUpdated}
              setSelectedUrl={setSelectedUrl}
              handleShowSnackbar={handleShowSnackbar}
            />
          ) : (
            <UrlShortener onUrlCreated={handleUrlCreated} handleShowSnackbar={handleShowSnackbar} />
          )}
        </Grid>
        <Grid
          item
          xs={12}
          sm={12}
          md={7}
          sx={{
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'left',
          }}
        >
          <UrlList
            urls={urls}
            setUrls={setUrls}
            onUrlSelected={setSelectedUrl}
            onUrlDeleted={handleUrlDeleted}
          />
        </Grid>
      </Grid>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message={snackbarMessage}
      >
        <Alert
          onClose={handleClose}
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
    </Snackbar>
    </ThemeProvider >
  );
};

export default App;