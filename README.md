# FiveM-CallbackAsync
`by Ghost @ FNGS / 2026` → [Author's GitHub](https://github.com/GhostQck) / [Publish Github](https://github.com/FNGS-Gh)

This standalone script provides a convenient and highly universal callback system, which utilizes standard Cfx network events.

*More details can be found below under the* **"2. Description"** *section ▼*

## 1. Installation
❗️ *This project is published under the MIT License. Upon using it, please make sure to keep the credits and apply the same type of licensing.*

---

###
If you don't care about the code readability and you just want to deploy the resource straight away, you can delete everything except of the following files and folders (and their content respectively):

```
fxmanifest.lua
config.json
dist/
```

The `config.json` file can be modified anytime with no need to rebuild the scripts.

---

###
If you want to modify the code, you'll find the source TypeScript files within the `src/` folder. Please note that this repo doesn't contain any TS builder and etc, so you'll need to set up your dev environment accordingly.

Also make sure that you have the `@citizenfx` packages:

```
npm install -D typescript @citizenfx/client @citizenfx/server
```

## 2. Description

The system has two entry points:

1. `class CbManager` for client-side;
2. `class CbHandler` for server-side.

The `CbManager` is responsible solely for triggering the mounted callback function on server and applying a corresponding action after any response is received. In the meantime, the `CbHandler` intercepts any inbound callback requests and executes a corresponding mounted function. For the client ↔ server communication, the script utilizes standard `emitNet()` to send network events and `onNet()` to retrieve network events.

### Example Usage:

**• Client Script:**\
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

**• Server Script:**\
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

## 3. Known Issues

*None at the moment*