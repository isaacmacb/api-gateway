import Cart from "../modes/Cart";
import Transaction from "../modes/Transaction";
import { v4 as uuidv4 } from "uuid";
import PagarMeProvider from "../providers/PagarMeProvider";
import pagarme from "pagarme"

class TransactionService {
  paymentProvider;
  constructor(paymentProvider) {
    this.paymentProvider = paymentProvider || new PagarMeProvider();
  }
  async process({
    cartCode,
    paymentType,
    installments,
    customer,
    billing,
    creditCard,
    items, // Adicionado o parâmetro 'items' aqui
  }) {
    const cart = await Cart.findOne({ code: cartCode });
    if (!cart) {
      throw `Cart ${cartCode} was not found`;
    }

    const transaction = await Transaction.create({
      cartCode: cart.code,
      code: await uuidv4(),
      total: cart.price,
      paymentType,
      installments,
      status: "started",
      customerName: customer.name,
      customerEmail: customer.email,
      customerMobile: customer.mobile,
      customerDocument: customer.document,
      billingAddress: billing.Address,
      billingNumber: billing.Number,
      billingNeighborhood: billing.neighborhood,
      billingCity: billing.city,
      billingState: billing.billingState,
      billingZipCode: billing.zipcode,
    });

    this.paymentProvider.process({
      transactonCode: transaction.code,
      total: transaction.total,
      paymentType,
      installments,
      creditCard,
      customer,
      billing,
      items, // Utilizando 'items' aqui
    });

    return transaction;
  }
}

export default TransactionService;
