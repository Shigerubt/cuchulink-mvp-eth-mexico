"use client";

import { NextPage } from "next";
import { useForm } from "react-hook-form";
import { useAccount } from "wagmi";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

const Create: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const { writeContractAsync: createCuchubal } = useScaffoldWriteContract("Cuchulink");

  const { register, handleSubmit } = useForm({
    defaultValues: {
      nombre: "",
      montoPorRonda: "",
      fechaInicio: "1",
      numParticipantes: "",
      codigo: "",
    },
  });

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <h1 className="text-lg">Crea tu Cuchubal</h1>
        {connectedAddress ? (
          <div className="flex items-center justify-center flex-col flex-grow p-8 pt-10">
            <form
              onSubmit={handleSubmit(async data => {
                console.log(data);
                console.log(data.montoPorRonda);
                try {
                  await createCuchubal({
                    functionName: "createCuchubal",
                    args: [
                      data.nombre,
                      BigInt(Math.round(Number(data.montoPorRonda) * 10 ** 18)),
                      BigInt(data.numParticipantes),
                      data.codigo,
                    ],
                    value: BigInt(Math.round(Number(data.montoPorRonda) * 10 ** 18)),
                  });
                } catch (error) {
                  console.error("Error :", error);
                }
              })}
              className="flex flex-row flex-wrap justify-between  w-[600px] gap-2 border p-4 rounded bg-slate-100"
            >
              <div className="flex flex-col w-5/12">
                <label htmlFor="nombre">Nombre del Cuchubal:</label>
                <input type="text" {...register("nombre")} name="nombre" />
              </div>

              <div className="flex flex-col w-5/12">
                <label htmlFor="montoPorRonda">Monto por Ronda (USDT):</label>
                <input type="number" {...register("montoPorRonda")} step="0.01" min="0" />
              </div>

              <div className="flex flex-col w-5/12">
                <label htmlFor="numParticipantes">Número de Participantes:</label>
                <input type="number" {...register("numParticipantes")} name="numParticipantes" min="0" />
              </div>

              <div className="flex flex-col w-5/12">
                <label htmlFor="codigo"> Código del Cuchubal:</label>
                <input type="text" {...register("codigo")} name="codigo" />
              </div>

              <button type="submit" className="d-block w-full">
                Crear Cuchubal
              </button>
            </form>
          </div>
        ) : (
          <div>Conecte su wallet</div>
        )}
      </div>
    </>
  );
};

export default Create;
