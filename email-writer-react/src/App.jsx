import React, { useState } from 'react';
import './App.css'
import { Container, Box, InputLabel, Button, CircularProgress, FormControl, TextField, Typography, Select, MenuItem } from '@mui/material';

function App() {
  const [emailContent, setEmailContent] = useState('');
  const [tone, setTone] = useState('');
  const [generatedResponse, setGeneratedResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const handleSubmit = async() => {
    setLoading(true);
    setError('');
    try{
      const response = await axios.post('http://localhost:8080/api/generate', {
          emailContent,
          tone,
        });
      setGeneratedResponse(typeof response.data === 'string' ? response.data : JSON.stringify(response.data));
    } catch (error) {
      console.error('Error generating reply:', error);
      setError('Failed to generate reply. Please try again later.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container maxWidth="md" sx={{py: 4}}>
      <Typography variant="h4" component="h1" gutterBottom>
        Email Reply Generator
      </Typography>
      <Box sx={{mx:3}}>
        <TextField
        fullWidth
        label="Original Email Content"
        multiline
        rows={6}
        value={emailContent || ''}
        placeholder="Enter the content of the email you want to reply to."
        sx={{mb: 2}}
        onChange={(e) => setEmailContent(e.target.value)}
        variant="outlined" />
        <FormControl fullWidth sx={{mb: 2}}>
          <InputLabel>Tone (Optional)</InputLabel>
          <Select
            value={tone || ''}
            label="Tone (Optional)"
            onChange={(e) => setTone(e.target.value)}>
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value="formal">Formal</MenuItem>
            <MenuItem value="informal">Informal</MenuItem>
            <MenuItem value="friendly">Friendly</MenuItem>
            <MenuItem value="professional">Professional</MenuItem>
          </Select>
        </FormControl>
        <Button variant="contained"
        color="primary"
        onClick={handleSubmit}
        fullWidth>
          {loading ? <CircularProgress size={24} /> : 'Generate Reply'}
        </Button>
      </Box>

      {error && (
        <Typography color='error' sx={{mb: 2}}>
          {error}
        </Typography>
      )}
      {
        generatedResponse && (
          <Box sx={{mt:3}}>
            <Typography variant='h6' gutterBottom sx={{mt: 2}}>
              Generated Reply:
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={6}
              value={generatedResponse || ''}
              variant="outlined"
              inputProps={{ readOnly: true }}/>

            <Button
              variant="contained"
              color="primary"
              sx={{mt: 2}}
              onClick={async () => {
                await navigator.clipboard.writeText(generatedResponse);
              }}
            >
              Copy to Clipboard
            </Button>
          </Box>
        )
      }
    </Container>
  )
}

export default App
