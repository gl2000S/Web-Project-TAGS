import pool from "../../config/mysql";

export async function findUserByEmail(email : string) { 
  const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]) as any;

  if (rows.length == 0) { 
    return null;
  }
  return rows[0];
}

export async function createUser(name: string, email: string, password_hash: string){
  await pool.query("INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)", [name,email,password_hash]);

}


/** 
import mongoose, { Schema, Document, Model } from "mongoose";

// Definitiom for a User document
export interface IUser extends Document {
  name: string;
  email: string;
  password: string; // password will be hashed
  createdAt: Date;
  updatedAt: Date;
}

// Create the schema, which breaks down the structure of User documents and defines all its fields
const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true, // no two users can sign up with the same email
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true, // we will store a *hashed* password here
    },
  },
  { timestamps: true } // automatically adds createdAt / updatedAt
);

// 3. Prevent model re-registration (important for Next.js hot reload)
const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema); // automatically sets the collection as 'users' in MongoDB

export default User;

*/