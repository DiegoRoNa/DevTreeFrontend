import type { SocialNetwork, UserHandle } from "../types"

type HandleDataProps = {
    data: UserHandle
}

export default function HandleData({data} : HandleDataProps) {

    const links : SocialNetwork[] = JSON.parse(data.links).filter((link: SocialNetwork) => link.enabled);

    return (
        <div className="space-y-6 text-white">
            <p className="text-5xl text-center font-black">{data.handle}</p>

            {data.image && <img src={data.image} alt="Imagen perfil" className="max-w-62.5 mx-auto"/>}

            <p className="text-lg text-center font-bold">{data.description}</p>

            <div className="mt-20 flex flex-col gap-6">
                {links.length ? 
                    
                    links.map(link => (
                        <a href={link.url} target="_blank" rel="noreferrer noopener" 
                            className="bg-white px-5 py-2 flex items-center gap-5 rounded-lg"
                            key={link.name}
                        >
                            <img src={`${import.meta.env.BASE_URL}/social/icon_${link.name}.svg`} alt="Imagen red social" className="w-12" />
                            <p className="text-black capitalize font-bold text-lg">Visita mi: {link.name}</p>
                        </a>
                    )) 
                    
                    : (<p className="text-center font-bold text-lg">Este usuario no ha agregado enlaces sociales</p>
                )}
            </div>

        </div>
    )
}
