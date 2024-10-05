// api/sendEmail.js

import nodemailer from 'nodemailer';
import formidable from 'formidable';
import fs from 'fs';

// Configuración para deshabilitar el bodyParser, necesario para manejar archivos
export const config = {
  api: {
    bodyParser: false,
  },
};

// Definir nombres de secciones e ítems en el checklist
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
  // ... (resto de las secciones)
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

export default async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  const form = new formidable.IncomingForm({
    multiples: true, // Permitir múltiples archivos
    maxFileSize: 5 * 1024 * 1024, // 5MB por archivo
  });

  try {
    const { fields, files } = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    });

    // Validaciones de campos
    const requiredFields = ['cliente', 'obra', 'direccion', 'fecha', 'email'];
    const missingFields = requiredFields.filter(field => !fields[field]);
    if (missingFields.length > 0) {
      return res.status(400).json({ message: `Faltan campos requeridos: ${missingFields.join(', ')}` });
    }

    // Formatear las respuestas del checklist usando nombres de secciones e ítems
    let formattedChecklist = '';
    Object.keys(fields).forEach((key) => {
      if (key.startsWith('checklistAnswers[')) {
        const sectionItem = key.match(/checklistAnswers\[(\d+)-(\d+)\]/);
        if (sectionItem) {
          const sectionIndex = parseInt(sectionItem[1], 10);
          const itemIndex = parseInt(sectionItem[2], 10);
          const sectionTitle = checklistSections[sectionIndex]?.title || 'Desconocido';
          const itemTitle = checklistSections[sectionIndex]?.items[itemIndex] || 'Desconocido';
          const answer = fields[key];

          formattedChecklist += `
            <tr>
              <td>${sectionTitle}</td>
              <td>${itemTitle}</td>
              <td>${answer}</td>
            </tr>`;
        }
      }
    });

    // Preparar los adjuntos (imágenes)
    let attachments = [];
    if (files.attachments) {
      const attachmentsArray = Array.isArray(files.attachments) ? files.attachments : [files.attachments];
      attachments = attachmentsArray.map(file => ({
        filename: file.originalFilename,
        content: fs.readFileSync(file.filepath),
        contentType: file.mimetype,
      }));
    }

    // Configurar Nodemailer para enviar el correo
    let transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER, // Tu correo de Gmail
        pass: process.env.EMAIL_PASS, // Tu contraseña de Gmail o contraseña de aplicación
      },
    });

    // Formatear el correo en HTML
    const htmlContent = `
      <h1>Formulario de Inspección</h1>
      <p><strong>Cliente:</strong> ${fields.cliente}</p>
      <p><strong>Obra:</strong> ${fields.obra}</p>
      <p><strong>Dirección:</strong> ${fields.direccion}</p>
      <p><strong>Fecha:</strong> ${fields.fecha}</p>
      <p><strong>Sistema:</strong> ${fields.sistema}</p>
      <p><strong>Administrador:</strong> ${fields.administrador}</p>
      <p><strong>Profesional de Terreno:</strong> ${fields.profesionalTerreno}</p>
      <p><strong>Prevención:</strong> ${fields.prevencion}</p>
      <p><strong>Bodega:</strong> ${fields.bodega}</p>

      <h2>Respuestas del Checklist</h2>
      <table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse;">
        <thead>
          <tr>
            <th>Sección</th>
            <th>Ítem</th>
            <th>Respuesta</th>
          </tr>
        </thead>
        <tbody>
          ${formattedChecklist}
        </tbody>
      </table>
    `;

    // Configurar el correo
    let mailOptions = {
      from: fields.email, // Remitente (puede ser el email del usuario)
      to: 'reneframirez@gmail.com', // Destinatario fijo
      subject: 'Nuevo Formulario de Inspección',
      html: htmlContent, // Enviar el contenido en formato HTML
      attachments: attachments, // Adjuntar imágenes
    };

    // Enviar el correo
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Correo enviado exitosamente' });

  } catch (error) {
    console.error('Error al procesar el formulario:', error);
    res.status(500).json({ message: 'Error al procesar el formulario', error: error.message || error });
  }
};
