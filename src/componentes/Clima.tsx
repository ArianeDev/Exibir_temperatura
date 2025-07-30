import { useState } from "react";
import axios from "axios";
import './style.css';
import { format } from "date-fns";

// Duas formas de criar = interface e type
interface WeatherResponse {
    location: {
        name: string;
        country: string;
        localtime: number;
    };
    current: {
        temp_c: number;  
        humidity: number; 
        wind_kph: number;
        feelslike_c: number;
        last_updated: number;
        condition: {
            icon: string;
            text: string;
        }
    };
}

export function Clima() {
    const [cidade, setCidade] = useState("");
    const [temperatura, setTemperatura] = useState <number | null>();
    const [nome_cidade, setNome_cidade] = useState("");
    const [umidade, setUmidade] = useState<number | null>();
    const [velocidadeVento, setVelocidadeVento] = useState<number | null>();
    const [sensacaoTermica, setSensacaoTermica] = useState<number | null>();
    const [ultimaAtualizacao, setUltimaAtualizacao] = useState("");
    const [data, setData] = useState("");
    const [icon, setIcon] = useState<string | null>();
    const [texto, setTexto] = useState<string | null>();
    const [erro, setErro] = useState("");

    async function buscarClima() {
        if (!cidade) return;

        try {
            const apiKey = 'b3d53c5b46a54120897161645252907';
            const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${cidade}&lang=pt`;

            const resposta = await axios.get<WeatherResponse>(url);

            const dataAtual = resposta.data.location.localtime;
            const dataFormatadaAtual = format(dataAtual, 'dd/MM/yyyy HH:mm');

            const dataUltimaAtualizacao = resposta.data.current.last_updated;
            const dataFormatadaAtualizada = format(dataUltimaAtualizacao, 'dd/MM/yyyy HH:mm');

            setNome_cidade(resposta.data.location.name);
            setTemperatura(resposta.data.current.temp_c);
            setUmidade(resposta.data.current.humidity);
            setVelocidadeVento(resposta.data.current.wind_kph);
            setSensacaoTermica(resposta.data.current.feelslike_c);
            setUltimaAtualizacao(dataFormatadaAtualizada);
            setData(dataFormatadaAtual);
            setIcon(resposta.data.current.condition.icon);
            setTexto(resposta.data.current.condition.text);
            
            setErro('');
        } catch {
            setErro('Cidade não encontrada');
            setTemperatura(null);
            setNome_cidade("");
        }
    }

    return(
        <main {...texto == "Sol" && (
            {className: "FundoAzul"}
        )} >
            <section className="containerInput">

                <h2>Temperatura</h2>
                <input 
                    type="text" 
                    placeholder="Digita a cidade aí" 
                    value={cidade} 
                    onChange={(e) => setCidade(e.target.value)}
                />
                <button onClick={buscarClima}>Buscar</button>

            </section>

            <section className="containerResult">

                {temperatura && (
                    <div>
                        <div className="header_containerResult">
                            <h2>{nome_cidade}</h2>
                            <div className="containerTemperatura">
                                <img src={icon!} alt="Icone do clima"/>
                                <p className="textTemperatura">{temperatura}°C</p>
                            </div>
                        </div>
                        <p><span>Umidade: </span>{umidade}%</p>
                        <p><span>Velocidade do vento: </span>{velocidadeVento} km</p>
                        <p><span>Sensação térmica: </span>{sensacaoTermica}°C</p>
                        <p><span>Condição: </span>{texto}</p>
                        <div className="textData">
                            <p>{data}</p>
                            <p className="textAtualizacao"><span>Última atualização: </span>{ultimaAtualizacao}</p>
                        </div>
                    </div>
                )}

                {erro && 
                    <p className="textError">{erro}</p>
                }
                
            </section>

        </main>
    )
}