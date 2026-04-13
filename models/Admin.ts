import mongoose, { Schema, Document, models, model } from "mongoose";
import bcrypt from "bcryptjs";

export interface IAdmin extends Document {
  email: string;
  password: string;
  createdAt: Date;
  comparePassword(candidate: string): Promise<boolean>;
}

const AdminSchema = new Schema<IAdmin>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, select: false },
  },
  { timestamps: true }
);

AdminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

AdminSchema.methods.comparePassword = async function (
  candidate: string
): Promise<boolean> {
  return bcrypt.compare(candidate, this.password);
};

const Admin =
  (models.Admin as mongoose.Model<IAdmin>) ||
  model<IAdmin>("Admin", AdminSchema);

export default Admin;
