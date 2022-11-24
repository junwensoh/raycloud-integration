const Shopify = require("@shopify/shopify-api").Shopify;

class GetInventoryLevelBySkuNumber {
  /**
   * Gets the inventoryLevelId and current available quantity at a location
   * @param  {[String]} sku The sku number of the product variant
   * @return {[Object]} Example:
   * {
   *      id: 'gid://shopify/InventoryLevel/97918943321?inventory_item_id=42422268264537',
   *      available: 3
   * }
   */
  static async run(sku) {
    try {
        
      const client = new Shopify.Clients.Graphql(
        process.env.SHOPIFY_SHOP,
        process.env.SHOPIFY_ACCESS_TOKEN
      );

      const response = await client.query({
        data: `
            {
                productVariants(first: 1, query: "sku:${sku}") {
                    edges {
                    node {
                        id
                        inventoryItem {
                        id
                        inventoryLevel(locationId: "gid://shopify/Location/${process.env.OXLUXE_LOCATION_ID}") {
                            id
                            available
                        }
                        }
                    }
                    }
                }
            }
        `,
      });

      if (response.body.data.productVariants.edges.length > 0) {
        const inventoryLevel = response.body.data.productVariants.edges[0].node.inventoryItem.inventoryLevel;
        return inventoryLevel;
      }
      return undefined;
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
  }
}

module.exports = GetInventoryLevelBySkuNumber;
