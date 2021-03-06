$(() => {
  const $quantityInputs = $('.qty');
  const form = $('form.new-order');
  const $timers = $('.timer');
  const $incrementButtons = $("button[name=increment]");
  const $decrementButtons = $("button[name=decrement]");

  $($(".cart")[0]).hide();

  $quantityInputs.change((el) => {
    updateTotal();
  });

  form.on("submit", (event) => {
    const input = $("input[name=customer_phone]").val();
    const qty = $("input[name=menu_item_quantity]");
    $('.error-message').html(``);
    validatePhone(input);
    validateQty(qty);
  });

  $timers.each(function () {
    const $timer = $(this);

    if ($timer.data("received-at")) {
      window.setInterval(calcTimeRemaining, 1000, $timer);
    }
  });

  $('.message-btn').click(function() {
    const customerPhone = $($(this).parent().parent().children(".customer_phone"))[0].innerHTML;
    $(".modal").slideDown("fast");
    $(".dim").slideDown("fast");
    $("#customer_phone").val(customerPhone);
  });

  $('.close').click(() => {
    $(".modal").slideUp("fast");
    $(".dim").slideUp("fast");
  });

  $('.cancel').click((event) => {
    event.preventDefault();
    $(".modal").slideUp("fast");
    $(".dim").slideUp("fast");
  });

  $incrementButtons.click(function (event) {
    event.preventDefault();
    const $qtyInput = $($(this).siblings("input")[0]);
    $qtyInput.val(Number($qtyInput.val()) + 1);
    updateTotal();
  });

  $decrementButtons.click(function (event) {
    event.preventDefault();
    const $qtyInput = $($(this).siblings("input")[0]);
    if ($qtyInput.val() > 0) {
      $qtyInput.val(Number($qtyInput.val()) - 1);
    }
    updateTotal();
  });
});

const calcTimeRemaining = ($timer) => {
  const receivedAt = new Date($timer.data("received-at"));
  const dueAt = new Date(receivedAt.setMinutes(receivedAt.getMinutes() + $timer.data("prep-time")));
  const timeRemaining = dueAt - new Date();
  const negative = timeRemaining < 0;
  const minutesRemaining = Math.floor(Math.abs(timeRemaining / 60000));
  const secondsRemaining = Math.floor(Math.abs((timeRemaining % 60000) / 1000));

  $timer.text(`${negative ? "-" : ""}${minutesRemaining}min, ${secondsRemaining}sec`);
  if (negative) {
    $timer.addClass("overdue");
  }
};

const validatePhone = (input) => {
  if (input === "") {
    event.preventDefault();
    const exisitingError = $('.error-message').text();
    $('.error-message').html(`${exisitingError} <br> You forgot to let us know your phone number.`);
    $(".hiddenError").removeClass("error");
    $(".hiddenError").slideDown("slow");
  };
};

const validateQty = (qty) => {
  let totalPizza = 0;
  for (let i = 0; i < qty.length; i++) {
    const quantity = Number.parseInt($(qty[i]).val()) || 0;
      totalPizza += quantity;
  };
  if (totalPizza === 0) {
    event.preventDefault();
    const exisitingError = $('.error-message').text();
    $('.error-message').html(`${exisitingError} <br> You forgot your pizza!`);
    $(".hiddenError").removeClass("error");
    $(".hiddenError").slideDown("slow");
  };
};

const updateTotal = () => {
  const $subTotal = $('#sub-total');
  let subTotal = 0.00;
  const $quantityInputs = $('.qty');
  const $cart = $($(".cart")[0]);
  const $itemsUL = $(".items");
  $itemsUL.html("");

  $quantityInputs.each(function (index) {
    const qty = Number.parseInt(this.value) || 0;
    const menuItemEl = $(this).parentsUntil(".menu-item").parent()[0];
    const menuItemName = $(menuItemEl).find(".name").text();
    const price = $(menuItemEl).find(".menu_item_price")[0].value.slice(1);

    if (qty > 0) {
      $itemsUL.append($(`<li>${qty} &times; ${menuItemName}</li>`));
    }

    subTotal += qty * price;
  });

  if (subTotal === 0) {
    $cart.slideUp();
  } else {
    $cart.slideDown();
  }

  $subTotal.text(`$${subTotal.toFixed(2)}`);
};
