import mongoose, { Mongoose } from "mongoose";

const schema = new mongoose.Schema(
  {
    cartCode: {
      type: String,
      required: true,

    },
    code: {
      type: String,
      required: true,
      unique: true,
    },
    status : {
        type : String,

        enum: [
            "started",
            "processing",
            "peding",
            "approved",
            "refused",
            "refunded",
            "chargeback",
            "error",
        ],
        required: true,
    },
    paymentType: {
        type: String,
        enum: [
            "billet",
            "credit_card"
        ],
        required: true,
    },
    installments: {
        type: Number,

    },
    total: {
        type: Number,

    },
    transcationId: {
        type:String
    },
    processorRespons : {
        
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Transaction", schema);
