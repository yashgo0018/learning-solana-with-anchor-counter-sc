import { useAnchorWallet } from "@solana/wallet-adapter-react";
import Header from "./components/Header";
import { useProgramContext } from "./contexts/Program";
import * as anchor from "@coral-xyz/anchor";
import { useState } from "react";
import { Keypair, PublicKey } from "@solana/web3.js";
import CountIncrementer from "./components/CountIncrementer";

function App() {
  const { counterProgram } = useProgramContext();
  const wallet = useAnchorWallet();
  const [counter, setCounter] = useState<PublicKey>();
  const [transactionUrl, setTransactionUrl] = useState<string>();

  const onClick = async () => {
    if (!wallet) {
      alert("please first connect your wallet");
      return;
    }

    if (!counterProgram) return;

    const newAccount = Keypair.generate();
    try {
      const sig = await counterProgram.methods
        .initialize()
        .accounts({
          counter: newAccount.publicKey,
          user: wallet.publicKey,
          systemAccount: anchor.web3.SystemProgram.programId,
        })
        .signers([newAccount])
        .rpc();

      setTransactionUrl(`https://explorer.solana.com/tx/${sig}?cluster=devnet`);
      setCounter(newAccount.publicKey);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="App">
      <Header />
      <button onClick={onClick}>Initialize</button>
      <CountIncrementer
        counter={counter}
        setTransactionUrl={setTransactionUrl}
      />
      {transactionUrl}
    </div>
  );
}

export default App;
