"use client";

import { useState } from "react";
import Link from "next/link";
import { NextPage } from "next";
import { useForm } from "react-hook-form";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

const Search: NextPage = () => {
  const [search, setSearch] = useState("");
  const { register, handleSubmit } = useForm({
    defaultValues: {
      codigo: "",
    },
  });

  const { data: cuchubalInfo, isLoading: isLoadingCuchubalInfo } = useScaffoldReadContract({
    contractName: "Cuchulink",
    functionName: "getCuchubalInfo",
    args: [search],
  });

  const { data: participantsJoined, isLoading: isLoadingGetParticipants } = useScaffoldReadContract({
    contractName: "Cuchulink",
    functionName: "getParticipants",
    args: [search],
  });

  return (
    <div className="flex items-center flex-col flex-grow p-8 pt-10 bg-gray-50 min-h-screen">
      <h2 className="text-4xl font-semibold text-gray-800 mb-6">Unirse a un Cuchubal</h2>

      <form
        onSubmit={handleSubmit(async data => {
          console.log(data);
          try {
            const { codigo } = data;
            setSearch(codigo);
            console.log(cuchubalInfo);
          } catch (e) {
            console.log(e);
          }
        })}
        className="flex flex-row flex-wrap justify-between w-[600px] gap-2 border p-4 rounded-lg bg-white shadow-md"
      >
        <div className="flex flex-col w-full gap-4">
          <label htmlFor="codigo" className="text-2xl text-gray-700">
            Código de Invitación
          </label>
          <input
            type="text"
            {...register("codigo")}
            placeholder="Escriba su Código de Cuchubal"
            className="border border-gray-300 bg-gray-200 p-2 rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <button
          type="submit"
          className="d-block w-full mt-4 bg-blue-600 text-white font-semibold py-2 rounded-lg transition duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Buscar Cuchubal
        </button>
      </form>

      {search &&
        (isLoadingCuchubalInfo ? (
          <p className="mt-4 text-gray-600">Espera...</p>
        ) : (
          <div className="border w-[800px] p-4 rounded-lg bg-white shadow-md mt-4" key={cuchubalInfo?.[0]}>
            <p className="text-gray-800">
              Nombre de Cuchubal: <span className="font-semibold">{cuchubalInfo?.[0]}</span>
            </p>
            <p className="text-gray-800">
              Monto por Ronda: <span className="font-semibold">{Number(cuchubalInfo?.[1]) / 10 ** 18} ETH</span>
            </p>
            <p className="text-gray-800">
              Número Máximo de Participantes: <span className="font-semibold">{Number(cuchubalInfo?.[2])}</span>
            </p>
            <p className="text-gray-800">
              Número Actual de Participantes:{" "}
              <span className="font-semibold">
                {isLoadingGetParticipants ||
                  participantsJoined?.[0].filter(
                    participant => participant !== "0x0000000000000000000000000000000000000000",
                  ).length}
              </span>
            </p>
            <p className="text-gray-800">
              Ronda Actual: <span className="font-semibold">{Number(cuchubalInfo?.[3])}</span>
            </p>

            <Link
              href={`/cuchubal/${search}`}
              className="mt-4 p-4 bg-blue-500 text-white rounded-lg transition duration-200 hover:bg-blue-600"
            >
              Ver Cuchubal
            </Link>
          </div>
        ))}
    </div>
  );
};

export default Search;
