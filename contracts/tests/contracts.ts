import * as anchor from "@coral-xyz/anchor";
import { Program, BN } from "@coral-xyz/anchor";
import { PublicKey, SystemProgram, Keypair } from "@solana/web3.js";
import { assert } from "chai";
import { PayrollProgram } from "../target/types/payroll_program";

describe("contracts", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const workspaceProgram =
    (anchor.workspace as Record<string, unknown>).payrollProgram ||
    (anchor.workspace as Record<string, unknown>).PayrollProgram ||
    (anchor.workspace as Record<string, unknown>).contracts;
  const program = workspaceProgram as Program<PayrollProgram>;

  const orgName = `Org-${Date.now()}`;
  const authority = provider.wallet.publicKey;
  const worker = Keypair.generate();

  const [orgPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("org"), authority.toBuffer(), Buffer.from(orgName)],
    program.programId
  );
  const [workerPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("worker"), orgPda.toBuffer(), worker.publicKey.toBuffer()],
    program.programId
  );

  it("creates an organization", async () => {
    await program.methods
      .createOrg(orgName)
      .accountsPartial({
        authority,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    const orgAccount = await program.account.organization.fetch(orgPda);
    assert.equal(orgAccount.name, orgName);
    assert.equal(orgAccount.authority.toBase58(), authority.toBase58());
    assert.equal(orgAccount.workersCount.toNumber(), 0);
    assert.equal(orgAccount.treasury.toNumber(), 0);
  });

  it("adds a worker and increments workersCount", async () => {
    const salary = new BN(100_000_000); // 0.1 SOL

    await program.methods
      .addWorker(salary)
      .accountsPartial({
        org: orgPda,
        worker: workerPda,
        workerPubkey: worker.publicKey,
        authority,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    const orgAccount = await program.account.organization.fetch(orgPda);
    const workerAccount = await program.account.worker.fetch(workerPda);

    assert.equal(orgAccount.workersCount.toNumber(), 1);
    assert.equal(
      workerAccount.workerPubkey.toBase58(),
      worker.publicKey.toBase58()
    );
    assert.equal(workerAccount.salary.toNumber(), salary.toNumber());
  });

  it("funds treasury, processes payroll, and withdraws", async () => {
    const fundAmount = new BN(400_000_000); // 0.4 SOL
    const withdrawAmount = new BN(50_000_000); // 0.05 SOL

    await program.methods
      .fundTreasury(fundAmount)
      .accountsPartial({
        org: orgPda,
        authority,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    const cycleTimestamp = new BN(Math.floor(Date.now() / 1000));
    await program.methods
      .processPayroll(cycleTimestamp)
      .accountsPartial({
        org: orgPda,
        authority,
        systemProgram: SystemProgram.programId,
      })
      .remainingAccounts([
        { pubkey: workerPda, isSigner: false, isWritable: true },
        { pubkey: worker.publicKey, isSigner: false, isWritable: true },
      ])
      .rpc();

    const workerAccount = await program.account.worker.fetch(workerPda);
    assert.equal(
      workerAccount.lastPaidCycle.toNumber(),
      cycleTimestamp.toNumber()
    );

    await program.methods
      .withdraw(withdrawAmount)
      .accountsPartial({
        org: orgPda,
        authority,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    const orgAccount = await program.account.organization.fetch(orgPda);
    assert.isAbove(orgAccount.treasury.toNumber(), 0);
    assert.isBelow(orgAccount.treasury.toNumber(), fundAmount.toNumber());
  });

  it("rejects unauthorized withdrawal", async () => {
    const unauthorized = Keypair.generate();
    const sig = await provider.connection.requestAirdrop(
      unauthorized.publicKey,
      1_000_000_000
    );
    await provider.connection.confirmTransaction(sig, "confirmed");

    let failed = false;
    try {
      await program.methods
        .withdraw(new BN(1_000_000))
        .accountsPartial({
          org: orgPda,
          authority: unauthorized.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([unauthorized])
        .rpc();
    } catch {
      failed = true;
    }

    assert.isTrue(failed, "Unauthorized withdraw should fail");
  });
});
