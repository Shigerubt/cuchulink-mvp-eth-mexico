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
    <div className="flex items-center flex-col flex-grow p-8 pt-10">
      <h2 className="text-4xl">Unirse a un Cuchubal</h2>

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
        className="flex flex-row flex-wrap justify-between w-[600px] gap-2 border p-4 rounded bg-slate-100"
      >
        <div className="flex flex-col w-full gap-4">
          <label htmlFor="startDate" className="text-2xl">
            Código de Invitación
          </label>
          <input type="text" {...register("codigo")} placeholder="Escriba su Código de Cuchubal" />
        </div>

        <button type="submit" className="d-block w-full">
          Buscar Cuchubal
        </button>
      </form>

      {search &&
        (isLoadingCuchubalInfo ? (
          "Espera"
        ) : (
          <div className="border w-[800px] p-4 rounded bg-slate-50" key={cuchubalInfo?.[0]}>
            <p>Nombre de Cuchubal: {cuchubalInfo?.[0]}</p>
            <p>Monto por Ronda: {Number(cuchubalInfo?.[1]) / 10 ** 18} ETH</p>
            <p>Número Máximo de Participantes: {Number(cuchubalInfo?.[2])}</p>
            <p>
              Número Actual de Participantes:{" "}
              {isLoadingGetParticipants ||
                participantsJoined?.[0].filter(
                  participant => participant != "0x0000000000000000000000000000000000000000",
                ).length}
            </p>
            <p>Ronda Actual: {Number(cuchubalInfo?.[3])}</p>

            <Link href={`/cuchubal/${search}`} className="p-4 bg-blue-500 rounded">
              Ver Cuchubal
            </Link>
          </div>
        ))}
    </div>
  );
};

export default Search;
