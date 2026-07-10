import jwt from "jsonwebtoken";

const JWT_SECRET = "2D4A614E645267556B58703273357638792F423F4428472B4B6250655368566D";

const token = jwt.sign(
    {
        serviceId: "service-buy-crypto",
        type:      "service-token",
        iat:       Math.floor(Date.now() / 1000),
    },
    JWT_SECRET
    // Sin expiresIn
);

console.log("\n Service token generated:\n");
console.log(token);
console.log("\nCopia este valor en .env.dev como COMMONS_SERVICE_TOKEN=<token>\n");

// To run this script, execute:
// bun run --env-file=.env.dev scripts/generate-service-token.ts