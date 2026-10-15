// $.session.usage() ve session.measure'dan gelen rakamların kartın tuttuğu hali.
export type Pencere = { kind: string; percentUsed: number; resetsAt?: string }

export type Olcum = {
  contextYuzde: number | null
  contextToken: number | null
  contextPencere: number
  limitler: Pencere[]
  maliyetUsd: number | null
}

declare module 'claude-code' {
  interface PluginState {
    'limit-karti': {
      olcum: Olcum | null
      // Geri sayımlar dakikada bir tazelensin diye tutulan "şimdi" (ms).
      simdi: number
      // Aynı eşik için iki kez uyarı verilmesin: "five_hour:80" gibi anahtarlar.
      uyarilan: string[]
    }
  }
}
