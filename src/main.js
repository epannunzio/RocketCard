import "./css/index.css"
import IMask from "imask"

const ccBgColor01 = document.querySelector(".cc-bg svg > g g:nth-child(1) path") //aqui dizemos que queremos a classe cc-bg, o svg dentro dela, o primeiro (>) g do svg e o path dele
const ccBgColor02 = document.querySelector(".cc-bg svg > g g:nth-child(2) path")
const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img")

function setCardType(type) {
  const colors = {
    visa: ["#4d1d4d", "#A70A5F", "#E149CF"],
    mastercard: ["#A70A5F", "#C69347"],
    rocketseat: ["#0D6F5D", "#C3129C"],
    default: ["black", "gray"],
  }

  ccBgColor01.setAttribute("fill", colors[type][0])
  ccBgColor02.setAttribute("fill", colors[type][1])
  ccLogo.setAttribute("src", `cc-${type}.svg`) //usar cráse ao interpolar
}

setCardType("visa")
// globalThis.setCardType = setCardType dessa forma alteramos em tempo real direto no console

// security code
const securityCode = document.querySelector("#security-code") //const sempre que a variável não for mudar ao longo do projeto
const securityCodePattern = {
  //camel case sempre!!!
  mask: "0000",
}
const securityCodeMasked = IMask(securityCode, securityCodePattern) //IMask é uma biblioteca js

const expirationDate = document.querySelector("#expiration-date")
const expirationDatePattern = {
  mask: "MM{/}YY",
  blocks: {
    YY: {
      mask: IMask.MaskedRange,
      from: String(new Date().getFullYear()).slice(2), //transforma a data em string e pega os 2 últimos números da data
      to: String(new Date().getFullYear() + 10).slice(2),
    },

    MM: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12,
    },
  },
}
const expirationDateMasked = IMask(expirationDate, expirationDatePattern)
const cardNumber = document.querySelector("#card-number")
const cardNumberPatter = {
  mask: [
    {
      mask: "0000 0000 0000 0000",
      regex: /^4\d{0,15}/, //expressão regular com as regras pra esse caso
      cardtype: "visa",
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /(^5[1-5]\d{0,2}|^22[2-9]\d^2[3-7]\d{0,2})\d{0,12}/,
      cardtype: "mastercard",
    },
    {
      mask: "0000 0000 0000 0000",
      cardtype: "default",
    },
  ],
  dispatch: function (appended, dynamicMasked) {
    const number = (dynamicMasked.value + appended).replace(/\D/g, "") //repõe tudo que não for digito por vazio
    const foundMask = dynamicMasked.compiledMasks.find(function (item) {
      return number.match(item.regex)
    })

    return foundMask
  },
}
const cardNumberMasked = IMask(cardNumber, cardNumberPatter)

const addButton = document.querySelector("#add-card")
addButton.addEventListener("click", () => {
  //arrow function sendo uma função vazia
  alert("Cartão adicionado")
})

document.querySelector("form").addEventListener("submit", (event) => {
  //evento pra quando alguém enviar o form
  event.preventDefault()
})

const cardHolder = document.querySelector("#card-holder")
cardHolder.addEventListener("input", () => {
  //evento pra quando alguém escrever algo
  const ccHolder = document.querySelector(".cc-holder .value")

  ccHolder.innerText =
    cardHolder.value.length === 0 ? "EDILZA R PANNUNZIO" : cardHolder.value //aqui temos um if ternário, com 3 condições, oque for digitado vai aparecendo no cartão, se apagar o que fica é edilza r pannunzio, senão oque fica é o nome digitado
})

securityCodeMasked.on("accept", () => {
  //mesma lógica do eventListener, observa o conteudo desse input
  updateSecurityCode(securityCodeMasked.value)
})

function updateSecurityCode(code) {
  const ccSecurity = document.querySelector(".cc-security .value")
  ccSecurity.innerText = code.length === 0 ? "123" : code //if ternário, oque digita vai mostrando, se apaga mostra 123, senão fica oque digitou
}

cardNumberMasked.on("accept", () => {
  const cardType = cardNumberMasked.masked.currentMask.cardtype
  setCardType(cardType)
  updateCardNumber(cardNumberMasked.value)
})

function updateCardNumber(number) {
  const ccNumber = document.querySelector(".cc-number")
  ccNumber.innerText = number.length === 0 ? "1234 5678 9012 3456" : number //if ternário
}

expirationDateMasked.on("accept", () => {
  updateExpirationDate(expirationDateMasked.value)
})

function updateExpirationDate(date) {
  const ccExpiration = document.querySelector(".cc-extra .value")
  ccExpiration.innerText = date.length === 0 ? "02/32" : date
}
