import { useState } from "react";
import axios from "axios";
import './style.css';
import { format } from "date-fns";
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
    const [ultimaAtualizacao, setUltimaAtualizacao] = useState("");
    const [data, setData] = useState("");
    const [icon, setIcon] = useState<string | null>();
    const [erro, setErro] = useState("");

    const [isLoading, setIsLoading] = useState(false);
    const [isCidade, setIsCidade] = useState(false);

    async function buscarClima() {

        if (!cidade) return;

        try {
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

            {!isCidade ? (
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
                        onKeyDown={(e) => {if (e.key === 'Enter')  buscarClima();}}
                    />
                    <button onClick={buscarClima}>Buscar</button>
                </section>

            ) : (
                <>
                    {isLoading ? (
                        <Loader />
                    ) : (
                        <>
                        
                            <section className="containerResult">
            
                                {temperatura && (
                                    <div>
                                        <div className="header_containerResult">
                                            <h2>{nome_cidade}</h2>
                                            <div className="containerTemperatura">
                                                <img src={icon!} alt="Icone do clima"/>
                                                <p className="textTemperatura">{temperatura}°</p>
                                            </div>
                                        </div>
                                        <p><span>Umidade: </span>{umidade}%</p>
                                        <p><span>Velocidade do vento: </span>{velocidadeVento} km</p>
                                        <p><span>Sensação térmica: </span>{sensacaoTermica}°C</p>
                                        <p><span>Condição: </span>{descricao}</p>
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
                            <section>
                                
                            </section>
                        </>
                    )}
                </>
            )}

        </main>
    )
}