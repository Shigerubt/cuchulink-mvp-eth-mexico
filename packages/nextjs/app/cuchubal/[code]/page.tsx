"use client";

import { useAccount } from "wagmi";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

const Page = ({ params }: { params: { code: string } }) => {
  const { address: connectedAddress } = useAccount();

  const { writeContractAsync: joinCuchubal } = useScaffoldWriteContract("Cuchulink");
  const { writeContractAsync: payForNextRound } = useScaffoldWriteContract("Cuchulink");

  const { data: cuchubalInfo, isLoading: isLoadingCuchubalInfo } = useScaffoldReadContract({
    contractName: "Cuchulink",
    functionName: "getCuchubalInfo",
    args: [params.code],
  });

  const { data: participantsJoined, isLoading: isLoadingGetParticipants } = useScaffoldReadContract({
    contractName: "Cuchulink",
    functionName: "getParticipants",
    args: [params.code],
  });

  return (
    <div>
      {isLoadingCuchubalInfo ? (
        "Espera"
      ) : (
        <div className="border w-[800px] p-4 rounded bg-slate-50">
          <p>Nombre de Cuchubal: {cuchubalInfo?.[0]}</p>
          <p>Monto por Ronda: {Number(cuchubalInfo?.[1]) / 10 ** 18} ETH</p>
          <p>Número Máximo de Participantes: {Number(cuchubalInfo?.[2])}</p>
          <p>
            Número Actual de Participantes:{" "}
            {isLoadingGetParticipants ||
              participantsJoined?.[0].filter(participant => participant != "0x0000000000000000000000000000000000000000")
                .length}
          </p>
          <p>Ronda Actual: {Number(cuchubalInfo?.[3])}</p>
          {isLoadingGetParticipants ||
          participantsJoined?.[0].filter(el => el == connectedAddress).includes(connectedAddress || "") ? (
            <button
              onClick={async () => {
                try {
                  await payForNextRound({
                    functionName: "payForNextRound",
                    args: [params.code],
                    value: cuchubalInfo?.[1],
                  });
                } catch (error) {
                  console.error("Error :", error);
                }
              }}
              className="p-4 bg-blue-500 rounded"
            >
              Pagar Ronda
            </button>
          ) : (
            <button
              onClick={async () => {
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
          )}
        </div>
      )}
    </div>
  );
};

export default Page;
