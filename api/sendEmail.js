// api/sendEmail.js

const nodemailer = require('nodemailer');
const formidable = require('formidable');
const fs = require('fs');

export const config = {
  api: {
    bodyParser: false, // Desactivar el bodyParser para manejar archivos
  },
};

export default async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  const form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Error al procesar el formulario:', err);
      return res.status(500).json({ message: 'Error al procesar el formulario', error: err });
    }

    // Validaciones básicas
    const requiredFields = ['cliente', 'obra', 'direccion', 'fecha', 'email'];
    const missingFields = requiredFields.filter(field => !fields[field]);
    if (missingFields.length > 0) {
      return res.status(400).json({ message: `Faltan campos requeridos: ${missingFields.join(', ')}` });
    }

    // Validar el formato del email del remitente
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(fields.email)) {
      return res.status(400).json({ message: 'Email inválido.' });
    }

    // Limitar el número de imágenes adjuntas
    let attachments = [];
    if (files.attachments) {
      const attachmentsArray = Array.isArray(files.attachments) ? files.attachments : [files.attachments];

      if (attachmentsArray.length > 5) {
        return res.status(400).json({ message: 'Puedes adjuntar hasta 5 imágenes.' });
      }

      // Preparar los adjuntos
      attachments = attachmentsArray.map(file => ({
        filename: file.originalFilename,
        content: fs.readFileSync(file.filepath),
        contentType: file.mimetype,
      }));
    }

    // Formatear las respuestas del checklist
    const formattedChecklist = Object.keys(fields)
      .filter(key => key.startsWith('checklistAnswers['))
      .map(key => {
        const sectionItem = key.match(/checklistAnswers\[(\d+)-(\d+)\]/);
        if (sectionItem) {
          const section = parseInt(sectionItem[1], 10) + 1;
          const item = parseInt(sectionItem[2], 10) + 1;
          return `Sección ${section}, Ítem ${item}: ${fields[key]}`;
        }
        return '';
      })
      .join('\n');

    // Configurar el transportador de Nodemailer
    let transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER, // Tu correo electrónico de Gmail
        pass: process.env.EMAIL_PASS, // Contraseña de aplicación de Gmail
      },
    });

    // Configurar el correo
    let mailOptions = {
      from: fields.email, // Remitente (correo del usuario)
      to: 'reneframirez@gmail.com', // Destinatario fijo
      subject: 'Nuevo Formulario de Inspección',
      text: `
        Nombre del Cliente: ${fields.cliente}
        Obra: ${fields.obra}
        Dirección: ${fields.direccion}
        Fecha: ${fields.fecha}
        Sistema: ${fields.sistema}
        Administrador: ${fields.administrador}
        Profesional de Terreno: ${fields.profesionalTerreno}
        Prevención: ${fields.prevencion}
        Bodega: ${fields.bodega}

        Respuestas del Checklist:
        ${formattedChecklist}
      `,
      attachments: attachments, // Incluye las imágenes adjuntas
    };

    try {
      await transporter.sendMail(mailOptions);
      res.status(200).json({ message: 'Correo enviado exitosamente' });
    } catch (error) {
      console.error('Error al enviar el correo:', error);
      res.status(500).json({ message: 'Error al enviar el correo', error });
    }
  });
};
