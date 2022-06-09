import Header from "./Header";
import OrderState from "./OrderState";
import alanBtn from "@alan-ai/alan-sdk-web";
import { useEffect } from "react";
import { Menu } from "./Data";
import { useState } from "react";
import Card from "./Card";
import "./Cart.css";
import { Route, useHistory } from "react-router-dom";
import ReactDOM from 'react-dom';

function App() {
  const history = useHistory();

  const [category, setCategory] = useState([]);
  const [cart, setCart] = useState([]);
  const [show, setShow] = useState(false)

  useEffect(() => {
      window.alanBtnInstance = alanBtn({
        key: "2184ec8b7b1b9f1f9b6f7dce26b5aea32e956eca572e1d8b807a3e2338fdd0dc/stage",
        onCommand: ({ command, product, data }) => {
          if (command === "showAllProduct") {
            setCategory(Menu)
            setShow(false)
          }
          if (command === "show") {
            filterMenu(product);
          }
          if (command === "showSpecial") {
            filterSpecial(product);
          }
          if (command === "addByName") {
            addByName(product);
          }
          if (command === "addToCart") {
            addtoCart(data)
          }
          if (command === "orderedMenu") {
            setCategory(data)
          }
          if (command === "removeFromCart") {
            removeFromCart(data)
          }
          if (command === "completeOrder") {
            completeOrder()
          }
          if (command === "totalCartPrice") {
            totalCartPrice()
          }
          if (command === "itemCountInCart") {
            itemCountInCart(data)
          }
          if (command === "statusOrder") {
            statusOrder()
          }
          if (command === "stopAlan") {
            window.alanBtnInstance.deactivate();
          }
        },
        onButtonState: async function(status) {
           if (status === 'ONLINE') {
            if (!this.greetingWasSaid) {
              await window.alanBtnInstance.activate();
              window.alanBtnInstance.playText("Welcome to the voice menu. You can listen to the user guide of the voice menu by saying, user guide, while using the menu. How can I help you?");
              this.greetingWasSaid = true
            }
          }
        },
        rootEl: document.getElementById("alan-btn"),
      })
    filterSpecial("")
  }, [history]);

  // name'e göre filtreleme ve ürünleri sayma
  const filterMenu = (names) => {
    const filtered = Menu.filter((item) => item.name.includes(names));
    var i;
    for(i = 0; i < filtered.length; i++) {
      window.alanBtnInstance.playText(filtered[i].specialName);
    }
    setCategory(filtered);
  }

  // kategori ile sipariş vermek isteyince çeşitlere yönlendirme yapılması
  const addByName = (names) => {
    const filtered = Menu.filter((item) => item.name.includes(names));
    window.alanBtnInstance.playText("I'm counting the kinds of" + filtered[0].name + "s");
    var i;
    for(i = 0; i < filtered.length; i++) {
      window.alanBtnInstance.playText(filtered[i].specialName);
    }
    window.alanBtnInstance.playText("Which" + filtered[0].name + "would you like?");
    setCategory(filtered);
  }

  // specialName'e göre filtreleme
  const filterSpecial = (specialNames) => {
    const filtered = Menu.filter((item) => item.specialName.toLowerCase().includes(specialNames.toLowerCase()));
    setCategory(filtered);
  }

  // sepete ekleme
  function addtoCart(item) {
    setCart((oldCart) => {
      const addFind = oldCart.find(
        (cartItem) => cartItem.specialName.toLowerCase() === item.specialName.toLowerCase()
      );
      const newCart = oldCart.map((cartItem) => cartItem.specialName.toLowerCase() === item.specialName.toLowerCase() ? {...addFind, price: addFind.price + item.price } : cartItem)
      if (addFind) {
        return newCart;
      } else {
        return [...oldCart, item];
      }
    });
  }
  
  // sepetten çıkarma
  function removeFromCart(item) {
    setCart((oldCart) => {
      const removeFind = window.removeFind;
      window.removeFind = oldCart.find(
        (cartItem) => cartItem.specialName === item.specialName
      );
      if (removeFind) {
        const filtered = Menu.find(item => item.specialName.toLowerCase() === removeFind.specialName.toLowerCase())
        if (removeFind.price === filtered.price) {
          const newCart = oldCart.filter(item => item.specialName.toLowerCase() !== removeFind.specialName.toLowerCase())
          return newCart
        } else {
          const newCart2 = oldCart.map((cartItem) => cartItem.specialName.toLowerCase() === item.specialName.toLowerCase() ? {...removeFind, price: removeFind.price - item.price } : cartItem)
          return newCart2
        }
      } else {
        return [...oldCart]
      }
    });
    if (window.removeFind) {
      const filtered = Menu.find(item => item.specialName.toLowerCase() === window.removeFind.specialName.toLowerCase())
      const prc = filtered.price;
      const count = (window.removeFind.price) / prc;
      let pluralSuffix = "s";
      if (count - 1 > 1) {
        pluralSuffix = "s"
      } else pluralSuffix = ""
      if (window.removeFind.price === filtered.price) {
        window.alanBtnInstance.playText("The" + item.specialName.toLowerCase() + "canceled. No more" + item.specialName.toLowerCase() + "in your order.");
      } else {
        window.alanBtnInstance.playText("One" + item.specialName.toLowerCase() + "canceled. You still have" + (count - 1) + item.specialName.toLowerCase() + pluralSuffix + " in your order.");
      }
    } else {
      window.alanBtnInstance.playText("There is no" + item.specialName.toLowerCase());
    }
  }

  // siparişin içeriğindeki herhangi bir ürünün miktarını öğrenme
  function itemCountInCart(item) {
    setCart((oldCart) => {
      const itemFindInCart = window.itemFindInCart;
      window.itemFindInCart = oldCart.find(
        (cartItem) => cartItem.specialName === item.specialName
      );
      return [...oldCart]
    });
    if (window.itemFindInCart) {
      const itemFindInMenu = Menu.find(item => item.specialName.toLowerCase() === window.itemFindInCart.specialName.toLowerCase())
      const prc = itemFindInMenu.price;
      const count = (window.itemFindInCart.price) / prc;
      let pluralSuffix = "s";
      if (count > 1) {
        pluralSuffix = "s"
      } else pluralSuffix = ""
      let auxiliaryVerb = "is";
      if (count > 1) {
        auxiliaryVerb = " are "
      } else auxiliaryVerb = " is "
      window.alanBtnInstance.playText("There" + auxiliaryVerb + count + item.specialName + pluralSuffix);
    } else {
      window.alanBtnInstance.playText("There is no" + item.specialName);
    }
  }

  // siparişi tamamlama
  const completeOrder = (x) => {
     setCart((oldCart) => {
       const cartLenght = window.cartLenght
       window.cartLenght = oldCart.length
      if (window.cartLenght == 0) {
        return [...oldCart]
      } else {
        setShow(true)
        return oldCart.filter(item => item.specialName.includes(x));
      }
    })
    if (window.cartLenght == 0) {
      window.alanBtnInstance.playText("You have to add something to order. Hmmmm, pizza might be a good idea. You can say, give me pizza");
    } else {
      window.alanBtnInstance.playText("Your order has been received. Enjoy your meal!");
    }
  }

  // siparişin durumunu öğrenme
  const statusOrder = () => {
    var x = document.getElementById("orderState");
    //var a = ReactDOM.findDOMNode(tot);
    if (x) {
      window.alanBtnInstance.playText("Your order has been received.");
    } else {
      window.alanBtnInstance.playText("You have not ordered yet. You can say, place order, for this")
    }
  }

  // siparişin anlık toplam tutarını öğrenme
  const totalCartPrice = () => {
    var tot = document.getElementById("total");
    var a = ReactDOM.findDOMNode(tot);
    var t = a.textContent
    window.alanBtnInstance.playText("your order" + t + "liras")
  }

  // toplam tutarın dinamik olarak hesaplanması
   const total = cart.reduce((sum, cartItem) => {
    return sum + cartItem.price
  }, 0)

  return (
    <>
        <Route exact path="/">
          <Header />
          <div className="main">
            <div className="menu">
              {category.map((item) => (
                <Card
                  image={item.image}
                  name={item.name}
                  rating={item.rating}
                  price={item.price}
                  specialName={item.specialName}
                  explanation={item.explanation}
                />
              ))}
            </div>
            <div className="cart">
              <div className="title"><p>Cart</p></div>
              <div id="total">Total : ₺{total}</div>
              {show ? <OrderState /> : null}
              {cart.map((cartItem) => (
                <Card
                image={cartItem.image}
                name={cartItem.name}
                rating={cartItem.rating}
                price={cartItem.price}
                specialName={cartItem.specialName}
                explanation={cartItem.explanation}
                />
              ))}
            </div>
          </div>
        </Route>
    </>
  );
}

export default App;
