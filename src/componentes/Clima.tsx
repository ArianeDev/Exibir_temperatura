import { useState } from "react";
import axios from "axios";
import './style.css';
import { format } from "date-fns";
import { Droplet, MapPin, Wind, CloudSun, CloudRainWind } from "lucide-react";
import { Card } from "./Card";
import Loader from "./loader";

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
        precip_mm: number;
    };
}

export function Clima() {
    const [cidade, setCidade] = useState("");
    const [temperatura, setTemperatura] = useState <number | null>();
    const [nome_cidade, setNome_cidade] = useState("");
    const [descricao, setDescricao] = useState<string | null>();
    const [umidade, setUmidade] = useState<number | null>();
    const [velocidadeVento, setVelocidadeVento] = useState<number | null>();
    const [sensacaoTermica, setSensacaoTermica] = useState<number | null>();
    const [precip_mm, setPrecip_mm] = useState<number | null>();
    const [ultimaAtualizacao, setUltimaAtualizacao] = useState("");
    const [data, setData] = useState("");
    const [icon, setIcon] = useState<string | null>();
    const [erro, setErro] = useState("");

    const [isLoading, setIsLoading] = useState(false);
    const [isCidade, setIsCidade] = useState(false);

    const listCard = [
        {
            titulo: "Umidade",
            icon: <Droplet />,
            descricao: `${umidade}%`
        },
        {
            titulo: "Velocidade do vento",
            icon: <Wind />,
            descricao: `${velocidadeVento}km/h`
        },
        {
            titulo: "Condição do clima",
            icon: <CloudSun />,
            descricao: `${descricao}`
        },
        {
            titulo: "Previsão de Chuva",
            icon: <CloudRainWind />,
            descricao: `${precip_mm}%`
        },
    ]

    async function buscarClima() {

        if (!cidade) return;

        try {
            setIsCidade(true);
            setIsLoading(true);

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
            setPrecip_mm(resposta.data.current.precip_mm);
            setUltimaAtualizacao(dataFormatadaAtualizada);
            setData(dataFormatadaAtual);
            setIcon(resposta.data.current.condition.icon);
            setDescricao(resposta.data.current.condition.text);            
            setErro('');

            setIsCidade(true);

        } catch {
            setErro('Cidade não encontrada');
            setTemperatura(null);
            setNome_cidade("");
        } finally {
            setIsLoading(false);
        }

    }

    return(
        <main {...descricao === "Sol" ? (
                {className: "FundoDescricaoSol"}
            ) : (
                {className: "FundoAzul"}
            )} 
            {...descricao === "Possibilidade de chuva irregular" && (
                {className: "FundoDescricaoChuva"}
            )}
            {...descricao === "Parcialmente nublado" && (
                {className: "FundoDescricaoParcialmenteNublado"}
            )}
            {...descricao === "Nublado" && (
                {className: "FundoNublado"}
            )}
            {...descricao === "Neblina" && (
                {className: "FundoNeblina"}
            )}
            {...descricao === "Chuva fraca" && (
                {className: "FundoDescricaoChuvaFraca"}
            )}
            {...descricao === "Céu limpo" && (
                {className: "FundoCeuLimpo"}
            )}
        >

            {!isCidade && (
                <section className="containerInput">

                    <div className="containerText">
                        <h1>Clima Tempo</h1>
                        <p>Busque o clima da sua cidade</p>
                    </div>

                    <input 
                        type="text" 
                        placeholder="Digite a cidade que deseja buscar" 
                        value={cidade} 
                        onChange={(e) => setCidade(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') buscarClima();}}                        
                    />
                    <button onClick={buscarClima}>Buscar</button>

                </section>
            )}

            {isCidade && (
                <>
                    {isLoading ? (
                        <Loader />
                    ) : (
                        <>
                            <section className="containerResult">
            
                                {temperatura && (
                                    <div>
                                        <div className="header_containerResult">
                                            <div className="containerTemperatura_header">
                                                <h2>{nome_cidade}</h2>
                                                <MapPin className="icon_MapPin"/>
                                            </div>
                                            <div className="containerTemperatura">
                                                <img src={icon!} alt="Icone do clima"/>
                                                <p className="textTemperatura">{temperatura}°</p>
                                            </div>
                                        </div>
                                        <p><span>Sensação térmica: </span>{sensacaoTermica}°</p>
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
                            <section className="containerCard">
                                <Card list={listCard} />
                            </section>
                        </>
                    )}
                </>
            )}
        </main>
    )
}