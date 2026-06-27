import dotenv from "dotenv";

const result = dotenv.config({
    path: `.env.${process.env.NODE_ENV || "development"}.local`,
});

// console.log(result);
// console.log("Error:", result.error);
// console.log("Parsed:", result.parsed);
// console.log("DB_URI:", process.env.DB_URI);

export const {
    PORT,
    DB_URI,
    ADMIN_KEY,
    JWT_SECRET,
    JWT_EXPIRES_IN
} = process.env;