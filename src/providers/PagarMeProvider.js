import { cpf } from "cpf-cnpj-validator";

class PagarMeProvider {
  async process({
    transactonCode,
    total,
    paymentType,
    installments,
    creditCard,
    customer,
    billing,
    items,
  }) {
    const billetParams = {
      payment_method: "boleto",
      amount: total * 100,
      installments: 1,
    };
    const creditCardParams = {
      payment_method: "credit_card",
      amount: total * 100,
      installments,
      card_number: creditCard.number.replace(/[^?0-9]/g, ""),
      card_expiration_date: creditCard.expiration.replace(/[^?0-9]/g, ""),
      card_cvv: creditCard.cvv,
      capture: true,
    };

    let paymentParams;

    switch (paymentType) {
      case "credit_card":
        paymentParams = creditCardParams;
        break;
      case "billet":
        paymentParams = billetParams;
        break;

      default:
        throw `paymenttType ${paymentType} not found`;
    }

    const customerParams = {
      customer: {
        external_id: customer.email,
        nam: customer.name,
        email: customer.email,
        type: cpf.isValid(customer.document) ? "Individual" : "Corporation",
        country: "br",
        phone_numbers: [customer.mobile],
        documents: [
          {
            type: cpf.isValid(customer.document) ? "cpf" : "cnpj",
            number: customer.document.replace(/[^0-9]/g, ""), // Correção aqui: removendo caracteres não numéricos
          },
        ],
      },
    };
    const billingParams = billing?.zipcode
      ? {
          billing: {
            name: "Billing Address",
            Address: {
              country: "br",
              state: billing.state,
              city: billing.city,
              neighborhood: billing.neighborhood,
              street: billing.address,
              street_number: billing.number,
              zipcode: billing.zipcode.replace(/[^0-9]/g, ""),
            },
          },
        }
      : {};

    const itemsParams =
      items && items.length > 0
        ? {
            items: items.map((item) => ({
              id: item?.id.toString(),
              title: item?.title,
              unit_price: item?.amount * 100,
              quantity: item?.quantity || 1,
              tangible: false,
            })),
          }
        : {
            items: [
              {
                id: 1,
                title: `t-${transactonCode}`,
                unit_price: total * 100,
                quantity: 1,
                tangible: false,
              },
            ],
          };

    const metadataParams = {
      metadata: {
        transaction_code: transactonCode,
      },
    };
    const transactionParams = {
      async: false,

      ...paymentParams,
      ...customerParams,
      ...billetParams,
      ...itemsParams,
      ...metadataParams,
    };
    const client = await pagarme.client.connect({
      api_key: process.env.PAGARME_API_KEY,
    });

    const response = await client.transaction.crete(transactionParams);
    console.debug("response", response);

    return {
      transactionId: response.id,
      status: this.translateStatus(response.status),
      billet: {
        url: response.boleto_url,
        barCode: response.boleto_url,
      },
      card: {
        id: response.card?.id,
      },
      processorResponse: JSON.stringify(response)
    };
  }
  translateStatus(status) {
    const statusMap = {
      processing: "processing",
      waiting_payment: "pending",
      authorized: "peding",
      paid: "approved",
      refused: "refused",
      peding_refund: "refunded",
      refunded: "refunded",
      chargedback: "chargeback",
    };
  }
}

export default PagarMeProvider;
