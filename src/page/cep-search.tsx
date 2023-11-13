import React, { useState } from "react";
import axios from "axios";
import "./styles.css";

interface Address {
  cep: string;
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
}

const CepSearch: React.FC = () => {
  const [cep, setCep] = useState<string>("");
  const [address, setAddress] = useState<Address | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<React.ReactNode[]>([]);

  const handleSearch = async () => {
    try {
      const response = await axios.get<Address>(
        `https://viacep.com.br/ws/${cep}/json/`
      );
      setAddress(response.data);
      setError(null);

      if (isAddressValid(response.data)) {
        const message = (
          <div className="avatar-container">
            <div className="avatar"></div>
            <div>{`Endereço: ${response.data.logradouro}, ${response.data.bairro}, ${response.data.localidade}-${response.data.uf}`}</div>
          </div>
        );
        setChatMessages([...chatMessages, message]);
      } else {
        setChatMessages((prevMessages) => [
          ...prevMessages,
          `Dados do CEP ${cep} não encontrados. Por favor, tente novamente `,
        ]);
      }
    } catch (error) {
      setAddress(null);
      setError("CEP não encontrado");
      setChatMessages((prevMessages) => [
        ...prevMessages,
        `Erro ao buscar o CEP ${cep}. Por favor, tente novamente.`,
      ]);
    }
  };

  const handleClear = () => {
    setCep("");
    setAddress(null);
    setError(null);
    setChatMessages([]);
  };

  const isAddressValid = (address: Address | null): boolean => {
    return (
      address &&
      !!address.logradouro &&
      !!address.bairro &&
      !!address.localidade &&
      !!address.uf
    );
  };

  return (
    <div className="container">
      <div className="card">
        <div className="chat-header">Chat CEP</div>
        <div className="chat-window">
          <ul className="message-list">
            {chatMessages.map((message, index) => (
              <li key={index}>{message}</li>
            ))}
          </ul>
        </div>
        <div className="chat-input">
          <input
            type="text"
            className="message-input"
            placeholder="Digite o CEP aqui"
            value={cep}
            onChange={(e) => setCep(e.target.value)}
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
