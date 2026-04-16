import { Outlet, Link as RouterLink } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container, Box } from '@mui/material';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';

function App() {
  return (
    <Box sx={{ flexGrow: 1, backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* Шапка навігації Material UI */}
      <AppBar position="static" elevation={1}>
        <Toolbar>
          <FitnessCenterIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            Fitness Tracker
          </Typography>
          <Box>
            <Button color="inherit" component={RouterLink} to="/">
              Головна
            </Button>
            <Button color="inherit" component={RouterLink} to="/workouts">
              Тренування
            </Button>
            <Button color="inherit" component={RouterLink} to="/exercises">
              Вправи
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      
      {/* Основний контент сторінок */}
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Outlet /> 
      </Container>
    </Box>
  );
}

export default App;