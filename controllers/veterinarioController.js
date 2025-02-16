import Veterinario from '../models/Veterinario.js';
import generarJWT from '../helpers/generarJWT.js';
import generarId from '../helpers/generarId.js';
import emailRegistro from '../helpers/emailRegistro.js';
import emailOlvidePassword from '../helpers/emailOlvidePassword.js';

const registrar = async (req, res) => {
    const { email, nombre } = req.body;

    // Prevenir usuarios duplicados
    const existeUsuario = await Veterinario.findOne({ email });

    if(existeUsuario) {
        const error = new Error('Usuario ya registrado');
        return res.status(400).json({ msg: error.message });
    }

    try {
        // Guardar un nuevo veterinario
        const veterinario = new Veterinario(req.body);
        const veterinarioGuardado = await veterinario.save();

        // Enviar el email
        emailRegistro({
            email,
            nombre,
            token: veterinarioGuardado.token
        });

        res.send(veterinarioGuardado);
    } catch (error) {
        console.log(error);
    }

    
};

const perfil = (req, res) => {
    const { veterinario} = req;
    res.send(veterinario);
};

const confirmar = async (req, res) => {
    const { token } = req.params;

    const usuarioConfirmar = await Veterinario.findOne({ token });

    if(!usuarioConfirmar) {
        const error = new Error('Token invalido');
        return res.status(404).json({ msg: error.message });
    }

    try {
        usuarioConfirmar.token = null;
        usuarioConfirmar.confirmado = true;
        await usuarioConfirmar.save();

        res.json({ msg: 'Usuario confirmado correctamente' })
    } catch (error) {
        console.log(error)
    }
};

const autenticar = async (req, res) => {
    const { email, password } = req.body;

    // Comprobar si el usuario existe
    const usuario = await Veterinario.findOne({email})

    if(!usuario) {
        const error = new Error('El usuario no existe');
        return res.status(403).json({ msg: error.message });
    }

    // Comprobar si el usuario esta autenticado
    if(!usuario.confirmado) {
        const error = new Error('Tu cuenta no ha sido confirmada');
        return res.status(403).json({ msg: error.message });
    }

    // Revisar el password
    if(await usuario.comprobarPassword(password)) {
        // Autenticar obteniendo la informacion del usuario
        res.json({
            _id: usuario.id,
            nombre: usuario.nombre,
            email: usuario.email,
            token: generarJWT(usuario.id)
        });
    } else {
        const error = new Error('La contraseña es incorrecta');
        return res.status(403).json({ msg: error.message });
    }
};

const olvidePassword = async (req, res) => {
    const { email } = req.body;

    const existeVeterinario = await Veterinario.findOne({ email });
    if(!existeVeterinario) {
        const error = new Error('El usuario no exitse');
        return res.status(400).json({ msg: error.message });
    }

    try {
        existeVeterinario.token = generarId();
        await existeVeterinario.save();

        // Enviar email
        emailOlvidePassword({
            email,
            nombre: existeVeterinario.nombre,
            token: existeVeterinario.token
        });

        res.json({ msg: 'Hemos enviado un email con las instrucciones' });
    } catch (error) {
        console.log(error);
    }
};

const comprobarToken = async (req, res) => {
    const { token } = req.params;

    const tokenValido = await Veterinario.findOne({ token });
    if(tokenValido) {
        // Revisa si el token es valido y el usuario existe
        res.json({ msg: 'Token valido y el usuario existe' });
    } else {
        const error = new Error('Token invalido');
        return res.status(400).json({ msg: error.message });
    }
};

const nuevoPassword = async (req, res) => {
    const { token } = req.params;
    const  { password } = req.body;

    const veterinario = await Veterinario.findOne({ token });
    if(!veterinario) {
        const error = new Error('Hubo un error');
        return res.status(400).json({ msg: error.message });
    }

    try {
        veterinario.token = null;
        veterinario.password = password;
        await veterinario.save();
        res.json({ msg: 'Contraseña actualizada correctamente' });
        console.log(veterinario);
    } catch (error) {
        console.log(error);
    }
};

const actualizarPerfil = async (req, res) => {
    const veterinario = await Veterinario.findById(req.params.id)
    if(!veterinario) {
        const error = new Error('Hubo un error')
        return res.status(400).json({ msg: error.message })
    }

    const { email } = req.body
    if(veterinario.email !== req.body.email) {
        const existeEmail = await Veterinario.findOne({ email })
        if(existeEmail) {
            const error = new Error('Este email ya esta en uso')
            return res.status(400).json({ msg: error.message })
        }
    }

    try {
        veterinario.nombre = req.body.nombre
        veterinario.email = req.body.email
        veterinario.web = req.body.web
        veterinario.telefono = req.body.telefono

        const veterinarioActualizado = await veterinario.save()
        res.json(veterinarioActualizado)
    } catch (error) {
        console.log(error)
    }
}

const actualizarPassword = async (req, res) => {
    // Leer datos
    const { id } = req.veterinario
    const { pwd_actual, pwd_nuevo } = req.body

    // Comprobar que el veterinario existe
    const veterinario = await Veterinario.findById(id)
    if(!veterinario) {
        const error = new Error('Hubo un error')
        return res.status(400).json({ msg: error.message })
    }

    // Comprobar su password
    if(await veterinario.comprobarPassword(pwd_actual)) {
        // Almacenar el nuevo password
        veterinario.password = pwd_nuevo
        await veterinario.save()
        res.json({ msg: 'Contraseña actualizada correctamente' })
    } else {
        const error = new Error('La contraseña actual es incorrecta')
        return res.status(400).json({ msg: error.message })
    }
}

export { registrar, perfil, confirmar, autenticar, olvidePassword, comprobarToken, nuevoPassword, actualizarPerfil, actualizarPassword };