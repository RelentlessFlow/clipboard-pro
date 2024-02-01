# Clipboard Pro
剪切板管理应用，采用Electron + Vite + React打造

## Insall

```shell
pnpm install
# 安装卡住就手动执行下这个，再install
node ./node_modules/electron/install.js
# 运行
pnpm run dev
# 运行时报错就看下面的Debug ⬇️
```

## Debug

issue
> dyld[20801]: Library not loaded: @rpath/Electron Framework.fram...

solution

Did you try to remove your package managers' cache, I tried https://github.com/electron/electron/issues/40345 and it worked as philjones88 said, there might be errored version of electron

```shell
rm -rf node_modules
sudo pnpm store prune
pnpm install
```
