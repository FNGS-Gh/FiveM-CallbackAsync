# FiveM-CallbackAsync
`by Ghost @ FNGS / 2026` → [Author's GitHub](https://github.com/GhostQck) / [Publish Github](https://github.com/FNGS-Gh)

This standalone script

*More details can be found below under the* **"2. Description"** *section ▼*

## 1. Installation
❗️ *This project is published under the MIT License. Upon using it, please make sure to keep the credits and apply the same type of licensing.*

---

### Example Usage

**Client Script:**\
*TypeScript*
```ts
const isPlayerAdmin = async (playerId: number): Promise<boolean> => {
  try {
    const isAdmin = await exports['FiveM-CallbackAsync'].TriggerCb(
      'admin:checkAdmin',
      playerId
    ) as boolean;

    return isAdmin;
  } catch (err: any) {
    console.error(`Check Failed: ${err.message}`);
    return false;
  }
};

const checkAdmin = await isPlayerAdmin(1);
```

**Server Script:**\
*TypeScript*
```ts
const DUMMY_ADMINS_MAP: Record<number, boolean> = {
  0: true,
  1: true,
  5: false
};

exports['FiveM-CallbackAsync'].MountCb('admin:checkAdmin', async (
  src: number,
  playerId: number
): Promise<boolean> => {
  try {
    const isSrcAdmin = DUMMY_ADMINS_MAP[src];

    if (!isSrcAdmin)
      throw new Error('You do not have permission to check admin status.');

    const isAdmin = DUMMY_ADMINS_MAP[playerId];

    if (isAdmin === undefined)
      throw new Error(`Target Player (ID: ${playerId}) does not exist.`);

    return isAdmin;
  } catch (err: any) {
    throw err;
  }
});
```