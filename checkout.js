class Checkout {

  /**
   * constructor - Creates an instance of Checkout from a pricing rules
   *
   * @param {Object} pricingRules to apply deals to the checkout
   */
  constructor(pricingRules) {
    this.pricingRules = pricingRules;
    this.cart = [];
    this.totalPrice = 0;
  }

  /**
   * store - Gets the products from the store.
   *
   * @return {Array} Set of products
   */
  get store() {
    return [
      {
        code: 'VOUCHER',
        name: 'Cabify Voucher',
        price: 5.00,
      },
      {
        code: 'TSHIRT',
        name: 'Cabify T-Shirt',
        price: 20.00,
      },
      {
        code: 'MUG',
        name: 'Cabify Coffee Mug',
        price: 7.50,
      },
    ];
  }

  /**
   * pricingDeals - Gets available discounts to be applied to the total price
   *
   * @return {Object} Set of functions that apply discounts
   */
  get pricingDeals() {
    return {
      XFORY({ code, cost, x, y }) {
        return this.getCountOfItems(code) % x === 0 ? ((x - y) * this.getPrice(code)) : 0;
      },

      BULK({ code, minItems, discountPrice }) {
        const countOfItems = this.getCountOfItems(code);
        const difference = this.getPrice(code) - discountPrice;

        if (countOfItems === minItems) {
          return  difference * minItems;
        } else if (countOfItems > minItems) {
          return difference;
        } else {
          return 0;
        }
      },

      default() {
        return 0;
      },
    };
  }

  /**
   * scan - Scans SKU codes to store them to the cart and the total price
   *
   * @param {String} code related to a product
   *
   * @return {Object} Instance of
   */
  scan(code) {
    this.addToCart(code).totalPrice += this.getPrice(code);
    this.applyDeals(code);

    return this;
  }

  /**
   * total - Total price to be printed
   *
   * @return {Number} Total price after apply discounts
   */
  total() {
    return this.totalPrice;
  }

  /**
   * applyDeals - Applies available discounts, using the pricing rules
   *
   * @param {String} code related to a product
   *
   * @return {Object} Instance of
   */
  applyDeals(code) {
    Object.keys(this.pricingRules).forEach((key) => {
      if(this.pricingRules[key].code === code) {
        this.totalPrice -= this.pricingDeals[key].call(this, this.pricingRules[key]);
      }
    });

    return this;
  }

  /**
   * addToCart - Adds a code product to the cart
   *
   * @param {String} code related to a product
   *
   * @return {Object} Instance of
   */
  addToCart(code) {
    this.cart.push(code);

    return this;
  }

  /**
   * getPrice - Gets price of product from the store
   *
   * @param {Srting} code related to a product
   *
   * @return {Number} Price of a product
   */
  getPrice(code) {
    return this.store.find(p => p.code === code).price;
  }

  /**
   * getCountOfItems - Gets the number of items in a cart product
   *
   * @param {type} code related to a product
   *
   * @return {Number} Count of items
   */
  getCountOfItems(code) {
    return this.cart.filter(p => p === code).length;
  }

}
