# Claude Code Rehberi: Hediye Paketi

Bu paket, YouTube kanalımdaki **"Claude Code Nedir, Nasıl Kullanılır? Sıfırdan İlk Siteni Yap ve Yayınla"** videosunun hediyesidir.

İçinde iki şey var:

| Klasör | Ne işe yarar |
|---|---|
| [`limit-karti/`](limit-karti/) | Prompt kutusunun üstüne limit şeridi koyan mod |
| [`tanitim-sitesi/`](tanitim-sitesi/) | Videodaki tanıtım sitesini yaptıran promptlar ve örnek bir `CLAUDE.md` |

Kanal: https://www.youtube.com/channel/UC65fXIucSDd1yxKkj3rmhow

## 1. Limit şeridi mod'u (`limit-karti`)

### Ne gösterir?

Claude Code'da mesaj yazdığın kutunun hemen üstüne tek satırlık bir şerit ekler. Şöyle görünür (rakamlar örnek):

```
Context ████░░░░ %48   5 saat ██░░░░░░ %23 (3 sa 12 dk)   Haftalık █░░░░░░░ %11 (4 g 6 sa)   Kart
```

* **Context:** Bu oturumda Claude'un hafızası ne kadar doldu. Bir çalışma masası gibi düşün: masa dolunca Claude eski kâğıtları özetleyip kenara kaldırır. Çubuk dolmaya yaklaşınca yeni bir oturum açmanın zamanı gelmiştir.
* **5 saat:** Aboneliğindeki 5 saatlik kullanım hakkının ne kadarını harcadığın. Parantez içinde sıfırlanmasına ne kadar kaldığı yazar.
* **Haftalık:** Aynı şey, haftalık hak için.
* **Kart:** Şeritteki bu düğmeye basınca ya da `/limit` yazınca daha büyük bir kart açılır. Kartta aynı çubuklar, context'te kaç token kullanıldığı ve bu oturumun API fiyatıyla karşılığı da görünür.

Renkler: %70'e kadar yeşil, %70'ten sonra sarı, %90'dan sonra kırmızı. Bir limit %80'i ve %90'ı geçtiğinde ekranda bir kez kısa bir uyarı çıkar.

Hesabında harcama limiti tanımlıysa o da "Harcama" adıyla şeride eklenir.

Şerit hem terminalde hem de Claude masaüstü uygulamasının **Code** sekmesinde çalışır.

**Bilmen gereken iki şey:**

* 5 saatlik ve haftalık limit bilgisi yalnız **Pro ya da Max aboneliğiyle** gelir. Claude Code'u API anahtarıyla kullanıyorsan şeritte yalnız Context görünür.
* Yeni bir oturumda bazı çubuklar Claude'un ilk cevabından sonra dolar. Boş görürsen bir mesaj yaz, sonra tekrar bak.

### Kurulum: kolay yol

Claude Code'un kendisine kurdurmak en kolayı.

1. Bu paketi bilgisayarına indir. GitHub sayfasında yeşil **Code** düğmesi, sonra **Download ZIP**. Zip dosyasını bir klasöre çıkar.
2. Claude Code'da bu klasörü aç.
3. Şunu yaz:

```
limit-karti klasörünü mod olarak kur.
```

Claude ne yapacağını anlatır ve her dosya değişikliği için senden onay ister. Onayları okuyarak ver. Daha net bir talimat vermek istersen bunu kullan:

```
Bu paketteki limit-karti klasörü bir Claude Code mod'u. Onu kullanıcı klasörümdeki .claude/mods/limit-karti altına kopyala ve claude plugin validate ile kontrol et. Sonra ~/.claude/settings.json dosyasındaki env bloğuna CLAUDE_CODE_PLUGIN_DIRS olarak bu klasörün yolunu ekle. Orada zaten bir değer varsa silme, yanına ekle. Her adımda ne yaptığını bana söyle.
```

4. Claude Code'u **tamamen kapatıp yeniden aç**, yeni bir oturum başlat. Şerit prompt kutusunun üstünde görünür.

### Kurulum: elle (resmi yöntemler)

Kendin kurmak istersen aşağıdaki adımlar Claude Code'un belgelenmiş yöntemleridir.

#### Önce kontrol et

Klasörün sağlam olduğunu kurmadan önce görmek için, paketin olduğu klasörde terminal açıp şunu çalıştır:

```bash
claude plugin validate ./limit-karti
```

Sonunda `Validation passed` yazmalı. Çıktı ayrıca mod'un neleri dinlediğini ve hangi işlemleri yaptığını listeler; güvenlik kontrolü için de işe yarar.

#### Yöntem A: tek oturumluk deneme (`--plugin-dir`)

```bash
claude --plugin-dir ./limit-karti
```

Mod yalnız bu terminal oturumunda yüklenir, oturumu kapatınca gider. Denemek için iyidir. Masaüstü uygulamasına bu şekilde bir ayar verilemez, orada Yöntem B'yi kullan.

#### Yöntem B: kalıcı kurulum (`CLAUDE_CODE_PLUGIN_DIRS`)

1. `limit-karti` klasörünü kalıcı bir yere taşı. Önerim: kullanıcı klasöründe `.claude/mods/limit-karti`. İndirilenler klasöründe bırakma; orası temizlenirse mod da gider.
2. Kullanıcı klasöründeki `.claude/settings.json` dosyasını aç ve `env` bloğuna şu satırı ekle:

```json
{
  "env": {
    "CLAUDE_CODE_PLUGIN_DIRS": "~/.claude/mods/limit-karti"
  }
}
```

3. Dosyada zaten bir `env` bloğu varsa ikinci bir tane açma; satırı var olan bloğun içine koy. Virgülü unutursan dosya bozulur ve ayarlar okunmaz.
4. Claude Code'u tamamen kapatıp yeniden aç.

Ayrıntılar:

* `~` senin kullanıcı klasörün demek. Tam yol da yazabilirsin. Windows'ta tam yol yazarken ters eğik çizgiyi ikişer yaz: `"C:\\Users\\<kullanıcı-adın>\\.claude\\mods\\limit-karti"`.
* Birden fazla mod kullanacaksan yolları ayırıcıyla yan yana yaz. **Windows'ta ayırıcı noktalı virgül (`;`)**, Mac ve Linux'ta iki nokta (`:`):

```json
"CLAUDE_CODE_PLUGIN_DIRS": "~/.claude/mods/limit-karti;~/.claude/mods/baska-mod"
```

* Bu ayar proje klasöründeki ayar dosyasından okunmaz. Kullanıcı klasöründeki `.claude/settings.json` dosyasına yaz.

### Çalıştığını nasıl anlarım?

Yeni bir oturumda bir mesaj yaz. Prompt kutusunun üstünde şerit görünüyorsa tamam. `/limit` yaz, kart açılmalı.

### Sorun çıkarsa

* **Şerit görünmüyor:** Claude Code'u tamamen kapatıp açtın mı? `claude plugin validate` hata veriyor mu? `settings.json` içindeki yol klasörün gerçek yeriyle aynı mı?
* **Şerit iki kez görünüyor:** Mod iki yerden yüklenmiş (örneğin hem `--plugin-dir` hem `settings.json`). Birini kaldır.
* **Yalnız Context görünüyor:** API anahtarıyla kullanıyorsun ya da henüz ilk cevap gelmedi. Limit bilgisi abonelikte, ilk cevaptan sonra gelir.
* **Hâlâ çözemedin:** `claude --debug` ile başlat; mod yüklenemediyse nedeni orada yazar.

### Kaldırma

`settings.json` içindeki `CLAUDE_CODE_PLUGIN_DIRS` satırını sil (ya da listeden yalnız bu yolu çıkar) ve Claude Code'u yeniden başlat. Sonra `limit-karti` klasörünü silebilirsin.

### Güvenlik notu

Mod'lar **senin yetkilerinle** çalışır. Yani bir mod, senin bilgisayarında, senin hesabınla yapabildiğin işleri yapabilecek şekilde yazılabilir. Bu yüzden:

* Yalnız güvendiğin kişilerin mod'larını kur.
* Kurmadan önce dosyalara bak. Anlamıyorsan Claude'a sor: "Bu mod ne yapıyor, güvenli mi?"
* `claude plugin validate` çıktısındaki `calls` satırı mod'un kullandığı işlemleri listeler.

Bu mod ne yapıyor: yalnız Claude Code'un kendi verdiği kullanım bilgisini (context, limitler, oturum maliyeti) okur ve ekrana çizer. Dosya okumaz ya da yazmaz, komut çalıştırmaz, internete bir şey göndermez. Kodun tamamı `hooks/register.tsx` dosyasında, yaklaşık 180 satır.

### Bu mod nasıl yazıldı?

Kodu ben yazmadım, Claude Code'a şunu dedim:

```
Prompt'un üstüne bu oturumun context doluluğunu, 5 saatlik ve haftalık limitimi gösteren bir şerit yap. Sıfırlanmaya ne kadar kaldığını da yaz.
```

Sen de kendi istediğin şeridi böyle yazdırabilirsin. Bu mod kuruluyken aynı istekle ikinci bir şerit yaptırırsan iki şerit üst üste görünür; önce bunu kaldır.

### Klasördeki dosyalar

```
limit-karti/
  .claude-plugin/plugin.json   mod'un adı, sürümü ve açıklaması
  hooks/hooks.json             Claude Code'a hangi dosyayı yükleyeceğini söyler
  hooks/register.tsx           şeridi, kartı ve uyarıları çizen kod
  types/index.d.ts             mod'un aklında tuttuğu değerlerin tarifi
  tsconfig.json                kod editörü için ayar
```

Mod ilk yüklendiğinde Claude Code `.claude-plugin/types/` adında bir klasör daha oluşturur. Bu klasörü Claude Code kendisi üretir, pakete konmadı; silinse de bir sonraki yüklemede yeniden yazılır.

## 2. Tanıtım sitesi başlangıç dosyaları (`tanitim-sitesi`)

Videoda boş bir klasörden kişisel tanıtım sitesi yaptırdım. O siteyi yaptıran promptlar ve sonunda oluşan `CLAUDE.md` dosyasının örneği bu klasörde:

* [`promptlar.md`](tanitim-sitesi/promptlar.md): ilk istek, telefon kontrolü ve `CLAUDE.md` promptları, kendi bilgilerinle doldurulacak şekilde.
* [`CLAUDE.md`](tanitim-sitesi/CLAUDE.md): proje kuralları dosyasının örneği.

Nasıl başlanır, `promptlar.md` dosyasının başında anlatıyor.
