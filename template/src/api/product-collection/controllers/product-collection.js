"use strict";

/**
 *  product-collection controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::product-collection.product-collection",

  {
    async findOne(ctx) {
      try {
        const { id: medusaId } = ctx.params;
        const productCollection = await strapi.db
          .query("api::product-collection.product-collection")
          .findOne({
            where: { medusa_id: medusaId },
          });
        if (productCollection && productCollection.id) {
          return (ctx.body = { productCollection });
        }
        return ctx.notFound(ctx);
      } catch (e) {
        return ctx.internalServerError(ctx);
      }
    },
    async create(ctx) {
      try {
        let collectionBody = ctx.request.body;
        if (!collectionBody.medusa_id) {
          collectionBody.medusa_id = collectionBody.id;
          delete collectionBody.id;
        }

        const create = await strapi.entityService.create(
          "api::product-collection.product-collection",
          { data: collectionBody }
        );

        if (create) {
          return (ctx.body = { id: create });
        }
        return ctx.badRequest(ctx);
      } catch (e) {
        console.log(e);
        return ctx.internalServerError(ctx);
      }
    },
    async update(ctx) {
      try {
        const { id: medusaId } = ctx.params;
        let collectionBody = ctx.request.body;
        if (!collectionBody.medusa_id) {
          collectionBody.medusa_id = collectionBody.id;
          delete collectionBody.id;
        }

        const found = await strapi.db
          .query("api::product-collection.product-collection")
          .findOne({
            where: { medusa_id: medusaId },
          });

        if (found) {
          const update = await strapi.entityService.update(
            "api::product-collection.product-collection",
            found.id,
            { data: collectionBody }
          );
          if (update) {
            return (ctx.body = { id: update });
          } else {
            return ctx.internalServerError(ctx);
          }
        }

        const create = await strapi.entityService.create(
          "api::product-collection.product-collection",
          { data: collectionBody }
        );
        if (create) {
          return (ctx.body = { id: create });
        }

        return ctx.notFound(ctx);
      } catch (e) {
        return ctx.internalServerError(ctx);
      }
    },
    async delete(ctx) {
      try {
        const { id: medusaId } = ctx.params;
        const collection = await strapi.db
          .query("api::product-collection.product-collection")
          .findOne({ where: { medusa_id: medusaId } });
        if (collection) {
          await strapi.db
            .query("api::product-collection.product-collection")
            .delete({
              where: { medusa_id: medusaId },
            });
          return (ctx.body = {
            id: collection.id,
          });
        }
        return ctx.notFound(ctx);
      } catch (e) {
        console.log("Error occurred while trying to delete product variant");
        return ctx.internalServerError(ctx);
      }
    },
  }
);
