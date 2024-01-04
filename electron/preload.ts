import { contextBridge } from "electron";
import { ipc } from './ipc.bridge';

contextBridge.exposeInMainWorld("ipc", ipc);
