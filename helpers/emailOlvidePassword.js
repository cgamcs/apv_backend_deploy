import sendEmail from './emailResend.js';

const emailOlvidePassword = async (datos) => {
  const { email, nombre, token } = datos;

  const html = `
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Restablecer Contraseña</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                padding: 20px;
                text-align: center;
            }
            .container {
                max-width: 600px;
                background-color: #ffffff;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
                margin: auto;
            }
            .button {
                display: inline-block;
                background-color: #4F46E5;
                color: white;
                padding: 12px 20px;
                text-decoration: none;
                border-radius: 5px;
                font-size: 16px;
                margin-top: 10px;
            }
            @media (max-width: 600px) {
                .container {
                    padding: 15px;
                }
                .button {
                    padding: 10px 15px;
                    font-size: 14px;
                }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h2 style="color: #4F46E5;">Hola ${nombre}, has solicitado restablecer tu contraseña.</h2>
            <p style="color: #333; font-size: 16px;">Haz clic en el siguiente enlace para generar una nueva contraseña</p>
            <a href="${process.env.FRONTEND_URL}/olvide-password/${token}" class="button">Restablecer contraseña</a>
            <p style="color: #777; font-size: 14px; margin-top: 20px;">Si tú no creaste esta cuenta, puedes ignorar este mensaje.</p>
        </div>
    </body>
    </html>
  `;

  try {
    await sendEmail({
      to: email,
      subject: "Restablece tu contraseña",
      html
    });
    console.log('Email de recuperación enviado a:', email);
  } catch (error) {
    console.error('Error al enviar email de recuperación:', error);
  }
};

export default emailOlvidePassword;