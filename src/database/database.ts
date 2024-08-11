import mongoose from "mongoose";

export const databaseConnection = () => {
  try {
    mongoose.connect(process.env.DATABASE_CONNECTION_STRING!);
    console.log("connected to db");
  } catch (error) {
    console.log("error", error);
  }
};

// export { databaseConnection };
