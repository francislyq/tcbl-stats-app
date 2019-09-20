import { getUserId } from "../utils";
import { stringArg, idArg, queryType } from "nexus";
// this is needed if you saw JS error like: ReferenceError: regeneratorRuntime is not defined
// import regeneratorRuntime from "regenerator-runtime";

export const Query = queryType({
  definition(t) {
    // t.field("me", {
    //   type: "User",
    //   resolve: (parent, args, ctx) => {
    //     const userId = getUserId(ctx);
    //     return ctx.prisma.user({ id: userId });
    //   }
    // });

    t.list.field("feed", {
      type: "Post",
      resolve: (parent, args, ctx) => {
        // filter
        const where = args.filter
          ? {
              OR: [
                { description_contains: args.filter },
                { url_contains: args.filter }
              ]
            }
          : {};

        // count
        const count = context.prisma
          .linksConnection({
            where
          })
          .aggregate()
          .count();

        return ctx.prisma.links({
          where,
          skip: args.skip,
          first: args.first,
          orderBy: args.orderBy
        });
      }
    });

    // t.list.field("filterPosts", {
    //   type: "Post",
    //   args: {
    //     searchString: stringArg({ nullable: true })
    //   },
    //   resolve: (parent, { searchString }, ctx) => {
    //     return ctx.prisma.posts({
    //       where: {
    //         OR: [
    //           { title_contains: searchString },
    //           { content_contains: searchString }
    //         ]
    //       }
    //     });
    //   }
    // });

    // t.field("post", {
    //   type: "Post",
    //   nullable: true,
    //   args: { id: idArg() },
    //   resolve: (parent, { id }, ctx) => {
    //     return ctx.prisma.post({ id });
    //   }
    // });
  }
});
