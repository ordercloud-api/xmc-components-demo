//import { OrderCalculatePayload } from 'ordercloud-javascript-sdk';
import { withOcWebhookAuth } from '@ordercloud/catalyst';
import { NextApiResponse } from 'next';

export const config = {
  api: {
    bodyParser: false,
  },
};

/**
 * This endpoint will get hit when the buyer application indicates that it needs the order to be calculated
 * which it can do by calling this endpoint https://ordercloud.io/api-reference/seller/integration-events/calculate
 * it includes nearly anything about the order including the order worksheet to give you enough information to update the order
 *
 * Since this is a demo we're only using it to update tax cost but it can be used to override shipping cost or line items as well
 */
//const routeHandler = (req: NextApiRequest, res: NextApiResponse) => {
const routeHandler = (res: NextApiResponse) => {
  //const event = req.body as OrderCalculatePayload;
  //const taxCost = Number((event.OrderWorksheet.Order.Total * 0.07).toFixed(2));  //Charge tax on orders
  const taxCost = Number((0).toFixed(2)); //Dont charge tax on orders
  console.log('Tax :' + taxCost);
  return res.status(200).send({
    TaxTotal: taxCost,
  });
};

export default withOcWebhookAuth(routeHandler, process.env.NEXT_OC_HASH_KEY);
