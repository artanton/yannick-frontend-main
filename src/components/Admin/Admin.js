import React, { useState, useEffect } from 'react';
import { fetchPrompts, addPrompt, editPrompt } from '../../api/admin';
import {
  Container,
  TextField,
  Button,
  Paper,
  Grid,
  IconButton,
  Table, TableBody, TableCell, TableHead, TableRow
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

const Admin = () => {
  const [prompts, setPrompts] = useState([]);
  const [currentPrompt, setCurrentPrompt] = useState({ name: '', instructions: '' });
  const [editing, setEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  useEffect(() => {
    fetchPromptsData();
  }, []);

  const fetchPromptsData = async () => {
    try {
      const data = await fetchPrompts();
      setPrompts(data);
    } catch (error) {
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentPrompt({ ...currentPrompt, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await editPrompt(currentId, currentPrompt);
      } else {
        await addPrompt(currentPrompt);
      }
      fetchPromptsData();
      setCurrentPrompt({ name: '', instructions: '' });
      setEditing(false);
      setCurrentId(null);
    } catch (error) {
      console.error("Error saving prompt:", error);
    }
  };

  const handleEdit = (prompt) => {
    setCurrentPrompt({ name: prompt.name, instructions: prompt.instructions });
    setEditing(true);
    setCurrentId(prompt._id);
  };

  return (
    <Container maxWidth="md" style={{marginTop: '40px'}}>
      
      {editing && (
        <Paper elevation={3} style={{ padding: '20px', marginBottom: '20px' }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Name"
                  name="name"
                  value={currentPrompt.name}
                  onChange={handleChange}
                  variant="outlined"
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Instructions"
                  name="instructions"
                  value={currentPrompt.instructions}
                  onChange={handleChange}
                  variant="outlined"
                  multiline
                  rows={4}
                  required
                />
              </Grid>
              <Grid item xs={12} align="center">
                <Button variant="contained" color="primary" type="submit">
                  {editing ? 'Update' : 'Add'} Prompt
                </Button>
              </Grid>
            </Grid>
          </form>

        </Paper>
      )}
      {/* <List>
          {prompts.map((prompt) => (
            <ListItem key={prompt._id} divider>
              <ListItemText
                primary={prompt.name}
                secondary={prompt.instructions}
              />
              <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="edit" onClick={() => handleEdit(prompt)}>
                  <EditIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List> */}
      <Paper elevation={3} style={{ padding: '20px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '16px' }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '16px' }}>Instructions</TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '16px' }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {prompts.map((prompt) => (
              <TableRow key={prompt._id}>
                <TableCell sx={{ verticalAlign: 'top' }}>{prompt.name.charAt(0).toUpperCase() + prompt.name.slice(1)}</TableCell>
                <TableCell>{prompt.instructions}</TableCell>
                <TableCell>
                  <IconButton edge="end" aria-label="edit" onClick={() => handleEdit(prompt)}>
                    <Button variant="contained" color="primary" type="submit">
                      <EditIcon />
                    </Button>

                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
};

export default Admin;
