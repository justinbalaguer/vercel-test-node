import mongoose, { Schema } from "mongoose";

const testSchema = new Schema({
  test: [{}],
});

const Tests = mongoose.model("Test", testSchema, "tests");

export default Tests;
