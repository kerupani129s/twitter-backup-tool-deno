import hmac from 'https://raw.githubusercontent.com/denolibs/hmac/master/lib/mod.ts';
import { Hash, encode } from 'https://deno.land/x/checksum@1.2.0/mod.ts';

const hashSha1 = new Hash('sha1');
const hash = bytes => hashSha1.digest(bytes).data;

const hmacSha1 = (data, key) => hmac(encode(data), encode(key), hash, 64, 20);

export default hmacSha1;
