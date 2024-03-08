import { PublicKey } from "@solana/web3.js";
import { useEffect, useState } from "react";
import { useProgramContext } from "../contexts/Program";
import { useAnchorWallet } from "@solana/wallet-adapter-react";

export default function CountIncrementer({
  counter,
  setTransactionUrl,
}: {
  counter: PublicKey | undefined;
  setTransactionUrl: Function;
}) {
  const [count, setCount] = useState(0);
  const { counterProgram } = useProgramContext();
  const wallet = useAnchorWallet();

  useEffect(() => {
    refreshCount();
  }, []);

  async function refreshCount() {
    if (!counterProgram || !counter) return;
    const { count } = await counterProgram.account.counter.fetch(counter);
    console.log(count);
    setCount(Number(count));
  }

  async function increment() {
    if (!wallet || !counterProgram || !counter) return;

    const sig = await counterProgram.methods
      .increment()
      .accounts({
        counter: counter,
        user: wallet.publicKey,
      })
      .rpc();

    setTransactionUrl(`https://explorer.solana.com/tx/${sig}?cluster=devnet`);
    refreshCount();
  }

  return (
    <div>
      {count}
      <button onClick={increment}>increment</button>
    </div>
  );
}
