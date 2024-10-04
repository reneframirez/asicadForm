// api/sendEmail.js

const nodemailer = require('nodemailer');
const formidable = require('formidable');
const fs = require('fs');

// Desactivar el bodyParser para manejar archivos
export const config = {
  api: {
    bodyParser: false,
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

    // Configurar el transportador de Nodemailer
    let transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER, // Tu correo electrónico
        pass: process.env.EMAIL_PASS, // Contraseña de aplicación
      },
    });

    // Preparar los adjuntos
    let attachments = [];
    if (files.attachments) {
      if (Array.isArray(files.attachments)) {
        attachments = files.attachments.map(file => ({
          filename: file.originalFilename,
          content: fs.readFileSync(file.filepath),
          contentType: file.mimetype,
        }));
      } else {
        attachments.push({
          filename: files.attachments.originalFilename,
          content: fs.readFileSync(files.attachments.filepath),
          contentType: files.attachments.mimetype,
        });
      }
    }

    // Configurar el correo
    let mailOptions = {
      from: fields.email, // Remitente (puede ser el email del usuario)
      to: 'reneframirez@gmail.com', // Destinatario fijo
      subject: 'Nuevo Formulario de Inspección',
      text: `
        Nombre: ${fields.cliente}
        Obra: ${fields.obra}
        Dirección: ${fields.direccion}
        Fecha: ${fields.fecha}
        Sistema: ${fields.sistema}
        Administrador: ${fields.administrador}
        Profesional de terreno: ${fields.profesionalTerreno}
        Prevención: ${fields.prevencion}
        Bodega: ${fields.bodega}

        Checklist:
        ${JSON.stringify(fields.checklistAnswers, null, 2)}
      `,
      attachments: attachments,
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
