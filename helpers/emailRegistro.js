import nodemailer from 'nodemailer';

const emailRegistro = async (datos) => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const { email, nombre, token } = datos;

    // Enviar el email
    const info = await transporter.sendMail({
        from: "APV - Administrador de Pacientes de Veterinaria",
        to: email,
        subject: "Comprueba tu cuenta en APV",
        text: "Comprueba tu cuenta en APV",
        html: `
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <title>Confirmación de Cuenta</title>
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
                    <h2 style="color: #4F46E5;">¡Bienvenido a APV, ${nombre}!</h2>
                    <p style="color: #333; font-size: 16px;">Tu cuenta está casi lista, solo debes confirmarla haciendo clic en el siguiente botón:</p>
                    <a href="${process.env.FRONTEND_URL}/confirmar/${token}" class="button">Confirmar Cuenta</a>
                    <p style="color: #777; font-size: 14px; margin-top: 20px;">Si tú no creaste esta cuenta, puedes ignorar este mensaje.</p>
                </div>
            </body>
            </html>
        `
    });

    console.log('Mensaje enviado: %s', info.messageId);
}

export default emailRegistro;