'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-services)
 * to customize this service
 */

const {createCoreService} = require('@strapi/strapi').factories;

module.exports = createCoreService('api::product-option-value.product-option-value', ({strapi}) => ({
  async handleOneToManyRelation(product_option_values, forceUpdate) {
    const productOptionValuesStrapiIds = [];
    if (product_option_values && product_option_values.length) {
      for (let product_option_value of product_option_values) {
        try {
          if (!product_option_value.medusa_id) {
            product_option_value.medusa_id = product_option_value.id;
            delete product_option_value.id;
          }

          const found = await strapi.db.query('api::product-option-value.product-option-value').findOne({
            where: {
              medusa_id: product_option_value.medusa_id
            }
          })
          if (found) {

            if (forceUpdate) {
              const update = await strapi.db.query('api::product-option-value.product-option-value').update({
                where: {
                  medusa_id: product_option_value.medusa_id
                }, data: {
                  value: product_option_value.value,
                }
              });
              if (update) {
                productOptionValuesStrapiIds.push(update.id);
                continue;
              }
            }

            productOptionValuesStrapiIds.push(found.id);
            continue;
          }

          const create = await strapi.entityService.create('api::product-option-value.product-option-value', {
            data: product_option_value
          });
          productOptionValuesStrapiIds.push(create.id);
        } catch (e) {
          console.log(e)
          throw new Error('Delegated creation failed');
        }
      }
    }

    return productOptionValuesStrapiIds;
  }
}));
