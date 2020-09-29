const nodemailer = require('nodemailer')

function generateOrderEmail({ order, total }) {
  return `
  <div>
    <h2>Your recent order for ${total}</h2>
    <p>Please start walking over, we will have your order ready in the next 20 minutes</p>
    <ul>
      ${order
    .map(
      (item) => ` <li>
        <img src="${item.thumbnail}" alt="${item.name}"/>
        ${item.size} ${item.name} - ${item.price}
      </li> `
    )
    .join('')}
    </ul>
    <p>Your total is <strong>$${total}</strong> due at pickup</p>
  </div>
  <style>
    ul {
      list-style: none;
    }
  </style>
  `
}

//create a transport for nodemailer
const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: 587,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
})

function wait(ms = 0) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, ms)
  })
}

exports.handler = async (event, context) => {
  //  await wait(5000)
  // Validate the data coming in is correct
  const body = JSON.parse(event.body)
  // Check if they have filled out the honeypot
  if (body.mapleSyrup) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Boop beep bop zzzzstt good bye' }),
    }
  }
  const requiredFields = ['email', 'name', 'order']

  for (const field of requiredFields) {
    if (!body[field]) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: `Opps! you are missing the ${field} field`,
        }),
      }
    }
  }
  // make sure they actually have items in that order

  if (!body.order.length) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Why would you order nothing?',
      }),
    }
  }
  // Send the email

  // send the success or error message
  const info = await transporter.sendMail({
    from: 'Slicks Slices <slick@example.com>',
    to: `${body.name} <${body.email}>, orders@example.com`,
    subject: 'New order!',
    html: generateOrderEmail({ order: body.order, total: body.total }),
  })
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Success' }),
  }
}
