import mongoose from "mongoose";
import { Password } from "../services/password";

// Interface representing a User document in MongoDB
export interface UserAttributes {
  email: string;
  passwordHash: string;
};

//An interface that describes the properties that a User Model has
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttributes): UserDoc;
}

// An interface that describes the properties that a User Document has
interface UserDoc extends mongoose.Document {
  email: string;
  passwordHash: string;
};

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
}, {
  toJSON: {
    transform(doc: any, ret: any) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.passwordHash;
      delete ret.__v;
      return ret;
    }
  }
});

userSchema.pre("save", async function (done) {
  if (this.isModified("passwordHash")) {
    const hashed = await Password.Hash(this.get("passwordHash"));
    this.set("passwordHash", hashed);
  }
  done();
});

userSchema.statics.build = (attrs: UserAttributes) => {
  return new User(attrs);
}

const User = mongoose.model<UserDoc, UserModel>("User", userSchema);


export { User };