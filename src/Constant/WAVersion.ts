/**
 * Sumber versi WhatsApp Web yang sedang berlaku.
 *
 * Dipakai `Client.resolveWAVersion()`. Kalau tidak terjangkau, Client jatuh ke
 * `fallbackWAVersion` yang dipatok di kodenya.
 */
export const WA_VERSION_ENDPOINT = "https://apitool.pgl.my.id/api/latestwawebver";

/**
 * Batas tunggu pengambilan versi. Sengaja pendek: bot yang telat start beberapa
 * detik masih bisa diterima, bot yang menggantung menunggu jaringan tidak.
 */
export const WA_VERSION_TIMEOUT_MS = 5000;
