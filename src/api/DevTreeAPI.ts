import api from "../config/axios";
import { isAxiosError } from "axios";
import type { LoginFormData, User, UserHandle } from "../types";

export async function login(formData : LoginFormData) {
    try {
        const { data } = await api.post('/auth/login', formData);
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message || 'Error al iniciar sesión');
        }
    }
}

export async function getUser() {
    try {
        const { data } = await api<User>('/user');
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message || 'Error al obtener el usuario');
        }
    }
}

export async function updateProfile(formData: User) {
    try {
        const { data } = await api.patch('/user', formData);
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message || 'No fue posible actualizar el perfil');
        }
    }
}

export async function uploadImage(file: File) {
    let formData = new FormData()
    formData.append('file', file)

    try {
        const { data: {image} } : { data: { message: string, image: string}} = await api.post('/user/image', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return image;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message || 'Error al subir la imagen');
        }
    }
}

export async function getUserByHandle(handle: string) {
    try {
        const { data } = await api<UserHandle>(`/${handle}`);
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message || 'Error al obtener el usuario por handle');
        }
    }
}

export async function searchByHandle(handle: string) {
    try {
        const { data } = await api.post<string>('/search', { handle });
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message || 'Error al buscarasdasd el handle');
        }
    }
}