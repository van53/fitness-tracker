import React, { useState, useRef } from 'react';
import { 
  Container, Typography, Card, CardContent, Box, Avatar, 
  IconButton, TextField, Button, Stack, Alert 
} from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import SaveIcon from '@mui/icons-material/Save';
import { apiClient } from '../api/apiClient';

interface UserProfile {
  firstName: string;
  lastName: string;
  age: string;
  weight: string;
  height: string;
}

export function DashboardPage() {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(localStorage.getItem('avatarUrl'));
  const [isUploading, setIsUploading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Стан для полів профілю
  const [profile, setProfile] = useState<UserProfile>({
    firstName: localStorage.getItem('user_firstName') || '',
    lastName: localStorage.getItem('user_lastName') || '',
    age: localStorage.getItem('user_age') || '',
    weight: localStorage.getItem('user_weight') || '',
    height: localStorage.getItem('user_height') || '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = () => {
    // Зберігання даних локально
    Object.entries(profile).forEach(([key, value]) => {
      localStorage.setItem(`user_${key}`, value);
    });
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setIsUploading(true);
    try {
      const response = await apiClient.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const fullImageUrl = `http://localhost:3000${response.data.url}`;
      setAvatarUrl(fullImageUrl);
      localStorage.setItem('avatarUrl', fullImageUrl);
    } catch (error) {
      console.error('Помилка завантаження файлу', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 6, mb: 6 }}>
      {/* Секція Аватара */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
        <Box sx={{ position: 'relative' }}>
          <Avatar 
            src={avatarUrl || undefined} 
            sx={{ width: 140, height: 140, mb: 2, boxShadow: '0px 8px 30px rgba(0,0,0,0.12)', border: '4px solid white' }}
          />
          <IconButton 
            color="primary" 
            sx={{ position: 'absolute', bottom: 15, right: -5, bgcolor: 'white', boxShadow: 3, '&:hover': { bgcolor: '#f5f5f5' } }}
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            <PhotoCameraIcon />
          </IconButton>
        </Box>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 0.5 }}>Профіль Користувача</Typography>
        <Typography color="text.secondary">Керуйте своїми даними та статистикою</Typography>
        <input type="file" hidden ref={fileInputRef} accept="image/*" onChange={handleFileUpload} />
      </Box>

      {/* Форма редагування даних */}
      <Card sx={{ borderRadius: 4, boxShadow: '0px 10px 40px rgba(0,0,0,0.04)', border: '1px solid', borderColor: 'divider' }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h6" sx={{ mb: 4, fontWeight: 'bold' }}>Дані користувача</Typography>
          
          {showSuccess && (
            <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>Дані успішно збережено!</Alert>
          )}

          <Stack spacing={3}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
              <TextField 
                label="Ім'я" 
                name="firstName"
                value={profile.firstName}
                onChange={handleInputChange}
                fullWidth 
              />
              <TextField 
                label="Прізвище" 
                name="lastName"
                value={profile.lastName}
                onChange={handleInputChange}
                fullWidth 
              />
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' }, gap: 3 }}>
              <TextField 
                label="Вік" 
                name="age"
                type="number"
                value={profile.age}
                onChange={handleInputChange}
                fullWidth 
              />
              <TextField 
                label="Вага (кг)" 
                name="weight"
                type="number"
                value={profile.weight}
                onChange={handleInputChange}
                fullWidth 
              />
              <TextField 
                label="Зріст (см)" 
                name="height"
                type="number"
                value={profile.height}
                onChange={handleInputChange}
                fullWidth 
              />
            </Box>

            <Button 
              variant="contained" 
              size="large" 
              startIcon={<SaveIcon />}
              onClick={handleSaveProfile}
              sx={{ 
                mt: 2, 
                py: 1.5, 
                borderRadius: 2, 
                fontWeight: 'bold', 
                textTransform: 'none',
                fontSize: '1rem' 
              }}
            >
              Зберегти зміни
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
}