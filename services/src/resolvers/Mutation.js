import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { APP_SECRET, getUserId } from "../utils";
import { prismaObjectType } from "nexus-prisma";
// this is needed if you saw JS error like: ReferenceError: regeneratorRuntime is not defined
import regeneratorRuntime from "regenerator-runtime";
import { stringArg } from "nexus/dist";

export const Mutation = prismaObjectType({
  name: "Mutation",
  definition: t => {
    // expose every mutations
    t.prismaFields(["*"]);

    // customized mutations
    t.field("signup", {
      type: "User",
      args: {
        email: stringArg(),
        password: stringArg(),
        name: stringArg()
      },
      resolve: (parent, { email, password, name }, ctx) => {
        const encodedPassword = bcrypt.hash(password, 10);
        const user = ctx.prisma.createUser({
          email: email,
          password: password,
          name: name
        });
        const token = jwt.sign({ userId: user.id }, APP_SECRET);
        console.log(user.id);
        return {
          token,
          user
        };
      }
    });
  }
});

// vote
// async function vote(parent, args, context, info) {
//   // 1
//   const userId = getUserId(context);

//   // 2
//   const linkExists = await context.prisma.$exists.vote({
//     user: { id: userId },
//     link: { id: args.linkId }
//   });
//   if (linkExists) {
//     throw new Error(`Already voted for link: ${args.linkId}`);
//   }

//   // 3
//   return context.prisma.createVote({
//     user: { connect: { id: userId } },
//     link: { connect: { id: args.linkId } }
//   });
// }

// async function login(parent, args, context, info) {
//   // 1
//   const user = await context.prisma.user({ email: args.email });
//   if (!user) {
//     throw new Error("No such user found");
//   }

//   // 2
//   const valid = await bcrypt.compare(args.password, user.password);
//   if (!valid) {
//     throw new Error("Invalid password");
//   }

//   const token = jwt.sign({ userId: user.id }, APP_SECRET);

//   // 3
//   return {
//     token,
//     user
//   };
// }

// // post
// function post(parent, args, context, info) {
//   const userId = getUserId(context);
//   return context.prisma.createLink({
//     url: args.url,
//     description: args.description,
//     postedBy: { connect: { id: userId } }
//   });
// }

// module.exports = {
//   signup,
//   login,
//   post,
//   vote
// };
