class Ticket {
  /**
   * constructor - Creates an instance of Ticket
   *
   * @param {Object} props to be printed by console
   *
   */
  constructor(props) {
    this.props = props;
  }

  /**
   * print - Prints by console a ticket from a finished checkout
   *
   */
  print() {
    console.log('Items:', this.props.items.join(', '));
    console.log('Total:', this.props.total.toLocaleString(navigator.language, { style: 'currency', currency: 'EUR' }));
  }
}
