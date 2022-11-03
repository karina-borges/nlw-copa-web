import { GetServerSideProps } from "next";
import Image from "next/image";

import appPreviewImg from "../assets/app-nlw-copa-preview.png";
import logoImg from "../assets/logo.svg";
import usersAvatarExampleImg from "../assets/users-avatar-exemple.png";
import iconCheckImg from "../assets/icon-check.svg";
import { api } from "../lib/axios";
import { FormEvent, useState } from "react";

interface HomeProps {
  poolCount: number;
  guessCount: number;
  usersCount: number;
}

export default function Home({ poolCount, guessCount, usersCount }: HomeProps) {
  const [poolTitle, setPoolTitle] = useState("");

  const createPool = async (event: FormEvent) => {
    event.preventDefault();
    console.log("createPool : ", poolTitle);

    try {
      const response = await api.post("/pools", {
        title: poolTitle,
      });

      const { code } = response.data;

      setPoolTitle("");

      const isSafari = /^((?!chrome|android).)*safari/i.test(
        navigator.userAgent
      );

      if (isSafari) {
        alert(`Código do bolão: ${code}`);
      } else {
        await navigator.clipboard.writeText(code);

        alert(
          "Bolão criado com sucesso! Código copiado para a área de transferência"
        );
      }
    } catch (error) {
      console.log("error : ", error);
      alert("Erro ao criar o bolão");
    }
  };

  return (
    <div className="max-w-[1124px] h-screen mx-auto grid grid-cols-2 items-center gap-28">
      <main>
        <Image src={logoImg} alt="Logo" />

        <h1 className="mt-14 text-white text-5xl font-bold leading-tight">
          Crie seu próprio bolão da copa e compartilhe entre amigos!
        </h1>

        <div className="mt-10 flex items-center gap-2">
          <Image src={usersAvatarExampleImg} alt="Avatar dos usuários" />
          <strong className="text-gray-100 text-xl">
            <span className="text-ignite-500">+ {usersCount}</span> pessoas já
            estão usando
          </strong>
        </div>

        <form
          onSubmit={(event) => createPool(event)}
          className="mt-10 flex gap-2"
        >
          <input
            className="flex-1 px-6 py-4 rounded bg-gray-800 border border-gray-600 focus:outline-none focus:border-yellow-500 text-sm text-gray-100"
            type="text"
            placeholder="Qual nome do seu bolão?"
            value={poolTitle}
            onChange={(event) => setPoolTitle(event.target.value)}
          />
          <button
            className="bg-yellow-500 px-6 py-4 rounded text-gray-900 font-bold text-sm uppercase hover:bg-yellow-700"
            type="submit"
          >
            Criar meu bolão
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-300 leading-relaxed">
          Após criar seu bolão, você receberá um código único que poderá usar
          para convidar outras pessoas 🚀
        </p>

        <div className="mt-10 pt-10 border-t border-gray-600 flex items-center justify-between text-gray-100">
          <div className="flex items-center gap-6">
            <Image src={iconCheckImg} alt="Ícone de check" />
            <div className="flex flex-col">
              <span className="font-bold text-2xl">+ {poolCount}</span>
              <span>Bolões criados</span>
            </div>
          </div>

          <div className="w-px h-14 bg-gray-600" />

          <div className="flex items-center gap-6">
            <Image src={iconCheckImg} alt="Ícone de check" />
            <div className="flex flex-col">
              <span className="font-bold text-2xl">+ {guessCount}</span>
              <span>Palpites enviados</span>
            </div>
          </div>
        </div>
      </main>

      <Image
        src={appPreviewImg}
        alt="Dois Celulares exibindo uma prévia da aplicação mobile"
        quality={100}
      />
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const [poolCountResponse, guessCountResponse, usersCountResponse] =
    await Promise.all([
      api.get("/pools/count"),
      api.get("/guesses/count"),
      api.get("/users/count"),
    ]);

  return {
    props: {
      poolCount: poolCountResponse.data.count,
      guessCount: guessCountResponse.data.count,
      usersCount: usersCountResponse.data.count,
    },
  };
};
