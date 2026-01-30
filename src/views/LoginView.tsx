import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import type { LoginFormData } from "../types";
import ErrorMessage from "../components/ErrorMessage";
import { useState } from "react";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login } from "../api/DevTreeAPI";

export default function LoginView() {

    const navigate = useNavigate();

    const queryClient = useQueryClient();

    const [loading, setLoading] = useState(false);
    
    const initialValues : LoginFormData = {
        email: '',
        password: '',
    };
    
    const { register, handleSubmit, reset, formState: { errors } } = useForm({ defaultValues: initialValues });

    const userLogin = useMutation({
        mutationFn: login,
        onSuccess: (data) => {
            localStorage.setItem('AUTH_TOKEN', data.token);

            queryClient.invalidateQueries({ queryKey: ['user'] });
            
            toast.success(data.message || 'Bienvenido de nuevo');
            reset();
            navigate('/admin');
        },
        onError: (error) => {
            toast.error(error.message || 'Error al iniciar sesión');
        }
    })

    const handleLogin = async (formData : LoginFormData) => {
        setLoading(true);
        userLogin.mutate(formData);
    }

    return (
        <>
        <h1 className="text-4xl text-white font-bold">Inicia sesión</h1>

        <form  onSubmit={handleSubmit(handleLogin)} className="bg-white px-5 py-20 rounded-lg space-y-10 mt-10" noValidate>
            <div className="grid grid-cols-1 space-y-3">
                <label htmlFor="email" className="text-2xl text-slate-500">Correo electrónico</label>
                <input id="email" type="email" placeholder="Correo electrónico de Registro" className="bg-slate-100 border-none p-3 rounded-lg placeholder-slate-400"
                    {...register("email", {
                        required: "El correo electrónico es obligatorio",
                        pattern: {
                            value: /\S+@\S+\.\S+/,
                            message: "E-mail no válido",
                        },
                    })}
                />
                {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
            </div>
            <div className="grid grid-cols-1 space-y-3">
                <label htmlFor="password" className="text-2xl text-slate-500">Password</label>
                <input id="password" type="password" placeholder="Contraseña de Registro" className="bg-slate-100 border-none p-3 rounded-lg placeholder-slate-400"
                    {...register("password", {
                        required: "La contraseña es obligatorio",
                    })}
                />
                {errors.password && <ErrorMessage>{errors.password.message}</ErrorMessage>}
            </div>

            <input type="submit" value={loading ? 'Enviando datos' : 'Iniciar Sesión'} disabled={loading}
                className="bg-cyan-400 p-3 text-lg w-full uppercase text-slate-600 rounded-lg font-bold cursor-pointer"
            />
        </form>
     
        <nav className="mt-10">
            <Link to="/auth/register" className="text-center text-white text-lg block">¿No tienes cuenta? Crea una aquí</Link>
        </nav>
        </>
    )
}
