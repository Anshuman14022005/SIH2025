import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";

const SUPABASE_URL = process.env.SUPABASE_URL!; // e.g. https://your-project.supabase.co

const client = jwksClient({
  jwksUri: `${SUPABASE_URL}/auth/v1/.well-known/jwks.json`,
});

function getKey(header: any, callback: any) {
  client.getSigningKey(header.kid, (err, key) => {
    if (err) return callback(err);

    const signingKey = key?.getPublicKey();
    if (!signingKey) return callback(new Error("Unable to get public key"));

    callback(null, signingKey);
  });
}

export const verifySupabaseToken = (token: string): Promise<any> =>
  new Promise((resolve, reject) => {
    jwt.verify(token, getKey, { algorithms: ["RS256"] }, (err, decoded) => {
      if (err) return reject(err);
      resolve(decoded);
    });
  });
