// src/Formulario.js

import React, { useState, useEffect } from 'react';
import {
  Button,
  TextField,
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel,
  FormLabel,
  Select,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Paper,
  Divider,
  Fab,
  Zoom,
  Box,
  Container,
  Grid,
  IconButton,
} from '@mui/material';
import { ExpandMore, Close, CloudUpload, Send, KeyboardArrowUp } from '@mui/icons-material';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1a237e', // Dark navy blue
      light: '#534bae',
      dark: '#000051',
    },
    secondary: {
      main: '#c0c0c0', // A silver color
      light: '#e0e0e0',
      dark: '#a0a0a0',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    text: {
      primary: '#333333',
      secondary: '#666666',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
      color: '#1a237e',
    },
    h5: {
      fontWeight: 500,
      color: '#1a237e',
      fontSize: '1.5rem',
    },
    h6: {
      fontWeight: 500,
      color: '#9e9e9e',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '4px',
          textTransform: 'none',
          fontWeight: 500,
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
          },
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          '&:before': {
            display: 'none',
          },
          '&$expanded': {
            margin: 0,
          },
        },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid #e0e0e0',
          '&$expanded': {
            minHeight: 48,
          },
        },
        content: {
          '&$expanded': {
            margin: '12px 0',
          },
        },
      },
    },
  },
});

const checklistSections = [
  {
    title: "PUESTA EN SERVICIO",
    items: [
      "¿Superficie de terreno es estable y nivelada?",
      "¿Se revisó material por obra antes del montaje?",
      "¿Existe mano de obra calificada?",
      "¿Existe señalización preventiva en los andamios?",
      "¿Existe fijación al terreno o a la edificación?",
      "¿La estructura de andamio presenta movimientos?",
      "¿Existen líneas de vida instaladas no autorizadas?",
      "¿Montaje acorde a planos enviados?",
      "¿Andamio es acorde al uso que se solicitó por obra?"
    ]
  },
  {
    title: "ESTRUCTURA ANDAMIO MULTIFRONT",
    items: [
      "¿Niveladores sobre placas de madera?",
      "¿Andamio se encuentra correctamente nivelado?",
      "¿Horizontales y cabezales instalados correctamente?",
      "¿Diagonales se encuentran instaladas correctamente?",
      "¿Rodapiés multifront instalados correctamente?",
      "¿Consolas y/o ménsulas instaladas correctamente?",
      "¿Accesorios adicionales instalados correctamente?",
      "¿Vigas simples o reticuladas instaladas correctamente?",
      "¿Arriostres de acuerdo a planos?"
    ]
  },
  {
    title: "ESTRUCTURA ANDAMIO FRONT",
    items: [
      "¿Niveladores sobre placas de madera?",
      "¿Andamio se encuentra correctamente nivelado?",
      "¿Marcos instalados correctamente?",
      "¿Barras horizontales instaladas correctamente?",
      "¿Rodapiés front instalados correctamente?",
      "¿Diagonales instaladas correctamente?",
      "¿Amplia plataformas instaladas correctamente?",
      "¿Traba cabezal baranda instalados correctamente?",
      "¿Accesorios adicionales instalados correctamente?",
      "¿Arriostres de acuerdo a planos?"
    ]
  },
  {
    title: "PLATAFORMAS Y TABLONES",
    items: [
      "¿Plataformas con escala instaladas correctamente?",
      "¿Tablones instalados correctamente?",
      "¿Tablones usados correctamente sin traslape?",
      "¿Plataformas y tablones sin imperfecciones ni dañados?",
      "¿Plataformas libres de residuos y otros?"
    ]
  },
  {
    title: "ANDAMIO FRONT EN VOLADO",
    items: [
      "¿Montaje acorde a planos enviados?",
      "¿Instalación de escuadras según lo recomendado?",
      "¿Escuadra para voladizo instalada correctamente?",
      "¿Vigas para voladizo instaladas correctamente?",
      "¿Nivelador para voladizo instalados correctamente?"
    ]
  }
];

export default function Formulario() {
  const [formData, setFormData] = useState({
    cliente: '',
    obra: '',
    direccion: '',
    fecha: '',
    sistema: '',
    administrador: '',
    profesionalTerreno: '',
    prevencion: '',
    bodega: '',
    email: '', // Agregado campo email
  });

  const [checklistAnswers, setChecklistAnswers] = useState({});
  const [images, setImages] = useState([]);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [expandedSection, setExpandedSection] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // Nuevo estado para manejo de carga

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.pageYOffset > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleChecklistChange = (sectionIndex, itemIndex, value) => {
    setChecklistAnswers(prevAnswers => ({
      ...prevAnswers,
      [`${sectionIndex}-${itemIndex}`]: value
    }));
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    // Validaciones de tipo y tamaño
    const validImages = files.filter(file => {
      const isValidType = ['image/jpeg', 'image/png', 'image/gif'].includes(file.type);
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB
      if (!isValidType) {
        alert(`El archivo ${file.name} no es una imagen válida.`);
      }
      if (!isValidSize) {
        alert(`El archivo ${file.name} excede el tamaño máximo permitido (5MB).`);
      }
      return isValidType && isValidSize;
    });
    setImages(prevImages => [...prevImages, ...validImages]);
  };

  const removeImage = (index) => {
    setImages(prevImages => prevImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true); // Iniciar indicador de carga

    const formDataToSend = new FormData(event.target);

    // Incluir las respuestas del checklist en los campos del formulario
    for (const key in checklistAnswers) {
      formDataToSend.append(`checklistAnswers[${key}]`, checklistAnswers[key]);
    }

    try {
      const response = await fetch('/api/sendEmail', {
        method: 'POST',
        body: formDataToSend,
      });

      const result = await response.json();

      if (response.ok) {
        alert('Formulario enviado exitosamente');
        event.target.reset(); // Resetear el formulario
        setImages([]); // Resetear las imágenes en el estado
        setChecklistAnswers({}); // Resetear las respuestas del checklist
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
      alert('Ocurrió un error al enviar el formulario.');
    } finally {
      setIsSubmitting(false); // Finalizar indicador de carga
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpandedSection(isExpanded ? panel : false);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4, position: 'relative' }}>
        <Container maxWidth="md">
          <Paper elevation={0} sx={{ p: 4, borderRadius: 2 }}>

            <Divider sx={{ my: 3 }} />
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Cliente"
                    name="cliente"
                    value={formData.cliente}
                    onChange={handleInputChange}
                    required
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Obra"
                    name="obra"
                    value={formData.obra}
                    onChange={handleInputChange}
                    required
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Dirección"
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleInputChange}
                    required
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Fecha"
                    type="date"
                    name="fecha"
                    value={formData.fecha}
                    onChange={handleInputChange}
                    InputLabelProps={{ shrink: true }}
                    required
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required variant="outlined">
                    <FormLabel>Sistema</FormLabel>
                    <Select
                      name="sistema"
                      value={formData.sistema}
                      onChange={handleInputChange}
                    >
                      <MenuItem value="ESTANDAR">ESTÁNDAR</MenuItem>
                      <MenuItem value="FRONT">FRONT</MenuItem>
                      <MenuItem value="MULTIFRONT">MULTIFRONT</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Administrador"
                    name="administrador"
                    value={formData.administrador}
                    onChange={handleInputChange}
                    required
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Profesional de terreno"
                    name="profesionalTerreno"
                    value={formData.profesionalTerreno}
                    onChange={handleInputChange}
                    required
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Prevención"
                    name="prevencion"
                    value={formData.prevencion}
                    onChange={handleInputChange}
                    required
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Bodega"
                    name="bodega"
                    value={formData.bodega}
                    onChange={handleInputChange}
                    required
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email" // Aseguramos que el campo sea de tipo email
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    variant="outlined"
                  />
                </Grid>
              </Grid>

              {/* Subir Imágenes */}
              <Box sx={{ mt: 4, mb: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Subir Imágenes
                </Typography>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="raised-button-file"
                  name="attachments"
                  multiple
                  type="file"
                  onChange={handleImageUpload}
                />
                <label htmlFor="raised-button-file">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<CloudUpload />}
                  >
                    Seleccionar Imágenes
                  </Button>
                </label>
              </Box>
              <Grid container spacing={2}>
                {images.map((image, index) => (
                  <Grid item xs={4} key={index}>
                    <Paper elevation={2} sx={{ position: 'relative', p: 1 }}>
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Uploaded ${index + 1}`}
                        style={{ width: '100%', height: '100px', objectFit: 'cover' }}
                      />
                      <IconButton
                        size="small"
                        sx={{ position: 'absolute', top: 4, right: 4, bgcolor: 'background.paper' }}
                        onClick={() => removeImage(index)}
                      >
                        <Close fontSize="small" />
                      </IconButton>
                    </Paper>
                  </Grid>
                ))}
              </Grid>

              {/* Checklist de Inspección */}
              <Box sx={{ mt: 4 }}>
                <Typography variant="h6" gutterBottom>
                  Checklist de Inspección
                </Typography>
                {checklistSections.map((section, sectionIndex) => (
                  <Accordion 
                    key={sectionIndex} 
                    expanded={expandedSection === `panel${sectionIndex}`} 
                    onChange={handleAccordionChange(`panel${sectionIndex}`)}
                    sx={{ 
                      mb: 2, 
                      border: '1px solid #e0e0e0', 
                      borderRadius: '4px',
                      '&:nth-of-type(odd)': { bgcolor: '#e8eaf6' },
                      '&:nth-of-type(even)': { bgcolor: '#f5f5f5' },
                    }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMore />}
                    >
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
                        {section.title}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      {section.items.map((item, itemIndex) => (
                        <FormControl component="fieldset" key={itemIndex} sx={{ mb: 2, width: '100%' }}>
                          <FormLabel component="legend" sx={{ mb: 1 }}>{item}</FormLabel>
                          <RadioGroup
                            row
                            name={`checklistAnswers[${sectionIndex}-${itemIndex}]`}
                            value={checklistAnswers[`${sectionIndex}-${itemIndex}`] || ''}
                            onChange={(e) => handleChecklistChange(sectionIndex, itemIndex, e.target.value)}
                          >
                            <FormControlLabel value="SI" control={<Radio />} label="SI" />
                            <FormControlLabel value="NO" control={<Radio />} label="NO" />
                            <FormControlLabel value="NO APLICA" control={<Radio />} label="NO APLICA" />
                          </RadioGroup>
                        </FormControl>
                      ))}
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Box>

              {/* Botón de Envío Dentro del Formulario */}
              <Box sx={{ position: 'relative', mt: 4 }}>


                {/* Floating Action Button Dentro del Formulario */}
                <Fab
                  variant="extended"
                  color="primary"
                  aria-label="Enviar formulario"
                  sx={{
                    position: 'fixed',
                    bottom: 16,
                    right: 16,
                  }}
                  type="submit" // Cambiar a tipo 'submit'
                  disabled={isSubmitting}
                >
                  <Send sx={{ mr: 1 }} />
                  {isSubmitting ? 'Enviando...' : 'Enviar'}
                </Fab>
              </Box>
            </form>
          </Paper>
        </Container>

        {/* Scroll to top button */}
        {showScrollTop && (
          <Zoom in={showScrollTop}>
            <Fab
              color="secondary"
              size="small"
              aria-label="scroll back to top"
              sx={{
                position: 'fixed',
                bottom: 80,
                right: 16,
              }}
              onClick={scrollToTop}
            >
              <KeyboardArrowUp />
            </Fab>
          </Zoom>
        )}
      </Box>
    </ThemeProvider>
  );
}
