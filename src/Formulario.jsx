import React, { useState } from 'react';
import { Button,TextField,Radio,RadioGroup,FormControl,FormControlLabel,FormLabel,Select,MenuItem,Accordion,AccordionSummary,AccordionDetails,Typography,Card,CardContent,CardHeader,Grid,IconButton,} from '@mui/material';
import { ExpandMore, Close } from '@mui/icons-material';
import { ThemeProvider, createTheme } from '@mui/material/styles';


const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
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

export default function Component() {
  const [formData, setFormData] = useState({
    cliente: '',
    obra: '',
    direccion: '',
    fecha: '',
    sistema: '',
    administrador: '',
    profesionalTerreno: '',
    prevencion: '',
    bodega: ''
  });

  const [checklistAnswers, setChecklistAnswers] = useState({});
  const [images, setImages] = useState([]);

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
    setImages(prevImages => [...prevImages, ...files]);
  };

  const removeImage = (index) => {
    setImages(prevImages => prevImages.filter((_, i) => i !== index));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log({ formData, checklistAnswers, images });
    // Aquí puedes manejar el envío del formulario
  };

  return (
    <ThemeProvider theme={theme}>
      <form onSubmit={handleSubmit} style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
        <Card elevation={3} style={{ marginBottom: '20px' }}>
          <CardHeader
            title="DESARROLLO INSPECCIÓN"
            subheader="REGISTRO DE OBRA"
            titleTypographyProps={{ align: 'center', variant: 'h4' }}
            subheaderTypographyProps={{ align: 'center' }}
          />
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Cliente"
                  name="cliente"
                  value={formData.cliente}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Obra"
                  name="obra"
                  value={formData.obra}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Dirección"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleInputChange}
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
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
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
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Profesional de terreno"
                  name="profesionalTerreno"
                  value={formData.profesionalTerreno}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Prevención"
                  name="prevencion"
                  value={formData.prevencion}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Bodega"
                  name="bodega"
                  value={formData.bodega}
                  onChange={handleInputChange}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Card elevation={3} style={{ marginBottom: '20px' }}>
          <CardHeader title="Subir Imágenes" />
          <CardContent>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="raised-button-file"
              multiple
              type="file"
              onChange={handleImageUpload}
            />
            <label htmlFor="raised-button-file">
              <Button variant="contained" component="span">
                Seleccionar Imágenes
              </Button>
            </label>
            <Grid container spacing={2} style={{ marginTop: '20px' }}>
              {images.map((image, index) => (
                <Grid item xs={4} key={index}>
                  <div style={{ position: 'relative' }}>
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Uploaded ${index + 1}`}
                      style={{ width: '100%', height: '100px', objectFit: 'cover' }}
                    />
                    <IconButton
                      size="small"
                      style={{ position: 'absolute', top: 0, right: 0, background: 'white' }}
                      onClick={() => removeImage(index)}
                    >
                      <Close />
                    </IconButton>
                  </div>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>

        <Card elevation={3} style={{ marginBottom: '20px' }}>
          <CardHeader title="Checklist de Inspección" />
          <CardContent>
            {checklistSections.map((section, sectionIndex) => (
              <Accordion key={sectionIndex}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography>{section.title}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {section.items.map((item, itemIndex) => (
                    <FormControl component="fieldset" key={itemIndex} style={{ marginBottom: '15px' }}>
                      <FormLabel component="legend">{item}</FormLabel>
                      <RadioGroup
                        row
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
          </CardContent>
        </Card>

        <Button type="submit" variant="contained" color="primary" fullWidth>
          Enviar formulario
        </Button>
      </form>
    </ThemeProvider>
  );
}