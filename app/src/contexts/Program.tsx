import { createContext, useContext, useEffect, useState } from "react";
import * as anchor from "@coral-xyz/anchor";
import { PROGRAM_ID } from "../constants";
import idl from "../idl/counter.json";
import { useWeb3Context } from "./Web3";

interface IProgramContext {
  counterProgram: anchor.Program<anchor.Idl> | null;
}

export const ProgramContext = createContext<IProgramContext>(
  {} as IProgramContext
);

export default function ProgramContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [counterProgram, setCounterProgram] =
    useState<anchor.Program<anchor.Idl> | null>(null);
  const { providerInitialized } = useWeb3Context();

  useEffect(() => {
    if (!providerInitialized) return;

    const program = new anchor.Program(idl as anchor.Idl, PROGRAM_ID);
    setCounterProgram(program);
  }, [providerInitialized]);

  return (
    <ProgramContext.Provider value={{ counterProgram }}>
      {children}
    </ProgramContext.Provider>
  );
}

export const useProgramContext = () => useContext(ProgramContext);
