import { Link } from "react-router-dom";

export default function HomeNavigation() {
    return (
        <>
        <Link to='/auth/login' className="text-white p-2 uppercase font-black text-xs cursor-pointer">Iniciar sesión</Link>
        <Link to='/auth/register' className="bg-lime-500 text-slate-800 p-2 rounded-lg uppercase font-black text-xs cursor-pointer">Registrarme</Link>
        </>
    )
}
