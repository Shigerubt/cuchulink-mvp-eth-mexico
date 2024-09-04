"use client";

import Link from "next/link";
import type { NextPage } from "next";
import { useAccount } from "wagmi";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        {connectedAddress ? (
          <>
            <h1 className="text-lg">Bienvenido a Cuchulink</h1>
            <Link href="/create" className="bg-blue-400 p-4 rounded">
              Crear Cuchubal
            </Link>
          </>
        ) : (
          <div>Conecte su wallet</div>
        )}
      </div>
    </>
  );
};

export default Home;
