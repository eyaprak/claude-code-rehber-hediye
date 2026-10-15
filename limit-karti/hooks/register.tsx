import { atom, read, update } from 'claude-code'
import type { EngineInterface, Register, SessionContextUsage, SessionCost, SessionRateLimit } from 'claude-code'

import type { Olcum, Pencere } from '../types'

const PANE = 'limit-karti'
const ESIKLER = [80, 90] // bu yüzdeleri geçince bir kez toast

const olcum = atom({ plugin: 'limit-karti', key: 'olcum' } as const, null)
const simdi = atom({ plugin: 'limit-karti', key: 'simdi' } as const, 0)
const uyarilan = atom({ plugin: 'limit-karti', key: 'uyarilan' } as const, [])

const AD: Record<string, string> = {
  five_hour: '5 saat',
  seven_day: 'Haftalık',
  spend_limit: 'Harcama',
}

function cubuk(yuzde: number, en: number): string {
  const dolu = Math.round((Math.min(100, Math.max(0, yuzde)) / 100) * en)
  return '█'.repeat(dolu) + '░'.repeat(en - dolu)
}

function renk(yuzde: number): string {
  if (yuzde >= 90) return 'red'
  if (yuzde >= 70) return 'yellow'
  return 'green'
}

// Saat dilimine bağlı kalmamak için mutlak saat yerine "ne kadar sonra".
function kalan(resetsAt: string | undefined, now: number): string {
  if (!resetsAt) return ''
  const dk = Math.max(0, Math.round((Date.parse(resetsAt) - now) / 60_000))
  const gun = Math.floor(dk / 1440)
  const saat = Math.floor((dk % 1440) / 60)
  const dakika = dk % 60
  if (gun > 0) return `${gun} g ${saat} sa`
  if (saat > 0) return `${saat} sa ${dakika} dk`
  return `${dakika} dk`
}

function binlik(n: number): string {
  return n >= 1000 ? `${Math.round(n / 1000)}k` : String(n)
}

function donustur(context: SessionContextUsage, limitler: SessionRateLimit[], cost?: SessionCost): Olcum {
  return {
    contextYuzde: context.percent ?? null,
    contextToken: context.tokens ?? null,
    contextPencere: context.window,
    limitler: limitler.map(l => ({ kind: l.kind, percentUsed: l.percentUsed, resetsAt: l.resetsAt })),
    maliyetUsd: cost?.usd ?? null,
  }
}

async function uyar($: EngineInterface, o: Olcum): Promise<void> {
  const once = await read($, uyarilan)
  const yeni: string[] = []
  for (const l of o.limitler) {
    for (const esik of ESIKLER) {
      const anahtar = `${l.kind}:${esik}:${l.resetsAt ?? ''}`
      if (l.percentUsed >= esik && !once.includes(anahtar)) {
        yeni.push(anahtar)
        $.ui.toast(`${AD[l.kind] ?? l.kind} limiti %${l.percentUsed} doldu, sıfırlanmaya ${kalan(l.resetsAt, await $.clock.now())}`)
      }
    }
  }
  if (yeni.length > 0) await update($, uyarilan, liste => [...liste, ...yeni].slice(-50))
}

async function kaydet($: EngineInterface, o: Olcum): Promise<void> {
  await update($, olcum, () => o)
  const t = await $.clock.now()
  await update($, simdi, () => t)
  await uyar($, o)
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    await $.command.register({ name: 'limit', description: 'Context ve Claude limitlerini kart olarak aç' })
    const u = await $.session.usage()
    await kaydet($, donustur(u.context, u.rateLimits, u.cost))
    // Geri sayım dakikada bir ilerlesin.
    $.clock.every(60_000, () => void $.clock.now().then(t => update($, simdi, () => t)))

    return next(e)
  })

  // Engine her tur sonunda ve bir limit tam bir puan oynadığında bunu yollar.
  on('session.measure', async ($, e, next) => {
    await kaydet($, donustur(e.context, e.rateLimits, e.cost))

    return next(e)
  })

  on('command.run', { command: 'limit' }, async $ => {
    await $.ui.open({ id: PANE, title: 'Claude limitleri' })

    return { text: 'Limit kartı açıldı.' }
  })

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    const o = await read($, olcum)
    if (e.props.hasSurvey || o === null) return next(e)

    const { Box, Button, Text } = $.ui.resolve(e)
    const now = await read($, simdi)

    return (
      <Box flexDirection="row" gap={2}>
        {o.contextYuzde !== null && (
          <Text>
            <Text dimColor>Context </Text>
            <Text color={renk(o.contextYuzde)}>{cubuk(o.contextYuzde, 8)}</Text> %{o.contextYuzde}
          </Text>
        )}
        {o.limitler.map(l => (
          <Text key={l.kind}>
            <Text dimColor>{AD[l.kind] ?? l.kind} </Text>
            <Text color={renk(l.percentUsed)}>{cubuk(l.percentUsed, 8)}</Text> %{l.percentUsed}
            <Text dimColor> ({kalan(l.resetsAt, now)})</Text>
          </Text>
        ))}
        <Button
          key="kart"
          label="Kart"
          plain
          onPress={() => void $.ui.open({ id: PANE, title: 'Claude limitleri' })}
        />
      </Box>
    )
  })

  on('ui.render', { component: 'Pane', requestId: PANE }, async ($, e) => {
    const { Box, Text } = $.ui.resolve(e)
    const o = await read($, olcum)
    const now = await read($, simdi)
    const en = Math.max(10, Math.min(40, (e.props.bodyColumns ?? 40) - 14))

    if (o === null) return <Text dimColor>Henüz ölçüm yok, ilk cevaptan sonra dolar.</Text>

    const kart = (baslik: string, yuzde: number | null, alt: string) => (
      <Box key={baslik} flexDirection="column">
        <Text bold>{baslik}</Text>
        {yuzde === null ? (
          <Text dimColor>İlk cevaptan sonra ölçülür</Text>
        ) : (
          <Text>
            <Text color={renk(yuzde)}>{cubuk(yuzde, en)}</Text> %{yuzde}
          </Text>
        )}
        {alt && <Text dimColor>{alt}</Text>}
      </Box>
    )

    const contextAlt =
      o.contextToken !== null
        ? `${binlik(o.contextToken)} / ${binlik(o.contextPencere)} token`
        : `pencere ${binlik(o.contextPencere)} token`

    return (
      <Box flexDirection="column" gap={1}>
        {kart('Context (bu oturum)', o.contextYuzde, contextAlt)}
        {o.limitler.length === 0 && <Text dimColor>Limit bilgisi ilk cevapla gelir (yalnız abonelikte).</Text>}
        {o.limitler.map((l: Pencere) =>
          kart(
            `${AD[l.kind] ?? l.kind} limit`,
            l.percentUsed,
            l.resetsAt ? `sıfırlanmaya ${kalan(l.resetsAt, now)}` : '',
          ),
        )}
        {o.maliyetUsd !== null && <Text dimColor>Bu oturumun API karşılığı: ${o.maliyetUsd.toFixed(2)}</Text>}
      </Box>
    )
  })
}
