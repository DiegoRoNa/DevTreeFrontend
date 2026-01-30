import { useEffect, useState } from "react"
import { social } from "../data/social"
import DevTreeInput from "../components/DevTreeInput";
import { isValidUrl } from "../utils";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfile } from "../api/DevTreeAPI";
import type { SocialNetwork, User } from "../types";

export default function LinkTreeView() {
    const [devTreeLinks, setDevTreeLinks] = useState(social);

    const queryClient = useQueryClient();
    const user : User = queryClient.getQueryData(['user'])!;

    const { mutate } = useMutation({
        mutationFn: updateProfile,
        onSuccess: () => {
            toast.success('Enlaces actualizados correctamente');
        },
        onError: (error) => {
            toast.error(error.message || 'Error al actualizar los enlaces');
        }
    })

    // Al cargar el componente, sincronizar los enlaces con los del usuario
    useEffect(() => {
        const updatedLinks = devTreeLinks.map(link => {
            const userLink = user && user.links ? JSON.parse(user.links).find((l: SocialNetwork) => l.name === link.name) : null;
            if (userLink) {
                return { ...link, url: userLink.url, enabled: userLink.enabled };
            }
            return link;
        });

        setDevTreeLinks(updatedLinks);
    }, []);

    // Manejar el cambio de URL en los inputs
    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const updatedLinks = devTreeLinks.map(link => link.name === e.target.name ? { ...link, url: e.target.value } : link);
        setDevTreeLinks(updatedLinks);
    }

    // Leer los enlaces del usuario desde el cache de react query (base de datos)
    const links = JSON.parse(user.links) as SocialNetwork[];

    // Manejar la habilitación/deshabilitación de un enlace
    const handleEnableLink = (name: string) => {

        // validar si la url es valida antes de habilitar
        const updatedLinks = devTreeLinks.map(link => {
            if (link.name === name) {
                if (isValidUrl(link.url)) {
                    return { ...link, enabled: !link.enabled };
                } else {
                    toast.error('Por favor ingresa una URL válida antes de habilitar el enlace.');
                }
            }
            return link;
        });

        // actualizar el estado de los enlaces
        setDevTreeLinks(updatedLinks);

        // actualizar los enlaces en el cache de react query
        let updatedItems: SocialNetwork[] = []

        // encontrar el enlace seleccionado
        const selectedSocialNetworks = updatedLinks.find(link => link.name === name);

        // si el enlace fue habilitado
        if (selectedSocialNetworks?.enabled) {
            
            const id = links.filter(link => link.id).length + 1; // asignar un id al nuevo enlace

            if (links.some(link => link.name === name)) { // si el enlace ya existe, solo actualizarlo
                updatedItems = links.map(link => link.name === name ? { ...link, enabled: true, id } : link);

            } else { // si el enlace no existe, agregarlo
                const newItem = { ...selectedSocialNetworks, id };
                updatedItems = [...links, newItem];
            }
            
        // si el enlace fue deshabilitado
        } else {
            const indexToUpdate = links.findIndex(link => link.name === name); // encontrar el indice del enlace a deshabilitar

            // reasignar los ids de los enlaces que vienen despues del enlace deshabilitado
            updatedItems = links.map(link => {
                if (link.name === name) { // deshabilitar el enlace
                    return { ...link, id: 0, enabled: false };
                }

                if (link.id > indexToUpdate && (indexToUpdate !== 0 && link.id === 1)) { // reasignar ids
                    return { ...link, id: link.id - 1 };
                }
                
                return link;
            });
        }
    
        // actualizar el cache de react query
        queryClient.setQueryData(['user'], (prevData: User) => {
            return { ...prevData, links: JSON.stringify(updatedItems) }
        });
    }

    return (
        <div className="space-y-5">
            {devTreeLinks.map((link) => (
                <DevTreeInput key={link.name} link={link} handleUrlChange={handleUrlChange} handleEnableLink={handleEnableLink} />
            ))}

            <button className="bg-cyan-400 p-2 text-lg w-full uppercase text-slate-600 rounded-lg font-bold cursor-pointer"
                    onClick={() => mutate(queryClient.getQueryData(['user'])!)}
            >
                Guardar cambios
            </button>
        </div>
    )
}
