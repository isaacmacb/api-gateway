class CartsController {
    async index () {
        return res.status(200).json({foo : "bar"})
    }
}
export default new CartsController()