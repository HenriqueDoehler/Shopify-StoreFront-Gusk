import Head from "next/head";
import { useState } from "react";
import Header from "../components/Header/Header";
import { Footer } from "@/components/Footer/footer";
import { createCustomer, customerAccessTokenCreate } from "@/utils/shopify";
import { styles } from "@/styles/auth.module.css";
export default function Auth() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  // const [acceptsMarketing, setAcceptsMarketing] = useState(false);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accessToken, setAccessToken] = useState(null);
  const [showSignupModal, setShowSignupModal] = useState(true);
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const handleCreateAccount = async (e) => {
    e.preventDefault();
    try {
      const customerData = {
        email: newEmail,
        password: newPassword,
        firstName: firstName,
        lastName: lastName,
        phone: phone,
        // acceptsMarketing: acceptsMarketing,
      };

      const response = await createCustomer(customerData);
      if (response.customerCreate.customer) {
        // Aqui você pode fechar o modal e limpar o formulário
        setShowSignupModal(false);
        setNewEmail("");
        setNewPassword("");
        // Você pode querer fazer algo com as informações do cliente aqui
      } else {
        console.error(
          "Erro ao criar conta: ",
          response.customerCreate.customerUserErrors
        );
      }
    } catch (error) {
      console.error("Erro ao criar a conta: ", error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await customerAccessTokenCreate(email, password);
      if (response.customerAccessTokenCreate.customerAccessToken) {
        setAccessToken(
          response.customerAccessTokenCreate.customerAccessToken.accessToken
        );
        // Aqui você pode redirecionar o usuário ou fazer outra ação após o login
      } else {
        console.error(
          "Falha ao fazer login: ",
          response.customerAccessTokenCreate.customerUserErrors
        );
      }
    } catch (error) {
      console.error("Erro ao fazer login: ", error);
    }
  };

  return (
    <>
      <Head>
        <title>GUSK Imports</title>
        <meta name="Gusk Imports" content="Gusk Imports" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/orangeGuskLogo.svg" />
      </Head>
      {/* <Header /> */}

      <main>
        {/* Botão para abrir o modal de criação de conta */}
        <button onClick={() => setShowSignupModal(true)}>Criar Conta</button>

        {/* Modal de criação de conta */}
        {showSignupModal && (
          <div className="modal">
            <div className="modal-content">
              <span
                className="close-button"
                onClick={() => setShowSignupModal(false)}
              >
                &times;
              </span>
              <form onSubmit={handleCreateAccount}>
                <input
                  type="email"
                  placeholder="Email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="Senha"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />

                <input
                  type="text"
                  placeholder="Primeiro Nome"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Sobrenome"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
                <input
                  type="tel"
                  placeholder="Telefone Celular"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                {/* <label>
                  Aceita Marketing:
                  <input
                    type="checkbox"
                    checked={acceptsMarketing}
                    onChange={(e) => setAcceptsMarketing(e.target.checked)}
                  />
                </label> */}
                <button type="submit">Criar Conta</button>
              </form>
            </div>
          </div>
        )}
        {/* O formulário de login */}

        <div>dsafsafas</div>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Login</button>
        </form>

        {/* Mostrar token de acesso ou mensagem de sucesso */}
        {accessToken && <p>Login bem-sucedido! Token: {accessToken}</p>}
      </main>
      {/* <Footer /> */}
    </>
  );
}
