const Shopify = require("@shopify/shopify-api").Shopify;
const GetInventoryLevelBySkuNumber = require('./GetInventoryLevelBySkuNumber');

class UpdateProductVariantQuantity {
  static async run(sku, newInventoryLevelQuantity) {
    try {

      const client = new Shopify.Clients.Graphql(
        process.env.SHOPIFY_SHOP,
        process.env.SHOPIFY_ACCESS_TOKEN
      );
      
      // we cannot update available quantity directly using ProductVariant and need to update it through InventoryLevel
      // hence, getting the inventoryLevelId from a graphQL query from line below to be used on next query.
      const inventoryLevel = await GetInventoryLevelBySkuNumber.run(sku);

      if (inventoryLevel) {
          const availableDelta = newInventoryLevelQuantity - inventoryLevel.available;
  
          const response = await client.query({
              data: {
                  query: `mutation AdjustInventoryQuantity($input: InventoryAdjustQuantityInput!) {
                      inventoryAdjustQuantity(input: $input) {
                        inventoryLevel {
                          id
                          available
                          incoming
                          item {
                            id
                            sku
                          }
                          location {
                            id
                            name
                          }
                        }
                      }
                    }
                  `,
                  variables: {
                      input: {
                          inventoryLevelId: inventoryLevel.id,
                          availableDelta: availableDelta
                      }
                  }
              }
          });
          
          const newAvailableQuantity = response.body.data.inventoryAdjustQuantity.inventoryLevel.available;
          console.log(newAvailableQuantity);
          console.log(`sku number: ${sku} has been updated with new quantity: ${newAvailableQuantity}`);
      } else {
          console.log(`no updates has been made for sku: ${sku} as it is not found on Shopify.`);
      }
    } catch (error) {
      if (error instanceof Shopify.Errors.GraphqlQueryError) {
        throw new Error(
          `${error.message}\n${JSON.stringify(error.response, null, 2)}`
        );
      } else {
        // handle other errors
        console.log(errors);
      }
    }
    return;
  }
}

module.exports = UpdateProductVariantQuantity;

