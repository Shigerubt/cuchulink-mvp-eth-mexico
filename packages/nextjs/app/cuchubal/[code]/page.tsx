"use client";

import { useEffect, useState } from "react";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

const Page = ({ params }: { params: { code: string } }) => {
  const [cuchubal, setCuchubal] = useState<any>([]);

  const { writeContractAsync: joinCuchubal } = useScaffoldWriteContract("Cuchulink");

  const { data: cuchubalInfo, isLoading: isLoadingCuchubalInfo } = useScaffoldReadContract({
    contractName: "Cuchulink",
    functionName: "getCuchubalInfo",
    args: [params.code],
  });

  useEffect(() => {
    setCuchubal(cuchubalInfo);
  }, [isLoadingCuchubalInfo, cuchubalInfo]);

  const getMontoPorRonda = () => {
    try {
      console.log(cuchubal);
      return 1;
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      {isLoadingCuchubalInfo ? (
        "Espera"
      ) : (
        <div className="border w-[800px] p-4 rounded bg-slate-50">
          <p>Nombre de Cuchubal: {cuchubalInfo?.[0]}</p>
          <p>Monto por Ronda: {getMontoPorRonda()} ETH</p>
          <p>Número Máximo de Participantes: {Number(cuchubalInfo?.[4])}</p>
          <button
            onClick={async () => {
              console.log("Inicio");
              try {
                await joinCuchubal({
                  functionName: "joinCuchubal",
                  args: [params.code],
                  value: cuchubalInfo?.[1],
                });
              } catch (error) {
                console.error("Error :", error);
              }
            }}
            className="p-4 bg-blue-500 rounded"
          >
            Unirse
          </button>
        </div>
      )}
    </div>
  );
};

export default Page;
