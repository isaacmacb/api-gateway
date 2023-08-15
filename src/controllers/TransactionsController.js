import * as Yup from 'yup';

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
            billingStates,
            billingZipCode,
            creditCardNumber,
            creditCardExpirantion,
            creditCardHolderName,
            creditCardCvv
        } = req.body;

        const schema = Yup.object({
            cartCode: Yup.string().required(),
        })
        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({
                error : "error on validate schema"
            })
        }
        
      } catch (error) {    
        console.log(error);
        return res.status(500).json({
            error : "Internal server error."
        })
    }
  }
}

export default new TransactionsController();
