import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

export default function AdminNavigation() {

    const queryClient = useQueryClient();

    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem('AUTH_TOKEN');
        queryClient.removeQueries({ queryKey: ['user'] });
        queryClient.clear();
        navigate('/auth/login');
    }

    return ( 
        <button onClick={logout} className=" bg-lime-500 p-2 text-slate-800 uppercase font-black text-xs rounded-lg cursor-pointer">
            Cerrar Sesión
        </button>
    )
}
