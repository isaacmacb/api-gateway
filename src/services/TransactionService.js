import Cart from "../modes/Cart";
import Transaction from "../modes/Transaction";
import { v4 as uuidv4 } from 'uuid';

class TransactionService {
  async process({
    cartCode,
    paymentType,
    installments,
    customer,
    billing,
    creditCard,
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
    
    return transaction;
  }
}

export default TransactionService;
