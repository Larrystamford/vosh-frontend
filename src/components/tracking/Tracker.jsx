import ReactGA from "react-ga";

// EXAMPLES
// ReactGA.event({
//   category: 'User',
//   action: 'Created an Account'
// });

// ReactGA.event({
//   category: 'Social',
//   action: 'Rated an App',
//   value: 3
// });

export const Event = (category, action, label, value = 0) => {
  ReactGA.event({
    category: category,
    action: action,
    label: label,
    value: value,
  });
};

export const ModalView = (modalType) => {


  ReactGA.modalview(
    window.location.pathname + window.location.search + "-" + modalType
  );
};

export const PageView = () => {

  ReactGA.pageview(window.location.pathname + window.location.search);
};

export const Exception = (exceptionMessage) => {

  ReactGA.exception({
    description: exceptionMessage,
    fatal: true,
  });
};

export const AddItem = (itemId, itemName, price, category, quantity) => {

  ReactGA.plugin.execute("ecommerce", "addItem", {
    id: itemId,
    name: itemName,
    sku: "--", // seems to be required
    price: price,
    category: category,
    quantity: quantity,
  });
};

export const Purchase = (itemId, revenue) => {

  ReactGA.plugin.execute("ecommerce", "addTransaction", {
    id: itemId, // the same as for addItem to connect them
    revenue: revenue, // obviously it's price * quantity
  });

  ReactGA.plugin.execute("ecommerce", "send");
  ReactGA.plugin.execute("ecommerce", "clear");
};
