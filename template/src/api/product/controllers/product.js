'use strict';

/**
 *  product controller
 */

const {createCoreController} = require('@strapi/strapi').factories;

module.exports = createCoreController('api::product.product', {
  async findOne(ctx) {
    try {
      const {productId} = ctx.params
      const product = await strapi
        .query("product", "")
        .findOne({product_id: productId})
      if (product && product.id) {
        return ctx.body = {
          product
        };
      }
      return ctx.notFound(ctx)
    } catch (e) {
      return ctx.internalServerError(ctx, e)
    }
  },
  async create(ctx) {
    try {
      const productBody = ctx.request.body

      const create = await strapi.service('api::product.product').createWithRelations(
        productBody
      )
      if (create) {
        return ctx.body = {id: create};
      }
      return ctx.badRequest(ctx)
    } catch (e) {
      return ctx.internalServerError(ctx, e)
    }
  },
  async update(ctx) {
    try {
      const {id} = ctx.params
      const productBody = ctx.request.body

      productBody.product_length = productBody.length
      delete productBody.length

      const found = await strapi.db.query('api::product.product').findOne({
        where: {
          medusa_id: id,
        }
      })

      if (found) {
        const update = await strapi.service('api::product.product').updateWithRelations(
          productBody
        )
        if (update) {
          return ctx.body = {id: update}
        } else {
          return ctx.internalServerError(ctx, "ERROR")
        }
      }

      const create = await strapi.service('api::product.product').createWithRelations(
        productBody
      )
      if (create) {
        return ctx.body = {id: create}
      }

      return ctx.notFound(ctx)
    } catch (e) {
      console.error(e)
      return ctx.internalServerError(ctx, e)
    }
  },
  async delete(ctx) {
    try {
      const {id} = ctx.params
      const product = await strapi
        .query("product", "")
        .findOne({medusa_id: id})
      if (product) {
        if (product.product_variants && product.product_variants.length) {
          await strapi
            .query("product-variant", "")
            .delete({product: product.id})
        }
        await strapi.query("product", "").delete({
          medusa_id: id,
        })
        return ctx.body = {
          id: product.id
        }
      }
      return ctx.notFound(ctx)
    } catch (e) {
      console.log("Error occurred while trying to delete product variant")
      return ctx.internalServerError(ctx, e)
    }
  },
});
