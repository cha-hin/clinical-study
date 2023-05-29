import { rest } from "msw";

type User = {
  token: string,
  email: string,
  password: string;
}

type Data = {
  userToken: string,
  bloodPressures: number[],
}



function boxMullerTransform() {
  const u1 = Math.random();
  const u2 = Math.random();

  const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
  const z1 = Math.sqrt(-2.0 * Math.log(u1)) * Math.sin(2.0 * Math.PI * u2);

  return { z0, z1 };
}

function getNormallyDistributedRandomNumber(mean: number, stddev: number) {
  const { z0 } = boxMullerTransform();
  return Math.round(z0 * stddev + mean);
}


function randInt(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min)
}

const users: User[] = [
  {
    token: "8f5bba99-5502-4827-8084-05c56cdf6ee3",
    email: "user1@email.com",
    password: "password"
  },
  {
    token: "d9294d95-f6bc-4a6d-8946-51ae7dae4b55",
    email: "user2@email.com",
    password: "password"
  },
  {
    token: "be4657ff-7fd7-4b0b-aa7d-8e67f229b703",
    email: "user3@email.com",
    password: "password"
  }
];

// for each user add a data entry
const dataCollection: Data[] = users.map(u => ({
  userToken: u.token,
  bloodPressures: []
}));



export const handlers = [
  // handles a POST /login request
  rest.post("/login", (req, res, ctx) => {
    return req.json().then(body => {
      const user = users.find(u => u.email === body.email);
      if (!user || user?.password !== body.password) {
        return res(
          // this response transformer sets a custom status text on the response.
          ctx.status(401),
          // while this one appends a "Content-Type" response header.
          ctx.set("Content-Type", "application/json"),
          ctx.json({ message: "Wrong email or password" })
        )
      } else {
        return res(ctx.json({ token: user.token }));
      }
    });
  }),

  // Handles a GET /user request
  rest.get("/user/:token/data", (req, res, ctx) => {
    if (!req.params.token) {
      return res(
        ctx.status(403),
        ctx.set("Content-Type", "application/json"),
        ctx.json({ message: "Forbidden" })
      )
    }
    const { token } = req.params;
    const data = dataCollection.find(d => d.userToken === token);
    if (!data) {
      return res(
        ctx.status(404),
        ctx.set("Content-Type", "application/json"),
        ctx.json({ message: "No data found for this patient" })
      )
    }
    else {
      // data.bloodPressures = [...Array(randInt(10000, 11000))].map(_ => randInt(90, 180))
      const generatedNumbers: number[] = []

      const mean = 128;
      const stddev = 23;

      for (let i = 0; i < randInt(900, 1000); i += 1) {
        generatedNumbers.push(getNormallyDistributedRandomNumber(mean, stddev))
      }

      // data.bloodPressures = [...Array(randInt(10000, 11000))].map(_ => randInt(90, 180))
      data.bloodPressures = generatedNumbers;
      return res(
        ctx.json({ bloodPressures: data.bloodPressures })
      )
    }
  }),
]