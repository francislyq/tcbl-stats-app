import { prismaObjectType } from "nexus-prisma";

export const Player = prismaObjectType({
  name: "Player",
  definition: t => {
    // expose every field
    t.prismaFields(["*"]);

    // customized field
    t.string("uppercaseFirstName", {
      resolve: ({ firstName }, args, ctx) => firstName.toUpperCase()
    });
  }
});
