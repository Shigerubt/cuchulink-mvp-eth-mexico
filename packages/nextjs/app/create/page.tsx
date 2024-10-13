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
      numParticipantes: "",
      codigo: "",
    },
  });

  return (
    <div className="flex items-center flex-col flex-grow pt-10 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">Crea tu Cuchubal</h1>
      {connectedAddress ? (
        <div className="flex items-center justify-center flex-col flex-grow p-8 rounded-lg shadow-lg bg-white">
          <form
            onSubmit={handleSubmit(async data => {
              console.log(data);
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
                console.error("Error:", error);
              }
            })}
            className="flex flex-col w-full max-w-lg gap-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label htmlFor="nombre" className="text-gray-700 mb-1">
                  Nombre del cuchubal:
                </label>
                <input
                  type="text"
                  {...register("nombre")}
                  name="nombre"
                  className="border border-gray-300 bg-gray-200 p-2 rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="montoPorRonda" className="text-gray-700 mb-1">
                  Monto por ronda (ETH):
                </label>
                <input
                  type="text"
                  {...register("montoPorRonda")}
                  className="border border-gray-300 bg-gray-200 p-2 rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="numParticipantes" className="text-gray-700 mb-1">
                  Participants Count:
                </label>
                <input
                  type="number"
                  {...register("numParticipantes")}
                  name="numParticipantes"
                  min="0"
                  className="border border-gray-300 bg-gray-200 text-gray-600 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="codigo" className="text-gray-700 mb-1">
                  Código de Cuchubal:
                </label>
                <input
                  type="text"
                  {...register("codigo")}
                  name="codigo"
                  className="border border-gray-300 bg-gray-200 p-2 rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="mt-4 bg-blue-600 text-white font-semibold py-2 rounded-lg transition duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Crear Cuchubal
            </button>
          </form>
        </div>
      ) : (
        <div className="text-gray-700">Conecta tu wallet</div>
      )}
    </div>
  );
};

export default Create;
