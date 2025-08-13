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
    forecast: {
        forecastday: {
            date: string;
            day: {
                maxtemp_c: number;
                mintemp_c: number;
                condition: {
                    icon: string;
                }
            }
        }
    }
}

export function Clima() {
    const [cidade, setCidade] = useState("");
    const [temperatura, setTemperatura] = useState<number | null>();
    const [nome_cidade, setNome_cidade] = useState("");
    const [descricao, setDescricao] = useState<string | null>();
    const [umidade, setUmidade] = useState<number | null>();
    const [velocidadeVento, setVelocidadeVento] = useState<number | null>();
    const [sensacaoTermica, setSensacaoTermica] = useState<number | null>();
    const [precip_mm, setPrecip_mm] = useState<number | null>();
    const [ultimaAtualizacao, setUltimaAtualizacao] = useState("");
    const [data, setData] = useState("");
    const [icon, setIcon] = useState<string | null>();

    // Pevisão do tempo
    const [previsaoSemana, setPrevisaoSemana] = useState<WeatherResponse["forecast"]["forecastday"]>([]);

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

            // Chave e url da API
            const apiKey = 'b3d53c5b46a54120897161645252907';
            const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${cidade}&lang=pt&days=7`;

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
            setPrevisaoSemana(resposta.data.forecast.forecastday);
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
                        <div className="loader">
                            <Loader />
                        </div>
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
                                    <p>{erro}</p>
                                }
                                
                            </section>

                            {!erro &&
                                <section className="containerCard">
                                    <Card list={listCard} />
                                </section>
                            }

                            <section className="containerCardPrevTemp">
                                {previsaoSemana.map((dia, index) => {
                                    const data = new Date(dia.date);
                                    const diaDaSemana = data.toLocaleDateString('pt-BR', { weekday: 'long'});
                            
                                    return (
                                        <div key={index} className="cardPrevTemp">
                                            <p className="dayWeeks_cardPrevTemp">{diaDaSemana}</p>
                                            <div className="icon">
                                                <img src={dia.day.condition.icon} alt="Icone da temperatura do dia" />
                                            </div>
                                            <div className="text_cardPrevTemp">
                                                <p className="text_maxtemp">{dia.day.maxtemp_c}°</p>
                                                <p className="text_mintemp">{dia.day.mintemp_c}°</p>
                                            </div>
                                        </div>
                                    )
                                })}
                                {Array.from({length: Math.max(0, 7 - previsaoSemana.length)}).map((_, key) => (
                                    <div className="cardPrevTemp"></div>
                                ))}

                            </section>
                        </>
                    )}
                </>
            )}
        </main>
    )
}