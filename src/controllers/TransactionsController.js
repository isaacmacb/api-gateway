import * as Yup from "yup";
import parsePhoneNumber from "libphonenumber-js";
import { cpf, cnpj } from "cpf-cnpj-validator";
import Cart from "../modes/Cart";
import TransactionService from "../services/TransactionService";

class TransactionsController {
  async create(req, res) {
    try {
      const {
        cartCode,
        paymentType,
        installments,
        customerName,
        customerEmail,
        customerMobile,
        customerDocument,
        billingAddress,
        billingNumber,
        billingNeighborhood,
        billingCity,
        billingState,
        billingZipCode,
        creditCardNumber,
        creditCardExpirantion,
        creditCardHolderName,
        creditCardCvv,
      } = req.body;

      const schema = Yup.object().shape({
        cartCode: Yup.string().required(),
        paymentType: Yup.string().oneOf(["credit_card", "billet"]).required(),
        installments: Yup.number().required(),
        customerName: Yup.string().required().min(3),
        customerEmail: Yup.string().email().required(),
        customerMobile: Yup.string()
          .required()
          .test("is-valid-mobile", "${path} is not a mobile phone", (value) =>
            parsePhoneNumber(value, "BR").isValid()
          ),
        customerDocument: Yup.string()
          .required()
          .test(
            "is-valid-document",
            "${path} is not a valid CPF / CNPJ",
            (value) => cpf.isValid(value) || cnpj.isValid(value)
          ),
        billingAddress: Yup.string().required(),
        billingNumber: Yup.string().required(),
        billingNeighborhood: Yup.string().required(),
        billingCity: Yup.string().required(),
        billingState: Yup.string().required(),
        billingZipCode: Yup.string().required(),
        creditCardNumber: Yup.string().when(
          "paymentType",
          (paymentType, schema) =>
            paymentType === "credit_card" ? schema.required() : schema
        ),
        creditCardExpirantion: Yup.string().when(
          "paymentType",
          (paymentType, schema) =>
            paymentType === "credit_card" ? schema.required() : schema
        ),
        creditCardHolderName: Yup.string().when(
          "paymentType",
          (paymentType, schema) =>
            paymentType === "credit_card" ? schema.required() : schema
        ),
        creditCardCvv: Yup.string().when(
          "paymentType",
          (paymentType, schema) =>
            paymentType === "credit_card" ? schema.required() : schema
        ),
      });

      await schema.validate(req.body, { abortEarly: false });

      const cart = await Cart.findOne({ code: cartCode });
      if (!cart) {
        return res.status(400).json({
          error: "Cart not found",
        });
      }

      const service = new TransactionService();
      const response = await service.process({
        cartCode,
        paymentType,
        installments,
        customer: {
          name: customerName,
          email: customerEmail,
          mobile: customerMobile,
          document: customerDocument,
        },
        billing: {
          address: billingAddress,
          number: billingNumber,
          neighborhood: billingNeighborhood,
          city: billingCity,
          states: billingState,
          zipcode: billingZipCode,
        },
        creditCard: {
          number: creditCardNumber,
          expiration: creditCardExpirantion,
          holderName: creditCardHolderName,
          cvv: creditCardCvv,
        },
      });

      return res.status(200).json(response);
    } catch (error) {
      console.error(error);
      return res.status(400).json({
        error: "Validation failed",
        details: error.errors,
      });
    }
  }
}

export default new TransactionsController();
