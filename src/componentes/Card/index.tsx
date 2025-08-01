import './style.css';

export function Card({ list } : { list: any[] }) {
    return (
        <>
            {list.map((item: any, index: number) => (
                <div className="card_container" key={index}>
                    <div className="card_header">
                        <h3>{item.titulo}</h3>
                        {item.icon}
                    </div>
                    <p>{item.descricao}</p>
                </div>
            ))}
        </>
    )
}