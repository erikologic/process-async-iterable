import { consume } from "../../src/consumers/consume";
import { filterAsync } from "../../src/transformers/filterAsync";
import { mapAsync } from "../../src/transformers/mapAsync";
import { peekAsync } from "../../src/transformers/peekAsync";

const hackedUserService = jest
  .fn()
  .mockResolvedValueOnce({
    name: "alice",
    ciphredPassword: "smart-hash-123abc",
  })
  .mockResolvedValueOnce({
    name: "bob",
    ciphredPassword: "smart-hash-456def",
  })
  .mockResolvedValueOnce({
    name: "charlie",
    ciphredPassword: "smart-hash-789ghi",
  })
  .mockRejectedValue("end of users list");

const hackedBankService = (() => {
  const accounts: any = {
    alice: {
      balance: 10_000,
      password: "123abc",
    },
    charlie: {
      balance: 5_000,
      password: "a-v3ry-g00d-p4ssw0rd",
    },
  };

  return {
    isThisBankUser: async (name: string, password: string) =>
      accounts[name]?.password === password,
    withdrawAccount: jest.fn(
      async (name: string, password: string, amount: number) => {
        if (accounts[name]?.password === password)
          accounts[name].balance -= amount;
      }
    ),
    accounts,
  };
})();

const passwordDecipherService = async (password: string) =>
  password.replace(/smart-hash-/, "");

test("not-pure chains are not the nicest", async () => {
  // getNames
  async function* getUserNames() {
    try {
      while (true) {
        yield hackedUserService();
      }
      // eslint-disable-next-line no-empty
    } catch (e) {}
  }

  const decipherPasswords = mapAsync(
    async ({
      name,
      ciphredPassword,
    }: {
      name: string;
      ciphredPassword: string;
    }) => ({
      name,
      password: await passwordDecipherService(ciphredPassword),
    })
  );

  // filterBankAccountsOwner
  const filterBankAccountsOwner = filterAsync(
    ({ name, password }: { name: string; password: string }) =>
      hackedBankService.isThisBankUser(name, password)
  );

  // withdrawTheirMoney
  const withdrawUserMoney = peekAsync(
    ({ name, password }: { name: string; password: string }) =>
      hackedBankService.withdrawAccount(name, password, 5_000)
  );

  await consume(
    withdrawUserMoney(
      filterBankAccountsOwner(decipherPasswords(getUserNames()))
    )
  );

  expect(hackedBankService.accounts.alice.balance).toEqual(5_000);
  expect(hackedBankService.accounts.charlie.balance).toEqual(10_000);
});
