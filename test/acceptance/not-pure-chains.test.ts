import { consume } from "../../src/consumers";
import {
  filterAsync,
  mapAsync,
  notAsync,
  peekAsync,
} from "../../src/transformers";

interface UserAccount {
  name: string;
  cipheredPassword: string;
}

async function* hackedUserService(): AsyncIterable<UserAccount> {
  yield {
    name: "alice",
    cipheredPassword: "smart-hash-123abc",
  };
  yield {
    name: "bob",
    cipheredPassword: "smart-hash-456def",
  };
  yield {
    name: "charlie",
    cipheredPassword: "smart-hash-789ghi",
  };
}

const hackedBankService = (() => {
  const accounts: any = {
    alice: {
      balance: 10_000,
      password: "123abc",
    },
    charlie: {
      balance: 0,
      password: "a-v3ry-g00d-p4ssw0rd",
    },
  };

  return {
    canLoginIn: async (name: string, password: string) =>
      accounts[name]?.password === password,
    emptyBalance: async (name: string, password: string) =>
      accounts[name]?.password === password && accounts[name].balance === 0,
    withdrawAccount: async (name: string, password: string, amount: number) => {
      if (accounts[name]?.password === password)
        accounts[name].balance -= amount;
    },
    accounts,
  };
})();

const passwordDecipherService = async (password: string) =>
  password.replace(/smart-hash-/, "");

interface HackedUserAccount {
  name: string;
  password: string;
}

test("not-pure chains are not the nicest", async () => {
  const decipherPasswords = mapAsync(
    async ({
      name,
      cipheredPassword,
    }: UserAccount): Promise<HackedUserAccount> => ({
      name,
      password: await passwordDecipherService(cipheredPassword),
    })
  );

  const filterHackedBankAccounts = filterAsync(
    ({ name, password }: { name: string; password: string }) =>
      hackedBankService.canLoginIn(name, password)
  );

  const accountHasMoney = filterAsync(
    notAsync(({ name, password }: { name: string; password: string }) =>
      hackedBankService.emptyBalance(name, password)
    )
  );

  const withdrawUserMoney = peekAsync(
    ({ name, password }: { name: string; password: string }) =>
      hackedBankService.withdrawAccount(name, password, 5_000)
  );

  await consume(
    withdrawUserMoney(
      accountHasMoney(
        filterHackedBankAccounts(decipherPasswords(hackedUserService()))
      )
    )
  );

  expect(hackedBankService.accounts.alice.balance).toEqual(5_000);
  expect(hackedBankService.accounts.charlie.balance).toEqual(0);
});
