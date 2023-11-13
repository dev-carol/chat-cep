import React from "preact/compat";
import axios from "axios";
import { useState } from "preact/hooks";
import './styles.css'
interface Address {
  cep: string;
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
}

const CepSearch: React.FC = () => {
  const [cep, setCep] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<React.ReactNode[]>([]);

  const handleSearch = async () => {
    try {
      const response = await axios.get<Address>(
        `https://viacep.com.br/ws/${cep.replace(/\D/g, '')}/json/`
      );

      if (isAddressValid(response.data)) {
        const newMessage = (
          <div className="avatar-container" key={chatMessages.length + 1}>
            <div className="avatar"></div>
            <div>{`Endereço: ${response.data.logradouro}, ${response.data.bairro}, ${response.data.localidade}-${response.data.uf}`}</div>
          </div>
        );

        setChatMessages((prevMessages: React.ReactNode[]) => [
          ...prevMessages,
          newMessage,
        ]);
      } else {
        setChatMessages((prevMessages: React.ReactNode[]) => [
          ...prevMessages,
   
        ]);
      }

      setError(null);
    } catch (error) {
      setError(`Erro ao buscar o CEP ${cep}. Por favor, tente novamente.`);
      setChatMessages((prevMessages: React.ReactNode[]) => [
        ...prevMessages,
      ]);
    }
  };

  const handleClear = () => {
    setCep("");
    setError(null);
    setChatMessages([]);
  };

  const isAddressValid = (address: Address | null): boolean => {
    return !!address && !!address.logradouro && !!address.bairro && !!address.localidade && !!address.uf;
  };

  return (
    <div className="container">
      <div className="card">
        <div className="chat-header">Chat CEP</div>
        <div className="chat-window">
          <ul className="message-list">
            {chatMessages.map((message: React.ReactNode, index: number) => (
              <li key={index}>{message}</li>
            ))}
            {error && (
              <li>
                <div className="error-message">{`Erro: ${error}`}</div>
              </li>
            )}
          </ul>
        </div>
        <div className="chat-input">
          <input
            type="text"
            className="message-input"
            placeholder="Digite o CEP aqui"
            value={cep}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCep(e.currentTarget.value)}
          />
          <button className="send-button" onClick={handleSearch}>
            Buscar
          </button>
          <button className="clear-button" onClick={handleClear}>
            Limpar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CepSearch;
