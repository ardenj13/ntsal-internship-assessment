import React, { useState } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const UrlShortener = ({ onUrlCreated, handleShowSnackbar }) => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/shorten', { url });
      onUrlCreated(response.data);
      setUrl('');
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred');
      handleShowSnackbar(err.response?.data?.error || 'An error occurred', 'error');
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
        Shorten Url
      </Typography>
      {error && <p className="text-red-500 mt-2" style={{ color: "red" }}>{error}</p>}
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="url"
          label="Url"
          name="url"
          autoFocus
          onChange={(e) => setUrl(e.target.value)}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Generate
        </Button>
      </Box>
    </Box>
  );
};

export default UrlShortener;