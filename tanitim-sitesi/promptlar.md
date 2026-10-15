# Tanıtım sitesi promptları

Videoda boş bir klasörden tek sayfalık bir tanıtım sitesi yaptırdım. Aşağıdaki üç prompt o sürecin omurgası. Köşeli parantezli yerleri kendi bilgilerinle doldur, parantezleri sil.

## Başlamadan önce

1. Bilgisayarında boş bir klasör oluştur, adı `tanitim-sitesi` olabilir.
2. Claude Code'da bu klasörü aç.
3. İzin modunu **Plan** yap. Claude önce plan yazar, sen onaylamadan dosyaya dokunmaz.
4. Fotoğraf kullanacaksan dosyayı (örneğin `profil.jpg`) bu klasöre koy. Promptta `@profil.jpg` yazarak Claude'a gösterebilirsin.

## 1. İlk istek

```
Benim için tek sayfalık bir kişisel tanıtım sitesi yap. Adım [adın soyadın], [ne iş yaptığını bir cümleyle yaz]. Üstte kısa bir tanıtım ve fotoğrafım, ortada [son üç işim / son üç videom / sunduğum hizmetler], altta iletişim bilgilerim olsun. Sade ve koyu temalı olsun, telefonda da düzgün görünsün. Sadece HTML, CSS ve gerekirse biraz JavaScript kullan; kurulum gerektiren bir şey olmasın.
```

Videoda ben şöyle doldurdum: "Adım Emrullah Yaprak, YouTube'da yapay zekaya gerçek işleri devretmeyi anlatıyorum" ve ortaya "son üç videom".

**Neden son cümle önemli:** Kurulum adımı olmayan bir site, sunucuya (videoda Hostinger) gittiği gibi çalışır. Ekstra bir şey kurman gerekmez.

**Dikkat:** Videoda son üç videonun adını bilerek vermedim ve Claude bilmediği yeri kendisi doldurdu. Sitede senin vermediğin bir bilgi görürsen mutlaka düzelttir. En kolayı, bilgileri baştan vermek ya da sonra şöyle demek:

```
[Bölümün adı] kısmında şu bilgileri kullan, aynen böyle yaz:
1. [başlık] [link]
2. [başlık] [link]
3. [başlık] [link]
```

## 2. Telefon görünümü

```
Sitenin telefonda nasıl göründüğünü kontrol et, bozuk bir yer varsa düzelt.
```

Siteye gelenlerin çoğu telefondan gelir. Her büyük değişiklikten sonra bunu kontrol ettir. Bir kez `CLAUDE.md` dosyasına yazarsan (aşağıda) her seferinde söylemene gerek kalmaz.

## 3. CLAUDE.md

```
Bu proje için bir CLAUDE.md dosyası oluştur. Kurallar: metinler Türkçe olsun, renkler mevcut tasarımdaki gibi kalsın, her değişiklikten sonra telefon görünümünü kontrol et, iş bitince değişikliği GitHub'a gönder.
```

`CLAUDE.md`, çırağa ilk gün verilen kurallar kâğıdı gibidir: Claude her yeni oturumda işe başlamadan önce bu dosyayı okur. Böylece aynı kuralları her seferinde tekrar yazmazsın.

Bu klasördeki [`CLAUDE.md`](CLAUDE.md) böyle bir dosyanın örneği. İki şekilde kullanabilirsin:

* Yukarıdaki promptu yaz, Claude kendi projene uygun olanını oluştursun. (Önerim bu.)
* Örnek dosyayı kendi proje klasörüne kopyala. Adı `CLAUDE.md` olarak kalmalı. Siteni GitHub'a göndermiyorsan 4. kuralı sil.

Kurallarını kendine göre değiştir. Kısa ve net kurallar, uzun açıklamalardan daha iyi çalışır.
