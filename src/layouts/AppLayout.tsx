import {  Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getUser } from "../api/DevTreeAPI";
import DevTree from "../components/DevTree";

export default function AppLayout() {

    const { data, isLoading, isError } = useQuery({
        queryKey: ['user'],
        queryFn: getUser,
        retry: 2,
        refetchOnWindowFocus: false,
    });

    if (isLoading) {
        return <div>Cargando...</div>
    }

    if (isError) {
        return <Navigate to="/auth/login" replace={true} />
    }

    if (data) return <DevTree data={data} />
}
