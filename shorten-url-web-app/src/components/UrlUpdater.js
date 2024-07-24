import React, { useState } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const UrlUpdater = ({ url, onUrlUpdated, setSelectedUrl, handleShowSnackbar }) => {
  const [newUrl, setNewUrl] = useState(url.url);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://localhost:8080/${url.short}`, { url: newUrl });
      onUrlUpdated(response.data.updatedUrl);
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
        Update Url
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
          value={newUrl}
          onChange={(e) => setNewUrl(e.target.value)}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Update
        </Button>
        <Button
          onClick={() => setSelectedUrl(null)}
          fullWidth
          variant="outlined"
          sx={{ mt: 3, mb: 2 }}
        >
          Generate
        </Button>
      </Box>
    </Box>
  );
};

export default UrlUpdater;